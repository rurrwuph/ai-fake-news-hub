"use client";

import { useState } from "react";
import type { AuditReport } from "@/lib/types";
import { Download, Copy, Check, FileCode, ShieldAlert, CheckCircle2 } from "lucide-react";

interface AuditExportProps {
  report: AuditReport | null;
}

export default function AuditExport({ report }: AuditExportProps) {
  const [copied, setCopied] = useState(false);

  if (!report) {
    return (
      <div className="card p-5 text-center text-slate-500 py-8">
        <FileCode className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-sm">No adjudication audit report generated yet.</p>
        <p className="text-xs text-slate-400">Complete the verification pipeline to generate the deterministic audit ledger.</p>
      </div>
    );
  }

  const jsonString = JSON.stringify(report, null, 2);

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const sanitizedTimestamp = report.timestamp.replace(/[:.]/g, "-");
    a.download = `veritas-audit-${sanitizedTimestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Stage 7: Forensic Audit Dossier & JSON Ledger Export
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Deterministic Record • ISO Timestamp: {report.timestamp}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy JSON
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit File (.json)
          </button>
        </div>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-slate-500 text-[10px] uppercase font-semibold">Final Adjudication</span>
          <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            {report.verdict}
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-slate-500 text-[10px] uppercase font-semibold">VQI Aggregate Score</span>
          <div className="text-sm font-bold font-mono text-indigo-600 mt-1">
            {report.vqiScore} / 100
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-slate-500 text-[10px] uppercase font-semibold">Safety Overrides</span>
          <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            {report.overridesTriggered.filter((o) => o.triggered).length} Triggered
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-slate-500 text-[10px] uppercase font-semibold">Evidence Ledger</span>
          <div className="text-sm font-bold text-slate-900 mt-1">
            {report.evidenceCitations.length} Citations Logged
          </div>
        </div>
      </div>

      {/* JSON Viewer */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Machine-Readable Audit Payload</span>
          <span className="font-mono text-[10px]">{jsonString.length} bytes</span>
        </div>
        <pre className="p-4 bg-slate-950 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto max-h-80 border border-slate-800 leading-relaxed selection:bg-indigo-900">
          {jsonString}
        </pre>
      </div>
    </div>
  );
}

