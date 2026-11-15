"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/types";
import { ExerciseContainer } from "../exercises/ExerciseContainer";
import { CheckCircle, AlertTriangle, RotateCcw, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { RegionScene, type RegionKey } from "@/components/illustrations/RegionScenes";
import { PassportStamp } from "@/components/journey/JourneyUI";
import { Ampelmann } from "@/components/journey/JourneyUI";

interface UnitReviewTestProps {
  unitTitle: string;
  unitNumber: number;
  level: string;
  nextUnitId?: string;
  questions: ExerciseItem[];
  onTestComplete: (score: number, passed: boolean, weakSpots: string[]) => void;
}

export function UnitReviewTest({
  unitTitle,
  unitNumber,
  level,
  nextUnitId,
  questions,
  onTestComplete,
}: UnitReviewTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ isCorrect: boolean; question: ExerciseItem }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleQuestionComplete = (isCorrect: boolean, exercise: ExerciseItem) => {
    const updated = [...answers, { isCorrect, question: exercise }];
    setAnswers(updated);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished all questions
      const correctCount = updated.filter((a) => a.isCorrect).length;
      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= 80;

      // Extract unique grammar topics of failed questions
      const failedTopics = Array.from(
        new Set(
          updated
            .filter((a) => !a.isCorrect)
            .map((a) => a.question.grammarTopic)
        )
      );

      setIsFinished(true);
      onTestComplete(score, passed, failedTopics);
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setIsFinished(false);
  };

  if (isFinished) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= 80;
    const failedAnswers = answers.filter((a) => !a.isCorrect);

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4 text-center sm:text-left">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
            Ankunft · Kapitel {unitNumber} · {unitTitle}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {passed ? "Ihr Zug fährt weiter" : "Noch nicht angekommen"}
          </h2>
        </div>

        {passed && !nextUnitId && <div className="arrival-landscape" data-region={({A1:"koeln",A2:"schwarzwald",B1:"berlin",B2:"alpen"} as Record<string,RegionKey>)[level] || "alpen"}><RegionScene region={({A1:"koeln",A2:"schwarzwald",B1:"berlin",B2:"alpen"} as Record<string,RegionKey>)[level] || "alpen"} className="arrival-scene"/><div className="arrival-copy"><p>ANKUNFT · NÄCHSTE REGION</p><h3>{({A1:"Rhein & Köln",A2:"Schwarzwald",B1:"Berlin",B2:"Alpen & Zugspitze"} as Record<string,string>)[level] || "Zugspitze"}</h3><PassportStamp region={level} label="BESTANDEN"/></div></div>}
        {/* Score indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-lg bg-slate-50 border border-slate-200 gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 flex items-center justify-center font-bold text-2xl border-2 ${
                passed
                  ? "bg-emerald-50 text-emerald-800 border-emerald-500"
                  : "bg-amber-50 text-amber-800 border-amber-500"
              }`}
            >
              {score}%
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {correctCount} of {questions.length} Questions Correct
              </div>
              <div className="text-xs text-slate-500">
                Passing benchmark: 80 % für die nächste Station
              </div>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-700">
            {passed ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Ampelmann state="correct" />
                Reisepass abgestempelt · Kapitel bestanden
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Verspätung · Thema noch einmal prüfen
              </span>
            )}
          </div>
        </div>

        {/* Weak spots list if failed or had errors */}
        {failedAnswers.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-semibold text-slate-900">
              Verspätete Themen · Wiederholung empfohlen
            </div>
            <div className="space-y-2">
              {failedAnswers.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-red-200 bg-red-50/50 text-xs text-slate-700 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-red-900">
                      Topic: {item.question.grammarTopic}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Target: {item.question.target}
                    </span>
                  </div>
                  <div className="text-slate-700">{item.question.explanation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleRetake}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Kapitel noch einmal üben</span>
          </button>

          {passed && nextUnitId ? (
            <Link
              href={`/learn/${level.toLowerCase()}/${nextUnitId}`}
              className="btn btn-primary"
            >
              <span>Weiter zur nächsten Station</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href={`/dashboard`}
              className="btn btn-primary"
            >
              <span>Zum Reiseplan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
            Unit {unitNumber} Mastery Test: {unitTitle}
          </h3>
          <p className="text-xs text-slate-500">
            Ab 80 % gilt diese Station als erreicht.
          </p>
        </div>
        <div className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <ExerciseContainer
        exercise={currentQuestion}
        exerciseIndex={currentIndex}
        totalExercises={questions.length}
        onComplete={handleQuestionComplete}
      />
    </div>
  );
}
