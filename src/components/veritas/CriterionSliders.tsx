"use client";

import type { VQICriteria } from "@/lib/types";
import { VQI_MAX, VQI_LABELS } from "@/lib/types";
import clsx from "clsx";

interface CriterionSlidersProps {
  criteria: VQICriteria;
  onChange: (criteria: VQICriteria) => void;
}

type CriterionKey = keyof VQICriteria;

interface ThresholdMarker {
  value: number;
  color: "red" | "amber";
  label: string;
}

const THRESHOLD_MARKERS: Partial<Record<CriterionKey, ThresholdMarker[]>> = {
  factualAccuracy: [
    { value: 10, color: "red", label: "Hard FALSE" },
    { value: 22, color: "amber", label: "Verified" },
  ],
  sourceReliability: [
    { value: 16, color: "amber", label: "Verified" },
    { value: 18, color: "amber", label: "High-Risk" },
  ],
  contextualAccuracy: [
    { value: 8, color: "amber", label: "Misleading" },
  ],
  evidenceSufficiency: [
    { value: 4, color: "red", label: "Unverifiable" },
  ],
};

const CRITERION_ORDER: CriterionKey[] = [
  "factualAccuracy",
  "sourceReliability",
  "statisticalAccuracy",
  "contextualAccuracy",
  "biasAssessment",
  "informationRecency",
  "evidenceSufficiency",
];

function getFillColor(value: number, max: number): string {
  const pct = value / max;
  if (pct >= 0.75) return "bg-emerald-500";
  if (pct >= 0.4) return "bg-amber-500";
  return "bg-red-500";
}

function getFillTextColor(value: number, max: number): string {
  const pct = value / max;
  if (pct >= 0.75) return "text-emerald-700";
  if (pct >= 0.4) return "text-amber-700";
  return "text-red-700";
}

export default function CriterionSliders({
  criteria,
  onChange,
}: CriterionSlidersProps) {
  const totalScore = CRITERION_ORDER.reduce(
    (sum, key) => sum + criteria[key],
    0
  );

  function handleChange(key: CriterionKey, value: number) {
    onChange({ ...criteria, [key]: value });
  }

  return (
    <div className="space-y-5">
      {CRITERION_ORDER.map((key) => {
        const max = VQI_MAX[key];
        const value = criteria[key];
        const pct = (value / max) * 100;
        const markers = THRESHOLD_MARKERS[key] || [];

        return (
          <div key={key} className="card p-4 space-y-2">
            {/* Label row */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                {VQI_LABELS[key]}
              </label>
              <span
                className={clsx(
                  "text-sm font-semibold font-mono",
                  getFillTextColor(value, max)
                )}
              >
                {value} / {max}
              </span>
            </div>

            {/* Fill bar */}
            <div className="relative h-2 bg-slate-100 rounded-full overflow-visible">
              <div
                className={clsx(
                  "h-full rounded-full transition-all duration-200",
                  getFillColor(value, max)
                )}
                style={{ width: `${pct}%` }}
              />
              {/* Threshold markers */}
              {markers.map((m) => (
                <div
                  key={m.label}
                  className="absolute top-0 h-full flex flex-col items-center"
                  style={{ left: `${(m.value / max) * 100}%` }}
                >
                  <div
                    className={clsx(
                      "w-0.5 h-full",
                      m.color === "red" ? "bg-red-400" : "bg-amber-400"
                    )}
                  />
                  <span
                    className={clsx(
                      "text-[9px] mt-0.5 whitespace-nowrap font-medium",
                      m.color === "red" ? "text-red-500" : "text-amber-500"
                    )}
                  >
                    {m.value} — {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Range slider */}
            <input
              type="range"
              min={0}
              max={max}
              value={value}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="slider-track w-full mt-1"
            />
          </div>
        );
      })}

      {/* Total score */}
      <div className="card-elevated p-5 flex items-center justify-between">
        <span className="text-base font-semibold text-slate-800">
          Total VQI Score
        </span>
        <span
          className={clsx(
            "text-2xl font-bold font-mono",
            getFillTextColor(totalScore, 100)
          )}
        >
          {totalScore}
          <span className="text-sm font-normal text-slate-400 ml-1">
            / 100
          </span>
        </span>
      </div>
    </div>
  );
}
