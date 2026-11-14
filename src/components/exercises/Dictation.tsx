"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/types";
import { AudioButton } from "../lesson/AudioButton";
import { isAnswerCorrect } from "@/lib/diff";

interface DictationProps {
  exercise: ExerciseItem;
  onSubmitResult: (correct: boolean, explanation: string) => void;
  isSubmitted: boolean;
}

export function Dictation({
  exercise,
  onSubmitResult,
  isSubmitted,
}: DictationProps) {
  const [value, setValue] = useState("");
  const audioText = exercise.audioText || exercise.target;

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
        {exercise.instruction || "Listen to the German audio carefully and write what you hear:"}
      </div>

      {/* Audio Playback Center */}
      <div className="p-6 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 text-center">
        <div className="text-xs text-slate-500">
          Play the recording as many times as needed (use 0.75x if too fast):
        </div>
        <AudioButton text={audioText} size="lg" label="Play Audio Dictation" />
      </div>

      {/* German input */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-600">
          Transcribe in German (remember that all German nouns are capitalized!):
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isSubmitted}
          placeholder="Type what you hear..."
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
            Check Dictation
          </button>
        </div>
      )}
    </form>
  );
}
