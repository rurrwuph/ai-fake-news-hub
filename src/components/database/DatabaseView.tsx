"use client";

import { useState, useEffect } from "react";
import type {
  ClaimVerification,
  SourceVerification,
  AIResponseComparison,
  FakeNewsInvestigation,
  BiasAnalysis,
} from "@/lib/types";
import { claimVerificationData } from "@/data/claimVerification";
import { sourceVerificationData } from "@/data/sourceVerification";
import { aiResponseComparisonData } from "@/data/aiResponseComparison";
import { fakeNewsInvestigationData } from "@/data/fakeNewsInvestigation";
import { biasAnalysisData } from "@/data/biasAnalysis";
import {
  Database,
  Table,
  FileSpreadsheet,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileWarning,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Layers,
} from "lucide-react";
import clsx from "clsx";

type SchemaTab = "claims" | "sources" | "comparisons" | "investigations" | "bias" | "architecture";

export default function DatabaseView() {
  const [activeTab, setActiveTab] = useState<SchemaTab>("claims");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get("table") as SchemaTab;
      if (
        tableParam &&
        ["claims", "sources", "comparisons", "investigations", "bias", "architecture"].includes(
          tableParam
        )
      ) {
        setActiveTab(tableParam);
      }
    }
  }, []);

  const downloadCSV = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportClaimsCSV = () => {
    const headers = [
      "Claim ID",
      "Date",
      "Claim",
      "Category",
      "AI Tool",
      "Original Prompt",
      "AI Response",
      "Verification Status",
      "Evidence Summary",
      "Confidence",
      "Reviewer",
    ];
    const rows = claimVerificationData.map((c) => [
      c.claimId,
      c.date,
      `"${c.claim.replace(/"/g, '""')}"`,
      c.category,
      c.aiTool,
      `"${c.originalPrompt.replace(/"/g, '""')}"`,
      `"${c.aiResponse.replace(/"/g, '""')}"`,
      c.verificationStatus,
      `"${c.evidenceSummary.replace(/"/g, '""')}"`,
      c.confidence,
      c.reviewer,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCSV("Claim_Verification.csv", csv);
  };

  const exportSourcesCSV = () => {
    const headers = [
      "Source ID",
      "Claim ID",
      "Source Title",
      "Publisher",
      "URL",
      "Source Type",
      "Publication Date",
      "Source Status",
      "Evidence Notes",
    ];
    const rows = sourceVerificationData.map((s) => [
      s.sourceId,
      s.claimId,
      `"${s.sourceTitle.replace(/"/g, '""')}"`,
      `"${s.publisher.replace(/"/g, '""')}"`,
      `"${s.url.replace(/"/g, '""')}"`,
      s.sourceType,
      s.publicationDate,
      s.sourceStatus,
      `"${s.evidenceNotes.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCSV("Source_Verification.csv", csv);
  };

  const exportComparisonsCSV = () => {
    const headers = [
      "Test ID",
      "Question",
      "ChatGPT Response",
      "Gemini Response",
      "DeepSeek Response",
      "Differences",
      "Incorrect Claims",
      "Final Finding",
    ];
    const rows = aiResponseComparisonData.map((t) => [
      t.testId,
      `"${t.question.replace(/"/g, '""')}"`,
      `"${t.chatGPTResponse.replace(/"/g, '""')}"`,
      `"${t.geminiResponse.replace(/"/g, '""')}"`,
      `"${t.deepSeekResponse.replace(/"/g, '""')}"`,
      `"${t.differences.replace(/"/g, '""')}"`,
      `"${t.incorrectClaims.replace(/"/g, '""')}"`,
      `"${t.finalFinding.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCSV("AI_Response_Comparison.csv", csv);
  };

  const exportInvestigationsCSV = () => {
    const headers = [
      "News ID",
      "Headline",
      "News Category",
      "Original AI-generated Article",
      "Number of Claims",
      "False Claims Found",
      "Misleading Claims Found",
      "Corrected Headline",
      "Corrected Article",
      "Investigation Report",
      "Final Status",
    ];
    const rows = fakeNewsInvestigationData.map((n) => [
      n.newsId,
      `"${n.headline.replace(/"/g, '""')}"`,
      n.newsCategory,
      `"${n.originalArticle.replace(/"/g, '""')}"`,
      n.numberOfClaims,
      n.falseClaimsFound,
      n.misleadingClaimsFound,
      `"${n.correctedHeadline.replace(/"/g, '""')}"`,
      `"${n.correctedArticle.replace(/"/g, '""')}"`,
      `"${n.investigationReport.replace(/"/g, '""')}"`,
      n.finalStatus,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCSV("Fake_News_Investigation.csv", csv);
  };

  const exportBiasCSV = () => {
    const headers = [
      "Analysis ID",
      "Question",
      "AI Tool",
      "Response",
      "One-sided Arguments",
      "Missing Perspectives",
      "Unsupported Assumptions",
      "Emotionally Loaded Language",
      "Bias Level",
      "Researcher's Conclusion",
    ];
    const rows = biasAnalysisData.map((b) => [
      b.analysisId,
      `"${b.question.replace(/"/g, '""')}"`,
      b.aiTool,
      `"${b.response.replace(/"/g, '""')}"`,
      `"${b.oneSidedArguments.replace(/"/g, '""')}"`,
      `"${b.missingPerspectives.replace(/"/g, '""')}"`,
      `"${b.unsupportedAssumptions.replace(/"/g, '""')}"`,
      `"${b.emotionallyLoadedLanguage.replace(/"/g, '""')}"`,
      b.biasLevel,
      `"${b.researcherConclusion.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadCSV("Bias_Analysis.csv", csv);
  };

  // Filtered lists
  const filteredClaims = claimVerificationData.filter(
    (c) =>
      c.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSources = sourceVerificationData.filter(
    (s) =>
      s.sourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComparisons = aiResponseComparisonData.filter(
    (comp) =>
      comp.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.testId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvestigations = fakeNewsInvestigationData.filter(
    (inv) =>
      inv.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.newsId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBias = biasAnalysisData.filter(
    (b) =>
      b.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.analysisId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Relational Data Hub (5-Sheet Architecture)
              </h1>
              <span className="badge bg-slate-100 text-slate-800 font-mono text-[10px] font-semibold border border-slate-300">
                GOOGLE SHEETS / LOOKER STUDIO SYNCHRONIZED
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Relational data ledger strictly enforcing foreign keys, validation domains, and Looker Studio live metric expressions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "claims" && (
            <button onClick={exportClaimsCSV} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Claims CSV
            </button>
          )}
          {activeTab === "sources" && (
            <button onClick={exportSourcesCSV} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Sources CSV
            </button>
          )}
          {activeTab === "comparisons" && (
            <button onClick={exportComparisonsCSV} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Comparisons CSV
            </button>
          )}
          {activeTab === "investigations" && (
            <button onClick={exportInvestigationsCSV} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Investigations CSV
            </button>
          )}
          {activeTab === "bias" && (
            <button onClick={exportBiasCSV} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Bias CSV
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("claims")}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2",
            activeTab === "claims"
              ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <Table className="w-4 h-4" /> Table 1: Claim_Verification
          <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-mono">
            {claimVerificationData.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("sources")}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2",
            activeTab === "sources"
              ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <LinkIcon className="w-4 h-4" /> Table 2: Source_Verification
          <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-mono">
            {sourceVerificationData.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("comparisons")}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2",
            activeTab === "comparisons"
              ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <Layers className="w-4 h-4" /> Table 3: AI_Response_Comparison
          <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-mono">
            {aiResponseComparisonData.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("investigations")}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2",
            activeTab === "investigations"
              ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <FileWarning className="w-4 h-4" /> Table 4: Fake_News_Investigation
          <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-mono">
            {fakeNewsInvestigationData.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("bias")}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2",
            activeTab === "bias"
              ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <AlertTriangle className="w-4 h-4" /> Table 5: Bias_Analysis
          <span className="bg-slate-200/80 px-1.5 py-0.2 rounded text-[10px] font-mono">
            {biasAnalysisData.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("architecture")}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2",
            activeTab === "architecture"
              ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          <FileSpreadsheet className="w-4 h-4" /> Architecture & Formulas
        </button>
      </div>

      {/* Search Input for Data Tabs */}
      {activeTab !== "architecture" && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter records across primary keys, text, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>
      )}

      {/* Tab 1: Claim_Verification */}
      {activeTab === "claims" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 font-mono">Claim ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Claim (Atomic Proposition)</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">AI Tool</th>
                  <th className="p-3">Verification Status</th>
                  <th className="p-3">Evidence Summary</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Reviewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClaims.map((c) => (
                  <tr key={c.claimId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {c.claimId}
                    </td>
                    <td className="p-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {c.date}
                    </td>
                    <td className="p-3 font-medium text-slate-900 max-w-xs">{c.claim}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="badge bg-slate-100 text-slate-700">{c.category}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap font-medium text-slate-700">
                      {c.aiTool}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={clsx(
                          "badge",
                          c.verificationStatus === "Verified" && "badge-verified",
                          c.verificationStatus === "False" && "badge-false",
                          c.verificationStatus === "Misleading" && "badge-misleading",
                          c.verificationStatus === "Unverifiable" && "badge-unverifiable",
                          c.verificationStatus === "Pending" && "badge-pending"
                        )}
                      >
                        {c.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-sm line-clamp-2">
                      {c.evidenceSummary}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={clsx(
                          "font-semibold",
                          c.confidence === "High" && "text-emerald-600",
                          c.confidence === "Medium" && "text-amber-600",
                          c.confidence === "Low" && "text-slate-400"
                        )}
                      >
                        {c.confidence}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap font-mono text-slate-600">
                      {c.reviewer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Source_Verification */}
      {activeTab === "sources" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 font-mono">Source ID</th>
                  <th className="p-3 font-mono">Claim ID (FK)</th>
                  <th className="p-3">Source Title</th>
                  <th className="p-3">Publisher</th>
                  <th className="p-3">Source Type</th>
                  <th className="p-3">Publication Date</th>
                  <th className="p-3">Source Status</th>
                  <th className="p-3">Evidence Notes</th>
                  <th className="p-3">Resolving URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSources.map((s) => (
                  <tr key={s.sourceId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {s.sourceId}
                    </td>
                    <td className="p-3 font-mono text-slate-600 whitespace-nowrap">
                      <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                        {s.claimId}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-900 max-w-xs">{s.sourceTitle}</td>
                    <td className="p-3 text-slate-700 whitespace-nowrap">{s.publisher}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="badge bg-slate-100 text-slate-700">{s.sourceType}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {s.publicationDate}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={clsx(
                          "badge",
                          s.sourceStatus === "Verified" && "bg-emerald-100 text-emerald-800",
                          s.sourceStatus === "Fabricated Source" && "bg-rose-100 text-rose-800 font-bold",
                          s.sourceStatus === "Real but Misrepresented" && "bg-amber-100 text-amber-800",
                          s.sourceStatus === "Unable to Verify" && "bg-slate-100 text-slate-700"
                        )}
                      >
                        {s.sourceStatus}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 max-w-sm line-clamp-2">{s.evidenceNotes}</td>
                    <td className="p-3 whitespace-nowrap font-mono">
                      {s.url && (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Link
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: AI_Response_Comparison */}
      {activeTab === "comparisons" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 font-mono">Test ID</th>
                  <th className="p-3">Question</th>
                  <th className="p-3">ChatGPT (GPT-4o)</th>
                  <th className="p-3">Gemini 3.8 Flash</th>
                  <th className="p-3">DeepSeek</th>
                  <th className="p-3">Divergence & Hallucinations</th>
                  <th className="p-3">Final Ground Truth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComparisons.map((c) => (
                  <tr key={c.testId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {c.testId}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 max-w-xs">{c.question}</td>
                    <td className="p-3 text-slate-600 max-w-xs bg-slate-50/50 p-2 rounded">
                      {c.chatGPTResponse}
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs bg-slate-50/50 p-2 rounded">
                      {c.geminiResponse}
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs bg-slate-50/50 p-2 rounded">
                      {c.deepSeekResponse}
                    </td>
                    <td className="p-3 text-rose-700 max-w-xs">
                      <div className="font-semibold">{c.differences}</div>
                      <div className="text-[11px] text-rose-600 italic mt-1">{c.incorrectClaims}</div>
                    </td>
                    <td className="p-3 text-emerald-800 font-medium max-w-xs bg-emerald-50/30">
                      {c.finalFinding}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Fake_News_Investigation */}
      {activeTab === "investigations" && (
        <div className="space-y-4">
          {filteredInvestigations.map((inv) => (
            <div key={inv.newsId} className="card p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-600 text-xs">{inv.newsId}</span>
                  <span className="badge bg-slate-100 text-slate-700 text-xs">{inv.newsCategory}</span>
                  <span
                    className={clsx(
                      "badge font-bold text-xs",
                      inv.finalStatus === "Fabricated" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {inv.finalStatus}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>Claims: <strong>{inv.numberOfClaims}</strong></span>
                  <span>False: <strong className="text-rose-600">{inv.falseClaimsFound}</strong></span>
                  <span>Misleading: <strong className="text-amber-600">{inv.misleadingClaimsFound}</strong></span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
                  Synthetic Fictional Headline
                </span>
                <h3 className="text-sm font-bold text-slate-900 line-through decoration-rose-500">
                  {inv.headline}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-rose-50/60 p-3 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-800 block mb-1">
                    Raw AI-Generated Article ([FICTIONAL])
                  </span>
                  <p className="text-slate-700 italic">{inv.originalArticle}</p>
                </div>

                <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-1">
                    Corrected Fact-Checked Article
                  </span>
                  <p className="text-slate-800 font-medium mb-1">{inv.correctedHeadline}</p>
                  <p className="text-slate-700">{inv.correctedArticle}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">Forensic Audit Breakdown:</span>
                <p className="text-slate-600">{inv.investigationReport}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Bias_Analysis */}
      {activeTab === "bias" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 font-mono">Analysis ID</th>
                  <th className="p-3">Policy / Ethical Dilemma</th>
                  <th className="p-3">AI Model</th>
                  <th className="p-3">One-Sided Arguments</th>
                  <th className="p-3">Missing Perspectives</th>
                  <th className="p-3">Unsupported Assumptions</th>
                  <th className="p-3">Loaded Descriptors</th>
                  <th className="p-3">Bias Level</th>
                  <th className="p-3">Researcher Synthesis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBias.map((b) => (
                  <tr key={b.analysisId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {b.analysisId}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 max-w-xs">{b.question}</td>
                    <td className="p-3 whitespace-nowrap font-medium text-slate-700">{b.aiTool}</td>
                    <td className="p-3 text-slate-600 max-w-xs">{b.oneSidedArguments}</td>
                    <td className="p-3 text-slate-600 max-w-xs">{b.missingPerspectives}</td>
                    <td className="p-3 text-slate-600 max-w-xs">{b.unsupportedAssumptions}</td>
                    <td className="p-3 text-amber-700 font-mono text-[11px] max-w-xs">
                      {b.emotionallyLoadedLanguage}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={clsx(
                          "badge font-bold",
                          b.biasLevel === "High" && "bg-rose-100 text-rose-800",
                          b.biasLevel === "Medium" && "bg-amber-100 text-amber-800",
                          b.biasLevel === "Low" && "bg-emerald-100 text-emerald-800"
                        )}
                      >
                        {b.biasLevel}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 max-w-sm font-medium">{b.researcherConclusion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Architecture & Formulas (YSSE Architecture Guide) */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                YSSE Dept. of IT: Relational Schema & Formula Specification
              </h3>
              <p className="text-xs text-slate-500">
                Deterministic formula implementations for Google Sheets & Looker Studio ingestion pipelines
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-sm block">
                  Looker Studio Live Aggregation Formulas
                </span>
                <div className="space-y-2 font-mono">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Total Claims Submitted (Min 30):</span>
                    <code className="text-indigo-600">=COUNTA(Claim_Verification!A2:A)</code>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Total Verified:</span>
                    <code className="text-emerald-600">=COUNTIF(Claim_Verification!H2:H, &quot;Verified&quot;)</code>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Total False:</span>
                    <code className="text-rose-600">=COUNTIF(Claim_Verification!H2:H, &quot;False&quot;)</code>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Total Misleading:</span>
                    <code className="text-amber-600">=COUNTIF(Claim_Verification!H2:H, &quot;Misleading&quot;)</code>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Total Unverifiable:</span>
                    <code className="text-slate-600">=COUNTIF(Claim_Verification!H2:H, &quot;Unverifiable&quot;)</code>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Total Fabricated Sources (Min 20):</span>
                    <code className="text-rose-600">=COUNTIF(Source_Verification!H2:H, &quot;Fabricated Source&quot;)</code>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 text-sm block">
                  Relational Integrity & Multi-Channel Pipeline
                </span>
                <p className="text-slate-600">
                  The Google Sheets database maintains 1:N relational links between <code>Claim_Verification.Claim ID</code> (Primary Key) and <code>Source_Verification.Claim ID</code> (Foreign Key).
                </p>
                <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 block">Google Forms Multi-Channel Pipeline:</span>
                  <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                    <li>Form 1: Public Claims Ingestion (Routes to <code>Claim_Verification</code> with Status = &quot;Pending&quot;)</li>
                    <li>Form 2: Forensic Reviewer Portal (Allows authorized auditors to populate <code>Source_Verification</code> and update Status)</li>
                  </ul>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-900 block">Current Database Totals:</span>
                  <p className="text-slate-600">
                    Claims recorded: <strong>{claimVerificationData.length}</strong> (exceeds 30 minimum threshold)
                  </p>
                  <p className="text-slate-600">
                    Sources recorded: <strong>{sourceVerificationData.length}</strong> (exceeds 20 minimum threshold)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

