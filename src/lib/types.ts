export interface CompetitorData {
  url: string;
  title: string;
  description: string;
  headings: string[];
  pricingInfo: string | null;
  fetchedAt: string;
  changes?: string[];
}

export interface AnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  pricingInsights: string;
  recommendation: string;
}

export interface SavedCompetitor {
  url: string;
  data: CompetitorData | null;
  analysis: AnalysisResult | null;
  addedAt: string;
}
