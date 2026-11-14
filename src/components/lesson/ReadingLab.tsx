"use client";

import React, { useState } from "react";
import { ReadingPassage } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import { Bookmark, BookmarkCheck, CheckCircle2, XCircle, Info } from "lucide-react";

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
    <div className="space-y-6 my-6">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          Graded Reading Comprehension
        </h3>
        <p className="text-xs text-slate-500">
          Click highlighted words to view grammar glosses. Save key sentences for your SM-2 spaced repetition queue.
        </p>
      </div>

      {/* Reading Text Container */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h4 className="text-base font-bold text-slate-900">{passage.title}</h4>
          <AudioButton text={passage.germanText} label="Listen to Passage" />
        </div>

        {/* Text paragraph with clickable words and sentence saving */}
        <div className="space-y-3 font-serif text-slate-800 text-base sm:text-lg leading-relaxed">
          {sentences.map((sentence, sIdx) => {
            const isSaved = savedSentences.has(sIdx);
            return (
              <div
                key={sIdx}
                className="group p-2 rounded hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
              >
                <div>
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
                            ? "cursor-pointer underline decoration-dotted decoration-indigo-400 hover:text-indigo-800 hover:bg-indigo-50 px-0.5 rounded transition-colors"
                            : ""
                        }`}
                      >
                        {token}
                      </span>
                    );
                  })}
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSave(sentence, sIdx)}
                    disabled={isSaved}
                    title={isSaved ? "Saved to SRS review" : "Save sentence to review queue"}
                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-200"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-emerald-600" />
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

        {/* Gloss popup panel */}
        {activeGloss && (
          <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <div className="font-bold text-indigo-950 text-sm">
                {activeGloss.word}:{" "}
                <span className="font-normal text-indigo-800">
                  {activeGloss.meaning}
                </span>
              </div>
              {activeGloss.grammarNote && (
                <div className="text-indigo-700 italic">
                  Grammar note: {activeGloss.grammarNote}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setActiveGloss(null)}
              className="text-indigo-400 hover:text-indigo-800 font-bold px-1.5 py-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* English summary toggle */}
        <details className="text-xs text-slate-600 pt-2 border-t border-slate-100">
          <summary className="cursor-pointer font-semibold text-slate-700 hover:text-slate-900">
            Show English Summary Translation
          </summary>
          <div className="mt-2 p-3 bg-slate-50 rounded border border-slate-200 leading-relaxed italic">
            {passage.englishSummary}
          </div>
        </details>
      </div>

      {/* Comprehension Questions */}
      {passage.comprehensionQuestions && passage.comprehensionQuestions.length > 0 && (
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Reading Comprehension Questions
          </h4>

          <div className="space-y-4">
            {passage.comprehensionQuestions.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              return (
                <div
                  key={qIdx}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {qIdx + 1}. {q.question}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      let optClass = "border-slate-200 hover:border-slate-300";
                      if (isSelected && !isAnswersChecked) {
                        optClass = "border-slate-800 bg-slate-50 font-semibold";
                      } else if (isAnswersChecked) {
                        if (isCorrect) {
                          optClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          optClass = "border-red-400 bg-red-50 text-red-900 line-through";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleAnswerSelect(qIdx, optIdx)}
                          className={`w-full p-2.5 rounded text-left text-xs sm:text-sm border transition-colors cursor-pointer flex items-center justify-between ${optClass}`}
                        >
                          <span>{opt}</span>
                          {isAnswersChecked && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswersChecked && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswersChecked && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="font-semibold text-slate-800">Explanation: </span>
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
              className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer shadow-sm transition-all"
            >
              Check Comprehension Answers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
