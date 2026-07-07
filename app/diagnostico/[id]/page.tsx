// Editor completo de um diagnóstico: 10 abas cobrindo todos os campos das
// 14 páginas do relatório final, com salvamento automático no localStorage.
// Cada aba só recebe o diagnóstico atual e uma função `atualizar` (patch
// parcial no topo do objeto) — a aba monta o patch da seção que edita.

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionPlanEditor } from "@/components/diagnostic/ActionPlanEditor";
import { CheckboxGroupWithComments } from "@/components/diagnostic/CheckboxGroupWithComments";
import { ImageUploader } from "@/components/diagnostic/ImageUploader";
import { OpportunityEditor } from "@/components/diagnostic/OpportunityEditor";
import { ScoreInput } from "@/components/diagnostic/ScoreInput";
import { SectionCard } from "@/components/diagnostic/SectionCard";
import { TextAreaField } from "@/components/diagnostic/TextAreaField";
import {
  DEFAULT_TEXTS,
  HIGHLIGHT_SUGGESTIONS,
  IMPROVEMENT_OPTIONS,
  STATUS_OPTIONS,
  STRENGTH_OPTIONS,
} from "@/lib/defaultData";
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
      <SectionCard title="Dados do cliente" description="Aparecem na capa e no cabeçalho do diagnóstico.">
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
            label="Objetivo principal do perfil"
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

      <SectionCard title="Objetivo da análise" description="Página 2 do diagnóstico.">
        <TextAreaField
          label="Objetivo do diagnóstico"
          value={d.analysisObjective.objective}
          onChange={(v) => atualizar({ analysisObjective: { ...d.analysisObjective, objective: v } })}
        />
        <TextAreaField
          label="Resumo do que foi analisado"
          value={d.analysisObjective.summary}
          onChange={(v) => atualizar({ analysisObjective: { ...d.analysisObjective, summary: v } })}
        />
      </SectionCard>

      <SectionCard title="Visão geral do perfil" description="Página 3 do diagnóstico.">
        <TextAreaField
          label="Primeira impressão"
          value={d.generalAnalysis.firstImpression}
          onChange={(v) => atualizar({ generalAnalysis: { ...d.generalAnalysis, firstImpression: v } })}
          rows={2}
        />
        <TextAreaField
          label="Potencial percebido"
          value={d.generalAnalysis.perceivedPotential}
          onChange={(v) => atualizar({ generalAnalysis: { ...d.generalAnalysis, perceivedPotential: v } })}
          rows={2}
        />
        <TextAreaField
          label="Maior ponto forte"
          value={d.generalAnalysis.mainStrength}
          onChange={(v) => atualizar({ generalAnalysis: { ...d.generalAnalysis, mainStrength: v } })}
          rows={2}
        />
        <TextAreaField
          label="Maior oportunidade"
          value={d.generalAnalysis.mainOpportunity}
          onChange={(v) => atualizar({ generalAnalysis: { ...d.generalAnalysis, mainOpportunity: v } })}
          rows={2}
        />
      </SectionCard>

      <SectionCard title="Notas de 1 a 5" description="Indicadores exibidos na página de visão geral.">
        <ScoreInput
          label="Clareza do perfil"
          value={d.scores.clarity}
          onChange={(v) => atualizar({ scores: { ...d.scores, clarity: v } })}
        />
        <ScoreInput
          label="Identidade visual"
          value={d.scores.visualIdentity}
          onChange={(v) => atualizar({ scores: { ...d.scores, visualIdentity: v } })}
        />
        <ScoreInput
          label="Autoridade"
          value={d.scores.authority}
          onChange={(v) => atualizar({ scores: { ...d.scores, authority: v } })}
        />
        <ScoreInput
          label="Humanização"
          value={d.scores.humanization}
          onChange={(v) => atualizar({ scores: { ...d.scores, humanization: v } })}
        />
        <ScoreInput
          label="Conversão"
          value={d.scores.conversion}
          onChange={(v) => atualizar({ scores: { ...d.scores, conversion: v } })}
        />
        <ScoreInput
          label="Consistência de conteúdo"
          value={d.scores.consistency}
          onChange={(v) => atualizar({ scores: { ...d.scores, consistency: v } })}
        />
      </SectionCard>
    </div>
  );
}

function ImagensTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <SectionCard
      title="Imagens do diagnóstico"
      description="Envie todos os prints e imagens usados no relatório. Defina o tipo de cada uma — as abas de Bio, Visual, Destaques e Conteúdo mostram automaticamente as imagens do tipo correspondente."
    >
      <ImageUploader images={d.images} onChange={(images) => atualizar({ images })} />
    </SectionCard>
  );
}

function BioTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Análise da bio" description={DEFAULT_TEXTS.bioSupport}>
        <TextAreaField
          label="Bio atual"
          value={d.bioAnalysis.currentBio}
          onChange={(v) => atualizar({ bioAnalysis: { ...d.bioAnalysis, currentBio: v } })}
        />
        <TextAreaField
          label="Pontos positivos da bio"
          value={d.bioAnalysis.positivePoints}
          onChange={(v) => atualizar({ bioAnalysis: { ...d.bioAnalysis, positivePoints: v } })}
        />
        <TextAreaField
          label="Pontos de melhoria da bio"
          value={d.bioAnalysis.improvementPoints}
          onChange={(v) => atualizar({ bioAnalysis: { ...d.bioAnalysis, improvementPoints: v } })}
        />
        <TextAreaField
          label="Sugestão de nova bio"
          value={d.bioAnalysis.suggestedBio}
          onChange={(v) => atualizar({ bioAnalysis: { ...d.bioAnalysis, suggestedBio: v } })}
        />
        <TextAreaField
          label="Comentário estratégico"
          value={d.bioAnalysis.strategicComment}
          onChange={(v) => atualizar({ bioAnalysis: { ...d.bioAnalysis, strategicComment: v } })}
        />
      </SectionCard>

      <SectionCard title="Print da bio">
        <ImageUploader
          images={d.images}
          onChange={(images) => atualizar({ images })}
          defaultType="bio"
          filterType="bio"
        />
      </SectionCard>
    </div>
  );
}

function VisualTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Diagnóstico visual">
        <TextAreaField
          label="Comentário sobre identidade visual"
          value={d.visualAnalysis.identityComment}
          onChange={(v) => atualizar({ visualAnalysis: { ...d.visualAnalysis, identityComment: v } })}
        />
        <TextAreaField
          label="Comentário sobre harmonia do feed"
          value={d.visualAnalysis.feedHarmony}
          onChange={(v) => atualizar({ visualAnalysis: { ...d.visualAnalysis, feedHarmony: v } })}
        />
        <TextAreaField
          label="Comentário sobre qualidade das imagens"
          value={d.visualAnalysis.imageQuality}
          onChange={(v) => atualizar({ visualAnalysis: { ...d.visualAnalysis, imageQuality: v } })}
        />
        <TextAreaField
          label="Comentário sobre profissionalismo percebido"
          value={d.visualAnalysis.professionalPerception}
          onChange={(v) =>
            atualizar({ visualAnalysis: { ...d.visualAnalysis, professionalPerception: v } })
          }
        />
        <TextAreaField
          label="Sugestão de direção visual"
          value={d.visualAnalysis.visualDirection}
          onChange={(v) => atualizar({ visualAnalysis: { ...d.visualAnalysis, visualDirection: v } })}
        />
      </SectionCard>

      <SectionCard title="Print do feed ou perfil">
        <ImageUploader
          images={d.images}
          onChange={(images) => atualizar({ images })}
          defaultType="feed"
          filterType="feed"
        />
      </SectionCard>
    </div>
  );
}

function DestaquesTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  const alternarSugestao = (nome: string, marcado: boolean) => {
    const atual = d.highlightsAnalysis.recommendedHighlights;
    const novaLista = marcado ? [...atual, nome] : atual.filter((item) => item !== nome);
    atualizar({ highlightsAnalysis: { ...d.highlightsAnalysis, recommendedHighlights: novaLista } });
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Análise dos destaques">
        <TextAreaField
          label="Comentário sobre organização"
          value={d.highlightsAnalysis.organization}
          onChange={(v) => atualizar({ highlightsAnalysis: { ...d.highlightsAnalysis, organization: v } })}
        />
        <TextAreaField
          label="Comentário sobre capas"
          value={d.highlightsAnalysis.covers}
          onChange={(v) => atualizar({ highlightsAnalysis: { ...d.highlightsAnalysis, covers: v } })}
        />
        <TextAreaField
          label="Comentário sobre nomes dos destaques"
          value={d.highlightsAnalysis.names}
          onChange={(v) => atualizar({ highlightsAnalysis: { ...d.highlightsAnalysis, names: v } })}
        />
        <TextAreaField
          label="Comentário estratégico"
          value={d.highlightsAnalysis.strategicComment}
          onChange={(v) =>
            atualizar({ highlightsAnalysis: { ...d.highlightsAnalysis, strategicComment: v } })
          }
        />
      </SectionCard>

      <SectionCard title="Destaques recomendados">
        <div className="flex flex-wrap gap-3">
          {HIGHLIGHT_SUGGESTIONS.map((nome) => (
            <label
              key={nome}
              className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm"
            >
              <Checkbox
                checked={d.highlightsAnalysis.recommendedHighlights.includes(nome)}
                onCheckedChange={(checked) => alternarSugestao(nome, checked === true)}
              />
              {nome}
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Print dos destaques">
        <ImageUploader
          images={d.images}
          onChange={(images) => atualizar({ images })}
          defaultType="highlights"
          filterType="highlights"
        />
      </SectionCard>
    </div>
  );
}

function ConteudoTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Análise de conteúdo">
        <TextAreaField
          label="Conteúdos que funcionam bem"
          value={d.contentAnalysis.whatWorks}
          onChange={(v) => atualizar({ contentAnalysis: { ...d.contentAnalysis, whatWorks: v } })}
        />
        <TextAreaField
          label="Conteúdos que podem melhorar"
          value={d.contentAnalysis.whatCanImprove}
          onChange={(v) => atualizar({ contentAnalysis: { ...d.contentAnalysis, whatCanImprove: v } })}
        />
        <TextAreaField
          label="Tipos de conteúdo que faltam"
          value={d.contentAnalysis.missingContentTypes}
          onChange={(v) =>
            atualizar({ contentAnalysis: { ...d.contentAnalysis, missingContentTypes: v } })
          }
        />
        <TextAreaField
          label="Comentário estratégico"
          value={d.contentAnalysis.strategicComment}
          onChange={(v) => atualizar({ contentAnalysis: { ...d.contentAnalysis, strategicComment: v } })}
        />
      </SectionCard>

      <SectionCard title="Por categoria estratégica">
        <TextAreaField
          label="Autoridade"
          value={d.contentAnalysis.authorityComment}
          onChange={(v) => atualizar({ contentAnalysis: { ...d.contentAnalysis, authorityComment: v } })}
          rows={2}
        />
        <TextAreaField
          label="Conexão"
          value={d.contentAnalysis.connectionComment}
          onChange={(v) => atualizar({ contentAnalysis: { ...d.contentAnalysis, connectionComment: v } })}
          rows={2}
        />
        <TextAreaField
          label="Conversão"
          value={d.contentAnalysis.conversionComment}
          onChange={(v) => atualizar({ contentAnalysis: { ...d.contentAnalysis, conversionComment: v } })}
          rows={2}
        />
      </SectionCard>

      <SectionCard title="Prints de posts ou Reels analisados">
        <ImageUploader
          images={d.images}
          onChange={(images) => atualizar({ images })}
          defaultType="post"
          filterType={["post", "reels"]}
        />
      </SectionCard>
    </div>
  );
}

function DiagnosticoTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Pontos fortes" description="Selecione os pontos fortes identificados no perfil.">
        <CheckboxGroupWithComments
          options={STRENGTH_OPTIONS}
          items={d.strengths}
          onChange={(strengths) => atualizar({ strengths })}
        />
      </SectionCard>

      <SectionCard title="Pontos de melhoria" description="Selecione os pontos de melhoria identificados.">
        <CheckboxGroupWithComments
          options={IMPROVEMENT_OPTIONS}
          items={d.improvements}
          onChange={(improvements) => atualizar({ improvements })}
        />
      </SectionCard>
    </div>
  );
}

function OportunidadesTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <SectionCard title="Oportunidades de conteúdo" description="Ideias de Reels, posts, carrossel, stories e anúncios.">
      <OpportunityEditor
        opportunities={d.contentOpportunities}
        onChange={(contentOpportunities) => atualizar({ contentOpportunities })}
      />
      <TextAreaField
        label="Observação estratégica"
        value={d.contentOpportunitiesNote}
        onChange={(v) => atualizar({ contentOpportunitiesNote: v })}
      />
    </SectionCard>
  );
}

function PlanoAcaoTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Novo direcionamento sugerido" description="Página 11 do diagnóstico.">
        <TextAreaField
          label="Como o perfil é percebido hoje"
          value={d.newDirection.currentPerception}
          onChange={(v) => atualizar({ newDirection: { ...d.newDirection, currentPerception: v } })}
          rows={2}
        />
        <TextAreaField
          label="Como o perfil pode ser percebido"
          value={d.newDirection.futurePerception}
          onChange={(v) => atualizar({ newDirection: { ...d.newDirection, futurePerception: v } })}
          rows={2}
        />
        <TextAreaField
          label="Caminho sugerido"
          value={d.newDirection.suggestedPath}
          onChange={(v) => atualizar({ newDirection: { ...d.newDirection, suggestedPath: v } })}
        />
        <TextAreaField
          label="Mensagem central recomendada"
          value={d.newDirection.centralMessage}
          onChange={(v) => atualizar({ newDirection: { ...d.newDirection, centralMessage: v } })}
          rows={2}
        />
      </SectionCard>

      <SectionCard title="Plano de ação inicial (30 dias)">
        <ActionPlanEditor items={d.actionPlan} onChange={(actionPlan) => atualizar({ actionPlan })} />
      </SectionCard>
    </div>
  );
}

function FinalizacaoTab({ d, atualizar }: { d: Diagnostic; atualizar: Atualizar }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Convite para reunião" description="Página 13 do diagnóstico.">
        <TextAreaField
          label="Texto do convite"
          value={d.meeting.invitationText}
          onChange={(v) => atualizar({ meeting: { ...d.meeting, invitationText: v } })}
          rows={4}
        />
        <TextAreaField
          label="Chamada principal"
          value={d.meeting.mainCallout}
          onChange={(v) => atualizar({ meeting: { ...d.meeting, mainCallout: v } })}
          rows={2}
        />
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="Texto do botão"
            value={d.meeting.ctaText}
            onChange={(v) => atualizar({ meeting: { ...d.meeting, ctaText: v } })}
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
          <Campo
            label="Nome do responsável"
            value={d.meeting.responsibleName}
            onChange={(v) => atualizar({ meeting: { ...d.meeting, responsibleName: v } })}
          />
        </div>
      </SectionCard>

      <SectionCard title="Página final" description="Página 14 do diagnóstico.">
        <TextAreaField
          label="Frase final"
          value={d.closing.finalPhrase}
          onChange={(v) => atualizar({ closing: { ...d.closing, finalPhrase: v } })}
          rows={2}
        />
        <Campo label="Site (opcional)" value={d.closing.site} onChange={(v) => atualizar({ closing: { ...d.closing, site: v } })} />
      </SectionCard>
    </div>
  );
}

const ABAS = [
  { value: "dados-gerais", label: "Dados gerais" },
  { value: "imagens", label: "Imagens" },
  { value: "bio", label: "Bio" },
  { value: "visual", label: "Visual" },
  { value: "destaques", label: "Destaques" },
  { value: "conteudo", label: "Conteúdo" },
  { value: "diagnostico", label: "Diagnóstico" },
  { value: "oportunidades", label: "Oportunidades" },
  { value: "plano-de-acao", label: "Plano de ação" },
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
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-6 py-3 backdrop-blur">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {diagnostico.clientName || "Novo diagnóstico"}
          </span>
          <span className="text-xs text-muted-foreground">
            {salvandoEm ? `Salvo automaticamente às ${salvandoEm}` : "Ainda não salvo"}
          </span>
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
            <TabsContent value="imagens">
              <ImagensTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="bio">
              <BioTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="visual">
              <VisualTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="destaques">
              <DestaquesTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="conteudo">
              <ConteudoTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="diagnostico">
              <DiagnosticoTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="oportunidades">
              <OportunidadesTab d={diagnostico} atualizar={atualizar} />
            </TabsContent>
            <TabsContent value="plano-de-acao">
              <PlanoAcaoTab d={diagnostico} atualizar={atualizar} />
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
