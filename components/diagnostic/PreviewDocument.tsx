// Template visual do diagnóstico rápido — um único documento fluido (não
// mais páginas fixas), usado na prévia em tela, na impressão/PDF (via
// window.print, ver app/globals.css) e na exportação em HTML. Seis seções:
// cabeçalho, resumo, riscos (imagem ao lado do texto), melhorias (idem),
// próximo passo e rodapé.

import { DEFAULT_TEXTS } from "@/lib/defaultData";
import type { Diagnostic, PointImage } from "@/lib/types";

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <span className="text-xs font-semibold tracking-widest text-[#09b1c2] uppercase">{eyebrow}</span>
      <h2 className="text-2xl font-semibold text-[#082a3e]">{title}</h2>
    </div>
  );
}

interface PointCardField {
  label: string;
  value: string;
}

interface PointCardProps {
  images: PointImage[];
  type: string;
  title: string;
  comment: string;
  fields: PointCardField[];
  borderColor: string;
  bgColor: string;
  typeBg: string;
  typeColor: string;
}

// Card de um ponto de risco/melhora: imagem (ou galeria, a principal em
// destaque) à esquerda, texto à direita — lado a lado no desktop e na
// impressão, empilhado só no mobile. "avoid-break" mantém o card inteiro
// numa mesma página impressa.
function PointCard({ images, type, title, comment, fields, borderColor, bgColor, typeBg, typeColor }: PointCardProps) {
  const ordenadas = [...images].sort((a, b) => a.order - b.order);
  const principal = ordenadas[0];
  const demais = ordenadas.slice(1);

  return (
    <div
      className="avoid-break flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row"
      style={{ borderColor, backgroundColor: bgColor }}
    >
      {principal && (
        <div className="flex shrink-0 flex-col gap-1.5 sm:w-56">
          <div className="avoid-break overflow-hidden rounded-xl border border-white bg-white/70">
            <div
              className="aspect-[4/3] w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${principal.src})` }}
            />
            {(principal.caption || principal.comment) && (
              <div className="flex flex-col gap-0.5 p-2">
                {principal.caption && (
                  <span className="text-xs font-medium text-[#111827]">{principal.caption}</span>
                )}
                {principal.comment && <p className="text-[11px] text-[#4b5563]">{principal.comment}</p>}
              </div>
            )}
          </div>

          {demais.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5">
              {demais.map((img) => (
                <div
                  key={img.id}
                  className="aspect-square rounded-lg border border-white bg-cover bg-center"
                  style={{ backgroundImage: `url(${img.src})` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1.5">
        {type && (
          <span
            className="w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
            style={{ backgroundColor: typeBg, color: typeColor }}
          >
            {type}
          </span>
        )}
        <h3 className="text-base font-semibold text-[#082a3e]">{title}</h3>
        {comment && <p className="text-sm text-[#111827]">{comment}</p>}
        {fields.map(
          (campo) =>
            campo.value && (
              <p key={campo.label} className="text-sm text-[#4b5563]">
                <b className="text-[#111827]">{campo.label}: </b>
                {campo.value}
              </p>
            )
        )}
      </div>
    </div>
  );
}

interface PreviewDocumentProps {
  diagnostic: Diagnostic;
}

export function PreviewDocument({ diagnostic: d }: PreviewDocumentProps) {
  const riscosOrdenados = [...d.risks].sort((a, b) => a.order - b.order);
  const melhoriasOrdenadas = [...d.improvements].sort((a, b) => a.order - b.order);

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

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#082a3e] sm:text-3xl">Diagnóstico rápido de Instagram</h1>
            <p className="max-w-lg text-sm text-[#4b5563]">
              Pontos de risco e oportunidades para melhorar a percepção do perfil e gerar mais contatos.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-1.5 rounded-2xl border border-[#e5e7eb] bg-white p-5 text-sm text-[#111827] sm:grid-cols-3">
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

        {/* Pontos de risco */}
        {riscosOrdenados.length > 0 && (
          <section>
            <SectionTitle eyebrow="Atenção" title="Pontos de risco" />
            <div className="flex flex-col gap-3">
              {riscosOrdenados.map((risco) => (
                <PointCard
                  key={risco.id}
                  images={risco.images}
                  type={risco.type}
                  title={risco.title}
                  comment={risco.comment}
                  fields={[
                    { label: "Impacto", value: risco.impact },
                    { label: "Sugestão rápida", value: risco.quickSuggestion },
                  ]}
                  borderColor="#f0d9b5"
                  bgColor="#fdf8f0"
                  typeBg="rgba(8, 42, 62, 0.05)"
                  typeColor="#082a3e"
                />
              ))}
            </div>
          </section>
        )}

        {/* Pontos de melhora */}
        {melhoriasOrdenadas.length > 0 && (
          <section>
            <SectionTitle eyebrow="Oportunidade" title="Pontos de melhora" />
            <div className="flex flex-col gap-3">
              {melhoriasOrdenadas.map((melhoria) => (
                <PointCard
                  key={melhoria.id}
                  images={melhoria.images}
                  type={melhoria.type}
                  title={melhoria.title}
                  comment={melhoria.comment}
                  fields={[
                    { label: "Benefício esperado", value: melhoria.expectedBenefit },
                    { label: "Ação recomendada", value: melhoria.recommendedAction },
                  ]}
                  borderColor="#bdeaef"
                  bgColor="#f0fbfc"
                  typeBg="rgba(9, 177, 194, 0.1)"
                  typeColor="#09b1c2"
                />
              ))}
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
