"use client";

import { useState } from "react";
import type { DecomposedSentence } from "@/lib/types";
import {
  SplitSquareHorizontal,
  Flag,
  Plus,
  Trash2,
  AlignLeft,
} from "lucide-react";
import clsx from "clsx";

interface SentenceDecomposerProps {
  sentences: DecomposedSentence[];
  onUpdate: (sentences: DecomposedSentence[]) => void;
}

const TYPE_COLORS: Record<DecomposedSentence["claimType"], string> = {
  factual: "border-l-blue-500",
  opinion: "border-l-purple-500",
  statistical: "border-l-emerald-500",
  contextual: "border-l-amber-500",
};

const TYPE_LABELS: Record<DecomposedSentence["claimType"], string> = {
  factual: "Factual",
  opinion: "Opinion",
  statistical: "Statistical",
  contextual: "Contextual",
};

export default function SentenceDecomposer({
  sentences,
  onUpdate,
}: SentenceDecomposerProps) {
  const [rawText, setRawText] = useState("");

  const flaggedCount = sentences.filter((s) => s.flagged).length;

  function decompose() {
    if (!rawText.trim()) return;
    const parts = rawText
      .split(/(?<=[.!?])\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const newSentences: DecomposedSentence[] = parts.map((text, i) => ({
      id: `s-${Date.now()}-${i}`,
      text,
      claimType: "factual" as const,
      flagged: false,
      notes: "",
    }));

    onUpdate([...sentences, ...newSentences]);
    setRawText("");
  }

  function updateSentence(id: string, patch: Partial<DecomposedSentence>) {
    onUpdate(
      sentences.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  }

  function removeSentence(id: string) {
    onUpdate(sentences.filter((s) => s.id !== id));
  }

  function addManual() {
    const newSentence: DecomposedSentence = {
      id: `s-${Date.now()}`,
      text: "",
      claimType: "factual",
      flagged: false,
      notes: "",
    };
    onUpdate([...sentences, newSentence]);
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            {sentences.length}
          </span>{" "}
          sentence{sentences.length !== 1 ? "s" : ""} decomposed
          {flaggedCount > 0 && (
            <>
              ,{" "}
              <span className="font-semibold text-red-600">
                {flaggedCount}
              </span>{" "}
              flagged
            </>
          )}
        </p>
      </div>

      {/* Input area */}
      <div className="card p-4 space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <AlignLeft className="h-4 w-4" />
          Paste AI response text
        </label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={4}
          placeholder="Paste the AI-generated text here to decompose into individual sentences…"
          className="input-field resize-y"
        />
        <div className="flex gap-2">
          <button
            onClick={decompose}
            disabled={!rawText.trim()}
            className="btn-primary"
          >
            <SplitSquareHorizontal className="h-4 w-4" />
            Decompose
          </button>
          <button onClick={addManual} className="btn-secondary">
            <Plus className="h-4 w-4" />
            Add Manually
          </button>
        </div>
      </div>

      {/* Sentence list */}
      {sentences.length > 0 && (
        <div className="space-y-2">
          {sentences.map((sentence) => (
            <div
              key={sentence.id}
              className={clsx(
                "card border-l-4 p-4 space-y-3 transition-colors duration-150",
                TYPE_COLORS[sentence.claimType],
                sentence.flagged && "bg-red-50/50"
              )}
            >
              {/* Sentence text */}
              <div className="flex items-start justify-between gap-3">
                <input
                  type="text"
                  value={sentence.text}
                  onChange={(e) =>
                    updateSentence(sentence.id, { text: e.target.value })
                  }
                  placeholder="Sentence text…"
                  className="input-field flex-1 text-sm"
                />
                <button
                  onClick={() => removeSentence(sentence.id)}
                  className="btn-ghost text-slate-400 hover:text-red-500 shrink-0"
                  title="Remove sentence"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Type dropdown */}
                <select
                  value={sentence.claimType}
                  onChange={(e) =>
                    updateSentence(sentence.id, {
                      claimType: e.target
                        .value as DecomposedSentence["claimType"],
                    })
                  }
                  className="select-field w-36 text-xs"
                >
                  {(
                    Object.keys(TYPE_LABELS) as DecomposedSentence["claimType"][]
                  ).map((type) => (
                    <option key={type} value={type}>
                      {TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>

                {/* Flag toggle */}
                <button
                  onClick={() =>
                    updateSentence(sentence.id, {
                      flagged: !sentence.flagged,
                    })
                  }
                  className={clsx(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150",
                    sentence.flagged
                      ? "bg-red-100 text-red-700 border-red-300"
                      : "bg-white text-slate-500 border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <Flag className="h-3 w-3" />
                  {sentence.flagged ? "Flagged" : "Flag"}
                </button>

                {/* Notes */}
                <input
                  type="text"
                  value={sentence.notes}
                  onChange={(e) =>
                    updateSentence(sentence.id, { notes: e.target.value })
                  }
                  placeholder="Notes…"
                  className="input-field flex-1 text-xs min-w-[140px]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
