"use client";

import React, { useState } from "react";
import { VocabularyItem } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import { Bookmark, BookmarkCheck, Check } from "lucide-react";

interface VocabularyViewProps {
  vocabulary: VocabularyItem[];
  onSaveToSRS?: (vocab: VocabularyItem) => void;
}

export function VocabularyView({ vocabulary, onSaveToSRS }: VocabularyViewProps) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const getArticleBadge = (article?: string) => {
    switch (article) {
      case "der":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "die":
        return "bg-red-100 text-red-800 border-red-300";
      case "das":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const handleSave = (item: VocabularyItem) => {
    const key = `${item.article || ""}-${item.word}`;
    const next = new Set(savedIds);
    next.add(key);
    setSavedIds(next);
    if (onSaveToSRS) {
      onSaveToSRS(item);
    }
  };

  return (
    <div className="space-y-6 my-6">
      <div className="border-b border-slate-200 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
            Thematic Vocabulary in Context
          </h3>
          <p className="text-xs text-slate-500">
            German vocabulary must always be learned with its grammatical gender and inside real sentences.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded">
          {vocabulary.length} core items
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vocabulary.map((v, idx) => {
          const itemKey = `${v.article || ""}-${v.word}`;
          const isSaved = savedIds.has(itemKey);

          return (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                {/* Header: German term + Audio + Save */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {v.article && (
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold border ${getArticleBadge(
                          v.article
                        )}`}
                      >
                        {v.article}
                      </span>
                    )}
                    <span className="text-base font-bold text-slate-900">
                      {v.word}
                    </span>
                    {v.plural && (
                      <span className="text-xs text-slate-500 font-mono">
                        (Pl. {v.plural})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <AudioButton text={`${v.article ? v.article + " " : ""}${v.word}`} size="sm" />
                    <button
                      type="button"
                      onClick={() => handleSave(v)}
                      disabled={isSaved}
                      title={isSaved ? "Saved to SRS review" : "Save to daily review queue"}
                      className={`p-1.5 rounded transition-colors text-xs ${
                        isSaved
                          ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent"
                      }`}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* English meaning */}
                <div className="text-sm font-medium text-slate-600 mt-1">
                  {v.english}
                </div>
              </div>

              {/* Context sentence */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-100 text-xs space-y-1">
                <div className="text-slate-900 font-medium flex items-center justify-between gap-2">
                  <span>{v.exampleSentence}</span>
                  <AudioButton text={v.exampleSentence} size="sm" />
                </div>
                <div className="text-slate-500 italic">
                  {v.exampleTranslation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
