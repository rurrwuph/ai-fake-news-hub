"use client";

import { useState, useMemo } from "react";
import {
  Newspaper,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  GitCompare,
  FolderSearch,
  PlusCircle,
  Download,
  ExternalLink,
  Search,
  ShieldAlert,
  Sparkles,
  FileText,
  Scale,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import clsx from "clsx";
import type {
  Week6NewsArticle,
  Week6ClaimRecord,
  Week6EvidenceRecord,
  Week6VerificationStatus,
  Week6ArticleCategory,
} from "@/lib/types";
import {
  week6Articles as INITIAL_ARTICLES,
  week6Claims as INITIAL_CLAIMS,
  week6EvidenceRepository as INITIAL_EVIDENCE,
  week6AIErrors,
  week6SourceRubric,
} from "@/data/week6Investigation";

type Week6SubTab =
  | "dashboard"
  | "claims"
  | "comparison"
  | "evidence"
  | "articles"
  | "demo";

const STATUS_BADGE: Record<Week6VerificationStatus, string> = {
  Verified: "bg-emerald-100 text-emerald-800 border-emerald-200",
  False: "bg-red-100 text-red-800 border-red-200",
  Misleading: "bg-amber-100 text-amber-800 border-amber-200",
  "Partially True": "bg-cyan-100 text-cyan-800 border-cyan-200",
  Unverifiable: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function Week6InvestigationHub() {
  const [activeTab, setActiveTab] = useState<Week6SubTab>("dashboard");
  const [articles, setArticles] = useState<Week6NewsArticle[]>(INITIAL_ARTICLES);
  const [claims, setClaims] = useState<Week6ClaimRecord[]>(INITIAL_CLAIMS);
  const [evidence, setEvidence] = useState<Week6EvidenceRecord[]>(INITIAL_EVIDENCE);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [articleFilter, setArticleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [onlyDiscrepancies, setOnlyDiscrepancies] = useState(false);

  // Live Platform Demonstration form state (Section 7.7)
  const [demoHeadline, setDemoHeadline] = useState(
    "UN Energy Report Claims Global Solar Capacity Doubled Within 18 Months"
  );
  const [demoPublisher, setDemoPublisher] = useState("Reuters / IEA Statistical Brief");
  const [demoCategory, setDemoCategory] = useState<Week6ArticleCategory>("Science & Technology");
  const [demoUrl, setDemoUrl] = useState("https://www.iea.org/reports/renewables-2024");
  const [demoClaimText, setDemoClaimText] = useState(
    "Global solar PV additions reached 420 GW in 2023, representing an 85% year-over-year expansion."
  );
  const [demoGptVerdict, setDemoGptVerdict] = useState("Verified");
  const [demoGeminiVerdict, setDemoGeminiVerdict] = useState("Verified (cites 2022 baseline)");
  const [demoDeepseekVerdict, setDemoDeepseekVerdict] = useState("Verified");
  const [demoHumanStatus, setDemoHumanStatus] = useState<Week6VerificationStatus>("Verified");
  const [demoAgreesAI, setDemoAgreesAI] = useState(true);
  const [demoEvidenceUrl, setDemoEvidenceUrl] = useState(
    "https://www.iea.org/reports/renewables-2024/executive-summary"
  );
  const [demoExcerpt, setDemoExcerpt] = useState(
    "IEA Renewables 2024 confirms global solar PV capacity additions surged to ~420 GW in 2023."
  );
  const [demoReasoning, setDemoReasoning] = useState(
    "Cross-verified against IEA Renewables 2024 Executive Summary and IRENA Capacity Statistics."
  );
  const [demoSuccessMsg, setDemoSuccessMsg] = useState<string | null>(null);

  // Live Dashboard KPIs (Section 7.6)
  const kpis = useMemo(() => {
    const totalArticles = articles.length;
    const totalClaims = claims.length;
    const verified = claims.filter((c) => c.humanFinalStatus === "Verified").length;
    const falseCount = claims.filter((c) => c.humanFinalStatus === "False").length;
    const misleading = claims.filter((c) => c.humanFinalStatus === "Misleading").length;
    const partiallyTrue = claims.filter((c) => c.humanFinalStatus === "Partially True").length;
    const unverifiable = claims.filter((c) => c.humanFinalStatus === "Unverifiable").length;
    const disagreements = claims.filter((c) => !c.agreesWithAI).length;
    const disagreementRate = totalClaims
      ? ((disagreements / totalClaims) * 100).toFixed(1)
      : "0.0";

    return {
      totalArticles,
      totalClaims,
      verified,
      falseCount,
      misleading,
      partiallyTrue,
      unverifiable,
      disagreements,
      disagreementRate,
    };
  }, [articles, claims]);

  // Chart data per article
  const domainChartData = useMemo(() => {
    return articles.map((art) => {
      const artClaims = claims.filter((c) => c.articleId === art.articleId);
      return {
        article: art.articleId,
        Verified: artClaims.filter((c) => c.humanFinalStatus === "Verified").length,
        False: artClaims.filter((c) => c.humanFinalStatus === "False").length,
        Misleading: artClaims.filter((c) => c.humanFinalStatus === "Misleading").length,
        "Partially True": artClaims.filter((c) => c.humanFinalStatus === "Partially True").length,
      };
    });
  }, [articles, claims]);

  // Filtered claims
  const filteredClaims = useMemo(() => {
    return claims.filter((c) => {
      if (articleFilter !== "ALL" && c.articleId !== articleFilter) return false;
      if (statusFilter !== "ALL" && c.humanFinalStatus !== statusFilter) return false;
      if (onlyDiscrepancies && c.agreesWithAI) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.claimId.toLowerCase().includes(q) ||
          c.extractedClaim.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.humanReasoning.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [claims, articleFilter, statusFilter, onlyDiscrepancies, searchQuery]);

  // Filtered evidence
  const filteredEvidence = useMemo(() => {
    return evidence.filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.evidenceId.toLowerCase().includes(q) ||
          e.claimId.toLowerCase().includes(q) ||
          e.sourceTitle.toLowerCase().includes(q) ||
          e.publisher.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [evidence, searchQuery]);

  // Export CSV helper
  const exportClaimsCSV = () => {
    const headers = [
      "Claim_ID",
      "Article_ID",
      "Extracted_Claim",
      "Category",
      "GPT4o",
      "Gemini",
      "DeepSeek",
      "Human_Status",
      "Agrees_With_AI",
      "Evidence_ID",
      "Reasoning",
    ];
    const rows = claims.map((c) => [
      c.claimId,
      c.articleId,
      `"${c.extractedClaim.replace(/"/g, '""')}"`,
      c.category,
      c.gpt4oAssessment,
      c.geminiAssessment,
      c.deepseekAssessment,
      c.humanFinalStatus,
      c.agreesWithAI ? "True" : "False",
      c.primaryEvidenceId,
      `"${c.humanReasoning.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Week6_Updated_Claims_Ledger.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Demo ingestion handler (Section 7.7)
  const handleAddDemoRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const nextArtNum = articles.length + 1;
    const newArtId = `ART${String(nextArtNum).padStart(2, "0")}`;
    const nextClmNum = claims.length + 1;
    const newClmId = `CLM${String(nextClmNum).padStart(3, "0")}`;
    const newEviId = `EVI${String(evidence.length + 1).padStart(3, "0")}`;

    const newArticle: Week6NewsArticle = {
      articleId: newArtId,
      category: demoCategory,
      headline: demoHeadline,
      publisher: demoPublisher,
      author: "Live Demonstration Analyst",
      publicationDate: "2026-11-11",
      url: demoUrl,
      publicationType: "Live Platform Demonstration Submission",
      mainSubject: demoHeadline,
      summary: demoReasoning,
      preAiCredibility: {
        identifiablePublisher: true,
        identifiableAuthor: true,
        publicationDateAvailable: true,
        supportingReferences: true,
        headlineAccurate: "Yes",
        distinguishesFactOpinion: "Yes",
      },
      finalVerdict: `${demoHumanStatus} — Ingested and cross-verified via Live Platform Demonstration.`,
    };

    const newClaim: Week6ClaimRecord = {
      claimId: newClmId,
      articleId: newArtId,
      extractedClaim: demoClaimText,
      category: demoCategory,
      gpt4oAssessment: demoGptVerdict,
      geminiAssessment: demoGeminiVerdict,
      deepseekAssessment: demoDeepseekVerdict,
      humanFinalStatus: demoHumanStatus,
      primaryEvidenceId: newEviId,
      humanReasoning: demoReasoning,
      agreesWithAI: demoAgreesAI,
    };

    const newEvidence: Week6EvidenceRecord = {
      evidenceId: newEviId,
      claimId: newClmId,
      sourceId: `SRC${String(evidence.length + 1).padStart(2, "0")}`,
      sourceTitle: `${demoPublisher} — Primary Verification Record`,
      publisher: demoPublisher,
      sourceUrl: demoEvidenceUrl,
      publicationDate: "2024-10-09",
      accessDate: "2026-11-11",
      relevantExcerpt: demoExcerpt,
      evidenceType: demoHumanStatus === "False" ? "Primary Contradicting" : "Primary Supporting",
      reliabilityScore10: 9.5,
      status: demoHumanStatus === "False" ? "Contradicting" : "Supporting",
    };

    setArticles((prev) => [newArticle, ...prev]);
    setClaims((prev) => [newClaim, ...prev]);
    setEvidence((prev) => [newEvidence, ...prev]);
    setDemoSuccessMsg(
      `Committed ${newArtId}, ${newClmId}, and ${newEviId} to live platform state! Verification Dashboard indicators updated (${articles.length + 1} Articles, ${claims.length + 1} Claims).`
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Week 6: AI + Human Fact-Checking Investigation Hub
              </h1>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-mono font-semibold">
                {kpis.totalArticles} ARTICLES · {kpis.totalClaims} CLAIMS
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Source verification, multi-model AI vs. human adjudication, 10-point evidence repository, and live ingestion workflow
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportClaimsCSV}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export 50-Claim CSV
          </button>
          <button
            onClick={() => setActiveTab("demo")}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Investigate New Article
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: "dashboard", label: "7.6 Verification Dashboard", icon: <Scale className="w-4 h-4" /> },
          { id: "claims", label: `7.1 Claims Database (${kpis.totalClaims})`, icon: <FileText className="w-4 h-4" /> },
          { id: "comparison", label: `7.3 AI vs Human (${kpis.disagreementRate}% Diff)`, icon: <GitCompare className="w-4 h-4" /> },
          { id: "evidence", label: `7.4 Evidence Repository (${evidence.length})`, icon: <FolderSearch className="w-4 h-4" /> },
          { id: "articles", label: `7.5 News Dossiers (${kpis.totalArticles})`, icon: <Newspaper className="w-4 h-4" /> },
          { id: "demo", label: "7.7 Platform Demonstration", icon: <Sparkles className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Week6SubTab)}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap",
              activeTab === t.id
                ? "border-indigo-600 text-indigo-700 bg-indigo-50/60"
                : "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: VERIFICATION DASHBOARD (SECTION 7.6) */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="kpi-card">
              <p className="text-xs font-medium text-slate-500">Total News Articles Investigated</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{kpis.totalArticles}</p>
              <p className="text-[11px] text-slate-400 mt-1">5 Mandatory Categories Covered</p>
            </div>
            <div className="kpi-card">
              <p className="text-xs font-medium text-slate-500">Total Factual Claims Extracted</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{kpis.totalClaims}</p>
              <p className="text-[11px] text-slate-400 mt-1">10 Verifiable Claims / Article</p>
            </div>
            <div className="kpi-card">
              <p className="text-xs font-medium text-slate-500">Claims Independently Verified</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{kpis.verified}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {((kpis.verified / kpis.totalClaims) * 100).toFixed(1)}% Supported by Primary Sources
              </p>
            </div>
            <div className="kpi-card">
              <p className="text-xs font-medium text-slate-500">AI–Human Disagreement Rate</p>
              <p className="text-2xl font-bold text-rose-600 mt-1">{kpis.disagreementRate}%</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {kpis.disagreements} / {kpis.totalClaims} Claims Required Human Correction
              </p>
            </div>
            <div className="kpi-card">
              <p className="text-xs font-medium text-slate-500">Claims Classified as False</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{kpis.falseCount}</p>
              <p className="text-[11px] text-slate-400 mt-1">Contradicted by Primary Evidence</p>
            </div>
            <div className="kpi-card">
              <p className="text-xs font-medium text-slate-500">Misleading Claims</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{kpis.misleading}</p>
              <p className="text-[11px] text-slate-400 mt-1">Context Stripped / Deceptive Framing</p>
            </div>
            <div className="kpi-card">
              <p className="text-xs font-medium text-slate-500">Partially True Claims</p>
              <p className="text-2xl font-bold text-cyan-600 mt-1">{kpis.partiallyTrue}</p>
              <p className="text-[11px] text-slate-400 mt-1">Pilot Data Extrapolated Nationwide</p>
            </div>
            <div className="kpi-card">
              <p className="text-xs font-medium text-slate-500">Unverifiable Claims</p>
              <p className="text-2xl font-bold text-slate-600 mt-1">{kpis.unverifiable}</p>
              <p className="text-[11px] text-slate-400 mt-1">All 50 Claims Traceable to Records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card p-6 lg:col-span-2">
              <h3 className="section-title mb-1">Human Adjudication Verdicts by Article</h3>
              <p className="section-subtitle mb-4">
                Claim-level verification outcomes across all investigated news dossiers
              </p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="article" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Verified" stackId="a" fill="#10b981" />
                    <Bar dataKey="Partially True" stackId="a" fill="#06b6d4" />
                    <Bar dataKey="Misleading" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="False" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="section-title">Multi-Model Audit Highlights</h3>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-slate-800">Models Evaluated</div>
                <p className="text-slate-600">ChatGPT (GPT-4o), Google Gemini (1.5 Pro), DeepSeek (V3/R1)</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs space-y-1">
                <div className="font-semibold text-emerald-800">Strongest Analytical Model</div>
                <p className="text-emerald-700">
                  DeepSeek-V3/R1 caught Transformer quadratic memory bounds and headline inversions most reliably.
                </p>
              </div>
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs space-y-1">
                <div className="font-semibold text-rose-800">10 Documented AI Errors</div>
                <p className="text-rose-700">
                  Includes URL slug fabrication (ERR01), 2025 vs 2035 deadline conflation (ERR02), and headline-body blindness (ERR09).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLAIM VERIFICATION DATABASE (SECTION 7.1) */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search claims by ID, text, or reasoning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-9 text-xs"
              />
            </div>
            <select
              value={articleFilter}
              onChange={(e) => setArticleFilter(e.target.value)}
              className="select-field w-44 text-xs"
            >
              <option value="ALL">All Articles ({articles.length})</option>
              {articles.map((a) => (
                <option key={a.articleId} value={a.articleId}>
                  {a.articleId}: {a.category}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field w-44 text-xs"
            >
              <option value="ALL">All Verdicts ({claims.length})</option>
              <option value="Verified">Verified</option>
              <option value="False">False</option>
              <option value="Misleading">Misleading</option>
              <option value="Partially True">Partially True</option>
              <option value="Unverifiable">Unverifiable</option>
            </select>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-mono">Claim ID</th>
                    <th className="p-3 font-mono">Article</th>
                    <th className="p-3">Extracted Factual Claim</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Human Verdict</th>
                    <th className="p-3">Evidence</th>
                    <th className="p-3">Human Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClaims.map((c) => (
                    <tr key={c.claimId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-semibold text-indigo-700">{c.claimId}</td>
                      <td className="p-3 font-mono text-slate-600">{c.articleId}</td>
                      <td className="p-3 text-slate-800 max-w-md">{c.extractedClaim}</td>
                      <td className="p-3 text-slate-600">{c.category}</td>
                      <td className="p-3">
                        <span
                          className={clsx(
                            "px-2 py-0.5 rounded-full border text-[11px] font-semibold whitespace-nowrap",
                            STATUS_BADGE[c.humanFinalStatus]
                          )}
                        >
                          {c.humanFinalStatus}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-blue-600">{c.primaryEvidenceId}</td>
                      <td className="p-3 text-slate-600 max-w-sm">{c.humanReasoning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI VS HUMAN COMPARISON & 10 AI ERRORS (SECTION 7.3) */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer bg-white px-3 py-2 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={onlyDiscrepancies}
                  onChange={(e) => setOnlyDiscrepancies(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                Show AI–Human Discrepancies Only ({kpis.disagreements})
              </label>
            </div>
            <div className="text-xs text-slate-500">
              Concordance: <strong className="text-emerald-700">{kpis.totalClaims - kpis.disagreements}/{kpis.totalClaims}</strong> · Disagreement Rate:{" "}
              <strong className="text-rose-700">{kpis.disagreementRate}%</strong>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto max-h-[420px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-mono">Claim ID</th>
                    <th className="p-3">GPT-4o</th>
                    <th className="p-3">Gemini 1.5 Pro</th>
                    <th className="p-3">DeepSeek V3/R1</th>
                    <th className="p-3">Human Verdict</th>
                    <th className="p-3">Agreement</th>
                    <th className="p-3">Explanation of Differences</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClaims.map((c) => (
                    <tr
                      key={c.claimId}
                      className={clsx("hover:bg-slate-50", !c.agreesWithAI && "bg-rose-50/40")}
                    >
                      <td className="p-3 font-mono font-semibold text-indigo-700">{c.claimId}</td>
                      <td className="p-3 text-slate-700">{c.gpt4oAssessment}</td>
                      <td className="p-3 text-slate-700">{c.geminiAssessment}</td>
                      <td className="p-3 text-slate-700">{c.deepseekAssessment}</td>
                      <td className="p-3">
                        <span
                          className={clsx(
                            "px-2 py-0.5 rounded-full border text-[11px] font-semibold",
                            STATUS_BADGE[c.humanFinalStatus]
                          )}
                        >
                          {c.humanFinalStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        {c.agreesWithAI ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Agree
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-semibold">
                            <XCircle className="w-3.5 h-3.5" /> Disagree
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600 max-w-sm">{c.humanReasoning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 10 Documented AI Errors */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h3 className="section-title text-base">
                10 Documented AI Errors & Hallucinations (ERR01–ERR10)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-rose-50 text-rose-900 font-semibold border-b border-rose-200">
                  <tr>
                    <th className="p-2.5 font-mono">Error ID</th>
                    <th className="p-2.5">AI Model</th>
                    <th className="p-2.5 font-mono">Claim</th>
                    <th className="p-2.5">Erroneous AI Output</th>
                    <th className="p-2.5">Empirical Ground Truth</th>
                    <th className="p-2.5">Root Cause</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {week6AIErrors.map((err) => (
                    <tr key={err.errorId} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-rose-700">{err.errorId}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{err.aiModel}</td>
                      <td className="p-2.5 font-mono text-indigo-700">{err.claimId}</td>
                      <td className="p-2.5 text-slate-700 max-w-xs">{err.erroneousOutput}</td>
                      <td className="p-2.5 text-slate-700 max-w-xs">{err.empiricalGroundTruth}</td>
                      <td className="p-2.5 font-medium text-rose-800">{err.rootCauseCategory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EVIDENCE REPOSITORY & SOURCE RELIABILITY (SECTION 7.2 & 7.4) */}
      {activeTab === "evidence" && (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900">
                Linked Evidence Repository (EVI001–EVI{String(evidence.length).padStart(3, "0")})
              </h3>
              <input
                type="text"
                placeholder="Filter by source title, publisher, or Claim ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-72 text-xs"
              />
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3 font-mono">Evi. ID</th>
                    <th className="p-3 font-mono">Claim</th>
                    <th className="p-3">Source Title & Publisher</th>
                    <th className="p-3">Pub / Access</th>
                    <th className="p-3">Relevant Excerpt</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvidence.map((e) => (
                    <tr key={e.evidenceId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-indigo-700">{e.evidenceId}</td>
                      <td className="p-3 font-mono text-slate-600">{e.claimId}</td>
                      <td className="p-3 max-w-xs">
                        <a
                          href={e.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                        >
                          {e.sourceTitle} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                        <div className="text-[11px] text-slate-500">{e.publisher}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {e.publicationDate}
                        <br />
                        Acc: {e.accessDate}
                      </td>
                      <td className="p-3 text-slate-700 max-w-sm italic">“{e.relevantExcerpt}”</td>
                      <td className="p-3 text-slate-600">{e.evidenceType}</td>
                      <td className="p-3 font-mono font-bold text-slate-800">{e.reliabilityScore10}/10</td>
                      <td className="p-3">
                        <span
                          className={clsx(
                            "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                            e.status === "Supporting"
                              ? "bg-emerald-100 text-emerald-800"
                              : e.status === "Contradicting"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-700"
                          )}
                        >
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <h3 className="section-title text-base">
              10-Point Source Reliability Assessment Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 font-mono">Source ID</th>
                    <th className="p-2.5">Source Title</th>
                    <th className="p-2.5">Classification</th>
                    <th className="p-2.5">Auth (2)</th>
                    <th className="p-2.5">Authen (2)</th>
                    <th className="p-2.5">Rel (2)</th>
                    <th className="p-2.5">Transp (2)</th>
                    <th className="p-2.5">Rec (2)</th>
                    <th className="p-2.5">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {week6SourceRubric.map((rb) => (
                    <tr key={rb.sourceId} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-semibold text-indigo-700">{rb.sourceId}</td>
                      <td className="p-2.5 font-medium text-slate-800">{rb.sourceTitle}</td>
                      <td className="p-2.5 text-slate-600">{rb.classification}</td>
                      <td className="p-2.5 font-mono">{rb.authority}</td>
                      <td className="p-2.5 font-mono">{rb.authenticity}</td>
                      <td className="p-2.5 font-mono">{rb.relevance}</td>
                      <td className="p-2.5 font-mono">{rb.transparency}</td>
                      <td className="p-2.5 font-mono">{rb.recency}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">{rb.totalScore}/10</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NEWS INVESTIGATION RECORDS (SECTION 7.5) */}
      {activeTab === "articles" && (
        <div className="grid grid-cols-1 gap-5">
          {articles.map((art) => (
            <div key={art.articleId} className="card p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-mono text-xs font-bold rounded">
                      {art.articleId}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span className="text-xs text-slate-400">· {art.publicationDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{art.headline}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {art.publisher} · {art.author}
                  </p>
                </div>
                <a
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1 whitespace-nowrap"
                >
                  Source URL <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{art.summary}</p>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-900">Final Fact-Checking Verdict: </span>
                <span className="text-slate-700">{art.finalVerdict}</span>
              </div>

              {art.misleadingPassage && art.correctedRewrite && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                    <div className="font-bold text-rose-800 mb-1">Original Misleading / Flawed Text</div>
                    <p className="text-rose-900 italic">“{art.misleadingPassage}”</p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="font-bold text-emerald-800 mb-1">Corrected Factual Rewrite</div>
                    <p className="text-emerald-900">“{art.correctedRewrite}”</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: PLATFORM DEMONSTRATION (SECTION 7.7) */}
      {activeTab === "demo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleAddDemoRecord} className="card p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="section-title text-base">
                  7.7 Live Platform Demonstration: Analyze, Verify & Commit New Article
                </h3>
                <p className="text-xs text-slate-500">
                  Demonstrates end-to-end article ingestion, AI comparison, evidence linking, and real-time Dashboard updates
                </p>
              </div>
            </div>

            {demoSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{demoSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Article Headline</label>
                <input
                  type="text"
                  required
                  value={demoHeadline}
                  onChange={(e) => setDemoHeadline(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={demoCategory}
                  onChange={(e) => setDemoCategory(e.target.value as Week6ArticleCategory)}
                  className="select-field text-xs"
                >
                  <option value="Politics & Public Affairs">Politics & Public Affairs</option>
                  <option value="Business & Economics">Business & Economics</option>
                  <option value="Science & Technology">Science & Technology</option>
                  <option value="Health & Education">Health & Education</option>
                  <option value="International Affairs">International Affairs</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Publisher</label>
                <input
                  type="text"
                  required
                  value={demoPublisher}
                  onChange={(e) => setDemoPublisher(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Canonical Article URL</label>
                <input
                  type="url"
                  required
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Extracted Factual Claim</label>
              <textarea
                rows={2}
                required
                value={demoClaimText}
                onChange={(e) => setDemoClaimText(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ChatGPT Assessment</label>
                <input
                  type="text"
                  value={demoGptVerdict}
                  onChange={(e) => setDemoGptVerdict(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gemini Assessment</label>
                <input
                  type="text"
                  value={demoGeminiVerdict}
                  onChange={(e) => setDemoGeminiVerdict(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">DeepSeek Assessment</label>
                <input
                  type="text"
                  value={demoDeepseekVerdict}
                  onChange={(e) => setDemoDeepseekVerdict(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Human Adjudicated Verdict</label>
                <select
                  value={demoHumanStatus}
                  onChange={(e) => setDemoHumanStatus(e.target.value as Week6VerificationStatus)}
                  className="select-field text-xs"
                >
                  <option value="Verified">Verified</option>
                  <option value="False">False</option>
                  <option value="Misleading">Misleading</option>
                  <option value="Partially True">Partially True</option>
                  <option value="Unverifiable">Unverifiable</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Evidence URL</label>
                <input
                  type="url"
                  required
                  value={demoEvidenceUrl}
                  onChange={(e) => setDemoEvidenceUrl(e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Verbatim Documentary Excerpt</label>
              <input
                type="text"
                required
                value={demoExcerpt}
                onChange={(e) => setDemoExcerpt(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Human Verification Justification</label>
              <textarea
                rows={2}
                required
                value={demoReasoning}
                onChange={(e) => setDemoReasoning(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={demoAgreesAI}
                  onChange={(e) => setDemoAgreesAI(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                AI Consensus Matches Human Verdict
              </label>
              <button type="submit" className="btn-primary text-xs py-2 px-4">
                Commit Investigation to Platform Hub <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="card p-6 space-y-4">
            <h3 className="section-title text-base">5-Stage Week 6 Pipeline</h3>
            <ol className="space-y-3 text-xs text-slate-600">
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block">1. News Selection & Metadata</strong>
                Catalog canonical URL, author, publisher, and Q1–Q6 pre-AI credibility check.
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block">2. Multi-Model Extraction</strong>
                Compare ChatGPT, Gemini, and DeepSeek outputs across 8 factual dimensions.
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block">3. Primary Source Research</strong>
                Cross-check against at least 2 independent primary records (WHO, IMF, UN, ArXiv, Gazettes).
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block">4. Human Adjudication & Scoring</strong>
                Assign final status and 10-point source reliability score; log any AI hallucinations.
              </li>
              <li className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <strong className="text-indigo-900 block">5. Live Dashboard Sync</strong>
                Indicators in Tab 7.6 update automatically upon commit.
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

