// Página de prévia: mostra o diagnóstico como o cliente vai ver (mesmo
// template usado na impressão/exportação). O botão "Imprimir / Salvar PDF"
// dispara window.print(), que usa o CSS de impressão de app/globals.css.

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PreviewDocument } from "@/components/diagnostic/PreviewDocument";
import { PrintToolbar } from "@/components/diagnostic/PrintToolbar";
import { getDiagnostic } from "@/lib/diagnosticStorage";
import { exportDiagnosticAsHtml, exportDiagnosticAsJson } from "@/lib/exportUtils";
import type { Diagnostic } from "@/lib/types";

export default function DiagnosticPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [diagnostico, setDiagnostico] = useState<Diagnostic | null>(null);
  const [carregado, setCarregado] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDiagnostico(getDiagnostic(id));
    setCarregado(true);
  }, [id]);

  if (carregado && !diagnostico) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-lg font-semibold text-foreground">Diagnóstico não encontrado</h1>
        <Button onClick={() => router.push("/")}>Voltar para início</Button>
      </div>
    );
  }

  if (!diagnostico) return null;

  return (
    <div className="flex flex-1 flex-col">
      <PrintToolbar
        clientName={diagnostico.clientName}
        onEdit={() => router.push(`/diagnostico/${diagnostico.id}`)}
        onPrint={() => window.print()}
        onExportJson={() => exportDiagnosticAsJson(diagnostico)}
        onExportHtml={() => previewRef.current && exportDiagnosticAsHtml(diagnostico, previewRef.current)}
      />
      <div ref={previewRef}>
        <PreviewDocument diagnostic={diagnostico} />
      </div>
    </div>
  );
}
