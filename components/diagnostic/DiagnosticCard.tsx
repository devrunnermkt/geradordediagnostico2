// Card de um diagnóstico na lista da página inicial: dados do cliente,
// status e ações (editar, visualizar, duplicar, exportar, excluir).

"use client";

import { Copy, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import type { DiagnosticSummary } from "@/lib/types";

interface DiagnosticCardProps {
  summary: DiagnosticSummary;
  onEdit: () => void;
  onView: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onExport: () => void;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function DiagnosticCard({
  summary,
  onEdit,
  onView,
  onDuplicate,
  onDelete,
  onExport,
}: DiagnosticCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-heading text-base font-semibold text-foreground">
              {summary.clientName || "Cliente sem nome"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {summary.instagramHandle ? `@${summary.instagramHandle.replace(/^@/, "")}` : "Sem Instagram"}
              {summary.segment ? ` · ${summary.segment}` : ""}
            </p>
          </div>
          <StatusBadge status={summary.status} />
        </div>

        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <span>Criado em {formatarData(summary.createdAt)}</span>
          <span>Atualizado em {formatarData(summary.updatedAt)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <Button size="sm" variant="outline" onClick={onView}>
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
          <Button size="sm" variant="ghost" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
            Duplicar
          </Button>
          <Button size="sm" variant="ghost" onClick={onExport}>
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
