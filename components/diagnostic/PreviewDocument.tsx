// Template visual das 14 páginas do diagnóstico final — usado tanto na
// prévia em tela quanto na impressão/exportação em PDF (via window.print)
// e na exportação em HTML. Cada <section className="printPage"> é uma
// página A4 (ver regras de impressão em app/globals.css).

import type { ReactNode } from "react";
import {
  CONTENT_FORMAT_OPTIONS,
  CONTENT_OBJECTIVE_OPTIONS,
  DEFAULT_TEXTS,
} from "@/lib/defaultData";
import type { Diagnostic, DiagnosticImage } from "@/lib/types";

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function primeiraImagemDoTipo(images: DiagnosticImage[], tipo: string): DiagnosticImage | undefined {
  return [...images].filter((i) => i.type === tipo).sort((a, b) => a.order - b.order)[0];
}

function imagensDoTipo(images: DiagnosticImage[], tipos: string[]): DiagnosticImage[] {
  return [...images].filter((i) => tipos.includes(i.type)).sort((a, b) => a.order - b.order);
}

function RunnerBrand({ light = false }: { light?: boolean }) {
  return (
    <div
      className={`text-xs font-semibold tracking-widest uppercase ${light ? "text-white/80" : "text-[#09b1c2]"}`}
    >
      Runner Marketing
    </div>
  );
}

function PageEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-xs font-semibold tracking-widest text-[#09b1c2] uppercase">
      {children}
    </span>
  );
}

function PageFooter({ page, title }: { page: number; title: string }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-[#e5e7eb] pt-3 text-[10px] text-[#4b5563]">
      <span>Runner Insight · Diagnóstico Estratégico de Instagram</span>
      <span>
        {title} · {String(page).padStart(2, "0")}/14
      </span>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-[#111827]">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className="h-2.5 w-6 rounded-full"
            style={{ backgroundColor: n <= value ? "#082a3e" : "#e5e7eb" }}
          />
        ))}
      </div>
    </div>
  );
}

