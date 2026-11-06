"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ClaimVerification } from "@/lib/types";

interface TimeSeriesChartProps {
  claims: ClaimVerification[];
}

export default function TimeSeriesChart({ claims }: TimeSeriesChartProps) {
  const data = useMemo(() => {
    if (claims.length === 0) return [];

    // Sort claims by date
    const sorted = [...claims].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Build cumulative counts per date
    const dateMap = new Map<
      string,
      { total: number; verified: number; falseClaims: number }
    >();

    let cumTotal = 0;
    let cumVerified = 0;
    let cumFalse = 0;

    for (const claim of sorted) {
      const dateStr = new Date(claim.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      cumTotal++;
      if (claim.verificationStatus === "Verified") cumVerified++;
      if (claim.verificationStatus === "False") cumFalse++;

      dateMap.set(dateStr, {
        total: cumTotal,
        verified: cumVerified,
        falseClaims: cumFalse,
      });
    }

    return Array.from(dateMap.entries()).map(([date, counts]) => ({
      date,
      Total: counts.total,
      Verified: counts.verified,
      False: counts.falseClaims,
    }));
  }, [claims]);

  return (
    <div className="card p-6">
      <h3 className="section-title mb-1">Cumulative Investigations Over Time</h3>
      <p className="section-subtitle mb-4">
        Running totals of processed claims by outcome
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradVerified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradFalse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-xs text-slate-600 ml-1">{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="Total"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gradTotal)"
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="Verified"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradVerified)"
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="False"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#gradFalse)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
