"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  LayoutDashboard,
  ShieldCheck,
  Database,
  FileSearch,
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Newspaper,
} from "lucide-react";

export type ViewTab = "dashboard" | "week6" | "veritas" | "database" | "testing";

interface SidebarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
}

const NAV_ITEMS: { id: ViewTab; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "dashboard",
    label: "Analytics Dashboard",
    icon: <LayoutDashboard size={20} />,
    description: "Looker Studio BI & KPIs",
  },
  {
    id: "week6",
    label: "News Fact-Checking",
    icon: <Newspaper size={20} />,
    description: "Week 6: 50 Claims & Evidence",
  },
  {
    id: "veritas",
    label: "VeritasAI Engine",
    icon: <ShieldCheck size={20} />,
    description: "7-Stage VQI Pipeline",
  },
  {
    id: "database",
    label: "Relational Data Hub",
    icon: <Database size={20} />,
    description: "5-Sheet Schema Ledger",
  },
  {
    id: "testing",
    label: "Testing & Validation",
    icon: <FlaskConical size={20} />,
    description: "Automated Suite (TC01-05)",
  },
];

const DATA_TABLES = [
  { icon: <Database size={15} />, label: "Claim_Verification", count: 82 },
  { icon: <FileSearch size={15} />, label: "Source_Verification", count: 74 },
  { icon: <BarChart3 size={15} />, label: "AI_vs_Human_Audit", count: 50 },
  { icon: <Brain size={15} />, label: "News_Investigations", count: 13 },
  { icon: <Brain size={15} />, label: "Evidence_Repository", count: 50 },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "flex flex-col bg-white border-r border-slate-200 transition-all duration-200 h-full flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg flex-shrink-0 text-white shadow-sm">
          <ShieldCheck size={18} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight truncate">
              AI Fake News Hub
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              YSSE Dept. of IT
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <p
          className={clsx(
            "px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400",
            collapsed && "sr-only"
          )}
        >
          Ecosystem Modules
        </p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={clsx(
              "flex items-center w-full gap-3 px-3 py-2.5 rounded-md text-left transition-colors duration-150",
              activeTab === item.id
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="block text-sm truncate">{item.label}</span>
                <span className="block text-[11px] text-slate-400 font-normal truncate">
                  {item.description}
                </span>
              </div>
            )}
          </button>
        ))}

        {/* Data tables section */}
        {!collapsed && (
          <>
            <div className="pt-6 pb-2">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                5-Sheet Database Schema
              </p>
            </div>
            {DATA_TABLES.map((table) => (
              <button
                key={table.label}
                onClick={() => onTabChange("database")}
                className="flex items-center gap-2.5 px-3 py-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-md w-full transition-colors text-left"
              >
                <span className="flex-shrink-0 text-slate-400">{table.icon}</span>
                <span className="text-xs truncate font-mono">{table.label}</span>
                <span className="ml-auto text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {table.count}
                </span>
              </button>
            ))}
          </>
        )}
      </nav>

      {/* Collapse button */}
      <div className="px-2 py-3 border-t border-slate-100">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full gap-2 px-3 py-2 text-xs text-slate-500 rounded-md hover:bg-slate-50 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
