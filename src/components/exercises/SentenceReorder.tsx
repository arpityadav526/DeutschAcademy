"use client";

import React, { useState, useEffect } from "react";
import { ExerciseItem } from "@/lib/types";
import { cleanGermanText } from "@/lib/diff";
import { RotateCcw } from "lucide-react";

interface SentenceReorderProps {
  exercise: ExerciseItem;
  onSubmitResult: (correct: boolean, explanation: string) => void;
  isSubmitted: boolean;
}

export function SentenceReorder({
  exercise,
  onSubmitResult,
  isSubmitted,
}: SentenceReorderProps) {
  // Available pool of words and arranged words
  const initialTokens = exercise.tokens || exercise.target.split(" ").sort(() => Math.random() - 0.5);

  const [availableTokens, setAvailableTokens] = useState<string[]>(initialTokens);
  const [placedTokens, setPlacedTokens] = useState<string[]>([]);

  useEffect(() => {
    // Reset if exercise changes
    setAvailableTokens(initialTokens);
    setPlacedTokens([]);
  }, [exercise]);

  const handlePickToken = (token: string, index: number) => {
    if (isSubmitted) return;
    const nextAvailable = [...availableTokens];
    nextAvailable.splice(index, 1);
    setAvailableTokens(nextAvailable);
    setPlacedTokens([...placedTokens, token]);
  };

  const handleRemoveToken = (token: string, index: number) => {
    if (isSubmitted) return;
    const nextPlaced = [...placedTokens];
    nextPlaced.splice(index, 1);
    setPlacedTokens(nextPlaced);
    setAvailableTokens([...availableTokens, token]);
  };

  const handleReset = () => {
    if (isSubmitted) return;
    setAvailableTokens(initialTokens);
    setPlacedTokens([]);
  };

  const handleSubmit = () => {
    if (placedTokens.length === 0 || isSubmitted) return;
    const builtSentence = placedTokens.join(" ");

    const cleanBuilt = cleanGermanText(builtSentence);
    const cleanTarget = cleanGermanText(exercise.target);

    const isMatch =
      cleanBuilt === cleanTarget ||
      (exercise.acceptableAnswers &&
        exercise.acceptableAnswers.some(
          (ans) => cleanGermanText(ans) === cleanBuilt
        ));

    onSubmitResult(Boolean(isMatch), exercise.explanation);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-slate-700">
        {exercise.instruction}
      </div>

      <div className="text-xs text-slate-500 italic">
        Translate or arrange for: &ldquo;{exercise.prompt}&rdquo;
      </div>

      {/* Assembly Area */}
      <div className="min-h-[70px] p-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/70 flex flex-wrap items-center gap-2">
        {placedTokens.length === 0 ? (
          <span className="text-xs text-slate-400 select-none">
            Click words from below to construct the German sentence in correct word order...
          </span>
        ) : (
          placedTokens.map((token, idx) => (
            <button
              key={`placed-${idx}`}
              type="button"
              disabled={isSubmitted}
              onClick={() => handleRemoveToken(token, idx)}
              className="px-3 py-1.5 rounded-md bg-white border border-slate-300 shadow-sm text-sm font-semibold text-slate-900 hover:border-red-400 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer group flex items-center gap-1.5"
            >
              <span>{token}</span>
              <span className="text-[10px] text-slate-400 group-hover:text-red-500 font-mono">
                {idx + 1}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Token Pool */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {availableTokens.map((token, idx) => (
          <button
            key={`pool-${idx}`}
            type="button"
            disabled={isSubmitted}
            onClick={() => handlePickToken(token, idx)}
            className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm font-medium text-slate-800 transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            {token}
          </button>
        ))}
      </div>

      {/* Actions */}
      {!isSubmitted && (
        <div className="flex items-center justify-between pt-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={placedTokens.length === 0}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset tiles</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={placedTokens.length === 0}
            className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            Check Word Order
          </button>
        </div>
      )}
    </div>
  );
}
