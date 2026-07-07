// Selo colorido do status de um diagnóstico (rascunho, em revisão, pronto
// para envio, enviado, reunião marcada). Usado no card da lista e no editor.

import { Badge } from "@/components/ui/badge";
import { STATUS_OPTIONS } from "@/lib/defaultData";
import type { DiagnosticStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const CORES_POR_STATUS: Record<DiagnosticStatus, string> = {
  rascunho: "bg-muted text-muted-foreground",
  "em-revisao": "bg-[#09b1c2]/15 text-[#09b1c2]",
  "pronto-para-envio": "bg-[#082a3e]/10 text-[#082a3e]",
  enviado: "bg-emerald-100 text-emerald-700",
  "reuniao-marcada": "bg-amber-100 text-amber-700",
};

export function StatusBadge({ status }: { status: DiagnosticStatus }) {
  const rotulo = STATUS_OPTIONS.find((opcao) => opcao.value === status)?.label ?? status;

  return (
    <Badge variant="outline" className={cn("border-transparent font-medium", CORES_POR_STATUS[status])}>
      {rotulo}
    </Badge>
  );
}
