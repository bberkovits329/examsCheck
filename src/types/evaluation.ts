export interface RubricItem {
  score: number;
  maxScore: number;
  notes: string;
}

export interface RubricBreakdown {
  correctnessAndLogic: RubricItem;
  syntaxAndSemantics: RubricItem;
  codeQualityAndStyle: RubricItem;
}

export interface ErrorItem {
  title: string;
  description: string;
  lineNumber?: number | null;
  severity: 'critical' | 'moderate' | 'minor';
  suggestedCorrection?: string;
}

export interface EvaluationAnalysis {
  positivePoints: string[];
  errorsAndFixes: ErrorItem[];
  handwritingConsiderations: string;
}

export interface CorrectedCodeSolution {
  code: string;
  language: string;
  explanation: string;
}

export interface FinalEvaluation {
  totalScore: number;
  rubric: RubricBreakdown;
  studentSummaryFeedback: string;
}

export interface EvaluationResult {
  id: string;
  timestamp: number;
  examTitle?: string;
  studentName?: string;
  isReadable: boolean;
  unreadableReason?: string;
  detectedLanguage: string;
  transcribedCode: string;
  hebrewNotes: string[];
  analysis: EvaluationAnalysis;
  correctedCode: CorrectedCodeSolution;
  finalEvaluation: FinalEvaluation;
  rawOutputHebrew?: string;
  imagesPreview?: string[];
}
