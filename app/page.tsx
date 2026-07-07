// Página inicial: apresenta o Runner Insight, permite criar um novo
// diagnóstico, importar um projeto salvo em JSON e lista os diagnósticos já
// salvos no navegador com suas ações (editar/visualizar/duplicar/excluir/exportar).

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, FolderOpen, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/diagnostic/ConfirmDialog";
import { DiagnosticCard } from "@/components/diagnostic/DiagnosticCard";
import { EmptyState } from "@/components/diagnostic/EmptyState";
import {
  createDiagnostic,
  deleteDiagnostic,
  duplicateDiagnostic,
  getDiagnostic,
  importDiagnostic,
  listDiagnostics,
} from "@/lib/diagnosticStorage";
import { exportDiagnosticAsJson, parseDiagnosticFromFile } from "@/lib/exportUtils";
import type { DiagnosticSummary } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticSummary[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null);
  const inputImportarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDiagnosticos(listDiagnostics());
    setCarregado(true);
  }, []);

  const recarregar = () => setDiagnosticos(listDiagnostics());

  const aoCriarNovo = () => {
    const diagnostico = createDiagnostic();
    router.push(`/diagnostico/${diagnostico.id}`);
  };

  const aoImportarClick = () => inputImportarRef.current?.click();

  const aoSelecionarArquivoImportado = async (evento: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!arquivo) return;

    try {
      const diagnostico = await parseDiagnosticFromFile(arquivo);
      importDiagnostic(diagnostico);
      recarregar();
      toast.success("Diagnóstico importado com sucesso.");
    } catch {
      toast.error("Não foi possível importar este arquivo. Confira se é um JSON do Runner Insight.");
    }
  };

  const aoExportar = (id: string) => {
    const diagnostico = getDiagnostic(id);
    if (!diagnostico) return;
    exportDiagnosticAsJson(diagnostico);
  };

  const aoDuplicar = (id: string) => {
    duplicateDiagnostic(id);
    recarregar();
    toast.success("Diagnóstico duplicado.");
  };

  const aoConfirmarExclusao = () => {
    if (!idParaExcluir) return;
    deleteDiagnostic(idParaExcluir);
    recarregar();
    toast.success("Diagnóstico excluído.");
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-14">
      <header className="flex flex-col items-start gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
            Runner Marketing
          </span>
          <h1 className="font-heading text-3xl font-semibold text-foreground">Runner Insight</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Monte diagnósticos estratégicos de Instagram para possíveis clientes: preencha os dados,
            suba prints do perfil e gere uma prévia profissional pronta para imprimir ou salvar em PDF.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={aoCriarNovo}>
            <Plus className="h-4 w-4" />
            Criar novo diagnóstico
          </Button>
          <Button variant="outline" onClick={aoImportarClick}>
            <FileUp className="h-4 w-4" />
            Importar projeto
          </Button>
          <input
            ref={inputImportarRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={aoSelecionarArquivoImportado}
          />
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Diagnósticos salvos neste navegador
        </h2>

        {!carregado ? null : diagnosticos.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Nenhum diagnóstico ainda"
            description="Crie o primeiro diagnóstico ou importe um projeto salvo em JSON para começar."
            action={
              <Button size="sm" onClick={aoCriarNovo}>
                <Plus className="h-4 w-4" />
                Criar novo diagnóstico
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diagnosticos.map((diagnostico) => (
              <DiagnosticCard
                key={diagnostico.id}
                summary={diagnostico}
                onEdit={() => router.push(`/diagnostico/${diagnostico.id}`)}
                onView={() => router.push(`/diagnostico/${diagnostico.id}/preview`)}
                onDuplicate={() => aoDuplicar(diagnostico.id)}
                onExport={() => aoExportar(diagnostico.id)}
                onDelete={() => setIdParaExcluir(diagnostico.id)}
              />
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={idParaExcluir !== null}
        onOpenChange={(open) => !open && setIdParaExcluir(null)}
        title="Excluir diagnóstico"
        description="Essa ação não pode ser desfeita. O diagnóstico será removido permanentemente deste navegador."
        confirmLabel="Excluir"
        onConfirm={aoConfirmarExclusao}
      />
    </div>
  );
}
