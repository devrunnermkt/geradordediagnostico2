// Editor da lista de ideias de conteúdo (Reels, post, carrossel, stories,
// anúncio...). Cada ideia tem título, formato, objetivo e descrição curta;
// permite adicionar/remover ideias livremente.

"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTENT_FORMAT_OPTIONS, CONTENT_OBJECTIVE_OPTIONS, createId } from "@/lib/defaultData";
import type { ContentFormat, ContentObjective, ContentOpportunity } from "@/lib/types";

interface OpportunityEditorProps {
  opportunities: ContentOpportunity[];
  onChange: (opportunities: ContentOpportunity[]) => void;
}

export function OpportunityEditor({ opportunities, onChange }: OpportunityEditorProps) {
  const atualizar = (id: string, patch: Partial<ContentOpportunity>) => {
    onChange(opportunities.map((op) => (op.id === id ? { ...op, ...patch } : op)));
  };

  const remover = (id: string) => {
    onChange(opportunities.filter((op) => op.id !== id));
  };

  const adicionar = () => {
    onChange([
      ...opportunities,
      { id: createId(), title: "", format: "reels", objective: "authority", description: "" },
    ]);
  };

  return (
    <div className="flex flex-col gap-3">
      {opportunities.map((op, indice) => (
        <div key={op.id} className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ideia {indice + 1}
            </span>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => remover(op.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Título</Label>
            <Input
              value={op.title}
              onChange={(e) => atualizar(op.id, { title: e.target.value })}
              placeholder="Ex.: Bastidores de um atendimento"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Formato</Label>
              <Select value={op.format} onValueChange={(v) => atualizar(op.id, { format: v as ContentFormat })}>
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_FORMAT_OPTIONS.map((opcao) => (
                    <SelectItem key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Objetivo</Label>
              <Select
                value={op.objective}
                onValueChange={(v) => atualizar(op.id, { objective: v as ContentObjective })}
              >
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_OBJECTIVE_OPTIONS.map((opcao) => (
                    <SelectItem key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Descrição curta</Label>
            <Textarea
              value={op.description}
              onChange={(e) => atualizar(op.id, { description: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" className="w-fit" onClick={adicionar}>
        <Plus className="h-4 w-4" />
        Adicionar ideia
      </Button>
    </div>
  );
}
