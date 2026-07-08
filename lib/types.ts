// Modelo de dados do Runner Insight. Um Diagnostic é a única fonte de
// verdade de um diagnóstico rápido de Instagram: dados do cliente, resumo,
// imagens, pontos de risco, pontos de melhora e o convite para reunião.
// Tudo é serializável em JSON (para localStorage e exportação/importação).

export type DiagnosticStatus =
  | "rascunho"
  | "em-revisao"
  | "pronto-para-envio"
  | "enviado"
  | "reuniao-marcada";

export type ImageType =
  | "profile"
  | "bio"
  | "feed"
  | "highlights"
  | "post"
  | "reels"
  | "stories"
  | "other";

export interface DiagnosticImage {
  id: string;
  type: ImageType;
  name: string;
  src: string; // base64 (data URL), já redimensionada
  caption: string;
  comment: string;
  order: number;
}

export interface Summary {
  firstImpression: string;
  mainRisk: string;
  mainOpportunity: string;
  suggestedObjective: string;
}

export interface RiskPoint {
  id: string;
  type: string;
  title: string;
  comment: string;
  impact: string;
  quickSuggestion: string;
  relatedImageId: string | null;
  order: number;
}

export interface ImprovementPoint {
  id: string;
  type: string;
  title: string;
  comment: string;
  expectedBenefit: string;
  recommendedAction: string;
  relatedImageId: string | null;
  order: number;
}

export interface Meeting {
  invitationText: string;
  ctaText: string;
  buttonText: string;
  meetingLink: string;
  whatsapp: string;
  runnerInstagram: string;
  finalPhrase: string;
}

export interface Diagnostic {
  id: string;
  clientName: string;
  instagramHandle: string;
  segment: string;
  city: string;
  profileObjective: string;
  responsibleName: string;
  status: DiagnosticStatus;
  createdAt: string;
  updatedAt: string;

  summary: Summary;
  images: DiagnosticImage[];
  risks: RiskPoint[];
  improvements: ImprovementPoint[];
  meeting: Meeting;
}

// Metadados leves para a lista da página inicial (evita carregar o
// diagnóstico inteiro, incluindo imagens em base64, só pra listar).
export interface DiagnosticSummary {
  id: string;
  clientName: string;
  instagramHandle: string;
  segment: string;
  status: DiagnosticStatus;
  createdAt: string;
  updatedAt: string;
}
