"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SourceVerification, SourceStatus } from "@/lib/types";

interface SourceBreakdownProps {
  sources: SourceVerification[];
}

const STATUS_COLORS: Record<SourceStatus, string> = {
  Verified: "#10b981",
  "Real but Misrepresented": "#f59e0b",
  "Fabricated Source": "#ef4444",
  "Unable to Verify": "#64748b",
};

const SOURCE_STATUSES: SourceStatus[] = [
  "Verified",
  "Real but Misrepresented",
  "Fabricated Source",
  "Unable to Verify",
];

export default function SourceBreakdown({ sources }: SourceBreakdownProps) {
  const data = useMemo(() => {
    return SOURCE_STATUSES.map((status) => ({
      name: status,
      count: sources.filter((s) => s.sourceStatus === status).length,
      fill: STATUS_COLORS[status],
    }));
  }, [sources]);

  return (
    <div className="card p-6">
      <h3 className="section-title mb-1">Source Verification Breakdown</h3>
      <p className="section-subtitle mb-4">
        Authenticity assessment of cited sources
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              width={150}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`${value} sources`, "Count"]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
