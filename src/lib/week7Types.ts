/* ──────────────────────────────────────────────────────────────
 * week7Types.ts — Type definitions for Week 7 Module
 * AI Classification + Human Review System
 * ────────────────────────────────────────────────────────────── */

export type Week7ContentCategory =
  | "Politics & Public Affairs"
  | "Business & Economics"
  | "Science & Technology"
  | "Health & Education"
  | "International Affairs"
  | "General Knowledge";

export type Week7ClassificationLabel = "Real" | "Fake" | "Suspicious";

export type Week7ReviewStatus = "Approved" | "Corrected" | "Escalated" | "Unresolved";

export type Week7ConfidenceBand = "High" | "Medium" | "Low";

export interface Week7AIInference {
  modelName: "GPT-4o" | "Gemini 1.5 Pro";
  prediction: Week7ClassificationLabel;
  confidenceScore: number; // 0-100
  confidenceBand: Week7ConfidenceBand;
  explanation: string;
  uncertaintyFactors: string[];
}

export interface Week7EvidenceItem {
  evidenceId: string;
  sourceTitle: string;
  publisher: string;
  url: string;
  publicationDate: string;
  credibilityScore: number; // 1-10
  excerpt: string;
  supportsOrRefutes: "Supports" | "Refutes" | "Contextual/Inconclusive";
}

export interface Week7ClassificationRecord {
  claimId: string;
  category: Week7ContentCategory;
  claimText: string;
  headlineContext: string;
  publisher: string;
  date: string;
  sourceUrl: string;

  // AI Inference from Dual Models
  gpt4o: Week7AIInference;
  gemini: Week7AIInference;

  // Consensus / Combined AI
  aiConsensus: Week7ClassificationLabel;
  aiAvgConfidence: number;
  aiConfidenceBand: Week7ConfidenceBand;

  // Primary Evidence
  evidence: Week7EvidenceItem;

  // Human Review & Audit
  humanFinalCategory: Week7ClassificationLabel;
  reviewStatus: Week7ReviewStatus;
  humanReasoning: string;
  agreesWithAI: boolean;
  reviewedAt: string;
  reviewerName: string;
}

export interface Week7DashboardStats {
  totalClaims: number;
  realCount: number;
  fakeCount: number;
  suspiciousCount: number;
  approvedCount: number;
  correctedCount: number;
  escalatedCount: number;
  unresolvedCount: number;
  agreementRate: number; // percentage
  avgConfidence: number;
}

export interface Week7TestCase {
  testId: string;
  name: string;
  category: string;
  inputDescription: string;
  expectedResult: string;
  actualResult: string;
  status: "Passed" | "Failed";
  latencyMs: number;
  notes: string;
}

