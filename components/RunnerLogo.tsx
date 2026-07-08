// Logo oficial da Runner Marketing (servida a partir de /public). Duas
// variantes: texto escuro (fundo claro, padrão) e texto branco (fundo
// escuro) — mesmo padrão usado no Gerador de Propostas Runner.

import { cn } from "@/lib/utils";

interface RunnerLogoProps {
  className?: string;
  onDark?: boolean;
}

export function RunnerLogo({ className, onDark = false }: RunnerLogoProps) {
  const src = onDark ? "/runner-logo-fundo-escuro.png" : "/runner-logo-fundo-claro.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Runner Marketing" className={cn("h-9 w-auto select-none", className)} draggable={false} />
  );
}
