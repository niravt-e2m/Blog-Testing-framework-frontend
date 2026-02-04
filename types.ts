
export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// New evaluation input types
export interface ToneOfVoiceInput {
  type: 'text' | 'file';
  content: string;
  fileName?: string;
}

export interface Reference {
  id: string;
  type: 'link' | 'text';
  content: string;
}

export interface EvaluationInput {
  blogTitle: string;
  blogText: string;
  blogOutline: string;
  toneOfVoice: ToneOfVoiceInput;
  references: Reference[];
  targetAudience: string;
}

// Metric types for the 8 evaluation categories
export type MetricCategory =
  | 'instructionFollowing'
  | 'factualAccuracy'
  | 'relevance'
  | 'completeness'
  | 'writingStyleTone'
  | 'clarity'
  | 'contextAwareness'
  | 'safety';

export interface Metric {
  label: string;
  score: number; // 0-100
  explanation: string;
  category?: MetricCategory;
}

export interface DetailedMetric extends Metric {
  subScores?: { label: string; score: number }[];
  suggestions?: string[];
}

export interface Flag {
  type: string;
  message: string;
  severity: Severity;
  startIndex?: number;
  endIndex?: number;
}

export interface Suggestion {
  id: string;
  category: MetricCategory;
  priority: Severity;
  title: string;
  description: string;
  actionItems?: string[];
}

export interface AIDetectionDetails {
  percentage: number;
  classification: 'Definitely AI' | 'Likely AI' | 'Likely human-written' | 'Definitely human';
  reasoning: string;
  linguisticMarkers?: string[];
  statisticalAnalysis?: Record<string, string>;
}

export interface EvaluationMetadata {
  contentLength: number;
  wordCount: number;
  paragraphCount: number;
  estimatedReadingTime: string;
  processingTime: number;
  evaluationTimestamp: string;
}

export interface Improvement {
  priority: string; // HIGH, MEDIUM, LOW
  category: string;
  suggestion: string;
  impact: string;
  action_items?: string[];
}

export interface EvaluationResult {
  overallScore: number;
  summary: string;
  metrics: DetailedMetric[];
  flags: Flag[];
  suggestedChanges: string[];
  suggestions: Suggestion[];
  aiLikelihood: number; // 0-100
  aiDetectionDetails?: AIDetectionDetails; // Detailed AI detection from backend
  // 8 evaluation metrics (0-100)
  instructionFollowing: number;
  factualAccuracy: number;
  relevance: number;
  completeness: number;
  writingStyleTone: number;
  clarity: number;
  contextAwareness: number;
  safety: number;
  // Extended fields from backend
  strengths?: string[];
  improvements?: Improvement[];
  metadata?: EvaluationMetadata;
  errors?: string[];
}

export interface AnalysisSession {
  id: string;
  timestamp: number;
  title: string;
  input: EvaluationInput;
  result: EvaluationResult;
}

// Legacy support
export interface LegacyAnalysisSession {
  id: string;
  timestamp: number;
  title: string;
  content: string;
  reference?: string;
  result: EvaluationResult;
}
