// Fábrica de diagnóstico vazio, textos padrão sugeridos e listas de opções
// (pontos fortes/melhoria, formatos e objetivos de conteúdo, destaques
// sugeridos, status, tipos de imagem). Centraliza todo o "conteúdo estático"
// do sistema para facilitar ajuste de copy sem mexer em componentes.

import type {
  ActionPlanItem,
  ContentFormat,
  ContentObjective,
  Diagnostic,
  DiagnosticStatus,
  ImageType,
} from "./types";

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

export const IMAGE_TYPE_OPTIONS: { value: ImageType; label: string }[] = [
  { value: "profile", label: "Foto de perfil" },
  { value: "bio", label: "Print da bio" },
  { value: "feed", label: "Print do feed" },
  { value: "highlights", label: "Print dos destaques" },
  { value: "post", label: "Post" },
  { value: "reels", label: "Reels" },
  { value: "stories", label: "Stories" },
  { value: "cover", label: "Capa / imagem principal" },
  { value: "other", label: "Outro" },
];

export const CONTENT_FORMAT_OPTIONS: { value: ContentFormat; label: string }[] = [
  { value: "reels", label: "Reels" },
  { value: "post", label: "Post estático" },
  { value: "carousel", label: "Carrossel" },
  { value: "stories", label: "Stories" },
  { value: "ad", label: "Anúncio" },
  { value: "backstage", label: "Bastidor" },
  { value: "testimonial", label: "Depoimento" },
];

export const CONTENT_OBJECTIVE_OPTIONS: { value: ContentObjective; label: string }[] = [
  { value: "authority", label: "Autoridade" },
  { value: "connection", label: "Conexão" },
  { value: "conversion", label: "Conversão" },
  { value: "social-proof", label: "Prova social" },
  { value: "desire", label: "Desejo" },
  { value: "education", label: "Educação" },
  { value: "offer", label: "Oferta" },
];

export const HIGHLIGHT_SUGGESTIONS = [
  "Sobre",
  "Serviços",
  "Resultados",
  "Depoimentos",
  "Bastidores",
  "Dúvidas",
  "Contato",
];

export const STRENGTH_OPTIONS = [
  "Boa presença visual",
  "Serviço com alto valor percebido",
  "Potencial de autoridade",
  "Boa qualidade de imagem",
  "Tem bastidores interessantes",
  "Tem prova social",
  "Tem diferencial competitivo",
  "Tem conteúdo educativo",
  "Tem rotina que pode virar conteúdo",
  "Tem apelo local",
  "Tem bom potencial para anúncios",
];

export const IMPROVEMENT_OPTIONS = [
  "Bio pouco clara",
  "Falta chamada para ação",
  "Destaques desorganizados",
  "Feed sem unidade visual",
  "Pouca prova social",
  "Pouca humanização",
  "Pouco conteúdo de conversão",
  "Pouca frequência de postagem",
  "Falta clareza na oferta",
  "Falta posicionamento",
  "Pouco uso de Reels",
  "Pouco conteúdo de bastidores",
  "Pouca diferenciação frente aos concorrentes",
];

export const ACTION_PLAN_DEFAULTS: { title: string; description: string }[] = [
  { title: "Ajustar bio", description: "Reescrever a bio com proposta de valor clara e chamada para ação." },
  { title: "Reorganizar destaques", description: "Definir ordem, capas e nomes que funcionem como vitrine rápida." },
  { title: "Criar linha visual mais consistente", description: "Padronizar cores, tipografia e estilo das publicações." },
  { title: "Definir pilares de conteúdo", description: "Estabelecer 3 a 4 temas fixos que sustentem o calendário editorial." },
  { title: "Criar calendário estratégico", description: "Planejar frequência e pauta das próximas publicações." },
  { title: "Criar roteiros de Reels", description: "Estruturar roteiros prontos para os formatos de maior alcance." },
  { title: "Inserir mais prova social", description: "Adicionar depoimentos e resultados de clientes reais." },
  { title: "Melhorar chamadas para contato", description: "Deixar claro em bio, destaques e posts como agendar/contatar." },
  { title: "Criar conteúdos de bastidores", description: "Mostrar rotina e processo para gerar conexão e confiança." },
  { title: "Criar conteúdos de conversão", description: "Produzir peças focadas em gerar contato e agendamento." },
  { title: "Criar anúncios estratégicos", description: "Planejar campanhas pagas alinhadas aos pilares definidos." },
];

