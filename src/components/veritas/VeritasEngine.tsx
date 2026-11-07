"use client";

import { useState, useMemo, useEffect } from "react";
import type {
  ClaimCategory,
  AITool,
  VQICriteria,
  DecomposedSentence,
  EvidenceCitation,
  BenchmarkCase,
  AuditReport,
} from "@/lib/types";
import { calculateVQI, defaultCriteria, verdictColor } from "@/lib/vqiEngine";
import SentenceDecomposer from "./SentenceDecomposer";
import CriterionSliders from "./CriterionSliders";
import ThresholdBar from "./ThresholdBar";
import OverrideAlerts from "./OverrideAlerts";
import EvidenceCitationForm from "./EvidenceCitationForm";
import BenchmarkCases from "./BenchmarkCases";
import AuditExport from "./AuditExport";
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  FileSearch,
  Scale,
  Sliders,
  Award,
  Layers,
  ArrowRight,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import clsx from "clsx";

const PIPELINE_STEPS = [
  { id: 1, name: "Claim Ingestion", icon: FileCheck2, short: "Ingest" },
  { id: 2, name: "Sentence Decomposition", icon: Layers, short: "Decompose" },
  { id: 3, name: "VQI Rubric Scoring", icon: Sliders, short: "Score" },
  { id: 4, name: "Thresholds & Overrides", icon: AlertTriangle, short: "Thresholds" },
  { id: 5, name: "Evidence Archival Ledger", icon: FileSearch, short: "Evidence" },
  { id: 6, name: "Adjudication Verdict", icon: Award, short: "Verdict" },
  { id: 7, name: "Forensic Audit Export", icon: Scale, short: "Audit" },
];

const CATEGORIES: ClaimCategory[] = [
  "Science",
  "Business",
  "History",
  "Technology",
  "Public Health",
  "General Knowledge",
];

const AI_TOOLS: AITool[] = ["ChatGPT", "Gemini 3.8 Flash", "DeepSeek"];

