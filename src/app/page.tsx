"use client";

import { useState, useEffect } from "react";
import Sidebar, { type ViewTab } from "@/components/Sidebar";
import Week7ClassificationHub from "@/components/week7/Week7ClassificationHub";
import DashboardView from "@/components/dashboard/DashboardView";
import Week6InvestigationHub from "@/components/week6/Week6InvestigationHub";
import VeritasEngine from "@/components/veritas/VeritasEngine";
import DatabaseView from "@/components/database/DatabaseView";
import TestRunnerView from "@/components/testing/TestRunnerView";
import { claimVerificationData } from "@/data/claimVerification";
import { sourceVerificationData } from "@/data/sourceVerification";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ViewTab>("week7");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as ViewTab;
      if (tabParam && ["week7", "dashboard", "week6", "veritas", "database", "testing"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {activeTab === "week7" && <Week7ClassificationHub />}
        {activeTab === "dashboard" && (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <DashboardView
              claims={claimVerificationData}
              sources={sourceVerificationData}
              onOpenWeek6={() => setActiveTab("week6")}
            />
          </div>
        )}
        {activeTab === "week6" && <Week6InvestigationHub />}
        {activeTab === "veritas" && <VeritasEngine />}
        {activeTab === "database" && <DatabaseView />}
        {activeTab === "testing" && <TestRunnerView />}
      </main>
    </div>
  );
}
