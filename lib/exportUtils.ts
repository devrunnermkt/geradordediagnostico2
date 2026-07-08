// Exportação/importação de diagnósticos. Tudo roda no navegador: JSON vira
// um arquivo baixado via Blob, e a versão HTML "congela" o preview
// renderizado (com o CSS já compilado da página) num único arquivo
// autocontido, sem precisar de backend.

import { sanitizeDiagnostic } from "./defaultData";
import type { Diagnostic } from "./types";

export function slugify(texto: string): string {
  return (
    texto
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "diagnostico"
  );
}

function downloadFile(nomeArquivo: string, conteudo: string, tipoMime: string): void {
  const blob = new Blob([conteudo], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportDiagnosticAsJson(diagnostic: Diagnostic): void {
  const nomeArquivo = `diagnostico-${slugify(diagnostic.clientName)}-runner-insight.json`;
  downloadFile(nomeArquivo, JSON.stringify(diagnostic, null, 2), "application/json");
}

export async function parseDiagnosticFromFile(file: File): Promise<Diagnostic> {
  const texto = await file.text();
  const dados = JSON.parse(texto);

  if (!dados || typeof dados !== "object" || !dados.id || typeof dados.clientName !== "string") {
    throw new Error("Arquivo JSON não parece ser um diagnóstico válido do Runner Insight.");
  }

  // Normaliza formatos antigos (ex.: pontos sem array de imagens próprio)
  // pra não quebrar a UI ao importar um JSON exportado de uma versão anterior.
  return sanitizeDiagnostic(dados as Diagnostic);
}

// Congela o HTML renderizado (elemento da prévia) + todo o CSS compilado das
// folhas de estilo same-origin da página, num documento autocontido.
export function exportDiagnosticAsHtml(diagnostic: Diagnostic, previewElement: HTMLElement): void {
  const clone = previewElement.cloneNode(true) as HTMLElement;

  let css = "";
  for (const folha of Array.from(document.styleSheets)) {
    try {
      for (const regra of Array.from(folha.cssRules)) {
        css += regra.cssText + "\n";
      }
    } catch {
      // Folha de estilo cross-origin — ignora, não deve acontecer neste app.
    }
  }

  const documentoHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Diagnóstico — ${diagnostic.clientName || "Cliente"} — Runner Insight</title>
<style>${css}</style>
</head>
<body class="bg-white">
${clone.outerHTML}
</body>
</html>`;

  const nomeArquivo = `diagnostico-${slugify(diagnostic.clientName)}-runner-insight.html`;
  downloadFile(nomeArquivo, documentoHtml, "text/html");
}
