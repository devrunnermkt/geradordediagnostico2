# Runner Insight

Sistema interno da Runner Marketing para gerar diagnósticos **rápidos** de
Instagram: preenche dados do cliente, sobe prints do perfil, cadastra pontos
de risco e de melhora, e exporta uma prévia comercial enxuta (HTML único, 2 a
4 páginas ao imprimir) pronta para enviar a possíveis clientes.

100% front-end: sem backend, sem banco de dados, sem login, sem API externa.
Tudo fica salvo no `localStorage` do navegador usado.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Persistência em `localStorage`, imagens convertidas para base64 (redimensionadas no upload)
- Exportação/importação de projeto em JSON
- Exportação em HTML autocontido
- Impressão/PDF via `window.print()` com CSS de impressão dedicado (A4, documento fluido)

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

> **Nota (Windows):** o script `dev` usa `next dev --webpack` em vez do
> Turbopack padrão. O Turbopack do Next 16 tem um bug conhecido ao rodar em
> pastas de usuário do Windows com espaço no nome (ex.: `C:\Users\Nome
> Sobrenome\...`), que quebra a compilação do `globals.css`. `npm run build`
> usa Turbopack normalmente e funciona sem problema.

## Como usar

1. Na página inicial, clique em **Criar novo diagnóstico** (ou **Importar
   projeto** para carregar um `.json` exportado antes).
2. Preencha os dados nas 5 abas do editor — o rascunho salva automaticamente
   no navegador a cada alteração.
3. Envie os prints do Instagram na aba **Imagens** (tipo, legenda e
   comentário por imagem); depois vincule-as opcionalmente a um ponto de
   risco ou de melhora.
4. Cadastre quantos **Pontos de risco** e **Pontos de melhora** fizerem
   sentido para o perfil.
5. Clique em **Visualizar diagnóstico** para ver a prévia final (um único
   documento: cabeçalho, resumo, imagens, riscos, melhorias, próximo passo e
   rodapé).
6. Na prévia, use **Imprimir / Salvar PDF** (abre o diálogo de impressão do
   navegador — escolha "Salvar como PDF"), ou **Exportar HTML**/**Exportar
   JSON** para levar o material para outro lugar.
7. Na página inicial, cada diagnóstico salvo pode ser editado, visualizado,
   duplicado, exportado ou excluído (com confirmação).

## Estrutura do projeto

```
app/
  page.tsx                        Página inicial (lista + criar/importar)
  diagnostico/[id]/page.tsx        Editor com as 5 abas + autosave
  diagnostico/[id]/preview/page.tsx  Prévia final + toolbar de exportação
  globals.css                      Tema (paleta Runner) + regras de impressão A4

components/diagnostic/             Componentes reutilizáveis da ferramenta
  DiagnosticCard, ImageUploader, ImageCard, RiskEditor, ImprovementEditor,
  SectionCard, TextAreaField, PreviewDocument, PrintToolbar, EmptyState,
  ConfirmDialog, StatusBadge

components/ui/                     Primitivos shadcn/ui (button, input, tabs, dialog...)

lib/
  types.ts                         Modelo de dados (Diagnostic e sub-tipos)
  defaultData.ts                   Fábrica de diagnóstico vazio, textos e listas padrão
  diagnosticStorage.ts             CRUD no localStorage
  imageUtils.ts                    Redimensionamento de imagem + base64
  exportUtils.ts                   Exportação/importação JSON e HTML
```

## Identidade visual

Paleta e raio de borda ficam centralizados em `app/globals.css` (variáveis
CSS do tema shadcn — `--primary`, `--secondary`, `--background`, etc.):

- Azul escuro `#082a3e` — cor primária
- Azul destaque `#09b1c2` — cor secundária/de destaque
- Fundo claro `#f7fbfc`, texto `#111827`, cinza claro `#e5e7eb`

## Ajustando campos e textos padrão

Os campos e textos padrão do diagnóstico ficam em `lib/types.ts` (tipos) e
`lib/defaultData.ts` (valores iniciais, textos padrão e sugestões de tipo de
risco/melhora) — ajuste ali para mudar o conteúdo sugerido sem tocar nos
componentes.
