/* ──────────────────────────────────────────────────────
 * types.ts — Central type definitions for the
 * AI Fake News Hub & VeritasAI Verification Engine
 * ────────────────────────────────────────────────────── */

// ── Enum-like union types ──────────────────────────────

export type ClaimCategory =
  | "Science"
  | "Business"
  | "History"
  | "Technology"
  | "Public Health"
  | "General Knowledge";

export type AITool = "ChatGPT" | "Gemini 3.8 Flash" | "DeepSeek";

export type VerificationStatus =
  | "Pending"
  | "Verified"
  | "False"
  | "Misleading"
  | "Unverifiable";

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type SourceType =
  | "Government/Statute"
  | "Q1 Academic"
  | "Multilateral Agency"
  | "News Registry";

export type SourceStatus =
  | "Verified"
  | "Real but Misrepresented"
  | "Fabricated Source"
  | "Unable to Verify";

export type NewsCategory =
  | "Scientific Discovery"
  | "Economic Report"
  | "Historical Claim"
  | "Tech Announcement"
  | "Public Panic";

export type BiasLevel = "Low" | "Medium" | "High";

// ── Table 1: Claim_Verification ────────────────────────

export interface ClaimVerification {
  claimId: string;
  date: string;
  claim: string;
  category: ClaimCategory;
  aiTool: AITool;
  originalPrompt: string;
  aiResponse: string;
  verificationStatus: VerificationStatus;
  evidenceSummary: string;
  confidence: ConfidenceLevel;
  reviewer: string;
}

// ── Table 2: Source_Verification ────────────────────────

export interface SourceVerification {
  sourceId: string;
  claimId: string;
  sourceTitle: string;
  publisher: string;
  url: string;
  sourceType: SourceType;
  publicationDate: string;
  sourceStatus: SourceStatus;
  evidenceNotes: string;
}

// ── Table 3: AI_Response_Comparison ────────────────────

export interface AIResponseComparison {
  testId: string;
  question: string;
  chatGPTResponse: string;
  geminiResponse: string;
  deepSeekResponse: string;
  differences: string;
  incorrectClaims: string;
  finalFinding: string;
}

// ── Table 4: Fake_News_Investigation ───────────────────

export interface FakeNewsInvestigation {
  newsId: string;
  headline: string;
  newsCategory: NewsCategory;
  originalArticle: string;
  numberOfClaims: number;
  falseClaimsFound: number;
  misleadingClaimsFound: number;
  correctedHeadline: string;
  correctedArticle: string;
  investigationReport: string;
  finalStatus: "Debunked" | "Fabricated";
}

// ── Table 5: Bias_Analysis ─────────────────────────────

export interface BiasAnalysis {
  analysisId: string;
  question: string;
  aiTool: AITool;
  response: string;
  oneSidedArguments: string;
  missingPerspectives: string;
  unsupportedAssumptions: string;
  emotionallyLoadedLanguage: string;
  biasLevel: BiasLevel;
  researcherConclusion: string;
}

// ── VQI Engine types ───────────────────────────────────

export interface VQICriteria {
  factualAccuracy: number;       // 0–25
  sourceReliability: number;     // 0–20
  statisticalAccuracy: number;   // 0–15
  contextualAccuracy: number;    // 0–15
  biasAssessment: number;        // 0–10
  informationRecency: number;    // 0–5
  evidenceSufficiency: number;   // 0–10
}

export const VQI_MAX: Record<keyof VQICriteria, number> = {
  factualAccuracy: 25,
  sourceReliability: 20,
  statisticalAccuracy: 15,
  contextualAccuracy: 15,
  biasAssessment: 10,
  informationRecency: 5,
  evidenceSufficiency: 10,
};

export const VQI_LABELS: Record<keyof VQICriteria, string> = {
  factualAccuracy: "Factual Accuracy",
  sourceReliability: "Source Reliability",
  statisticalAccuracy: "Statistical Accuracy",
  contextualAccuracy: "Contextual Accuracy",
  biasAssessment: "Bias Assessment",
  informationRecency: "Information Recency",
  evidenceSufficiency: "Evidence Sufficiency",
};

export interface Override {
  type: "HARD_FALSE" | "HARD_UNVERIFIABLE" | "HIGH_RISK_GATEWAY" | "GENERAL_BOUNDARY";
  message: string;
  severity: "critical" | "warning" | "info";
  triggered: boolean;
}

export interface VQIResult {
  totalScore: number;
  verdict: VerificationStatus;
  overrides: Override[];
  isHighRiskDomain: boolean;
  criteria: VQICriteria;
}

// ── Sentence Decomposition ─────────────────────────────

export interface DecomposedSentence {
  id: string;
  text: string;
  claimType: "factual" | "opinion" | "statistical" | "contextual";
  flagged: boolean;
  notes: string;
}

// ── Evidence Citations ─────────────────────────────────

export interface EvidenceCitation {
  id: string;
  sourceTitle: string;
  publisher: string;
  url: string;
  sourceType: SourceType;
  publicationDate: string;
  excerpt: string;
  supports: boolean;
}

// ── Benchmark Cases ────────────────────────────────────

export interface BenchmarkCase {
  id: string;
  name: string;
  description: string;
  claim: string;
  category: ClaimCategory;
  aiTool: AITool;
  expectedVerdict: VerificationStatus;
  presetCriteria: VQICriteria;
  sentences: DecomposedSentence[];
  evidence: EvidenceCitation[];
}

// ── Audit Report (JSON Export) ─────────────────────────

export interface AuditReport {
  timestamp: string;
  claim: string;
  category: ClaimCategory;
  aiTool: AITool;
  decomposedSentences: DecomposedSentence[];
  criteria: VQICriteria;
  vqiScore: number;
  verdict: VerificationStatus;
  overridesTriggered: Override[];
  evidenceCitations: EvidenceCitation[];
  isHighRiskDomain: boolean;
}

