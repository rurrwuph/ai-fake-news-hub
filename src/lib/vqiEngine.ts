/* ──────────────────────────────────────────────────────
 * vqiEngine.ts — Deterministic 100-point Verification
 * Quality Index scoring engine with non-compensatory
 * safety overrides.
 * ────────────────────────────────────────────────────── */

import type { VQICriteria, VQIResult, Override, VerificationStatus, ClaimCategory } from "./types";

/** Domains that trigger elevated verification thresholds. */
const HIGH_RISK_DOMAINS: ClaimCategory[] = ["Public Health"];

/**
 * Compute the VQI score and deterministic verdict for a claim.
 *
 * Override priority (highest → lowest):
 *   1. Hard FALSE  — Factual Accuracy < 10 ⇒ "False"
 *   2. Hard UNVERIFIABLE — Evidence Sufficiency < 4 ⇒ "Unverifiable"
 *   3. High-Risk Domain Gateway — blocks "Verified" for sensitive categories
 *   4. General score-based boundaries
 */
export function calculateVQI(
  criteria: VQICriteria,
  category: ClaimCategory
): VQIResult {
  const totalScore =
    criteria.factualAccuracy +
    criteria.sourceReliability +
    criteria.statisticalAccuracy +
    criteria.contextualAccuracy +
    criteria.biasAssessment +
    criteria.informationRecency +
    criteria.evidenceSufficiency;

  const isHighRiskDomain = HIGH_RISK_DOMAINS.includes(category);
  const overrides: Override[] = [];

  // ── Override 1: Hard FALSE ───────────────────────────
  const hardFalse: Override = {
    type: "HARD_FALSE",
    message: `Factual Accuracy score (${criteria.factualAccuracy}/25) fell below the critical threshold of 10. Verdict forced to FALSE regardless of aggregate VQI.`,
    severity: "critical",
    triggered: criteria.factualAccuracy < 10,
  };
  overrides.push(hardFalse);

  // ── Override 2: Hard UNVERIFIABLE ────────────────────
  const hardUnverifiable: Override = {
    type: "HARD_UNVERIFIABLE",
    message: `Evidence Sufficiency score (${criteria.evidenceSufficiency}/10) fell below the minimum threshold of 4. Verdict forced to UNVERIFIABLE.`,
    severity: "critical",
    triggered: criteria.evidenceSufficiency < 4,
  };
  overrides.push(hardUnverifiable);

  // ── Override 3: High-Risk Domain Gateway ─────────────
  const highRiskGateway: Override = {
    type: "HIGH_RISK_GATEWAY",
    message: `High-risk domain "${category}" requires Factual Accuracy ≥ 22 AND Source Reliability ≥ 18 to achieve Verified status. Current: FA=${criteria.factualAccuracy}, SR=${criteria.sourceReliability}.`,
    severity: "warning",
    triggered:
      isHighRiskDomain &&
      (criteria.factualAccuracy < 22 || criteria.sourceReliability < 18),
  };
  overrides.push(highRiskGateway);

  // ── Determine verdict ────────────────────────────────
  let verdict: VerificationStatus;

  if (hardFalse.triggered) {
    // Priority 1: Factual Accuracy < 10 → always False
    verdict = "False";
  } else if (hardUnverifiable.triggered) {
    // Priority 2: Evidence Sufficiency < 4 → Unverifiable (unless already False)
    verdict = "Unverifiable";
  } else if (totalScore < 50) {
    // General: VQI < 50 → False
    verdict = "False";
  } else if (
    totalScore >= 85 &&
    criteria.factualAccuracy >= 22 &&
    criteria.sourceReliability >= 16
  ) {
    // Check high-risk domain gateway before granting Verified
    if (
      isHighRiskDomain &&
      (criteria.factualAccuracy < 22 || criteria.sourceReliability < 18)
    ) {
      verdict = "Misleading";
    } else {
      verdict = "Verified";
    }
  } else if (
    totalScore >= 50 &&
    totalScore <= 84 &&
    criteria.factualAccuracy >= 12 &&
    criteria.contextualAccuracy < 8
  ) {
    verdict = "Misleading";
  } else if (criteria.factualAccuracy < 10) {
    verdict = "False";
  } else {
    // Residual cases
    if (criteria.contextualAccuracy < 8 && criteria.factualAccuracy >= 12) {
      verdict = "Misleading";
    } else if (totalScore >= 85 && criteria.factualAccuracy >= 22) {
      // High score but source reliability below 16
      verdict = "Pending";
    } else {
      verdict = "Pending";
    }
  }

  // ── General boundary info override ───────────────────
  const generalBoundary: Override = {
    type: "GENERAL_BOUNDARY",
    message: buildBoundaryMessage(totalScore, criteria, verdict, isHighRiskDomain),
    severity: "info",
    triggered: true,
  };
  overrides.push(generalBoundary);

  return { totalScore, verdict, overrides, isHighRiskDomain, criteria };
}

/** Human-readable summary of which thresholds are met. */
function buildBoundaryMessage(
  score: number,
  c: VQICriteria,
  verdict: VerificationStatus,
  isHighRisk: boolean
): string {
  const checks: string[] = [];

  const check = (label: string, value: number, threshold: number) =>
    value >= threshold
      ? `${label} (${value}) ≥ ${threshold} ✓`
      : `${label} (${value}) < ${threshold} ✗`;

  checks.push(check("VQI", score, 85));
  checks.push(check("Factual Accuracy", c.factualAccuracy, 22));
  checks.push(check("Source Reliability", c.sourceReliability, 16));
  checks.push(check("Contextual Accuracy", c.contextualAccuracy, 8));
  checks.push(check("Evidence Sufficiency", c.evidenceSufficiency, 4));

  if (isHighRisk) {
    checks.push(check("HR: Source Reliability", c.sourceReliability, 18));
  }

  return `Verdict: ${verdict} — ${checks.join(" | ")}`;
}

/** Return the appropriate CSS class token for a verdict. */
export function verdictColor(status: VerificationStatus): string {
  switch (status) {
    case "Verified":
      return "verified";
    case "False":
      return "false";
    case "Misleading":
      return "misleading";
    case "Unverifiable":
      return "unverifiable";
    case "Pending":
    default:
      return "pending";
  }
}

/** Default (zero) criteria for initializing the engine. */
export function defaultCriteria(): VQICriteria {
  return {
    factualAccuracy: 0,
    sourceReliability: 0,
    statisticalAccuracy: 0,
    contextualAccuracy: 0,
    biasAssessment: 0,
    informationRecency: 0,
    evidenceSufficiency: 0,
  };
}

