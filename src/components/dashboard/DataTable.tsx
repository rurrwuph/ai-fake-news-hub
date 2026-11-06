"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { ClaimVerification, VerificationStatus } from "@/lib/types";

interface DataTableProps {
  claims: ClaimVerification[];
}

type SortField = "date" | "verificationStatus" | "confidence";
type SortDir = "asc" | "desc";

const STATUS_ORDER: Record<VerificationStatus, number> = {
  Verified: 0,
  False: 1,
  Misleading: 2,
  Unverifiable: 3,
  Pending: 4,
};

const BADGE_CLASS: Record<VerificationStatus, string> = {
  Verified: "badge-verified",
  False: "badge-false",
  Misleading: "badge-misleading",
  Unverifiable: "badge-unverifiable",
  Pending: "badge-pending",
};

const STATUSES: VerificationStatus[] = [
  "Verified",
  "False",
  "Misleading",
  "Unverifiable",
  "Pending",
];

const PAGE_SIZE = 10;

export default function DataTable({ claims }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "All">("All");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
      setPage(0);
    },
    [sortField]
  );

  const filtered = useMemo(() => {
    let result = [...claims];

    // Filter by status
    if (statusFilter !== "All") {
      result = result.filter((c) => c.verificationStatus === statusFilter);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.claim.toLowerCase().includes(q) ||
          c.claimId.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === "verificationStatus") {
        cmp = STATUS_ORDER[a.verificationStatus] - STATUS_ORDER[b.verificationStatus];
      } else if (sortField === "confidence") {
        const order = { High: 0, Medium: 1, Low: 2 };
        cmp = order[a.confidence] - order[b.confidence];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [claims, statusFilter, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 text-slate-300" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-indigo-600" />
    ) : (
      <ChevronDown className="h-3 w-3 text-indigo-600" />
    );
  };

  return (
    <div className="card">
      {/* Header & Controls */}
      <div className="p-6 border-b border-slate-200">
        <h3 className="section-title mb-1">Recent Adjudicated Claims</h3>
        <p className="section-subtitle mb-4">
          Browse, filter, and search all processed claims
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search claims..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="input-field pl-9"
            />
          </div>

          {/* Status filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                setStatusFilter("All");
                setPage(0);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                statusFilter === "All"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">
                Claim ID
              </th>
              <th
                className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none"
                onClick={() => toggleSort("date")}
              >
                <span className="inline-flex items-center gap-1">
                  Date <SortIcon field="date" />
                </span>
              </th>
              <th className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider min-w-[240px]">
                Claim
              </th>
              <th className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">
                AI Tool
              </th>
              <th
                className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none"
                onClick={() => toggleSort("verificationStatus")}
              >
                <span className="inline-flex items-center gap-1">
                  Status <SortIcon field="verificationStatus" />
                </span>
              </th>
              <th
                className="px-6 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none"
                onClick={() => toggleSort("confidence")}
              >
                <span className="inline-flex items-center gap-1">
                  Confidence <SortIcon field="confidence" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                  No claims match your filters.
                </td>
              </tr>
            ) : (
              paged.map((claim, idx) => (
                <tr
                  key={claim.claimId}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  } hover:bg-slate-50 transition-colors`}
                >
                  <td className="px-6 py-3 font-mono text-xs text-slate-500">
                    {claim.claimId}
                  </td>
                  <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                    {new Date(claim.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3 text-slate-800 max-w-xs">
                    <span title={claim.claim}>
                      {claim.claim.length > 60
                        ? claim.claim.slice(0, 60) + "…"
                        : claim.claim}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                    {claim.category}
                  </td>
                  <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                    {claim.aiTool}
                  </td>
                  <td className="px-6 py-3">
                    <span className={BADGE_CLASS[claim.verificationStatus]}>
                      {claim.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{claim.confidence}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">
            {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-slate-700">
            {Math.min((page + 1) * PAGE_SIZE, filtered.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700">{filtered.length}</span>{" "}
          results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-secondary px-2 py-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-slate-600">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="btn-secondary px-2 py-1.5"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
