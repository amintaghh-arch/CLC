export type Plan = "free" | "premium";

export interface User {
  id: string;
  email: string;
  password: string; // demo only — never store plaintext passwords in a real app
  credits: number;
  plan: Plan;
  createdAt: string;
}

export interface AnalysisResult {
  score_total: number;
  ats_score: number;
  mise_en_page: number;
  lisibilite: number;
  impact: number;
  experience: number;
  competences: number;
  mots_cles: number;
  points_forts: string[];
  points_faibles: string[];
  ameliorations: string[];
  competences_manquantes: string[];
  resume: string;
}

export interface OptimizationResult {
  version_amelioree: string;
  changements_effectues: string[];
  explications: string[];
}

export interface ComparisonResult {
  score_compatibilite: number;
  competences_manquantes: string[];
  modifications_proposees: string[];
}

export interface CVEntry {
  id: string;
  userId: string;
  title: string;
  rawText: string;
  createdAt: string;
  analysis?: AnalysisResult;
  optimization?: OptimizationResult;
  comparison?: ComparisonResult;
  coverLetter?: string;
}

export interface HistoryEvent {
  id: string;
  userId: string;
  cvId: string;
  type: "analyse" | "optimisation" | "lettre" | "comparaison";
  createdAt: string;
  creditsSpent: number;
}
