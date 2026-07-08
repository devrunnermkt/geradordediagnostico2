// Template visual do diagnóstico rápido — um único documento fluido (não
// mais páginas fixas), usado na prévia em tela, na impressão/PDF (via
// window.print, ver app/globals.css) e na exportação em HTML. Sete seções:
// cabeçalho, resumo, imagens, riscos, melhorias, próximo passo e rodapé.

import { DEFAULT_TEXTS, IMAGE_TYPE_OPTIONS } from "@/lib/defaultData";
import type { Diagnostic, DiagnosticImage } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function rotuloTipoImagem(tipo: string): string {
  return IMAGE_TYPE_OPTIONS.find((t) => t.value === tipo)?.label ?? tipo;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <span className="text-xs font-semibold tracking-widest text-[#09b1c2] uppercase">{eyebrow}</span>
      <h2 className="text-2xl font-semibold text-[#082a3e]">{title}</h2>
    </div>
  );
}

function ImageThumb({ image, className }: { image?: DiagnosticImage; className?: string }) {
  if (!image) return null;
  return (
    <div
      className={cn("aspect-[4/3] w-full rounded-xl border border-[#e5e7eb] bg-cover bg-center", className)}
      style={{ backgroundImage: `url(${image.src})` }}
    />
  );
}

interface PreviewDocumentProps {
  diagnostic: Diagnostic;
}

