// Grade de checkboxes com comentário opcional por item selecionado. Usado
// nas páginas de Pontos fortes e Pontos de melhoria — mesma estrutura de
// dados ({ id, title, comment }), só muda a lista de opções sugeridas.

"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createId } from "@/lib/defaultData";

export interface CommentableItem {
  id: string;
  title: string;
  comment: string;
}

interface CheckboxGroupWithCommentsProps {
  options: string[];
  items: CommentableItem[];
  onChange: (items: CommentableItem[]) => void;
}

export function CheckboxGroupWithComments({ options, items, onChange }: CheckboxGroupWithCommentsProps) {
  const [novoTitulo, setNovoTitulo] = useState("");

  const itemPorTitulo = (titulo: string) => items.find((item) => item.title === titulo);

  const alternarOpcao = (titulo: string, marcado: boolean) => {
    if (marcado) {
      onChange([...items, { id: createId(), title: titulo, comment: "" }]);
    } else {
      onChange(items.filter((item) => item.title !== titulo));
    }
  };

  const atualizarComentario = (id: string, comment: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, comment } : item)));
  };

  const removerItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const adicionarPersonalizado = () => {
    const titulo = novoTitulo.trim();
    if (!titulo) return;
    onChange([...items, { id: createId(), title: titulo, comment: "" }]);
    setNovoTitulo("");
  };

  const itensPersonalizados = items.filter((item) => !options.includes(item.title));

  return (
    <div className="flex flex-col gap-3">
      {options.map((opcao) => {
        const item = itemPorTitulo(opcao);
        const marcado = Boolean(item);
        return (
          <div key={opcao} className="rounded-lg border border-border bg-white p-3">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Checkbox
                checked={marcado}
                onCheckedChange={(checked) => alternarOpcao(opcao, checked === true)}
              />
              {opcao}
            </label>
            {item && (
              <Textarea
                className="mt-2"
                value={item.comment}
                onChange={(e) => atualizarComentario(item.id, e.target.value)}
                placeholder="Comentário personalizado (opcional)"
                rows={2}
              />
            )}
          </div>
        );
      })}

      {itensPersonalizados.map((item) => (
        <div key={item.id} className="rounded-lg border border-secondary/30 bg-secondary/5 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-foreground">{item.title}</span>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => removerItem(item.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            className="mt-2"
            value={item.comment}
            onChange={(e) => atualizarComentario(item.id, e.target.value)}
            placeholder="Comentário personalizado (opcional)"
            rows={2}
          />
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          value={novoTitulo}
          onChange={(e) => setNovoTitulo(e.target.value)}
          placeholder="Adicionar item personalizado"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), adicionarPersonalizado())}
        />
        <Button type="button" variant="outline" onClick={adicionarPersonalizado}>
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>
    </div>
  );
}
