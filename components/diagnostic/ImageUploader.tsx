// Upload múltiplo de imagens: converte cada arquivo em base64 redimensionado
// e mantém a lista ordenada, delegando a edição de cada item ao ImageCard.

"use client";

import { useState, type ChangeEvent } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageCard } from "./ImageCard";
import { createId } from "@/lib/defaultData";
import { resizeImageToDataUrl } from "@/lib/imageUtils";
import type { DiagnosticImage, ImageType } from "@/lib/types";

interface ImageUploaderProps {
  images: DiagnosticImage[];
  onChange: (images: DiagnosticImage[]) => void;
  defaultType?: ImageType;
  filterType?: ImageType | ImageType[];
}

export function ImageUploader({ images, onChange, defaultType = "other", filterType }: ImageUploaderProps) {
  const [carregando, setCarregando] = useState(false);

  const tiposPermitidos = filterType ? (Array.isArray(filterType) ? filterType : [filterType]) : null;
  const listaFiltrada = tiposPermitidos
    ? images.filter((img) => tiposPermitidos.includes(img.type))
    : images;
  const listaOrdenada = [...listaFiltrada].sort((a, b) => a.order - b.order);

  const aoSelecionarArquivos = async (evento: ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(evento.target.files ?? []);
    if (arquivos.length === 0) return;

    setCarregando(true);
    try {
      const proximaOrdem = images.length > 0 ? Math.max(...images.map((i) => i.order)) + 1 : 0;
      const novas: DiagnosticImage[] = [];
      for (let i = 0; i < arquivos.length; i++) {
        const src = await resizeImageToDataUrl(arquivos[i]);
        novas.push({
          id: createId(),
          type: defaultType,
          name: arquivos[i].name,
          src,
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

  const atualizarImagem = (id: string, patch: Partial<DiagnosticImage>) => {
    onChange(images.map((img) => (img.id === id ? { ...img, ...patch } : img)));
  };

  const removerImagem = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const trocarOrdem = (idA: string, idB: string) => {
    const imgA = images.find((i) => i.id === idA);
    const imgB = images.find((i) => i.id === idB);
    if (!imgA || !imgB) return;
    onChange(
      images.map((img) => {
        if (img.id === idA) return { ...img, order: imgB.order };
        if (img.id === idB) return { ...img, order: imgA.order };
        return img;
      })
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50">
        {carregando ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {carregando ? "Processando imagens..." : "Enviar imagens"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={aoSelecionarArquivos}
          disabled={carregando}
        />
      </label>

      {listaOrdenada.length > 0 && (
        <div className="flex flex-col gap-3">
          {listaOrdenada.map((imagem, indice) => (
            <ImageCard
              key={imagem.id}
              image={imagem}
              onChange={(patch) => atualizarImagem(imagem.id, patch)}
              onRemove={() => removerImagem(imagem.id)}
              onMoveUp={() => indice > 0 && trocarOrdem(imagem.id, listaOrdenada[indice - 1].id)}
              onMoveDown={() =>
                indice < listaOrdenada.length - 1 && trocarOrdem(imagem.id, listaOrdenada[indice + 1].id)
              }
              isFirst={indice === 0}
              isLast={indice === listaOrdenada.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
