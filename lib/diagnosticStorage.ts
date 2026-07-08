// Persistência 100% local (localStorage) dos diagnósticos. Não há backend:
// tudo que a equipe cria fica só no navegador do computador usado. Único
// ponto de leitura/escrita — telas chamam essas funções, nunca localStorage
// diretamente.

import { createEmptyDiagnostic, createId } from "./defaultData";
import type { Diagnostic, DiagnosticSummary } from "./types";

// v2: modelo de dados simplificado (summary/risks/improvements em vez das
// antigas análises por página) — chave nova pra não carregar diagnósticos
// salvos no formato antigo, que quebrariam a UI enxuta.
const STORAGE_KEY = "runner-insight-diagnostics-v2";

type DiagnosticMap = Record<string, Diagnostic>;

function lerTudo(): DiagnosticMap {
  if (typeof window === "undefined") return {};
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    return bruto ? (JSON.parse(bruto) as DiagnosticMap) : {};
  } catch {
    return {};
  }
}

function salvarTudo(mapa: DiagnosticMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapa));
}

export function listDiagnostics(): DiagnosticSummary[] {
  const mapa = lerTudo();
  return Object.values(mapa)
    .map(
      (d): DiagnosticSummary => ({
        id: d.id,
        clientName: d.clientName,
        instagramHandle: d.instagramHandle,
        segment: d.segment,
        status: d.status,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getDiagnostic(id: string): Diagnostic | null {
  const mapa = lerTudo();
  return mapa[id] ?? null;
}

export function saveDiagnostic(diagnostic: Diagnostic): Diagnostic {
  const mapa = lerTudo();
  const atualizado: Diagnostic = { ...diagnostic, updatedAt: new Date().toISOString() };
  mapa[atualizado.id] = atualizado;
  salvarTudo(mapa);
  return atualizado;
}

export function createDiagnostic(): Diagnostic {
  const diagnostico = createEmptyDiagnostic();
  const mapa = lerTudo();
  mapa[diagnostico.id] = diagnostico;
  salvarTudo(mapa);
  return diagnostico;
}

export function deleteDiagnostic(id: string): void {
  const mapa = lerTudo();
  delete mapa[id];
  salvarTudo(mapa);
}

export function duplicateDiagnostic(id: string): Diagnostic | null {
  const original = getDiagnostic(id);
  if (!original) return null;

  const agora = new Date().toISOString();
  const copia: Diagnostic = {
    ...original,
    id: createId(),
    clientName: original.clientName ? `${original.clientName} (cópia)` : "Cópia",
    status: "rascunho",
    createdAt: agora,
    updatedAt: agora,
  };

  const mapa = lerTudo();
  mapa[copia.id] = copia;
  salvarTudo(mapa);
  return copia;
}

export function importDiagnostic(diagnostic: Diagnostic): Diagnostic {
  const mapa = lerTudo();
  const jaExiste = Boolean(mapa[diagnostic.id]);
  const agora = new Date().toISOString();

  const importado: Diagnostic = jaExiste
    ? { ...diagnostic, id: createId(), createdAt: agora, updatedAt: agora }
    : diagnostic;

  mapa[importado.id] = importado;
  salvarTudo(mapa);
  return importado;
}
