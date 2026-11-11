export type CriterionCode = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7';
export type CriterionType = 'benefit' | 'cost';

export interface CriterionOption {
  label: string;
  score: number; // 1 - 5
}

export interface CriterionDefinition {
  code: CriterionCode;
  name: string;
  type: CriterionType;
  description: string;
  question: string;
  options: CriterionOption[];
}

export interface Scholarship {
  id: string;
  name: string;
  shortName: string;
  description: string;
  quota: number;
  weights: Record<CriterionCode, number>;
}

export type ApplicationStatus = 'menunggu' | 'diterima' | 'ditolak';

export interface Applicant {
  id: string;
  registrationNumber: string;
  nisn: string;
  name: string;
  grade: 'X' | 'XI' | 'XII';
  major: string;
  whatsapp: string;
  scholarshipId: string;
  scores: Record<CriterionCode, number>;
  createdAt: string;
  status: ApplicationStatus;
}

export interface SAWStepBreakdown {
  code: CriterionCode;
  name: string;
  type: CriterionType;
  rawScore: number;
  normalizedScore: number;
  weight: number;
  weightedScore: number;
}

export interface SAWEvaluation {
  scholarshipId: string;
  scholarshipName: string;
  scoreV: number;
  category: 'Sangat Layak' | 'Layak' | 'Belum Layak';
  breakdown: SAWStepBreakdown[];
  rank?: number;
  totalApplicants?: number;
  inQuota?: boolean;
}

export interface MultiScholarshipEvaluation {
  current: SAWEvaluation;
  all: SAWEvaluation[];
  bestFit: SAWEvaluation;
  recommendations: SAWEvaluation[];
  message: string;
}
