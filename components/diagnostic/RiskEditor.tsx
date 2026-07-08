// Editor da lista de pontos de risco: cada card tem tipo (com sugestões),
// título, comentário, impacto, sugestão rápida e uma imagem relacionada
// opcional. Permite adicionar, editar, remover e reordenar.

"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createId, IMAGE_TYPE_OPTIONS, RISK_TYPE_SUGGESTIONS } from "@/lib/defaultData";
import type { DiagnosticImage, RiskPoint } from "@/lib/types";

interface RiskEditorProps {
  risks: RiskPoint[];
  images: DiagnosticImage[];
  onChange: (risks: RiskPoint[]) => void;
}

export function RiskEditor({ risks, images, onChange }: RiskEditorProps) {
  const ordenados = [...risks].sort((a, b) => a.order - b.order);

  const atualizar = (id: string, patch: Partial<RiskPoint>) => {
    onChange(risks.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const remover = (id: string) => {
    onChange(risks.filter((r) => r.id !== id));
  };

  const adicionar = () => {
    const proximaOrdem = risks.length > 0 ? Math.max(...risks.map((r) => r.order)) + 1 : 0;
    onChange([
      ...risks,
      {
        id: createId(),
        type: "",
        title: "",
        comment: "",
        impact: "",
        quickSuggestion: "",
        relatedImageId: null,
        order: proximaOrdem,
      },
    ]);
  };

  const trocarOrdem = (idA: string, idB: string) => {
    const a = risks.find((r) => r.id === idA);
    const b = risks.find((r) => r.id === idB);
    if (!a || !b) return;
    onChange(
      risks.map((r) => {
        if (r.id === idA) return { ...r, order: b.order };
        if (r.id === idB) return { ...r, order: a.order };
        return r;
      })
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <datalist id="risk-type-suggestions">
        {RISK_TYPE_SUGGESTIONS.map((sugestao) => (
          <option key={sugestao} value={sugestao} />
        ))}
      </datalist>

      {ordenados.map((risco, indice) => (
        <div key={risco.id} className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Risco {indice + 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={indice === 0}
                onClick={() => trocarOrdem(risco.id, ordenados[indice - 1].id)}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={indice === ordenados.length - 1}
                onClick={() => trocarOrdem(risco.id, ordenados[indice + 1].id)}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remover(risco.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Tipo</Label>
              <Input
                list="risk-type-suggestions"
                value={risco.type}
                onChange={(e) => atualizar(risco.id, { type: e.target.value })}
                placeholder="Ex.: Bio pouco clara"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Imagem relacionada (opcional)</Label>
              <Select
                value={risco.relatedImageId ?? "none"}
                onValueChange={(v) => atualizar(risco.id, { relatedImageId: v === "none" ? null : v })}
              >
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {images.map((img) => (
                    <SelectItem key={img.id} value={img.id}>
                      {IMAGE_TYPE_OPTIONS.find((t) => t.value === img.type)?.label} —{" "}
                      {img.caption || "sem legenda"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Título</Label>
            <Input
              value={risco.title}
              onChange={(e) => atualizar(risco.id, { title: e.target.value })}
              placeholder="Ex.: O visitante pode não entender rapidamente o que você oferece"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Comentário</Label>
            <Textarea
              value={risco.comment}
              onChange={(e) => atualizar(risco.id, { comment: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Impacto</Label>
            <Textarea
              value={risco.impact}
              onChange={(e) => atualizar(risco.id, { impact: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Sugestão rápida</Label>
            <Textarea
              value={risco.quickSuggestion}
              onChange={(e) => atualizar(risco.id, { quickSuggestion: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" className="w-fit" onClick={adicionar}>
        <Plus className="h-4 w-4" />
        Adicionar ponto de risco
      </Button>
    </div>
  );
}
