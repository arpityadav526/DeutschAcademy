"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/types";
import { isAnswerCorrect } from "@/lib/diff";

interface ExerciseProps {
  exercise: ExerciseItem;
  onSubmitResult: (correct: boolean, explanation: string) => void;
  isSubmitted: boolean;
}

export function FillInBlank({ exercise, onSubmitResult, isSubmitted }: ExerciseProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isSubmitted) return;

    const { correct } = isAnswerCorrect(
      value,
      exercise.target,
      exercise.acceptableAnswers
    );
    onSubmitResult(correct, exercise.explanation);
  };

  // Render prompt with [ ... ] placeholder if provided
  const parts = exercise.prompt.split(/\[\s*\.{3}\s*\]|___/);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm font-semibold text-ink-soft">
        Übung · {exercise.instruction}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-base sm:text-lg text-slate-900 leading-relaxed font-serif">
        {parts.length > 1 ? (
          <span>
            {parts[0]}
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isSubmitted}
              placeholder="…"
              className="journey-blank inline-block mx-1.5 px-2 py-0.5 text-center min-w-[120px]"
              autoFocus
            />
            {parts[1]}
          </span>
        ) : (
          <div className="space-y-3 font-sans">
            <div>{exercise.prompt}</div>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isSubmitted}
              placeholder="Deutsche Antwort hier …"
              className="journey-blank w-full px-2 py-2 text-lg"
              autoFocus
            />
          </div>
        )}
      </div>

      {exercise.contextSentence && (
        <div className="text-xs text-slate-500 italic">
          Hinweis: {exercise.contextSentence}
        </div>
      )}

      {!isSubmitted && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!value.trim()}
            className="btn btn-primary"
          >
            Antwort prüfen
          </button>
        </div>
      )}
    </form>
  );
}
