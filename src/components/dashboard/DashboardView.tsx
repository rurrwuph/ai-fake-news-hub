"use client";

import { BarChart3 } from "lucide-react";
import type { ClaimVerification, SourceVerification } from "@/lib/types";

import KPICards from "./KPICards";
import DonutChart from "./DonutChart";
import BarCharts from "./BarCharts";
import TimeSeriesChart from "./TimeSeriesChart";
import SourceBreakdown from "./SourceBreakdown";
import DataTable from "./DataTable";

interface DashboardViewProps {
  claims: ClaimVerification[];
  sources: SourceVerification[];
}

export default function DashboardView({ claims, sources }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Real-time verification metrics and intelligence
          </p>
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
