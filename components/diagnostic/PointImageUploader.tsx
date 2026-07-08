// Upload de imagens embutido dentro de um ponto de risco ou de melhora.
// Cada imagem pertence só àquele ponto: sem campo de tipo, só legenda,
// comentário e ordem. Usado por RiskEditor e ImprovementEditor.

"use client";

import { useState, type ChangeEvent } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createId } from "@/lib/defaultData";
import { resizeImageToDataUrl } from "@/lib/imageUtils";
import type { PointImage } from "@/lib/types";

interface PointImageUploaderProps {
  images: PointImage[];
  onChange: (images: PointImage[]) => void;
}

export function PointImageUploader({ images, onChange }: PointImageUploaderProps) {
  const [carregando, setCarregando] = useState(false);
  const ordenadas = [...images].sort((a, b) => a.order - b.order);

  const aoSelecionarArquivos = async (evento: ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(evento.target.files ?? []);
    if (arquivos.length === 0) return;

    setCarregando(true);
    try {
      const proximaOrdem = images.length > 0 ? Math.max(...images.map((i) => i.order)) + 1 : 0;
      const novas: PointImage[] = [];
      for (let i = 0; i < arquivos.length; i++) {
        const src = await resizeImageToDataUrl(arquivos[i]);
        novas.push({
          id: createId(),
          src,
          name: arquivos[i].name,
          caption: "",
          comment: "",
          order: proximaOrdem + i,
        });
      }
      onChange([...images, ...novas]);
    } finally {
      setCarregando(false);
      evento.target.value = "";
    }
  };

  const atualizar = (id: string, patch: Partial<PointImage>) => {
    onChange(images.map((img) => (img.id === id ? { ...img, ...patch } : img)));
  };

  const remover = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const trocarOrdem = (idA: string, idB: string) => {
    const a = images.find((i) => i.id === idA);
    const b = images.find((i) => i.id === idB);
    if (!a || !b) return;
    onChange(
      images.map((img) => {
        if (img.id === idA) return { ...img, order: b.order };
        if (img.id === idB) return { ...img, order: a.order };
        return img;
      })
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-xs text-muted-foreground">Imagens do ponto</Label>

      {ordenadas.length > 0 && (
        <div className="flex flex-col gap-2">
          {ordenadas.map((imagem, indice) => (
            <div key={imagem.id} className="flex gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <div
                className="h-16 w-16 shrink-0 rounded-md bg-cover bg-center bg-muted"
                style={{ backgroundImage: `url(${imagem.src})` }}
              />
              <div className="flex flex-1 flex-col gap-2">
                <Input
                  value={imagem.caption}
                  onChange={(e) => atualizar(imagem.id, { caption: e.target.value })}
                  placeholder="Legenda"
                  className="h-7 text-xs"
                />
                <Textarea
                  value={imagem.comment}
                  onChange={(e) => atualizar(imagem.id, { comment: e.target.value })}
                  placeholder="Comentário"
                  rows={1}
                  className="text-xs"
                />
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1">
                <button
                  type="button"
                  disabled={indice === 0}
                  onClick={() => trocarOrdem(imagem.id, ordenadas[indice - 1].id)}
                  className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={indice === ordenadas.length - 1}
                  onClick={() => trocarOrdem(imagem.id, ordenadas[indice + 1].id)}
                  className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remover(imagem.id)}
                  className="rounded p-1 text-destructive hover:bg-destructive/10"
                  aria-label="Remover imagem"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50">
        {carregando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
        {carregando ? "Processando..." : "Adicionar imagem"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={aoSelecionarArquivos}
          disabled={carregando}
        />
      </label>
    </div>
  );
}
