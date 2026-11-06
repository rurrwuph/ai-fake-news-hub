"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ClaimVerification, VerificationStatus } from "@/lib/types";

interface DonutChartProps {
  claims: ClaimVerification[];
}

const STATUS_COLORS: Record<VerificationStatus, string> = {
  Verified: "#10b981",
  False: "#ef4444",
  Misleading: "#f59e0b",
  Unverifiable: "#64748b",
  Pending: "#3b82f6",
};

const STATUSES: VerificationStatus[] = [
  "Verified",
  "False",
  "Misleading",
  "Unverifiable",
  "Pending",
];

export default function DonutChart({ claims }: DonutChartProps) {
  const data = useMemo(() => {
    return STATUSES.map((status) => ({
      name: status,
      value: claims.filter((c) => c.verificationStatus === status).length,
    })).filter((d) => d.value > 0);
  }, [claims]);

  const total = claims.length;

  return (
    <div className="card p-6">
      <h3 className="section-title mb-1">Claims by Verification Status</h3>
      <p className="section-subtitle mb-4">
        Distribution across all verification outcomes
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.name as VerificationStatus]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: number, name: string) => [
                `${value} (${total ? ((value / total) * 100).toFixed(1) : 0}%)`,
                name,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-xs text-slate-600 ml-1">{value}</span>
              )}
            />
            {/* Center label */}
            <text
              x="50%"
              y="42%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-900"
              style={{ fontSize: "28px", fontWeight: 700 }}
            >
              {total}
            </text>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-500"
              style={{ fontSize: "12px", fontWeight: 400 }}
            >
              Total Claims
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
