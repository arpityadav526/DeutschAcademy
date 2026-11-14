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
      <div className="text-sm font-medium text-slate-700">
        {exercise.instruction}
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
              placeholder="?"
              className="inline-block mx-1.5 px-3 py-1 text-center font-sans font-medium text-base rounded border-2 border-slate-300 focus:border-slate-800 focus:outline-none bg-white min-w-[120px] shadow-inner transition-colors"
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
              placeholder="Enter German answer..."
              className="w-full px-3 py-2 text-base rounded border-2 border-slate-300 focus:border-slate-800 focus:outline-none bg-white shadow-inner"
              autoFocus
            />
          </div>
        )}
      </div>

      {exercise.contextSentence && (
        <div className="text-xs text-slate-500 italic">
          Context hint: {exercise.contextSentence}
        </div>
      )}

      {!isSubmitted && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!value.trim()}
            className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            Check Answer
          </button>
        </div>
      )}
    </form>
  );
}
