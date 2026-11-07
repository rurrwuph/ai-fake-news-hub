"use client";

import type { BenchmarkCase } from "@/lib/types";
import { benchmarkCases } from "@/data/benchmarkCases";
import { Sparkles, CheckCircle2, AlertOctagon, HelpCircle, ShieldAlert } from "lucide-react";
import clsx from "clsx";

interface BenchmarkCasesProps {
  onLoad: (benchmarkCase: BenchmarkCase) => void;
  activeCaseId?: string;
}

export default function BenchmarkCases({ onLoad, activeCaseId }: BenchmarkCasesProps) {
  const getBadge = (verdict: string) => {
    switch (verdict) {
      case "Verified":
        return <span className="badge-verified flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>;
      case "False":
        return <span className="badge-false flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> False</span>;
      case "Misleading":
        return <span className="badge-misleading flex items-center gap-1"><AlertOctagon className="w-3 h-3" /> Misleading</span>;
      case "Unverifiable":
        return <span className="badge-unverifiable flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Unverifiable</span>;
      default:
        return <span className="badge-pending">Pending</span>;
    }
  };

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Benchmark Scenarios & Stress Tests
            </h3>
            <p className="text-xs text-slate-500">
              Pre-configured verification test suites validating the 7-stage pipeline and non-compensatory safety overrides
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {benchmarkCases.map((bCase) => {
          const isSelected = activeCaseId === bCase.id;
          return (
            <div
              key={bCase.id}
              className={clsx(
                "p-4 rounded-lg border transition-all text-left flex flex-col justify-between space-y-3",
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase">
                    {bCase.id}
                  </span>
                  {getBadge(bCase.expectedVerdict)}
                </div>

                <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                  {bCase.name}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {bCase.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <span className="badge bg-slate-100 text-slate-700">
                    {bCase.category}
                  </span>
                  <span>•</span>
                  <span className="font-medium text-slate-600">{bCase.aiTool}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  Target: {bCase.expectedVerdict}
                </span>
                <button
                  type="button"
                  onClick={() => onLoad(bCase)}
                  className={clsx(
                    "px-3 py-1 text-xs font-medium rounded transition-colors",
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "btn-secondary text-xs"
                  )}
                >
                  {isSelected ? "Active Suite" : "Load Scenario"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

