// Editor da lista de pontos de melhora: cada card tem tipo (com sugestões),
// título, comentário, benefício esperado, ação recomendada e suas próprias
// imagens. Permite adicionar, editar, remover e reordenar tanto os pontos
// quanto as imagens dentro de cada um.

"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PointImageUploader } from "./PointImageUploader";
import { createId, IMPROVEMENT_TYPE_SUGGESTIONS } from "@/lib/defaultData";
import type { ImprovementPoint } from "@/lib/types";

interface ImprovementEditorProps {
  improvements: ImprovementPoint[];
  onChange: (improvements: ImprovementPoint[]) => void;
}

export function ImprovementEditor({ improvements, onChange }: ImprovementEditorProps) {
  const ordenados = [...improvements].sort((a, b) => a.order - b.order);

  const atualizar = (id: string, patch: Partial<ImprovementPoint>) => {
    onChange(improvements.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const remover = (id: string) => {
    onChange(improvements.filter((m) => m.id !== id));
  };

  const adicionar = () => {
    const proximaOrdem = improvements.length > 0 ? Math.max(...improvements.map((m) => m.order)) + 1 : 0;
    onChange([
      ...improvements,
      {
        id: createId(),
        type: "",
        title: "",
        comment: "",
        expectedBenefit: "",
        recommendedAction: "",
        order: proximaOrdem,
        images: [],
      },
    ]);
  };

  const trocarOrdem = (idA: string, idB: string) => {
    const a = improvements.find((m) => m.id === idA);
    const b = improvements.find((m) => m.id === idB);
    if (!a || !b) return;
    onChange(
      improvements.map((m) => {
        if (m.id === idA) return { ...m, order: b.order };
        if (m.id === idB) return { ...m, order: a.order };
        return m;
      })
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <datalist id="improvement-type-suggestions">
        {IMPROVEMENT_TYPE_SUGGESTIONS.map((sugestao) => (
          <option key={sugestao} value={sugestao} />
        ))}
      </datalist>

      {ordenados.map((melhoria, indice) => (
        <div key={melhoria.id} className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Melhoria {indice + 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={indice === 0}
                onClick={() => trocarOrdem(melhoria.id, ordenados[indice - 1].id)}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={indice === ordenados.length - 1}
                onClick={() => trocarOrdem(melhoria.id, ordenados[indice + 1].id)}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon-sm" onClick={() => remover(melhoria.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Tipo</Label>
            <Input
              list="improvement-type-suggestions"
              value={melhoria.type}
              onChange={(e) => atualizar(melhoria.id, { type: e.target.value })}
              placeholder="Ex.: Organizar destaques"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Título</Label>
            <Input
              value={melhoria.title}
              onChange={(e) => atualizar(melhoria.id, { title: e.target.value })}
              placeholder="Ex.: Transformar os destaques em uma vitrine de confiança"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Comentário</Label>
            <Textarea
              value={melhoria.comment}
              onChange={(e) => atualizar(melhoria.id, { comment: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Benefício esperado</Label>
            <Textarea
              value={melhoria.expectedBenefit}
              onChange={(e) => atualizar(melhoria.id, { expectedBenefit: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Ação recomendada</Label>
            <Textarea
              value={melhoria.recommendedAction}
              onChange={(e) => atualizar(melhoria.id, { recommendedAction: e.target.value })}
              rows={2}
            />
          </div>

          <PointImageUploader
            images={melhoria.images}
            onChange={(images) => atualizar(melhoria.id, { images })}
          />
        </div>
      ))}

      <Button type="button" variant="outline" className="w-fit" onClick={adicionar}>
        <Plus className="h-4 w-4" />
        Adicionar ponto de melhora
      </Button>
    </div>
  );
}