export function PreviewDocument({ diagnostic: d }: PreviewDocumentProps) {
  const imagemPerfil = [...d.images].sort((a, b) => a.order - b.order).find((i) => i.type === "profile");
  const imagensOrdenadas = [...d.images].sort((a, b) => a.order - b.order);
  const riscosOrdenados = [...d.risks].sort((a, b) => a.order - b.order);
  const melhoriasOrdenadas = [...d.improvements].sort((a, b) => a.order - b.order);
  const imagemPorId = (id: string | null) => (id ? d.images.find((i) => i.id === id) : undefined);

  return (
    <div className="flex justify-center bg-[#f7fbfc] py-10 print:bg-white print:py-0">
      <div className="printPage flex flex-col gap-10">
        {/* Cabeçalho */}
        <header className="avoid-break flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-widest text-[#09b1c2] uppercase">
              Runner Marketing
            </span>
            <span className="text-xs text-[#4b5563]">Data da análise: {formatarData(d.createdAt)}</span>
          </div>

          <div className="flex items-center gap-6">
            {imagemPerfil && (
              <div
                className="h-24 w-24 shrink-0 rounded-full border-4 border-[#e5e7eb] bg-cover bg-center"
                style={{ backgroundImage: `url(${imagemPerfil.src})` }}
              />
            )}
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold text-[#082a3e]">Diagnóstico rápido de Instagram</h1>
              <p className="max-w-lg text-sm text-[#4b5563]">
                Pontos de risco e oportunidades para melhorar a percepção do perfil e gerar mais contatos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1 rounded-2xl border border-[#e5e7eb] bg-white p-5 text-sm text-[#111827] sm:grid-cols-3">
            <span>
              <b>Cliente:</b> {d.clientName || "—"}
            </span>
            <span>
              <b>Instagram:</b> {d.instagramHandle ? `@${d.instagramHandle.replace(/^@/, "")}` : "—"}
            </span>
            <span>
              <b>Segmento:</b> {d.segment || "—"}
            </span>
            <span>
              <b>Cidade:</b> {d.city || "—"}
            </span>
            <span>
              <b>Responsável:</b> {d.responsibleName || "—"}
            </span>
          </div>
        </header>

        {/* Resumo rápido */}
        <section>
          <SectionTitle eyebrow="Resumo" title="Resumo rápido" />
          <p className="mb-4 text-sm leading-relaxed text-[#4b5563]">{DEFAULT_TEXTS.summaryIntro}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="avoid-break rounded-xl border border-[#e5e7eb] bg-white p-4">
              <span className="text-xs font-semibold tracking-wide text-[#4b5563] uppercase">
                Primeira impressão
              </span>
              <p className="mt-1 text-sm text-[#111827]">{d.summary.firstImpression || "—"}</p>
            </div>
            <div className="avoid-break rounded-xl border border-[#e5e7eb] bg-white p-4">
              <span className="text-xs font-semibold tracking-wide text-[#4b5563] uppercase">
                Maior risco percebido
              </span>
              <p className="mt-1 text-sm text-[#111827]">{d.summary.mainRisk || "—"}</p>
            </div>
            <div className="avoid-break rounded-xl border border-[#e5e7eb] bg-white p-4">
              <span className="text-xs font-semibold tracking-wide text-[#4b5563] uppercase">
                Maior oportunidade percebida
              </span>
              <p className="mt-1 text-sm text-[#111827]">{d.summary.mainOpportunity || "—"}</p>
            </div>
            <div className="avoid-break rounded-xl border border-[#e5e7eb] bg-white p-4">
              <span className="text-xs font-semibold tracking-wide text-[#4b5563] uppercase">
                Objetivo sugerido
              </span>
              <p className="mt-1 text-sm text-[#111827]">{d.summary.suggestedObjective || "—"}</p>
            </div>
          </div>
        </section>

        {/* Imagens do diagnóstico */}
        {imagensOrdenadas.length > 0 && (
          <section>
            <SectionTitle eyebrow="Evidências" title="Imagens do diagnóstico" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {imagensOrdenadas.map((img) => (
                <div key={img.id} className="avoid-break overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
                  <ImageThumb image={img} className="rounded-none rounded-t-2xl border-0" />
                  <div className="flex flex-col gap-1 p-3">
                    <span className="w-fit rounded-full bg-[#082a3e]/5 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#082a3e] uppercase">
                      {rotuloTipoImagem(img.type)}
                    </span>
                    {img.caption && <span className="text-sm font-medium text-[#111827]">{img.caption}</span>}
                    {img.comment && <p className="text-xs text-[#4b5563]">{img.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pontos de risco */}
        {riscosOrdenados.length > 0 && (
          <section>
            <SectionTitle eyebrow="Atenção" title="Pontos de risco" />
            <div className="flex flex-col gap-3">
              {riscosOrdenados.map((risco) => {
                const imagem = imagemPorId(risco.relatedImageId);
                return (
                  <div
                    key={risco.id}
                    className="avoid-break flex gap-4 rounded-2xl border border-[#f0d9b5] bg-[#fdf8f0] p-5"
                  >
                    {imagem && <ImageThumb image={imagem} className="w-32 shrink-0" />}
                    <div className="flex flex-1 flex-col gap-1.5">
                      {risco.type && (
                        <span className="w-fit rounded-full bg-[#082a3e]/5 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#082a3e] uppercase">
                          {risco.type}
                        </span>
                      )}
                      <h3 className="text-base font-semibold text-[#082a3e]">{risco.title}</h3>
                      {risco.comment && <p className="text-sm text-[#111827]">{risco.comment}</p>}
                      {risco.impact && (
                        <p className="text-sm text-[#4b5563]">
                          <b className="text-[#111827]">Impacto: </b>
                          {risco.impact}
                        </p>
                      )}
                      {risco.quickSuggestion && (
                        <p className="text-sm text-[#4b5563]">
                          <b className="text-[#111827]">Sugestão rápida: </b>
                          {risco.quickSuggestion}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Pontos de melhora */}
        {melhoriasOrdenadas.length > 0 && (
          <section>
            <SectionTitle eyebrow="Oportunidade" title="Pontos de melhora" />
            <div className="flex flex-col gap-3">
              {melhoriasOrdenadas.map((melhoria) => {
                const imagem = imagemPorId(melhoria.relatedImageId);
                return (
                  <div
                    key={melhoria.id}
                    className="avoid-break flex gap-4 rounded-2xl border border-[#bdeaef] bg-[#f0fbfc] p-5"
                  >
                    {imagem && <ImageThumb image={imagem} className="w-32 shrink-0" />}
                    <div className="flex flex-1 flex-col gap-1.5">
                      {melhoria.type && (
                        <span className="w-fit rounded-full bg-[#09b1c2]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#09b1c2] uppercase">
                          {melhoria.type}
                        </span>
                      )}
                      <h3 className="text-base font-semibold text-[#082a3e]">{melhoria.title}</h3>
                      {melhoria.comment && <p className="text-sm text-[#111827]">{melhoria.comment}</p>}
                      {melhoria.expectedBenefit && (
                        <p className="text-sm text-[#4b5563]">
                          <b className="text-[#111827]">Benefício esperado: </b>
                          {melhoria.expectedBenefit}
                        </p>
                      )}
                      {melhoria.recommendedAction && (
                        <p className="text-sm text-[#4b5563]">
                          <b className="text-[#111827]">Ação recomendada: </b>
                          {melhoria.recommendedAction}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Próximo passo */}
        <section className="avoid-break rounded-2xl p-8 text-white" style={{ backgroundColor: "#082a3e" }}>
          <p className="text-sm leading-relaxed whitespace-pre-line text-white/85">{d.meeting.invitationText}</p>
          <p className="mt-4 text-xl font-semibold">{d.meeting.ctaText}</p>
          {d.meeting.buttonText && (
            <span className="mt-4 inline-block w-fit rounded-full bg-[#09b1c2] px-6 py-3 text-sm font-semibold text-white">
              {d.meeting.buttonText}
            </span>
          )}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/70">
            {d.meeting.whatsapp && <span>WhatsApp: {d.meeting.whatsapp}</span>}
            {d.meeting.runnerInstagram && <span>Instagram: @{d.meeting.runnerInstagram.replace(/^@/, "")}</span>}
            {d.meeting.meetingLink && <span>{d.meeting.meetingLink}</span>}
          </div>
        </section>

        {/* Rodapé */}
        <footer className="avoid-break flex flex-col items-center gap-2 border-t border-[#e5e7eb] pt-6 text-center">
          <span className="text-xs font-semibold tracking-widest text-[#09b1c2] uppercase">
            Runner Marketing
          </span>
          <p className="max-w-md text-sm text-[#4b5563]">{d.meeting.finalPhrase}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[#4b5563]">
            {d.meeting.runnerInstagram && <span>@{d.meeting.runnerInstagram.replace(/^@/, "")}</span>}
            {d.meeting.whatsapp && <span>{d.meeting.whatsapp}</span>}
          </div>
        </footer>
      </div>
    </div>
  );
}