function Paragraph({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="text-sm leading-relaxed text-[#111827] whitespace-pre-line">{children}</p>;
}

function FieldBlock({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="avoid-break flex flex-col gap-1">
      <span className="text-xs font-semibold tracking-wide text-[#4b5563] uppercase">{label}</span>
      <Paragraph>{value}</Paragraph>
    </div>
  );
}

function ImageFrame({ image, className = "" }: { image?: DiagnosticImage; className?: string }) {
  if (!image) return null;
  return (
    <figure className={`avoid-break overflow-hidden rounded-2xl border border-[#e5e7eb] ${className}`}>
      <div className="aspect-[4/3] w-full bg-cover bg-center" style={{ backgroundImage: `url(${image.src})` }} />
      {image.caption && <figcaption className="px-3 py-2 text-xs text-[#4b5563]">{image.caption}</figcaption>}
    </figure>
  );
}

interface PreviewDocumentProps {
  diagnostic: Diagnostic;
}

export function PreviewDocument({ diagnostic: d }: PreviewDocumentProps) {
  const imagemPerfil = primeiraImagemDoTipo(d.images, "profile") ?? primeiraImagemDoTipo(d.images, "cover");
  const imagemBio = primeiraImagemDoTipo(d.images, "bio");
  const imagensFeed = imagensDoTipo(d.images, ["feed"]);
  const imagemDestaques = primeiraImagemDoTipo(d.images, "highlights");
  const imagensConteudo = imagensDoTipo(d.images, ["post", "reels"]);

  const pontosFortesSelecionados = d.strengths.filter((s) => s.title);
  const pontosMelhoriaSelecionados = d.improvements.filter((i) => i.title);
  const acoesSelecionadas = d.actionPlan.filter((item) => item.selected);

  return (
    <div className="flex flex-col items-center bg-[#f7fbfc] py-10 print:bg-white print:py-0">
      {/* Página 1 — Capa */}
      <section className="printPage flex flex-col" style={{ backgroundColor: "#082a3e", color: "white" }}>
        <RunnerBrand light />
        <div className="flex flex-1 flex-col justify-center gap-6 py-16">
          {imagemPerfil && (
            <div
              className="h-28 w-28 rounded-full border-4 border-white/20 bg-cover bg-center"
              style={{ backgroundImage: `url(${imagemPerfil.src})` }}
            />
          )}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium tracking-widest text-[#09b1c2] uppercase">
              Análise Estratégica de Instagram
            </span>
            <h1 className="text-4xl leading-tight font-semibold">{d.clientName || "Cliente"}</h1>
            <p className="text-white/70">
              {d.instagramHandle && `@${d.instagramHandle.replace(/^@/, "")}`}
              {d.segment && ` · ${d.segment}`}
              {d.city && ` · ${d.city}`}
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/80">{DEFAULT_TEXTS.coverPositioning}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Data da análise: {formatarData(d.createdAt)}</span>
          <span>Runner Insight</span>
        </div>
      </section>

      {/* Página 2 — Objetivo da análise */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Objetivo da análise</h2>
        <FieldBlock label="Objetivo do diagnóstico" value={d.analysisObjective.objective} />
        <FieldBlock label="Resumo do que foi analisado" value={d.analysisObjective.summary} />
        <PageFooter page={2} title="Objetivo da análise" />
      </section>

      {/* Página 3 — Visão geral do perfil */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Visão geral do perfil</h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-[#111827]">
          <span>
            <b>Cliente:</b> {d.clientName}
          </span>
          <span>
            <b>Instagram:</b> @{d.instagramHandle?.replace(/^@/, "")}
          </span>
          <span>
            <b>Segmento:</b> {d.segment}
          </span>
          <span>
            <b>Cidade:</b> {d.city}
          </span>
          <span className="col-span-2">
            <b>Objetivo principal do perfil:</b> {d.profileObjective}
          </span>
        </div>

        <FieldBlock label="Primeira impressão" value={d.generalAnalysis.firstImpression} />
        <FieldBlock label="Potencial percebido" value={d.generalAnalysis.perceivedPotential} />
        <FieldBlock label="Maior oportunidade" value={d.generalAnalysis.mainOpportunity} />

        <div className="avoid-break rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <ScoreBar label="Clareza do perfil" value={d.scores.clarity} />
          <ScoreBar label="Identidade visual" value={d.scores.visualIdentity} />
          <ScoreBar label="Autoridade" value={d.scores.authority} />
          <ScoreBar label="Humanização" value={d.scores.humanization} />
          <ScoreBar label="Conversão" value={d.scores.conversion} />
          <ScoreBar label="Consistência de conteúdo" value={d.scores.consistency} />
        </div>
        <PageFooter page={3} title="Visão geral do perfil" />
      </section>

      {/* Página 4 — Análise da bio */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Análise da bio</h2>
        <p className="text-sm text-[#4b5563] italic">{DEFAULT_TEXTS.bioSupport}</p>
        <ImageFrame image={imagemBio} className="max-w-xs" />
        <FieldBlock label="Bio atual" value={d.bioAnalysis.currentBio} />
        <FieldBlock label="Pontos positivos" value={d.bioAnalysis.positivePoints} />
        <FieldBlock label="Pontos de melhoria" value={d.bioAnalysis.improvementPoints} />
        <FieldBlock label="Sugestão de nova bio" value={d.bioAnalysis.suggestedBio} />
        <FieldBlock label="Comentário estratégico" value={d.bioAnalysis.strategicComment} />
        <PageFooter page={4} title="Análise da bio" />
      </section>

      {/* Página 5 — Diagnóstico visual */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Diagnóstico visual</h2>
        <div className="grid grid-cols-3 gap-3">
          {imagensFeed.slice(0, 3).map((img) => (
            <ImageFrame key={img.id} image={img} />
          ))}
        </div>
        <FieldBlock label="Identidade visual" value={d.visualAnalysis.identityComment} />
        <FieldBlock label="Harmonia do feed" value={d.visualAnalysis.feedHarmony} />
        <FieldBlock label="Qualidade das imagens" value={d.visualAnalysis.imageQuality} />
        <FieldBlock label="Profissionalismo percebido" value={d.visualAnalysis.professionalPerception} />
        <FieldBlock label="Sugestão de direção visual" value={d.visualAnalysis.visualDirection} />
        <PageFooter page={5} title="Diagnóstico visual" />
      </section>

      {/* Página 6 — Análise dos destaques */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Análise dos destaques</h2>
        <ImageFrame image={imagemDestaques} className="max-w-xs" />
        <FieldBlock label="Organização" value={d.highlightsAnalysis.organization} />
        <FieldBlock label="Capas" value={d.highlightsAnalysis.covers} />
        <FieldBlock label="Nomes dos destaques" value={d.highlightsAnalysis.names} />
        <FieldBlock label="Comentário estratégico" value={d.highlightsAnalysis.strategicComment} />
        {d.highlightsAnalysis.recommendedHighlights.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold tracking-wide text-[#4b5563] uppercase">
              Destaques recomendados
            </span>
            <div className="flex flex-wrap gap-2">
              {d.highlightsAnalysis.recommendedHighlights.map((nome) => (
                <span
                  key={nome}
                  className="rounded-full bg-[#09b1c2]/10 px-3 py-1 text-xs font-medium text-[#082a3e]"
                >
                  {nome}
                </span>
              ))}
            </div>
          </div>
        )}
        <PageFooter page={6} title="Análise dos destaques" />
      </section>

      {/* Página 7 — Análise de conteúdo */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Análise de conteúdo</h2>
        <div className="grid grid-cols-3 gap-3">
          {imagensConteudo.slice(0, 3).map((img) => (
            <ImageFrame key={img.id} image={img} />
          ))}
        </div>
        <FieldBlock label="Conteúdos que funcionam bem" value={d.contentAnalysis.whatWorks} />
        <FieldBlock label="Conteúdos que podem melhorar" value={d.contentAnalysis.whatCanImprove} />
        <FieldBlock label="Tipos de conteúdo que faltam" value={d.contentAnalysis.missingContentTypes} />

        <div className="grid grid-cols-3 gap-3">
          <div className="avoid-break rounded-xl bg-white p-3 ring-1 ring-[#e5e7eb]">
            <PageEyebrow>Autoridade</PageEyebrow>
            <Paragraph>{d.contentAnalysis.authorityComment}</Paragraph>
          </div>
          <div className="avoid-break rounded-xl bg-white p-3 ring-1 ring-[#e5e7eb]">
            <PageEyebrow>Conexão</PageEyebrow>
            <Paragraph>{d.contentAnalysis.connectionComment}</Paragraph>
          </div>
          <div className="avoid-break rounded-xl bg-white p-3 ring-1 ring-[#e5e7eb]">
            <PageEyebrow>Conversão</PageEyebrow>
            <Paragraph>{d.contentAnalysis.conversionComment}</Paragraph>
          </div>
        </div>
        <FieldBlock label="Comentário estratégico" value={d.contentAnalysis.strategicComment} />
        <PageFooter page={7} title="Análise de conteúdo" />
      </section>

      {/* Página 8 — Pontos fortes */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Pontos fortes</h2>
        <div className="grid grid-cols-2 gap-3">
          {pontosFortesSelecionados.map((item) => (
            <div key={item.id} className="avoid-break rounded-xl border border-[#e5e7eb] bg-white p-4">
              <span className="text-sm font-semibold text-[#082a3e]">{item.title}</span>
              {item.comment && <p className="mt-1 text-sm text-[#4b5563]">{item.comment}</p>}
            </div>
          ))}
        </div>
        <PageFooter page={8} title="Pontos fortes" />
      </section>

      {/* Página 9 — Pontos de melhoria */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Pontos de melhoria</h2>
        <div className="grid grid-cols-2 gap-3">
          {pontosMelhoriaSelecionados.map((item) => (
            <div key={item.id} className="avoid-break rounded-xl border border-[#e5e7eb] bg-white p-4">
              <span className="text-sm font-semibold text-[#082a3e]">{item.title}</span>
              {item.comment && <p className="mt-1 text-sm text-[#4b5563]">{item.comment}</p>}
            </div>
          ))}
        </div>
        <PageFooter page={9} title="Pontos de melhoria" />
      </section>

      {/* Página 10 — Oportunidades de conteúdo */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Oportunidades de conteúdo</h2>
        <div className="grid grid-cols-2 gap-3">
          {d.contentOpportunities
            .filter((op) => op.title)
            .map((op) => (
              <div key={op.id} className="avoid-break rounded-xl border border-[#e5e7eb] bg-white p-4">
                <div className="mb-1 flex gap-2 text-xs">
                  <span className="rounded-full bg-[#082a3e]/5 px-2 py-0.5 font-medium text-[#082a3e]">
                    {CONTENT_FORMAT_OPTIONS.find((f) => f.value === op.format)?.label}
                  </span>
                  <span className="rounded-full bg-[#09b1c2]/10 px-2 py-0.5 font-medium text-[#09b1c2]">
                    {CONTENT_OBJECTIVE_OPTIONS.find((o) => o.value === op.objective)?.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#111827]">{op.title}</span>
                {op.description && <p className="mt-1 text-sm text-[#4b5563]">{op.description}</p>}
              </div>
            ))}
        </div>
        <FieldBlock label="Observação estratégica" value={d.contentOpportunitiesNote} />
        <PageFooter page={10} title="Oportunidades de conteúdo" />
      </section>

      {/* Página 11 — Novo direcionamento sugerido */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Novo direcionamento sugerido</h2>
        <FieldBlock label="Como o perfil é percebido hoje" value={d.newDirection.currentPerception} />
        <FieldBlock label="Como o perfil pode ser percebido" value={d.newDirection.futurePerception} />
        <FieldBlock label="Caminho sugerido" value={d.newDirection.suggestedPath} />
        {d.newDirection.centralMessage && (
          <div className="avoid-break rounded-2xl bg-[#082a3e] p-5 text-white">
            <PageEyebrow>Mensagem central recomendada</PageEyebrow>
            <p className="text-base leading-relaxed">{d.newDirection.centralMessage}</p>
          </div>
        )}
        <PageFooter page={11} title="Novo direcionamento sugerido" />
      </section>

      {/* Página 12 — Plano de ação inicial */}
      <section className="printPage flex flex-col gap-6">
        <RunnerBrand />
        <h2 className="text-2xl font-semibold text-[#082a3e]">Plano de ação inicial (30 dias)</h2>
        <div className="flex flex-col gap-2">
          {acoesSelecionadas.map((item) => (
            <div
              key={item.id}
              className="avoid-break flex items-start gap-3 rounded-xl border border-[#e5e7eb] bg-white p-3"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#09b1c2] text-[10px] font-bold text-white">
                ✓
              </span>
              <div>
                <span className="text-sm font-semibold text-[#111827]">{item.title}</span>
                {item.description && <p className="text-sm text-[#4b5563]">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
        <PageFooter page={12} title="Plano de ação inicial" />
      </section>

      {/* Página 13 — Convite para reunião */}
      <section className="printPage flex flex-col" style={{ backgroundColor: "#082a3e", color: "white" }}>
        <RunnerBrand light />
        <div className="flex flex-1 flex-col justify-center gap-6 py-12">
          <Paragraph>
            <span className="text-white/85">{d.meeting.invitationText}</span>
          </Paragraph>
          <p className="text-2xl leading-snug font-semibold">{d.meeting.mainCallout}</p>
          {d.meeting.ctaText && (
            <span className="w-fit rounded-full bg-[#09b1c2] px-6 py-3 text-sm font-semibold text-white">
              {d.meeting.ctaText}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/70">
          {d.meeting.responsibleName && <span>{d.meeting.responsibleName}</span>}
          {d.meeting.whatsapp && <span>WhatsApp: {d.meeting.whatsapp}</span>}
          {d.meeting.runnerInstagram && <span>Instagram: @{d.meeting.runnerInstagram.replace(/^@/, "")}</span>}
          {d.meeting.meetingLink && <span>{d.meeting.meetingLink}</span>}
        </div>
      </section>

      {/* Página 14 — Página final */}
      <section
        className="printPage flex flex-col items-center justify-center gap-6 text-center"
        style={{ backgroundColor: "#082a3e", color: "white" }}
      >
        <span className="text-sm font-semibold tracking-widest text-[#09b1c2] uppercase">Runner Marketing</span>
        <p className="max-w-md text-xl leading-relaxed font-medium">{d.closing.finalPhrase}</p>
        <div className="flex flex-col gap-1 text-sm text-white/70">
          {d.meeting.runnerInstagram && <span>@{d.meeting.runnerInstagram.replace(/^@/, "")}</span>}
          {d.meeting.whatsapp && <span>{d.meeting.whatsapp}</span>}
          {d.closing.site && <span>{d.closing.site}</span>}
        </div>
      </section>
    </div>
  );
}
