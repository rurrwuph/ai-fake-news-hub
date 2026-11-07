"use client";

import type { VQIResult } from "@/lib/types";
import { verdictColor } from "@/lib/vqiEngine";
import { AlertTriangle } from "lucide-react";
import clsx from "clsx";

interface ThresholdBarProps {
  result: VQIResult;
}

const ZONE_SEGMENTS = [
  { label: "False", from: 0, to: 49, color: "bg-red-500" },
  { label: "Misleading / Pending", from: 50, to: 84, color: "bg-amber-400" },
  { label: "Verified", from: 85, to: 100, color: "bg-emerald-500" },
];

function getBadgeClass(verdict: string): string {
  switch (verdict) {
    case "Verified":
      return "badge-verified";
    case "False":
      return "badge-false";
    case "Misleading":
      return "badge-misleading";
    case "Unverifiable":
      return "badge-unverifiable";
    default:
      return "badge-pending";
  }
}

export default function ThresholdBar({ result }: ThresholdBarProps) {
  const { totalScore, verdict, overrides } = result;
  const hasOverride = overrides.some(
    (o) => o.triggered && o.type !== "GENERAL_BOUNDARY"
  );
  const markerPosition = Math.min(Math.max(totalScore, 0), 100);

  return (
    <div className="card p-6 space-y-4">
      {/* Score + verdict header */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span
            className={clsx(
              "text-4xl font-bold font-mono",
              `text-${verdictColor(verdict)}`
            )}
          >
            {totalScore}
          </span>
          <span className="text-sm text-slate-500">/ 100</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={getBadgeClass(verdict)}>{verdict}</span>
          {hasOverride && (
            <span
              className="inline-flex items-center gap-1 text-xs text-amber-600"
              title="Override active"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Override
            </span>
          )}
        </div>
      </div>

      {/* Segmented bar */}
      <div className="relative">
        {/* Bar */}
        <div className="flex h-5 rounded-full overflow-hidden">
          {ZONE_SEGMENTS.map((zone) => (
            <div
              key={zone.label}
              className={clsx(zone.color, "relative")}
              style={{ width: `${zone.to - zone.from + 1}%` }}
            />
          ))}
        </div>

        {/* Boundary labels */}
        <div className="relative h-5">
          <span
            className="absolute text-[10px] font-medium text-slate-500 -translate-x-1/2"
            style={{ left: "50%" }}
          >
            50
          </span>
          <span
            className="absolute text-[10px] font-medium text-slate-500 -translate-x-1/2"
            style={{ left: "85%" }}
          >
            85
          </span>
        </div>

        {/* Marker */}
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out"
          style={{ left: `${markerPosition}%` }}
        >
          {/* Arrow */}
          <div className="w-3 h-3 bg-slate-800 rotate-45 -mb-1.5 shadow-md" />
          <div className="w-0.5 h-5 bg-slate-800" />
        </div>
      </div>

      {/* Zone labels */}
      <div className="flex text-[10px] font-medium text-slate-500">
        <div className="flex-[49]">
          <span className="text-red-600">0–49 False</span>
        </div>
        <div className="flex-[35] text-center">
          <span className="text-amber-600">50–84 Misleading/Pending</span>
        </div>
        <div className="flex-[16] text-right">
          <span className="text-emerald-600">85–100 Verified</span>
        </div>
      </div>
    </div>
  );
}