export const DEFAULT_TEXTS = {
  coverPositioning:
    "Uma visão estratégica sobre presença digital, percepção de valor e oportunidades de crescimento no Instagram.",
  analysisObjective:
    "Este diagnóstico foi criado para identificar oportunidades de melhoria no perfil, considerando clareza de comunicação, percepção visual, autoridade, conexão com o público e potencial de conversão.",
  analysisSummary:
    "Ao analisar o perfil, percebemos que existe uma boa base de presença digital, mas ainda há oportunidades importantes para melhorar a clareza da comunicação, aumentar a percepção de autoridade e transformar mais visitantes em interessados.",
  bioSupport:
    "A bio é uma das áreas mais importantes do perfil, porque define rapidamente quem é o profissional, o que ele entrega e qual ação o visitante deve tomar.",
  bioComment:
    "A bio pode comunicar com mais força quem é o profissional, o que ele entrega e qual ação o visitante deve tomar. Pequenos ajustes nessa área podem melhorar a primeira impressão e facilitar o contato.",
  visualComment:
    "O perfil pode ganhar mais consistência visual para transmitir profissionalismo, valor e confiança logo nos primeiros segundos de navegação.",
  highlightsComment:
    "Os destaques precisam funcionar como uma vitrine rápida para quem chegou agora. Eles devem responder dúvidas, apresentar provas, mostrar bastidores e conduzir o visitante para o contato.",
  contentComment:
    "O conteúdo tem potencial para gerar confiança, mas pode ser melhor organizado por função estratégica. A ideia não é apenas postar mais, mas criar conteúdos que gerem autoridade, conexão e conversão.",
  suggestedPath:
    "O perfil já possui ativos importantes, mas pode se tornar mais claro, mais desejado e mais estratégico. O objetivo é transformar a presença digital em uma vitrine que gere confiança e facilite o contato de novos interessados.",
  invitationText:
    "Identificamos oportunidades claras para transformar o Instagram em uma ferramenta mais forte de posicionamento, confiança e geração de oportunidades.\n\nO próximo passo é uma reunião estratégica para mostrar como aplicar esses ajustes na prática e construir um plano personalizado para o perfil.",
  mainCallout:
    "Vamos conversar sobre como transformar seu perfil em uma vitrine mais profissional, desejada e estratégica?",
  finalPhrase:
    "Estratégia, conteúdo e posicionamento para transformar presença digital em oportunidade real de negócio.",
};

function createActionPlan(): ActionPlanItem[] {
  return ACTION_PLAN_DEFAULTS.map((item) => ({
    id: createId(),
    title: item.title,
    description: item.description,
    selected: false,
  }));
}

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

    scores: {
      clarity: 3,
      visualIdentity: 3,
      authority: 3,
      humanization: 3,
      conversion: 3,
      consistency: 3,
    },

    analysisObjective: {
      objective: DEFAULT_TEXTS.analysisObjective,
      summary: DEFAULT_TEXTS.analysisSummary,
    },

    generalAnalysis: {
      firstImpression: "",
      mainStrength: "",
      mainOpportunity: "",
      perceivedPotential: "",
    },

    bioAnalysis: {
      currentBio: "",
      positivePoints: "",
      improvementPoints: "",
      suggestedBio: "",
      strategicComment: DEFAULT_TEXTS.bioComment,
    },

    visualAnalysis: {
      identityComment: DEFAULT_TEXTS.visualComment,
      feedHarmony: "",
      imageQuality: "",
      professionalPerception: "",
      visualDirection: "",
    },

    highlightsAnalysis: {
      organization: "",
      covers: "",
      names: "",
      recommendedHighlights: [],
      strategicComment: DEFAULT_TEXTS.highlightsComment,
    },

    contentAnalysis: {
      whatWorks: "",
      whatCanImprove: "",
      missingContentTypes: "",
      authorityComment: "",
      connectionComment: "",
      conversionComment: "",
      strategicComment: DEFAULT_TEXTS.contentComment,
    },

    strengths: [],
    improvements: [],

    contentOpportunities: [
      { id: createId(), title: "", format: "reels", objective: "authority", description: "" },
      { id: createId(), title: "", format: "reels", objective: "connection", description: "" },
      { id: createId(), title: "", format: "reels", objective: "conversion", description: "" },
      { id: createId(), title: "", format: "post", objective: "education", description: "" },
      { id: createId(), title: "", format: "carousel", objective: "authority", description: "" },
      { id: createId(), title: "", format: "stories", objective: "connection", description: "" },
      { id: createId(), title: "", format: "ad", objective: "offer", description: "" },
    ],
    contentOpportunitiesNote: "",

    newDirection: {
      currentPerception: "",
      futurePerception: "",
      suggestedPath: DEFAULT_TEXTS.suggestedPath,
      centralMessage: "",
    },

    actionPlan: createActionPlan(),

    meeting: {
      invitationText: DEFAULT_TEXTS.invitationText,
      mainCallout: DEFAULT_TEXTS.mainCallout,
      ctaText: "Agendar reunião estratégica",
      meetingLink: "",
      whatsapp: "",
      runnerInstagram: "",
      responsibleName: "",
    },

    closing: {
      finalPhrase: DEFAULT_TEXTS.finalPhrase,
      site: "",
    },

    images: [],
  };
}
