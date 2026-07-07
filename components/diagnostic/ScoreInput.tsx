// Seletor de nota de 1 a 5 usado nos indicadores de perfil (clareza,
// identidade visual, autoridade, humanização, conversão, consistência).

"use client";

import { cn } from "@/lib/utils";

interface ScoreInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function ScoreInput({ label, value, onChange }: ScoreInputProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((nota) => (
          <button
            key={nota}
            type="button"
            onClick={() => onChange(nota)}
            aria-label={`${label}: nota ${nota}`}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
              nota <= value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
          >
            {nota}
          </button>
        ))}
      </div>
    </div>
  );
}
