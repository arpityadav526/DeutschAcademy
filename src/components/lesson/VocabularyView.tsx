"use client";

import React, { useState } from "react";
import { VocabularyItem } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface VocabularyViewProps {
  vocabulary: VocabularyItem[];
  onSaveToSRS?: (vocab: VocabularyItem) => void;
}

export function VocabularyView({ vocabulary, onSaveToSRS }: VocabularyViewProps) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const articleClass = (article?: string) => {
    switch (article) {
      case "der":
        return "gender-der";
      case "die":
        return "gender-die";
      case "das":
        return "gender-das";
      default:
        return "";
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
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="running-head">
          <span>Wortschatz · Karteikarten</span>
        </p>
        <h3 className="text-xl font-bold text-ink font-serif mt-4">
          Wortschatz im Kontext
        </h3>
        <p className="text-sm text-ink-soft">
          German vocabulary is always learned with its gender and inside a real sentence.
          Every card can be saved to your daily Wiederholung queue.
        </p>
      </header>

      {/* Karteikarten grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {vocabulary.map((v, idx) => {
          const itemKey = `${v.article || ""}-${v.word}`;
          const isSaved = savedIds.has(itemKey);

          return (
            <div key={idx} className="karteikarte space-y-2">
              {/* Above the rule: the word itself */}
              <div className="flex items-start justify-between gap-2 pb-3">
                <p className="text-lg font-serif text-ink">
                  {v.article && (
                    <span className={`${articleClass(v.article)} font-semibold mr-1.5`}>
                      {v.article}
                    </span>
                  )}
                  {v.word}
                  {v.plural && (
                    <span className="text-xs text-ink-soft font-sans ml-2">
                      (Pl. {v.plural})
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <AudioButton text={`${v.article ? v.article + " " : ""}${v.word}`} size="sm" />
                  <button
                    type="button"
                    onClick={() => handleSave(v)}
                    disabled={isSaved}
                    title={isSaved ? "Bereits zur Wiederholung gespeichert" : "Zur täglichen Wiederholung speichern"}
                    aria-label={isSaved ? "Bereits gespeichert" : "Zur Wiederholung speichern"}
                    className={`p-1 rounded-sm transition-colors ${
                      isSaved
                        ? "text-moos"
                        : "text-ink-soft hover:text-ink"
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

              {/* Below the rule: meaning and example in context */}
              <div className="pt-2 space-y-1.5">
                <p className="text-sm text-ink-soft">{v.english}</p>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="german-example !text-[1.02rem] text-ink">{v.exampleSentence}</p>
                  <AudioButton text={v.exampleSentence} size="sm" />
                </div>
                <p className="german-translation">{v.exampleTranslation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
