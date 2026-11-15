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
            "border-rule bg-panel hover:border-ink text-ink";

          if (isSelected && !isSubmitted) {
            btnClass = "border-ink bg-panel-rich font-semibold text-ink";
          } else if (isTarget) {
            btnClass = "border-moos bg-panel-rich text-tannengruen font-semibold highlight-ending";
          } else if (isWrongSelection) {
            btnClass = "border-signalrot bg-panel-rich text-signalrot rotstift-strike";
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={isSubmitted}
              className={`p-3.5 rounded-sm border-2 text-left text-base transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
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
            className="btn btn-primary"
          >
            Antwort prüfen
          </button>
        </div>
      )}
    </div>
  );
}
