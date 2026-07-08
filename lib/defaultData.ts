// Fábrica de diagnóstico vazio, textos padrão sugeridos e listas de opções.
// Centraliza todo o "conteúdo estático" do sistema para facilitar ajuste de
// copy sem mexer em componentes.

import type { Diagnostic, DiagnosticStatus, ImprovementPoint, RiskPoint } from "./types";

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const STATUS_OPTIONS: { value: DiagnosticStatus; label: string }[] = [
  { value: "rascunho", label: "Rascunho" },
  { value: "em-revisao", label: "Em revisão" },
  { value: "pronto-para-envio", label: "Pronto para envio" },
  { value: "enviado", label: "Enviado" },
  { value: "reuniao-marcada", label: "Reunião marcada" },
];

export const RISK_TYPE_SUGGESTIONS = [
  "Bio pouco clara",
  "Falta de chamada para ação",
  "Feed sem unidade",
  "Pouca prova social",
  "Destaques confusos",
  "Pouca humanização",
  "Conteúdo sem direção",
  "Baixa frequência",
  "Oferta pouco evidente",
  "Pouco uso de Reels",
  "Percepção visual fraca",
  "Falta de autoridade",
  "Falta de diferenciação",
];

export const IMPROVEMENT_TYPE_SUGGESTIONS = [
  "Melhorar bio",
  "Organizar destaques",
  "Criar linha visual",
  "Criar prova social",
  "Mostrar bastidores",
  "Criar conteúdos de autoridade",
  "Criar conteúdos de conversão",
  "Melhorar chamadas para contato",
  "Aumentar frequência",
  "Usar Reels com estratégia",
  "Fortalecer posicionamento",
  "Criar calendário de conteúdo",
  "Melhorar capas dos posts",
];

export const DEFAULT_TEXTS = {
  summaryIntro:
    "Analisamos o perfil com foco em clareza, confiança e conversão. O objetivo deste diagnóstico é mostrar, de forma rápida, os pontos que podem estar travando a percepção de valor e as melhorias que podem tornar o perfil mais estratégico para atrair interessados.",
  invitationText:
    "Esses pontos mostram oportunidades claras para tornar o perfil mais profissional, mais estratégico e mais preparado para gerar contatos.\n\nEm uma reunião rápida, conseguimos mostrar como aplicar essas melhorias na prática e transformar o Instagram em uma vitrine mais forte para o negócio.",
  ctaText: "Vamos conversar sobre o próximo passo?",
  buttonText: "Agendar reunião estratégica",
  finalPhrase:
    "Estratégia, conteúdo e posicionamento para transformar presença digital em oportunidade real de negócio.",
};

export function createEmptyDiagnostic(): Diagnostic {
  const now = new Date().toISOString();

  return {
    id: createId(),
    clientName: "",
    instagramHandle: "",
    segment: "",
    city: "",
    profileObjective: "",
    responsibleName: "",
    status: "rascunho",
    createdAt: now,
    updatedAt: now,

    summary: {
      firstImpression: "",
      mainRisk: "",
      mainOpportunity: "",
      suggestedObjective: "",
    },

    risks: [
      {
        id: createId(),
        type: "Bio pouco clara",
        title: "O visitante pode não entender rapidamente o que você oferece",
        comment:
          "A bio precisa comunicar melhor quem é você, o que entrega e qual ação o visitante deve tomar.",
        impact:
          "Isso pode fazer com que pessoas interessadas saiam do perfil sem chamar no direct ou WhatsApp.",
        quickSuggestion:
          "Reescrever a bio com promessa clara, serviço principal e chamada para contato.",
        order: 0,
        images: [],
      },
    ],

    improvements: [
      {
        id: createId(),
        type: "Organizar destaques",
        title: "Transformar os destaques em uma vitrine de confiança",
        comment:
          "Os destaques podem responder dúvidas, mostrar resultados, apresentar bastidores e facilitar o contato.",
        expectedBenefit: "O visitante entende melhor o serviço e ganha mais segurança para chamar.",
        recommendedAction:
          "Criar destaques como Sobre, Serviços, Resultados, Depoimentos, Bastidores e Contato.",
        order: 0,
        images: [],
      },
    ],

    meeting: {
      invitationText: DEFAULT_TEXTS.invitationText,
      ctaText: DEFAULT_TEXTS.ctaText,
      buttonText: DEFAULT_TEXTS.buttonText,
      meetingLink: "",
      whatsapp: "",
      runnerInstagram: "",
      finalPhrase: DEFAULT_TEXTS.finalPhrase,
    },
  };
}

// Normaliza um diagnóstico vindo do localStorage ou de um JSON importado.
// Protege contra formatos antigos (de antes das imagens ficarem dentro de
// cada ponto): garante que risks/improvements sempre tenham um array
// `images`, mesmo que o dado de origem não tivesse esse campo.
export function sanitizeDiagnostic(diagnostic: Diagnostic): Diagnostic {
  const sanitizarPonto = <T extends RiskPoint | ImprovementPoint>(ponto: T): T => ({
    ...ponto,
    images: Array.isArray(ponto.images) ? ponto.images : [],
  });

  return {
    ...diagnostic,
    risks: Array.isArray(diagnostic.risks) ? diagnostic.risks.map(sanitizarPonto) : [],
    improvements: Array.isArray(diagnostic.improvements)
      ? diagnostic.improvements.map(sanitizarPonto)
      : [],
  };
}
