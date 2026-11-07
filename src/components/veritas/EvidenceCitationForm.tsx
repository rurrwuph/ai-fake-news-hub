"use client";

import { useState } from "react";
import type { EvidenceCitation, SourceType } from "@/lib/types";
import { Plus, Trash2, CheckCircle2, XCircle, ExternalLink, BookOpen } from "lucide-react";
import clsx from "clsx";

interface EvidenceCitationFormProps {
  citations: EvidenceCitation[];
  onUpdate: (citations: EvidenceCitation[]) => void;
}

const SOURCE_TYPES: SourceType[] = [
  "Government/Statute",
  "Q1 Academic",
  "Multilateral Agency",
  "News Registry",
];

export default function EvidenceCitationForm({
  citations,
  onUpdate,
}: EvidenceCitationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceTitle, setSourceTitle] = useState("");
  const [publisher, setPublisher] = useState("");
  const [url, setUrl] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("Q1 Academic");
  const [publicationDate, setPublicationDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [supports, setSupports] = useState(true);

  const handleAddCitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTitle.trim() || !excerpt.trim()) return;

    const newCitation: EvidenceCitation = {
      id: `CIT-${Date.now()}`,
      sourceTitle: sourceTitle.trim(),
      publisher: publisher.trim() || "Independent Ledger",
      url: url.trim() || "https://doi.org/",
      sourceType,
      publicationDate: publicationDate || new Date().toISOString().split("T")[0],
      excerpt: excerpt.trim(),
      supports,
    };

    onUpdate([...citations, newCitation]);
    // Reset form
    setSourceTitle("");
    setPublisher("");
    setUrl("");
    setExcerpt("");
    setIsOpen(false);
  };

  const handleRemoveCitation = (id: string) => {
    onUpdate(citations.filter((c) => c.id !== id));
  };

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-semibold text-slate-900">
            Stage 5: Evidence Citations & Archival Ledger
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono">
            {citations.length} Citation{citations.length === 1 ? "" : "s"} Documented
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            {isOpen ? "Cancel" : "Add Citation"}
          </button>
        </div>
      </div>

      {/* Expandable Form */}
      {isOpen && (
        <form
          onSubmit={handleAddCitation}
          className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 animate-fade-in"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Source Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Science Journal Vol. 337 / WHO Report 2024"
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Publisher / Institution
              </label>
              <input
                type="text"
                placeholder="e.g. American Association for the Advancement of Science"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Source Type
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
                className="select-field text-xs"
              >
                {SOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Publication Date
              </label>
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Corroboration Stance
              </label>
              <div className="flex gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setSupports(true)}
                  className={clsx(
                    "flex-1 py-1.5 px-2 rounded text-xs font-medium border flex items-center justify-center gap-1",
                    supports
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Supports
                </button>
                <button
                  type="button"
                  onClick={() => setSupports(false)}
                  className={clsx(
                    "flex-1 py-1.5 px-2 rounded text-xs font-medium border flex items-center justify-center gap-1",
                    !supports
                      ? "bg-rose-50 border-rose-500 text-rose-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> Refutes
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL / DOI / Persistent Identifier
            </label>
            <input
              type="url"
              placeholder="https://doi.org/10.1126/science.1225829"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-field text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Exact Empirical Excerpt *
            </label>
            <textarea
              required
              rows={2}
              placeholder="Paste exact verbatim finding or statistical table excerpt from the primary document..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="input-field text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary text-xs py-1 px-3"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-1 px-3">
              Save Citation to Ledger
            </button>
          </div>
        </form>
      )}

      {/* Citations List */}
      <div className="space-y-2">
        {citations.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              No evidence citations recorded for this claim.
            </p>
            <p className="text-[11px] text-slate-400">
              Click &quot;Add Citation&quot; or load a pre-configured benchmark case.
            </p>
          </div>
        ) : (
          citations.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[10px]",
                      c.supports
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    )}
                  >
                    {c.supports ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-600" />
                    )}
                    {c.supports ? "Corroborates" : "Refutes"}
                  </span>
                  <span className="font-semibold text-slate-900">{c.sourceTitle}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600">{c.publisher}</span>
                  <span className="badge bg-slate-100 text-slate-700 text-[10px]">
                    {c.sourceType}
                  </span>
                  <span className="text-slate-400 text-[11px]">{c.publicationDate}</span>
                </div>

                <p className="text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100 font-serif">
                  &ldquo;{c.excerpt}&rdquo;
                </p>

                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline font-mono"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {c.url}
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRemoveCitation(c.id)}
                className="text-slate-400 hover:text-rose-600 p-1 self-start"
                title="Remove citation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

