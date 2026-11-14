"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/types";
import { isAnswerCorrect } from "@/lib/diff";
import { ArrowRight } from "lucide-react";

interface TransformationProps {
  exercise: ExerciseItem;
  onSubmitResult: (correct: boolean, explanation: string) => void;
  isSubmitted: boolean;
}

export function Transformation({
  exercise,
  onSubmitResult,
  isSubmitted,
}: TransformationProps) {
  const [value, setValue] = useState("");
  const rule = exercise.transformationRule;

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm font-medium text-slate-700">
        {exercise.instruction}
      </div>

      {rule && (
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1.5 rounded w-fit">
          <span>{rule.from}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-indigo-700">{rule.to}</span>
        </div>
      )}

      {/* Base Sentence */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
          Base Sentence:
        </div>
        <div className="text-lg font-serif text-slate-900">
          {rule?.baseSentence || exercise.prompt}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600">
          Transformed German Sentence:
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isSubmitted}
          placeholder="Write the transformed German sentence..."
          className="w-full px-3 py-2 text-base font-serif rounded border-2 border-slate-300 focus:border-slate-800 focus:outline-none bg-white shadow-inner"
          autoFocus
        />
      </div>

      {!isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!value.trim()}
            className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            Check Transformation
          </button>
        </div>
      )}
    </form>
  );
}
