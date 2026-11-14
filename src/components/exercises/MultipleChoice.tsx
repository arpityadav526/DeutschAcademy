"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/types";

interface MultipleChoiceProps {
  exercise: ExerciseItem;
  onSubmitResult: (correct: boolean, explanation: string) => void;
  isSubmitted: boolean;
}

export function MultipleChoice({
  exercise,
  onSubmitResult,
  isSubmitted,
}: MultipleChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    const isCorrect =
      selectedOption.trim().toLowerCase() === exercise.target.trim().toLowerCase();
    onSubmitResult(isCorrect, exercise.explanation);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-slate-700">
        {exercise.instruction}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-base font-medium text-slate-900 leading-relaxed">
        {exercise.prompt}
      </div>

      {exercise.contextSentence && (
        <div className="text-xs text-slate-500 italic">
          Context: {exercise.contextSentence}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {exercise.options?.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isTarget =
            isSubmitted &&
            option.trim().toLowerCase() === exercise.target.trim().toLowerCase();
          const isWrongSelection =
            isSubmitted && isSelected && !isTarget;

          let btnClass =
            "border-slate-200 bg-white hover:border-slate-400 text-slate-800";

          if (isSelected && !isSubmitted) {
            btnClass = "border-slate-900 bg-slate-100 font-semibold text-slate-900 ring-1 ring-slate-900";
          } else if (isTarget) {
            btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500";
          } else if (isWrongSelection) {
            btnClass = "border-red-400 bg-red-50 text-red-900 line-through ring-1 ring-red-400";
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={isSubmitted}
              className={`p-3.5 rounded-lg border text-left text-sm transition-all cursor-pointer shadow-sm flex items-center justify-between ${btnClass}`}
            >
              <span>{option}</span>
              <span className="text-xs font-mono text-slate-400 ml-2">
                {String.fromCharCode(65 + idx)}
              </span>
            </button>
          );
        })}
      </div>

      {!isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            Check Answer
          </button>
        </div>
      )}
    </div>
  );
}
