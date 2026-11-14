"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/types";
import { isAnswerCorrect, compareSpokenToTarget } from "@/lib/diff";

interface SmartTranslationProps {
  exercise: ExerciseItem;
  onSubmitResult: (correct: boolean, explanation: string) => void;
  isSubmitted: boolean;
}

export function SmartTranslation({
  exercise,
  onSubmitResult,
  isSubmitted,
}: SmartTranslationProps) {
  const [input, setInput] = useState("");
  const [diffResult, setDiffResult] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitted) return;

    const { correct, matchedVariant } = isAnswerCorrect(
      input,
      exercise.target,
      exercise.acceptableAnswers
    );

    const diff = compareSpokenToTarget(matchedVariant || exercise.target, input);
    setDiffResult(diff);

    onSubmitResult(correct, exercise.explanation);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm font-medium text-slate-700">
        {exercise.instruction || "Translate the following sentence into German:"}
      </div>

      {/* English prompt */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
          English Prompt:
        </div>
        <div className="text-lg font-medium text-slate-900">
          &ldquo;{exercise.prompt}&rdquo;
        </div>
      </div>

      {exercise.contextSentence && (
        <div className="text-xs text-slate-500 italic">
          Hint: {exercise.contextSentence}
        </div>
      )}

      {/* German input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600">
          Your German Translation:
        </label>
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSubmitted}
          placeholder="Type the full German sentence..."
          className="w-full px-3 py-2 text-base font-serif rounded border-2 border-slate-300 focus:border-slate-800 focus:outline-none bg-white shadow-inner resize-none"
          autoFocus
        />
      </div>

      {/* Word-level diff display after submission if not fully correct */}
      {isSubmitted && diffResult && !diffResult.isPassing && (
        <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs space-y-1">
          <div className="font-semibold text-amber-900">Word Comparison:</div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {diffResult.wordDiffs.map((d: any, idx: number) => (
              <span
                key={idx}
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                  d.status === "match"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : d.status === "missing"
                    ? "bg-amber-100 text-amber-800 border border-amber-300 line-through"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {d.spoken || d.expected}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            Check Translation
          </button>
        </div>
      )}
    </form>
  );
}
