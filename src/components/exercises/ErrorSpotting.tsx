"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/types";

interface ErrorSpottingProps {
  exercise: ExerciseItem;
  onSubmitResult: (correct: boolean, explanation: string) => void;
  isSubmitted: boolean;
}

export function ErrorSpotting({
  exercise,
  onSubmitResult,
  isSubmitted,
}: ErrorSpottingProps) {
  const data = exercise.errorSpotting;
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | null>(null);
  const [correctionInput, setCorrectionInput] = useState("");

  if (!data) {
    return <div className="text-red-500">Missing error spotting data</div>;
  }

  const handleSelectToken = (idx: number) => {
    if (isSubmitted) return;
    setSelectedTokenIdx(idx);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTokenIdx === null || isSubmitted) return;

    const correctIndexMatched = selectedTokenIdx === data.errorIndex;
    const cleanCorrection = correctionInput.trim().toLowerCase();
    const cleanExpected = data.correctedToken.trim().toLowerCase();

    // Pass if user spotted the wrong word and gave the correct form
    const isSuccess =
      correctIndexMatched &&
      (cleanCorrection === cleanExpected || cleanCorrection.length === 0);

    onSubmitResult(isSuccess, data.explanation || exercise.explanation);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm font-medium text-slate-700">
        {exercise.instruction || "Identify the grammatical mistake in this sentence by clicking on the incorrect word:"}
      </div>

      <div className="text-xs text-slate-500 italic">{exercise.prompt}</div>

      {/* Sentence Tokens to Click */}
      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-wrap items-center gap-2">
        {data.tokens.map((token, idx) => {
          const isSelected = selectedTokenIdx === idx;
          const isTheError = idx === data.errorIndex;

          let badgeClass =
            "border-slate-300 bg-white text-slate-800 hover:border-slate-500";

          if (isSelected && !isSubmitted) {
            badgeClass = "border-slate-900 bg-slate-900 text-white font-semibold";
          } else if (isSubmitted) {
            if (isTheError) {
              badgeClass = "border-red-500 bg-red-100 text-red-900 font-bold underline decoration-wavy";
            } else if (isSelected && !isTheError) {
              badgeClass = "border-slate-300 bg-slate-200 text-slate-600 line-through";
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              onClick={() => handleSelectToken(idx)}
              className={`px-3 py-1.5 rounded-md border text-base font-serif transition-colors cursor-pointer ${badgeClass}`}
            >
              {token}
            </button>
          );
        })}
      </div>

      {/* Optional correction input */}
      {selectedTokenIdx !== null && !isSubmitted && (
        <div className="space-y-2 pt-2">
          <label className="text-xs font-medium text-slate-600">
            What should this word be replaced with? (Optional, or click Check)
          </label>
          <input
            type="text"
            value={correctionInput}
            onChange={(e) => setCorrectionInput(e.target.value)}
            placeholder={`Correct form for "${data.tokens[selectedTokenIdx]}"...`}
            className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:border-slate-800 focus:outline-none bg-white"
          />
        </div>
      )}

      {!isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={selectedTokenIdx === null}
            className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            Check Error
          </button>
        </div>
      )}
    </form>
  );
}
