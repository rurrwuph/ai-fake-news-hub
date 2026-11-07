"use client";

import type { Override } from "@/lib/types";
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";
import clsx from "clsx";

interface OverrideAlertsProps {
  overrides: Override[];
}

const OVERRIDE_CONFIG: Record<
  Override["type"],
  {
    icon: typeof ShieldAlert;
    className: string;
    title: string;
  }
> = {
  HARD_FALSE: {
    icon: ShieldAlert,
    className: "override-critical",
    title: "Hard FALSE Override",
  },
  HARD_UNVERIFIABLE: {
    icon: AlertOctagon,
    className: "override-critical",
    title: "Hard UNVERIFIABLE Override",
  },
  HIGH_RISK_GATEWAY: {
    icon: AlertTriangle,
    className: "override-warning",
    title: "High-Risk Domain Gateway",
  },
  GENERAL_BOUNDARY: {
    icon: Info,
    className: "override-info",
    title: "General Boundary Check",
  },
};

const SEVERITY_LABELS: Record<Override["severity"], string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};

export default function OverrideAlerts({ overrides }: OverrideAlertsProps) {
  const visibleOverrides = overrides.filter(
    (o) => o.triggered || o.type === "GENERAL_BOUNDARY"
  );

  const hasNonGeneralOverride = overrides.some(
    (o) => o.triggered && o.type !== "GENERAL_BOUNDARY"
  );

  return (
    <div className="space-y-3">
      {!hasNonGeneralOverride && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span className="text-sm font-medium">
            No Safety Overrides Triggered
          </span>
        </div>
      )}

      {visibleOverrides.map((override) => {
        const config = OVERRIDE_CONFIG[override.type];
        const Icon = config.icon;

        return (
          <div
            key={override.type}
            className={clsx(config.className, "animate-fade-in")}
          >
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">
                    {config.title}
                  </span>
                  <span
                    className={clsx(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wide",
                      override.severity === "critical" &&
                        "bg-red-200 text-red-800",
                      override.severity === "warning" &&
                        "bg-amber-200 text-amber-800",
                      override.severity === "info" &&
                        "bg-blue-200 text-blue-800"
                    )}
                  >
                    {SEVERITY_LABELS[override.severity]}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{override.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
