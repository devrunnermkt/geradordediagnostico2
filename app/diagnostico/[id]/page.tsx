// Editor de um diagnóstico rápido: 4 abas cobrindo dados gerais, pontos de
// risco, pontos de melhora e finalização, com salvamento automático no
// localStorage. As imagens são cadastradas dentro de cada ponto de risco/
// melhora (ver RiskEditor/ImprovementEditor), não numa aba separada.

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RunnerLogo } from "@/components/RunnerLogo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImprovementEditor } from "@/components/diagnostic/ImprovementEditor";
import { RiskEditor } from "@/components/diagnostic/RiskEditor";
import { SectionCard } from "@/components/diagnostic/SectionCard";
import { TextAreaField } from "@/components/diagnostic/TextAreaField";
import { STATUS_OPTIONS } from "@/lib/defaultData";
import { getDiagnostic, saveDiagnostic } from "@/lib/diagnosticStorage";
import { exportDiagnosticAsJson } from "@/lib/exportUtils";
import type { Diagnostic, DiagnosticStatus } from "@/lib/types";

function Campo({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

type Atualizar = (patch: Partial<Diagnostic>) => void;

function DadosGeraisTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Dados do cliente" description="Aparecem no cabeçalho do diagnóstico.">
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Nome do cliente" value={d.clientName} onChange={(v) => atualizar({ clientName: v })} />
          <Campo
            label="Instagram"
            value={d.instagramHandle}
            onChange={(v) => atualizar({ instagramHandle: v })}
            placeholder="@perfil"
          />
          <Campo label="Segmento" value={d.segment} onChange={(v) => atualizar({ segment: v })} />
          <Campo label="Cidade" value={d.city} onChange={(v) => atualizar({ city: v })} />
          <Campo
            label="Objetivo do perfil"
            value={d.profileObjective}
            onChange={(v) => atualizar({ profileObjective: v })}
          />
          <Campo
            label="Responsável pela análise"
            value={d.responsibleName}
            onChange={(v) => atualizar({ responsibleName: v })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Status do diagnóstico</Label>
          <Select value={d.status} onValueChange={(v) => atualizar({ status: v as DiagnosticStatus })}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opcao) => (
                <SelectItem key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SectionCard>

      <SectionCard title="Resumo rápido" description="Aparece logo após o cabeçalho no diagnóstico.">
        <TextAreaField
          label="Primeira impressão"
          value={d.summary.firstImpression}
          onChange={(v) => atualizar({ summary: { ...d.summary, firstImpression: v } })}
          rows={2}
        />
        <TextAreaField
          label="Maior risco percebido"
          value={d.summary.mainRisk}
          onChange={(v) => atualizar({ summary: { ...d.summary, mainRisk: v } })}
          rows={2}
        />
        <TextAreaField
          label="Maior oportunidade percebida"
          value={d.summary.mainOpportunity}
          onChange={(v) => atualizar({ summary: { ...d.summary, mainOpportunity: v } })}
          rows={2}
        />
        <TextAreaField
          label="Objetivo sugerido"
          value={d.summary.suggestedObjective}
          onChange={(v) => atualizar({ summary: { ...d.summary, suggestedObjective: v } })}
          rows={2}
        />
      </SectionCard>
    </div>
  );
}

function RiscosTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <SectionCard
      title="Pontos de risco"
      description="O que pode estar travando a percepção de valor do perfil. Envie os prints direto em cada ponto."
    >
      <RiskEditor risks={d.risks} onChange={(risks) => atualizar({ risks })} />
    </SectionCard>
  );
}

function MelhoriasTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <SectionCard
      title="Pontos de melhora"
      description="O que pode tornar o perfil mais estratégico. Envie os prints direto em cada ponto."
    >
      <ImprovementEditor improvements={d.improvements} onChange={(improvements) => atualizar({ improvements })} />
    </SectionCard>
  );
}

function FinalizacaoTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <SectionCard title="Próximo passo e rodapé">
      <TextAreaField
        label="Texto do convite"
        value={d.meeting.invitationText}
        onChange={(v) => atualizar({ meeting: { ...d.meeting, invitationText: v } })}
        rows={4}
      />
      <TextAreaField
        label="Chamada"
        value={d.meeting.ctaText}
        onChange={(v) => atualizar({ meeting: { ...d.meeting, ctaText: v } })}
        rows={2}
      />
      <div className="grid grid-cols-2 gap-4">
        <Campo
          label="Texto do botão"
          value={d.meeting.buttonText}
          onChange={(v) => atualizar({ meeting: { ...d.meeting, buttonText: v } })}
        />
        <Campo
          label="Link de reunião"
          value={d.meeting.meetingLink}
          onChange={(v) => atualizar({ meeting: { ...d.meeting, meetingLink: v } })}
        />
        <Campo
          label="WhatsApp"
          value={d.meeting.whatsapp}
          onChange={(v) => atualizar({ meeting: { ...d.meeting, whatsapp: v } })}
        />
        <Campo
          label="Instagram da Runner"
          value={d.meeting.runnerInstagram}
          onChange={(v) => atualizar({ meeting: { ...d.meeting, runnerInstagram: v } })}
        />
      </div>
      <TextAreaField
        label="Frase final (rodapé)"
        value={d.meeting.finalPhrase}
        onChange={(v) => atualizar({ meeting: { ...d.meeting, finalPhrase: v } })}
        rows={2}
      />
    </SectionCard>
  );
}

const ABAS = [
  { value: "dados-gerais", label: "Dados gerais" },
  { value: "riscos", label: "Pontos de risco" },
  { value: "melhorias", label: "Pontos de melhora" },
  { value: "finalizacao", label: "Finalização" },
] as const;

export default function DiagnosticEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [diagnostico, setDiagnostico] = useState<Diagnostic | null>(null);
  const [salvandoEm, setSalvandoEm] = useState<string | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setDiagnostico(getDiagnostic(id));
    setCarregado(true);
  }, [id]);

  useEffect(() => {
    if (!carregado || !diagnostico) return;
    const timeout = setTimeout(() => {
      saveDiagnostic(diagnostico);
      setSalvandoEm(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnostico]);

  const atualizar: Atualizar = (patch) => {
    setDiagnostico((atual) => (atual ? { ...atual, ...patch } : atual));
  };

  if (carregado && !diagnostico) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-lg font-semibold text-foreground">Diagnóstico não encontrado</h1>
        <p className="text-sm text-muted-foreground">
          Este diagnóstico não existe mais neste navegador (ou foi excluído).
        </p>
        <Button onClick={() => router.push("/")}>Voltar para início</Button>
      </div>
    );
  }

  if (!diagnostico) {
    return null;
  }

  const aoSalvarAgora = () => {
    saveDiagnostic(diagnostico);
    setSalvandoEm(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    toast.success("Diagnóstico salvo.");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-background/85 px-6 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <RunnerLogo className="h-7" />
          <div className="flex flex-col border-l border-border pl-3">
            <span className="text-sm font-semibold text-foreground">
              {diagnostico.clientName || "Novo diagnóstico"}
            </span>
            <span className="text-xs text-muted-foreground">
              {salvandoEm ? `Salvo automaticamente às ${salvandoEm}` : "Ainda não salvo"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
            Início
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportDiagnosticAsJson(diagnostico)}>
            Exportar JSON
          </Button>
          <Button variant="outline" size="sm" onClick={aoSalvarAgora}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button size="sm" onClick={() => router.push(`/diagnostico/${diagnostico.id}/preview`)}>
            <Eye className="h-4 w-4" />
            Visualizar diagnóstico
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        <Tabs defaultValue="dados-gerais">
          <TabsList className="h-auto flex-wrap justify-start">
            {ABAS.map((aba) => (
              <TabsTrigger key={aba.value} value={aba.value}>
                {aba.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="dados-gerais">
              <DadosGeraisTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="riscos">
              <RiscosTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="melhorias">
              <MelhoriasTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="finalizacao">
              <FinalizacaoTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
