// Card de uma imagem enviada: preview + tipo + legenda + comentário +
// controles de ordem/remoção. Usado dentro do ImageUploader.

"use client";

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IMAGE_TYPE_OPTIONS } from "@/lib/defaultData";
import type { DiagnosticImage, ImageType } from "@/lib/types";

interface ImageCardProps {
  image: DiagnosticImage;
  onChange: (patch: Partial<DiagnosticImage>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ImageCard({
  image,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ImageCardProps) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-white p-4">
      <div
        className="h-28 w-28 shrink-0 rounded-lg bg-cover bg-center bg-muted"
        style={{ backgroundImage: `url(${image.src})` }}
      />

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Tipo</Label>
            <Select value={image.type} onValueChange={(v) => onChange({ type: v as ImageType })}>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_TYPE_OPTIONS.map((opcao) => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Legenda</Label>
            <Input
              value={image.caption}
              onChange={(e) => onChange({ caption: e.target.value })}
              placeholder="Ex.: Bio atual do perfil"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon-sm" disabled={isFirst} onClick={onMoveUp}>
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" disabled={isLast} onClick={onMoveDown}>
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>

        <Textarea
          value={image.comment}
          onChange={(e) => onChange({ comment: e.target.value })}
          placeholder="Comentário estratégico sobre esta imagem"
          rows={2}
        />
      </div>
    </div>
  );
}
