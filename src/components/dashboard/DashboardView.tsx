"use client";

import { BarChart3, Newspaper, ArrowRight } from "lucide-react";
import type { ClaimVerification, SourceVerification } from "@/lib/types";
import { week6Articles, week6Claims } from "@/data/week6Investigation";

import KPICards from "./KPICards";
import DonutChart from "./DonutChart";
import BarCharts from "./BarCharts";
import TimeSeriesChart from "./TimeSeriesChart";
import SourceBreakdown from "./SourceBreakdown";
import DataTable from "./DataTable";

interface DashboardViewProps {
  claims: ClaimVerification[];
  sources: SourceVerification[];
  onOpenWeek6?: () => void;
}

export default function DashboardView({ claims, sources, onOpenWeek6 }: DashboardViewProps) {
  const week6Disagreements = week6Claims.filter((c) => !c.agreesWithAI).length;
  const week6DisagreementRate = ((week6Disagreements / week6Claims.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Real-time verification metrics and Week 5 + Week 6 intelligence
            </p>
          </div>
        </div>
        {onOpenWeek6 && (
          <button
            onClick={onOpenWeek6}
            className="btn-primary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
          >
            <Newspaper className="w-4 h-4" />
            Open Week 6 News Investigation Hub
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Week 6 Integration Banner (Section 7.6) */}
      <div className="card p-4 bg-gradient-to-r from-indigo-50 via-white to-emerald-50 border-indigo-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Week 6 News Fact-Checking Integration Active
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {week6Articles.length} Real News Articles · {week6Claims.length} Extracted Claims ·{" "}
              {week6Claims.filter((c) => c.humanFinalStatus === "Verified").length} Verified ·{" "}
              {week6Claims.filter((c) => c.humanFinalStatus === "False").length} False ·{" "}
              {week6Claims.filter((c) => c.humanFinalStatus === "Misleading").length} Misleading ·{" "}
              {week6Claims.filter((c) => c.humanFinalStatus === "Partially True").length} Partially True ·{" "}
              <strong className="text-rose-700">{week6DisagreementRate}% AI–Human Disagreement Rate</strong>
            </p>
          </div>
          {onOpenWeek6 && (
            <button
              onClick={onOpenWeek6}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 whitespace-nowrap"
            >
              Inspect 50 Claims &amp; Evidence &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <KPICards claims={claims} sources={sources} />

      {/* Row 2: Donut + Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DonutChart claims={claims} />
        </div>
        <div className="lg:col-span-2">
          <BarCharts claims={claims} />
        </div>
      </div>

      {/* Row 3: Time Series + Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeSeriesChart claims={claims} />
        <SourceBreakdown sources={sources} />
      </div>

      {/* Row 4: Data Table */}
      <DataTable claims={claims} />
    </div>
  );
}
