
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
