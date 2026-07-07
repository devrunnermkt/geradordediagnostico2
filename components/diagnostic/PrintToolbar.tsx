// Barra de ações da prévia: Editar, Imprimir/Salvar PDF, Exportar HTML,
// Exportar JSON. Tem a classe "no-print" para desaparecer na impressão.

"use client";

import { ArrowLeft, Code2, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintToolbarProps {
  clientName: string;
  onEdit: () => void;
  onPrint: () => void;
  onExportHtml: () => void;
  onExportJson: () => void;
}

export function PrintToolbar({ clientName, onEdit, onPrint, onExportHtml, onExportJson }: PrintToolbarProps) {
  return (
    <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-6 py-3 backdrop-blur">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">{clientName || "Diagnóstico"}</span>
        <span className="text-xs text-muted-foreground">Prévia do relatório final</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <ArrowLeft className="h-4 w-4" />
          Editar
        </Button>
        <Button variant="outline" size="sm" onClick={onExportJson}>
          <Download className="h-4 w-4" />
          Exportar JSON
        </Button>
        <Button variant="outline" size="sm" onClick={onExportHtml}>
          <Code2 className="h-4 w-4" />
          Exportar HTML
        </Button>
        <Button size="sm" onClick={onPrint}>
          <Printer className="h-4 w-4" />
          Imprimir / Salvar PDF
        </Button>
      </div>
    </div>
  );
}
