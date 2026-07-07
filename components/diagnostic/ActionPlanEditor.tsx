// Plano de ação de 30 dias: lista fixa de ações com checkbox + descrição
// curta editável. Só os itens marcados aparecem no PDF final.

"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { ActionPlanItem } from "@/lib/types";

interface ActionPlanEditorProps {
  items: ActionPlanItem[];
  onChange: (items: ActionPlanItem[]) => void;
}

export function ActionPlanEditor({ items, onChange }: ActionPlanEditorProps) {
  const atualizar = (id: string, patch: Partial<ActionPlanItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-3 rounded-lg border border-border bg-white p-3"
        >
          <Checkbox
            className="mt-0.5"
            checked={item.selected}
            onCheckedChange={(checked) => atualizar(item.id, { selected: checked === true })}
          />
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">{item.title}</span>
            <Input
              value={item.description}
              onChange={(e) => atualizar(item.id, { description: e.target.value })}
              placeholder="Descrição curta"
              className="text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
