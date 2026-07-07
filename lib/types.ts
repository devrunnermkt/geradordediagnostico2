// Modelo de dados do Runner Insight. Um Diagnostic é a única fonte de
// verdade de um diagnóstico de Instagram: dados do cliente, análises por
// página, imagens e o plano de ação. Tudo é serializável em JSON (para
// localStorage e exportação/importação de arquivo).

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
  | "cover"
  | "other";

export type ContentFormat =
  | "reels"
  | "post"
  | "carousel"
  | "stories"
  | "ad"
  | "backstage"
  | "testimonial";

export type ContentObjective =
  | "authority"
  | "connection"
  | "conversion"
  | "social-proof"
  | "desire"
  | "education"
  | "offer";

export interface DiagnosticImage {
  id: string;
  type: ImageType;
  name: string;
  src: string; // base64 (data URL), já redimensionada
  caption: string;
  comment: string;
  order: number;
}

export interface Scores {
  clarity: number; // 1 a 5
  visualIdentity: number;
  authority: number;
  humanization: number;
  conversion: number;
  consistency: number;
}

export interface GeneralAnalysis {
  firstImpression: string;
  mainStrength: string;
  mainOpportunity: string;
  perceivedPotential: string;
}

export interface BioAnalysis {
  currentBio: string;
  positivePoints: string;
  improvementPoints: string;
  suggestedBio: string;
  strategicComment: string;
}

export interface VisualAnalysis {
  identityComment: string;
  feedHarmony: string;
  imageQuality: string;
  professionalPerception: string;
  visualDirection: string;
}

export interface HighlightsAnalysis {
  organization: string;
  covers: string;
  names: string;
  recommendedHighlights: string[];
  strategicComment: string;
}

export interface ContentAnalysis {
  whatWorks: string;
  whatCanImprove: string;
  missingContentTypes: string;
  authorityComment: string;
  connectionComment: string;
  conversionComment: string;
  strategicComment: string;
}

export interface StrengthItem {
  id: string;
  title: string;
  comment: string;
}

export interface ImprovementItem {
  id: string;
  title: string;
  comment: string;
}

export interface ContentOpportunity {
  id: string;
  title: string;
  format: ContentFormat;
  objective: ContentObjective;
  description: string;
}

export interface NewDirection {
  currentPerception: string;
  futurePerception: string;
  suggestedPath: string;
  centralMessage: string;
}

export interface ActionPlanItem {
  id: string;
  title: string;
  selected: boolean;
  description: string;
}

export interface AnalysisObjective {
  objective: string;
  summary: string;
}

export interface Meeting {
  invitationText: string;
  mainCallout: string;
  ctaText: string;
  meetingLink: string;
  whatsapp: string;
  runnerInstagram: string;
  responsibleName: string;
}

export interface Closing {
  finalPhrase: string;
  site: string;
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

  scores: Scores;
  analysisObjective: AnalysisObjective;
  generalAnalysis: GeneralAnalysis;
  bioAnalysis: BioAnalysis;
  visualAnalysis: VisualAnalysis;
  highlightsAnalysis: HighlightsAnalysis;
  contentAnalysis: ContentAnalysis;
  strengths: StrengthItem[];
  improvements: ImprovementItem[];
  contentOpportunities: ContentOpportunity[];
  contentOpportunitiesNote: string;
  newDirection: NewDirection;
  actionPlan: ActionPlanItem[];
  meeting: Meeting;
  closing: Closing;
  images: DiagnosticImage[];
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
