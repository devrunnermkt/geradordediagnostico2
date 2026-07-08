// Modelo de dados do Runner Insight. Um Diagnostic é a única fonte de
// verdade de um diagnóstico rápido de Instagram: dados do cliente, resumo,
// pontos de risco, pontos de melhora (cada um com suas próprias imagens) e
// o convite para reunião. Tudo é serializável em JSON (para localStorage e
// exportação/importação).

export type DiagnosticStatus =
  | "rascunho"
  | "em-revisao"
  | "pronto-para-envio"
  | "enviado"
  | "reuniao-marcada";

// Imagem pertencente a um ponto de risco ou de melhora específico — não tem
// mais "tipo", já que o contexto (o ponto em que está) já diz o que ela é.
export interface PointImage {
  id: string;
  src: string; // base64 (data URL), já redimensionada
  name: string;
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
  order: number;
  images: PointImage[];
}

export interface ImprovementPoint {
  id: string;
  type: string;
  title: string;
  comment: string;
  expectedBenefit: string;
  recommendedAction: string;
  order: number;
  images: PointImage[];
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
