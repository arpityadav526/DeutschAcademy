"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/types";
import { FillInBlank } from "./FillInBlank";
import { MultipleChoice } from "./MultipleChoice";
import { SentenceReorder } from "./SentenceReorder";
import { TableCompletion } from "./TableCompletion";
import { ErrorSpotting } from "./ErrorSpotting";
import { Transformation } from "./Transformation";
import { SmartTranslation } from "./SmartTranslation";
import { Dictation } from "./Dictation";
import { SpeakingPractice } from "./SpeakingPractice";
import { CheckCircle2, XCircle, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface ExerciseContainerProps {
  exercise: ExerciseItem;
  exerciseIndex: number;
  totalExercises: number;
  onComplete: (isCorrect: boolean, exercise: ExerciseItem) => void;
}

export function ExerciseContainer({
  exercise,
  exerciseIndex,
  totalExercises,
  onComplete,
}: ExerciseContainerProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState<string>("");

  const handleResult = (correct: boolean, expl: string) => {
    setIsSubmitted(true);
    setIsCorrect(correct);
    setExplanation(expl);
  };

  const handleNext = () => {
    if (isCorrect !== null) {
      onComplete(isCorrect, exercise);
      // Reset for next
      setIsSubmitted(false);
      setIsCorrect(null);
      setExplanation("");
    }
  };

  const formatExerciseType = (type: string) => {
    switch (type) {
      case "fill_in_blank":
        return "Cloze / Fill-in";
      case "multiple_choice":
        return "Concept Check";
      case "sentence_reorder":
        return "Word Order / V2 Tile Drill";
      case "table_completion":
        return "Declension / Conjugation Matrix";
      case "error_spotting":
        return "Error Spotting";
      case "transformation":
        return "Grammar Transformation";
      case "translation":
        return "Translation Production";
      case "dictation":
        return "Audio Dictation";
      case "speaking":
        return "Spoken Production";
      default:
        return type;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all">
      {/* Exercise progress header */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">
            Exercise {exerciseIndex + 1} of {totalExercises}
          </span>
          <span className="text-slate-300">•</span>
          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
            {formatExerciseType(exercise.type)}
          </span>
        </div>
        <div className="text-slate-500 font-medium">
          Topic: <span className="text-slate-800">{exercise.grammarTopic}</span>
        </div>
      </div>

      {/* Main exercise interactive body */}
      <div className="p-5 sm:p-6">
        {exercise.type === "fill_in_blank" && (
          <FillInBlank
            exercise={exercise}
            onSubmitResult={handleResult}
            isSubmitted={isSubmitted}
          />
        )}
        {exercise.type === "multiple_choice" && (
          <MultipleChoice
            exercise={exercise}
            onSubmitResult={handleResult}
            isSubmitted={isSubmitted}
          />
        )}
        {exercise.type === "sentence_reorder" && (
          <SentenceReorder
            exercise={exercise}
            onSubmitResult={handleResult}
            isSubmitted={isSubmitted}
          />
        )}
        {exercise.type === "table_completion" && (
          <TableCompletion
            exercise={exercise}
            onSubmitResult={handleResult}
            isSubmitted={isSubmitted}
          />
        )}
        {exercise.type === "error_spotting" && (
          <ErrorSpotting
            exercise={exercise}
            onSubmitResult={handleResult}
            isSubmitted={isSubmitted}
          />
        )}
        {exercise.type === "transformation" && (
          <Transformation
            exercise={exercise}
            onSubmitResult={handleResult}
            isSubmitted={isSubmitted}
          />
        )}
        {exercise.type === "translation" && (
          <SmartTranslation
            exercise={exercise}
            onSubmitResult={handleResult}
            isSubmitted={isSubmitted}
          />
        )}
        {exercise.type === "dictation" && (
          <Dictation
            exercise={exercise}
            onSubmitResult={handleResult}
            isSubmitted={isSubmitted}
          />
        )}
        {exercise.type === "speaking" && (
          <SpeakingPractice
            exercise={exercise}
            onSubmitResult={handleResult}
            isSubmitted={isSubmitted}
          />
        )}
      </div>

      {/* Instant Explanatory Feedback Banner */}
      {isSubmitted && (
        <div
          className={`p-5 border-t transition-colors ${
            isCorrect
              ? "bg-emerald-50/70 border-emerald-200"
              : "bg-red-50/70 border-red-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}

              <div className="space-y-1.5">
                <div
                  className={`text-sm font-bold ${
                    isCorrect ? "text-emerald-900" : "text-red-900"
                  }`}
                >
                  {isCorrect ? "Richtig! (Correct)" : "Nicht ganz richtig (Incorrect)"}
                </div>

                {!isCorrect && exercise.target && (
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">
                      Target German:{" "}
                    </span>
                    <span className="font-serif font-bold text-slate-900">
                      {exercise.target}
                    </span>
                  </div>
                )}

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">
                    Grammar Explanation:{" "}
                  </span>
                  {explanation || exercise.explanation}
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <Link
                    href={`/grammar`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-700 hover:text-indigo-900 underline"
                  >
                    <BookOpen className="w-3 h-3" />
                    Review &apos;{exercise.grammarTopic}&apos; in Grammar Handbook
                  </Link>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className={`shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all cursor-pointer ${
                isCorrect
                  ? "bg-emerald-700 hover:bg-emerald-800"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
