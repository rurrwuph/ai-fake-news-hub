"use client";

import { useMemo } from "react";
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
import type { ClaimVerification, AITool, ClaimCategory } from "@/lib/types";

interface BarChartsProps {
  claims: ClaimVerification[];
}

const AI_TOOLS: AITool[] = ["ChatGPT", "Gemini 3.8 Flash", "DeepSeek"];
const CATEGORIES: ClaimCategory[] = [
  "Science",
  "Business",
  "History",
  "Technology",
  "Public Health",
  "General Knowledge",
];

const COLORS = {
  Verified: "#10b981",
  False: "#ef4444",
  Misleading: "#f59e0b",
};

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  fontSize: "13px",
};

export default function BarCharts({ claims }: BarChartsProps) {
  const toolData = useMemo(() => {
    return AI_TOOLS.map((tool) => {
      const toolClaims = claims.filter((c) => c.aiTool === tool);
      return {
        tool: tool === "Gemini 3.8 Flash" ? "Gemini" : tool,
        Verified: toolClaims.filter((c) => c.verificationStatus === "Verified").length,
        False: toolClaims.filter((c) => c.verificationStatus === "False").length,
        Misleading: toolClaims.filter((c) => c.verificationStatus === "Misleading").length,
      };
    });
  }, [claims]);

  const domainData = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catClaims = claims.filter((c) => c.category === cat);
      return {
        category: cat,
        Verified: catClaims.filter((c) => c.verificationStatus === "Verified").length,
        False: catClaims.filter((c) => c.verificationStatus === "False").length,
        Misleading: catClaims.filter((c) => c.verificationStatus === "Misleading").length,
      };
    });
  }, [claims]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Chart A: Grouped Bar — Accuracy by AI Tool */}
      <div className="card p-6">
        <h3 className="section-title mb-1">Accuracy Distribution by AI Tool</h3>
        <p className="section-subtitle mb-4">
          Verification outcomes per AI model
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={toolData} barGap={4} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="tool"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs text-slate-600 ml-1">{value}</span>
                )}
              />
              <Bar dataKey="Verified" fill={COLORS.Verified} radius={[4, 4, 0, 0]} />
              <Bar dataKey="False" fill={COLORS.False} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Misleading" fill={COLORS.Misleading} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart B: Stacked Bar — Hallucination Rate by Domain */}
      <div className="card p-6">
        <h3 className="section-title mb-1">Hallucination Rate by Domain</h3>
        <p className="section-subtitle mb-4">
          False &amp; misleading claims stacked by category
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={domainData} barGap={4} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => (
                  <span className="text-xs text-slate-600 ml-1">{value}</span>
                )}
              />
              <Bar dataKey="Verified" fill={COLORS.Verified} radius={[0, 0, 0, 0]} />
              <Bar dataKey="False" stackId="hallucination" fill={COLORS.False} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Misleading" stackId="hallucination" fill={COLORS.Misleading} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