export default function VeritasEngine() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeBenchmarkId, setActiveBenchmarkId] = useState<string | undefined>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stepParam = parseInt(params.get("step") || "", 10);
      if (stepParam >= 1 && stepParam <= 7) {
        setCurrentStep(stepParam);
      }
    }
  }, []);

  // Core Claim State
  const [claim, setClaim] = useState(
    "CRISPR-Cas9 was discovered in 2012 by Jennifer Doudna and Emmanuelle Charpentier, providing a programmable genome-editing system."
  );
  const [category, setCategory] = useState<ClaimCategory>("Science");
  const [aiTool, setAiTool] = useState<AITool>("ChatGPT");
  const [originalPrompt, setOriginalPrompt] = useState(
    "When was CRISPR-Cas9 genome editing discovered and who pioneered it?"
  );
  const [aiResponseText, setAiResponseText] = useState(
    "CRISPR-Cas9 was discovered in 2012 by Jennifer Doudna and Emmanuelle Charpentier. They showed that Cas9 endonuclease could be programmed with synthetic guide RNA to cleave specific DNA sequences. They won the 2020 Nobel Prize in Chemistry for this breakthrough."
  );

  // Decomposed Sentences State
  const [sentences, setSentences] = useState<DecomposedSentence[]>([
    {
      id: "S1",
      text: "CRISPR-Cas9 was discovered in 2012 by Jennifer Doudna and Emmanuelle Charpentier.",
      claimType: "factual",
      flagged: false,
      notes: "Landmark Science 2012 paper verified.",
    },
    {
      id: "S2",
      text: "They showed that Cas9 endonuclease could be programmed with synthetic guide RNA to cleave specific DNA sequences.",
      claimType: "factual",
      flagged: false,
      notes: "Mechanistic biochemistry verified.",
    },
    {
      id: "S3",
      text: "They won the 2020 Nobel Prize in Chemistry for this breakthrough.",
      claimType: "factual",
      flagged: false,
      notes: "Nobel Foundation official registry confirmed.",
    },
  ]);

  // VQI Scoring Criteria State (Preset with high score for default CRISPR claim)
  const [criteria, setCriteria] = useState<VQICriteria>({
    factualAccuracy: 24,
    sourceReliability: 19,
    statisticalAccuracy: 14,
    contextualAccuracy: 14,
    biasAssessment: 9,
    informationRecency: 4,
    evidenceSufficiency: 9,
  });

  // Evidence Citations State
  const [citations, setCitations] = useState<EvidenceCitation[]>([
    {
      id: "CIT-001",
      sourceTitle: "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity",
      publisher: "Science (AAAS)",
      url: "https://doi.org/10.1126/science.1225829",
      sourceType: "Q1 Academic",
      publicationDate: "2012-08-17",
      excerpt: "We demonstrate here that the Cas9 endonuclease can be programmed by a single engineered RNA molecule combining the crucial features of tracrRNA and crRNA.",
      supports: true,
    },
    {
      id: "CIT-002",
      sourceTitle: "The Nobel Prize in Chemistry 2020 Announcement",
      publisher: "The Nobel Foundation",
      url: "https://www.nobelprize.org/prizes/chemistry/2020/press-release/",
      sourceType: "Multilateral Agency",
      publicationDate: "2020-10-07",
      excerpt: "Emmanuelle Charpentier and Jennifer A. Doudna have discovered one of gene technology's sharpest tools: the CRISPR/Cas9 genetic scissors.",
      supports: true,
    },
  ]);

  // Deterministic VQI Computation
  const vqiResult = useMemo(() => {
    return calculateVQI(criteria, category);
  }, [criteria, category]);

  // Audit Report Construction
  const auditReport: AuditReport = useMemo(() => {
    return {
      timestamp: new Date().toISOString(),
      claim,
      category,
      aiTool,
      decomposedSentences: sentences,
      criteria,
      vqiScore: vqiResult.totalScore,
      verdict: vqiResult.verdict,
      overridesTriggered: vqiResult.overrides,
      evidenceCitations: citations,
      isHighRiskDomain: vqiResult.isHighRiskDomain,
    };
  }, [claim, category, aiTool, sentences, criteria, vqiResult, citations]);

  // Benchmark Loader Handler
  const handleLoadBenchmark = (bCase: BenchmarkCase) => {
    setActiveBenchmarkId(bCase.id);
    setClaim(bCase.claim);
    setCategory(bCase.category);
    setAiTool(bCase.aiTool);
    setCriteria(bCase.presetCriteria);
    setSentences(bCase.sentences);
    setCitations(bCase.evidence);
    // Jump straight to verdict review for fast audit analysis
    setCurrentStep(6);
  };

  const handleReset = () => {
    setActiveBenchmarkId(undefined);
    setClaim("");
    setCategory("Science");
    setAiTool("ChatGPT");
    setOriginalPrompt("");
    setAiResponseText("");
    setSentences([]);
    setCriteria(defaultCriteria());
    setCitations([]);
    setCurrentStep(1);
  };

  // Radar chart data preparation
  const radarData = [
    { subject: "Factual Acc.", score: (criteria.factualAccuracy / 25) * 100, fullMark: 100 },
    { subject: "Source Rel.", score: (criteria.sourceReliability / 20) * 100, fullMark: 100 },
    { subject: "Statistical", score: (criteria.statisticalAccuracy / 15) * 100, fullMark: 100 },
    { subject: "Contextual", score: (criteria.contextualAccuracy / 15) * 100, fullMark: 100 },
    { subject: "Bias Assess.", score: (criteria.biasAssessment / 10) * 100, fullMark: 100 },
    { subject: "Recency", score: (criteria.informationRecency / 5) * 100, fullMark: 100 },
    { subject: "Sufficiency", score: (criteria.evidenceSufficiency / 10) * 100, fullMark: 100 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                VeritasAI Verification Engine
              </h1>
              <span className="badge bg-indigo-50 text-indigo-700 font-mono text-[10px] font-semibold border border-indigo-200">
                v2.4-STABLE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deterministic 7-Stage Claim Verification Pipeline & 100-Point VQI Non-Compensatory Evaluation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Pipeline
          </button>
          <div className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-200">
            <span>VQI Score:</span>
            <strong className="text-indigo-600 text-sm">{vqiResult.totalScore}/100</strong>
          </div>
        </div>
      </div>

      {/* 7-Stage Pipeline Step Tracker */}
      <div className="card p-3 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[680px] gap-2">
          {PIPELINE_STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isDone = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            return (
              <div key={s.id} className="flex-1 flex items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full",
                    isCurrent
                      ? "bg-indigo-600 text-white shadow-sm"
                      : isDone
                      ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <div
                    className={clsx(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                      isCurrent
                        ? "bg-white text-indigo-600"
                        : isDone
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    )}
                  >
                    {isDone ? "✓" : s.id}
                  </div>
                  <span className="truncate">{s.name}</span>
                </button>
                {idx < PIPELINE_STEPS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Panels */}
      <div className="space-y-6">
        {/* Step 1: Claim Ingestion */}
        {currentStep === 1 && (
          <div className="card p-5 space-y-4 animate-fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Stage 1: Claim Ingestion & Metadata Specification
              </h3>
              <p className="text-xs text-slate-500">
                Enter the atomic proposition to evaluate, its target domain, and the generative model context.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Claim Under Audit (Atomic Proposition) *
                </label>
                <textarea
                  rows={3}
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  className="input-field text-sm font-medium"
                  placeholder="e.g. The human body contains 206 bones at birth..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Original User Prompt verbatim
                </label>
                <textarea
                  rows={3}
                  value={originalPrompt}
                  onChange={(e) => setOriginalPrompt(e.target.value)}
                  className="input-field text-xs"
                  placeholder="Original prompt fed to the model..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Knowledge Domain Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ClaimCategory)}
                  className="select-field text-xs font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} {cat === "Public Health" ? "⚠️ (High-Risk Domain)" : ""}
                    </option>
                  ))}
                </select>
                {category === "Public Health" && (
                  <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> High-Risk Domain active: requires Factual Accuracy ≥ 22 & Source Reliability ≥ 18.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  AI Tool Evaluated
                </label>
                <select
                  value={aiTool}
                  onChange={(e) => setAiTool(e.target.value as AITool)}
                  className="select-field text-xs font-medium"
                >
                  {AI_TOOLS.map((tool) => (
                    <option key={tool} value={tool}>
                      {tool}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Raw AI Response Body (Used for automatic decomposition)
              </label>
              <textarea
                rows={4}
                value={aiResponseText}
                onChange={(e) => setAiResponseText(e.target.value)}
                className="input-field text-xs font-mono"
                placeholder="Paste the complete text output generated by the AI tool..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Sentence Decomposition */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <SentenceDecomposer sentences={sentences} onUpdate={setSentences} />
          </div>
        )}

        {/* Step 3: VQI Rubric Scoring */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <CriterionSliders criteria={criteria} onChange={setCriteria} />
          </div>
        )}

        {/* Step 4: Thresholds & Safety Overrides */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <ThresholdBar result={vqiResult} />
            <OverrideAlerts overrides={vqiResult.overrides} />
          </div>
        )}

        {/* Step 5: Evidence Citations */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fade-in">
            <EvidenceCitationForm citations={citations} onUpdate={setCitations} />
          </div>
        )}

        {/* Step 6: Adjudication Verdict & Radar Assessment */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Score Banner */}
            <div
              className={clsx(
                "card p-6 border-l-8 transition-all",
                vqiResult.verdict === "Verified" && "border-l-emerald-500 bg-emerald-50/20",
                vqiResult.verdict === "False" && "border-l-rose-500 bg-rose-50/20",
                vqiResult.verdict === "Misleading" && "border-l-amber-500 bg-amber-50/20",
                vqiResult.verdict === "Unverifiable" && "border-l-slate-500 bg-slate-50/40",
                vqiResult.verdict === "Pending" && "border-l-blue-500 bg-blue-50/20"
              )}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                      Adjudication Verdict
                    </span>
                    <span className={`badge-${verdictColor(vqiResult.verdict)} text-xs px-2.5 py-0.5 font-bold uppercase`}>
                      {vqiResult.verdict}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 leading-snug">
                    {claim}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-2 pt-1">
                    <span>Domain: <strong>{category}</strong></span>
                    <span>•</span>
                    <span>Model: <strong>{aiTool}</strong></span>
                    <span>•</span>
                    <span>Evidence Citations: <strong>{citations.length}</strong></span>
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center min-w-[140px] flex-shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    VQI Index
                  </span>
                  <span className="text-3xl font-extrabold text-indigo-600 font-mono">
                    {vqiResult.totalScore}
                  </span>
                  <span className="text-[11px] text-slate-500 block">/ 100 Points</span>
                </div>
              </div>
            </div>

            {/* Radar Analysis and Rubric Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="card p-5 space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-semibold text-slate-900">
                    VQI Multi-Axis Rubric Profile
                  </h4>
                  <p className="text-xs text-slate-500">
                    Normalized percentage score across all 7 verification dimensions
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#475569", fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "#94a3b8", fontSize: 9 }}
                      />
                      <Radar
                        name="VQI Dimension Score"
                        dataKey="score"
                        stroke="#4f46e5"
                        fill="#6366f1"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Threshold Checklist */}
              <div className="card p-5 space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Deterministic Safety Check Ledger
                  </h4>
                  <p className="text-xs text-slate-500">
                    Status of critical boundary tests and non-compensatory thresholds
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span>Factual Accuracy (FA ≥ 10, Hard False Boundary)</span>
                    <span className={clsx("font-bold font-mono", criteria.factualAccuracy >= 10 ? "text-emerald-600" : "text-rose-600")}>
                      {criteria.factualAccuracy}/25 {criteria.factualAccuracy >= 10 ? "PASS ✓" : "TRIGGERED ✗"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span>Evidence Sufficiency (ES ≥ 4, Hard Unverifiable Boundary)</span>
                    <span className={clsx("font-bold font-mono", criteria.evidenceSufficiency >= 4 ? "text-emerald-600" : "text-rose-600")}>
                      {criteria.evidenceSufficiency}/10 {criteria.evidenceSufficiency >= 4 ? "PASS ✓" : "TRIGGERED ✗"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span>Verified Tier Floor (VQI ≥ 85, FA ≥ 22, SR ≥ 16)</span>
                    <span className={clsx("font-bold font-mono", vqiResult.totalScore >= 85 && criteria.factualAccuracy >= 22 && criteria.sourceReliability >= 16 ? "text-emerald-600" : "text-slate-500")}>
                      {vqiResult.totalScore >= 85 && criteria.factualAccuracy >= 22 && criteria.sourceReliability >= 16 ? "QUALIFIED ✓" : "NOT MET"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span>High-Risk Domain Gateway ({category})</span>
                    <span className={clsx("font-bold font-mono", category !== "Public Health" ? "text-slate-500" : criteria.factualAccuracy >= 22 && criteria.sourceReliability >= 18 ? "text-emerald-600" : "text-amber-600")}>
                      {category !== "Public Health" ? "INACTIVE (Standard)" : criteria.factualAccuracy >= 22 && criteria.sourceReliability >= 18 ? "PASSED ✓" : "BLOCKED ⚠️"}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <OverrideAlerts overrides={vqiResult.overrides} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Export & Benchmark Scenarios */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-fade-in">
            <AuditExport report={auditReport} />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="card p-4 flex items-center justify-between">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Stage
        </button>

        <span className="text-xs text-slate-500 font-mono hidden sm:inline">
          Stage {currentStep} of {PIPELINE_STEPS.length}: {PIPELINE_STEPS[currentStep - 1].name}
        </span>

        {currentStep < PIPELINE_STEPS.length ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.min(PIPELINE_STEPS.length, prev + 1))}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            Next Stage <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            Start New Evaluation <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Persistent Benchmark Scenarios Drawer at Bottom */}
      <div className="pt-2">
        <BenchmarkCases onLoad={handleLoadBenchmark} activeCaseId={activeBenchmarkId} />
      </div>
    </div>
  );
}

