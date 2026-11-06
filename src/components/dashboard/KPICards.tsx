"use client";

import { useMemo } from "react";
import {
  FileCheck,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  HelpCircle,
  Clock,
  FileWarning,
} from "lucide-react";
import type { ClaimVerification, SourceVerification } from "@/lib/types";

interface KPICardsProps {
  claims: ClaimVerification[];
  sources: SourceVerification[];
}

export default function KPICards({ claims, sources }: KPICardsProps) {
  const stats = useMemo(() => {
    const total = claims.length;
    const verified = claims.filter((c) => c.verificationStatus === "Verified").length;
    const falseClaims = claims.filter((c) => c.verificationStatus === "False").length;
    const misleading = claims.filter((c) => c.verificationStatus === "Misleading").length;
    const unverifiable = claims.filter((c) => c.verificationStatus === "Unverifiable").length;
    const pending = claims.filter((c) => c.verificationStatus === "Pending").length;
    const fabricatedSources = sources.filter((s) => s.sourceStatus === "Fabricated Source").length;

    return { total, verified, falseClaims, misleading, unverifiable, pending, fabricatedSources };
  }, [claims, sources]);

  const cards = [
    {
      label: "Total Claims Submitted",
      count: stats.total,
      icon: FileCheck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      barColor: "bg-indigo-500",
      percentage: 100,
    },
    {
      label: "Verified",
      count: stats.verified,
      icon: ShieldCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      barColor: "bg-emerald-500",
      percentage: stats.total ? (stats.verified / stats.total) * 100 : 0,
    },
    {
      label: "False",
      count: stats.falseClaims,
      icon: ShieldX,
      color: "text-red-600",
      bgColor: "bg-red-50",
      barColor: "bg-red-500",
      percentage: stats.total ? (stats.falseClaims / stats.total) * 100 : 0,
    },
    {
      label: "Misleading",
      count: stats.misleading,
      icon: AlertTriangle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      barColor: "bg-amber-500",
      percentage: stats.total ? (stats.misleading / stats.total) * 100 : 0,
    },
    {
      label: "Unverifiable",
      count: stats.unverifiable,
      icon: HelpCircle,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      barColor: "bg-slate-500",
      percentage: stats.total ? (stats.unverifiable / stats.total) * 100 : 0,
    },
    {
      label: "Pending",
      count: stats.pending,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      barColor: "bg-blue-500",
      percentage: stats.total ? (stats.pending / stats.total) * 100 : 0,
    },
    {
      label: "Fabricated Sources",
      count: stats.fabricatedSources,
      icon: FileWarning,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      barColor: "bg-rose-500",
      percentage: sources.length ? (stats.fabricatedSources / sources.length) * 100 : 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="kpi-card">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 truncate">
                  {card.label}
                </p>
                <p className={`mt-1 text-2xl font-bold ${card.color}`}>
                  {card.count}
                </p>
              </div>
              <div className={`flex-shrink-0 p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{card.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${card.barColor}`}
                  style={{ width: `${Math.min(card.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
