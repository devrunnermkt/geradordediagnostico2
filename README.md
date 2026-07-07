# Runner Insight

Sistema interno da Runner Marketing para gerar diagnósticos estratégicos de
Instagram: preenche dados do cliente, sobe prints do perfil, monta a análise
em 10 abas e exporta uma prévia profissional de 14 páginas pronta para
imprimir ou salvar como PDF pelo navegador.

100% front-end: sem backend, sem banco de dados, sem login, sem API externa.
Tudo fica salvo no `localStorage` do navegador usado.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Persistência em `localStorage`, imagens convertidas para base64 (redimensionadas no upload)
- Exportação/importação de projeto em JSON
- Exportação em HTML autocontido
- Impressão/PDF via `window.print()` com CSS de impressão dedicado (A4)

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
2. Preencha os dados nas 10 abas do editor — o rascunho salva automaticamente
   no navegador a cada alteração.
3. Envie os prints do Instagram na aba **Imagens** (ou diretamente nas abas
   Bio/Visual/Destaques/Conteúdo, que já filtram pelo tipo certo).
4. Clique em **Visualizar diagnóstico** para ver a prévia final.
5. Na prévia, use **Imprimir / Salvar PDF** (abre o diálogo de impressão do
   navegador — escolha "Salvar como PDF"), ou **Exportar HTML**/**Exportar
   JSON** para levar o material para outro lugar.
6. Na página inicial, cada diagnóstico salvo pode ser editado, visualizado,
   duplicado, exportado ou excluído (com confirmação).

## Estrutura do projeto

```
app/
  page.tsx                        Página inicial (lista + criar/importar)
  diagnostico/[id]/page.tsx        Editor com as 10 abas + autosave
  diagnostico/[id]/preview/page.tsx  Prévia final + toolbar de exportação
  globals.css                      Tema (paleta Runner) + regras de impressão A4

components/diagnostic/             Componentes reutilizáveis da ferramenta
  DiagnosticCard, ImageUploader, ImageCard, ScoreInput, SectionCard,
  TextAreaField, CheckboxGroupWithComments, OpportunityEditor,
  ActionPlanEditor, PreviewDocument, PrintToolbar, EmptyState,
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

## Adicionando um novo diagnóstico ao modelo de dados

Os campos e textos padrão de cada página do relatório ficam em
`lib/types.ts` (tipos) e `lib/defaultData.ts` (valores iniciais, textos
padrão e listas de opções) — ajuste ali para mudar o conteúdo sugerido sem
tocar nos componentes.
