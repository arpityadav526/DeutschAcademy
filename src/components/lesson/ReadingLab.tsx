"use client";

import React, { useState } from "react";
import { ReadingPassage } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface ReadingLabProps {
  passage: ReadingPassage;
  onSaveSentence?: (germanSentence: string, englishTranslation: string) => void;
}

export function ReadingLab({ passage, onSaveSentence }: ReadingLabProps) {
  const [activeGloss, setActiveGloss] = useState<{
    word: string;
    meaning: string;
    grammarNote?: string;
  } | null>(null);

  const [savedSentences, setSavedSentences] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswersChecked, setIsAnswersChecked] = useState(false);

  // Split passage into sentences for "save sentence" capability
  const sentences = passage.germanText
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  const handleSave = (sentence: string, index: number) => {
    const next = new Set(savedSentences);
    next.add(index);
    setSavedSentences(next);
    if (onSaveSentence) {
      onSaveSentence(sentence, passage.englishSummary);
    }
  };

  const handleAnswerSelect = (qIdx: number, optIdx: number) => {
    if (isAnswersChecked) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  const checkGloss = (word: string) => {
    const clean = word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"'„“»«]/g, "");
    const match = passage.glossary.find(
      (g) => g.word.toLowerCase() === clean || clean.startsWith(g.word.toLowerCase())
    );
    if (match) {
      setActiveGloss(match);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="running-head">
          <span>Leseverstehen · Text</span>
        </p>
        <h3 className="text-xl font-bold text-ink font-serif mt-4">
          {passage.title}
        </h3>
        <p className="text-sm text-ink-soft">
          Click dotted-underlined words for a gloss. Save key sentences for your Wiederholung queue.
        </p>
      </header>

      {/* Reading text — book page */}
      <div className="space-y-3">
        <div className="flex justify-end">
          <AudioButton text={passage.germanText} label="Text vorlesen" />
        </div>

        <div className="reading-copy">
          {sentences.map((sentence, sIdx) => {
            const isSaved = savedSentences.has(sIdx);
            return (
              <div
                key={sIdx}
                className="group flex items-start justify-between gap-3 py-1"
              >
                <p className="german-example text-ink">
                  {sentence.split(" ").map((token, wIdx) => {
                    const clean = token.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"'„“»«]/g, "");
                    const isGlossed = passage.glossary.some(
                      (g) => g.word.toLowerCase() === clean
                    );

                    return (
                      <span
                        key={wIdx}
                        onClick={() => isGlossed && checkGloss(token)}
                        className={`mr-1 inline-block ${
                          isGlossed
                            ? "cursor-pointer underline decoration-dotted decoration-tintenblau underline-offset-4 hover:text-tintenblau"
                            : ""
                        }`}
                      >
                        {token}
                      </span>
                    );
                  })}
                </p>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSave(sentence, sIdx)}
                    disabled={isSaved}
                    title={isSaved ? "Bereits gespeichert" : "Satz zur Wiederholung speichern"}
                    aria-label={isSaved ? "Bereits gespeichert" : "Satz speichern"}
                    className="p-1 text-ink-soft hover:text-ink"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-moos" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                  <AudioButton text={sentence} size="sm" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Gloss — dictionary-style aside */}
        {activeGloss && (
          <div className="margin-note max-w-md fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p>
                  <strong className="text-ink font-serif">{activeGloss.word}</strong>{" "}
                  — {activeGloss.meaning}
                </p>
                {activeGloss.grammarNote && (
                  <p className="italic">Grammatik: {activeGloss.grammarNote}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveGloss(null)}
                aria-label="Glossar schließen"
                className="text-ink-soft hover:text-ink font-bold px-1"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* English summary */}
        <details className="text-sm text-ink-soft pt-2 border-t border-rule">
          <summary className="cursor-pointer font-semibold text-ink">
            Englische Übersetzung anzeigen
          </summary>
          <div className="mt-2 german-translation leading-relaxed">
            {passage.englishSummary}
          </div>
        </details>
      </div>

      {/* Comprehension questions — workbook page */}
      {passage.comprehensionQuestions && passage.comprehensionQuestions.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-rule">
          <p className="eyebrow smallcaps">
            Übung · Verständnisfragen
          </p>

          <div className="space-y-5">
            {passage.comprehensionQuestions.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              return (
                <div key={qIdx} className="space-y-2">
                  <p className="text-sm font-medium text-ink font-serif">
                    <span className="paragraph-num mr-1.5">{qIdx + 1}.</span>
                    {q.question}
                  </p>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      let optClass = "border-transparent text-ink";
                      if (isSelected && !isAnswersChecked) {
                        optClass = "border-rule bg-paper-deep font-medium";
                      } else if (isAnswersChecked) {
                        if (isCorrect) {
                          optClass = "border-moos text-moos font-medium highlight-ending";
                        } else if (isSelected && !isCorrect) {
                          optClass = "rotstift-strike text-ink-soft";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleAnswerSelect(qIdx, optIdx)}
                          className={`w-full p-2 text-left text-sm border rounded-sm transition-colors flex items-center justify-between ${optClass}`}
                        >
                          <span>{opt}</span>
                          {isAnswersChecked && isCorrect && (
                            <span className="moos-tick text-lg leading-none">✓</span>
                          )}
                          {isAnswersChecked && isSelected && !isCorrect && (
                            <span className="margin-red text-xs">vgl. Text</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswersChecked && (
                    <div className="margin-note fade-in max-w-xl">
                      <span className="margin-note-label block">Erklärung</span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setIsAnswersChecked(true)}
              disabled={
                isAnswersChecked ||
                Object.keys(selectedAnswers).length <
                  passage.comprehensionQuestions.length
              }
              className="btn btn-primary"
            >
              Antworten prüfen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
