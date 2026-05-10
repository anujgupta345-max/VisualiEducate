
export interface VisualResult {
  id: string;
  text: string;
  imageUrl: string;
  timestamp: number;
  explanation?: string;
}

export interface PDFState {
  file: File | null;
  numPages: number;
  currentPage: number;
  selection: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

// --- Visa News Aggregator Types ---

export type VisaCategory =
  | 'student-visa'
  | 'work-visa'
  | 'family-visa'
  | 'embassy-update'
  | 'slot-availability'
  | 'policy-change'
  | 'community-story'
  | 'success-story';

export type SourceType = 'reddit' | 'official' | 'news' | 'embassy' | 'social';
export type Severity = 'critical' | 'important' | 'info' | 'positive';

export interface VisaNewsItem {
  id: string;
  title: string;
  summary: string;
  category: VisaCategory;
  country: string;
  source: string;
  sourceType: SourceType;
  severity: Severity;
  tags: string[];
  actionRequired?: string;
  affectedGroup?: string;
}

export interface DailyBriefing {
  date: string;
  headline: string;
  executiveSummary: string;
  criticalAlerts: VisaNewsItem[];
  news: VisaNewsItem[];
  generatedAt: string;
  sourceCount: number;
}
