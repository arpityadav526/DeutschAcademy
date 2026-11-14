"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Eye,
  Loader2,
} from "lucide-react";
import { AudioButton } from "@/components/lesson/AudioButton";

interface SRSReviewItem {
  id: string;
  itemType: string;
  prompt: string;
  answer: string;
  translation: string;
  grammarTopic: string;
  explanation: string;
  repetition: number;
  interval: number;
  easeFactor: number;
}

export default function ReviewPage() {
  const [items, setItems] = useState<SRSReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    fetchReviewItems();
  }, []);

  const fetchReviewItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/review");
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (quality: number) => {
    const currentItem = items[currentIndex];
    if (!currentItem) return;

    try {
      await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review",
          itemId: currentItem.id,
          quality,
        }),
      });
    } catch {
      // ignore
    }

    setReviewedCount((prev) => prev + 1);
    setIsRevealed(false);
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800 mx-auto" />
        <div className="text-sm font-medium text-slate-600">
          Loading your daily spaced repetition queue...
        </div>
      </div>
    );
  }

  // Finished or Empty Queue
  if (items.length === 0 || currentIndex >= items.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 font-serif">
            Daily Review Queue Complete
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {reviewedCount > 0
              ? `You have reviewed ${reviewedCount} items today according to the SuperMemo-2 interval algorithm.`
              : "You have no pending spaced repetition cards due right now. Items are scheduled as you study units and save sentences."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/learn/a1/unit-01"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-sm"
          >
            <span>Continue Curriculum Lessons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
          >
            <span>View Progress Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const current = items[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Review Header */}
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-700" />
          <h1 className="text-lg font-bold text-slate-900">
            Spaced Repetition Review (SM-2)
          </h1>
        </div>
        <div className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-700 font-semibold">
          {currentIndex + 1} of {items.length} Due
        </div>
      </div>

      {/* Review Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
          <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
            Contextual Sentence Recall
          </span>
          <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Topic: {current.grammarTopic}
          </span>
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sentence in Context:
          </div>
          <div className="text-xl font-serif text-slate-900 leading-relaxed font-medium">
            {current.prompt}
          </div>
          {current.translation && (
            <div className="text-xs text-slate-500 italic">
              Meaning: &ldquo;{current.translation}&rdquo;
            </div>
          )}
        </div>

        {/* Reveal Answer Button */}
        {!isRevealed ? (
          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsRevealed(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Reveal Correct German Target</span>
            </button>
          </div>
        ) : (
          /* Revealed state */
          <div className="space-y-6 pt-4 border-t border-slate-200 animate-in fade-in">
            <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                    Target German Form:
                  </div>
                  <div className="text-xl font-serif font-bold text-emerald-950 mt-0.5">
                    {current.answer}
                  </div>
                </div>
                <AudioButton text={current.answer} size="md" />
              </div>

              {current.explanation && (
                <div className="text-xs text-emerald-900 pt-1 border-t border-emerald-200/60 leading-relaxed">
                  <strong>Grammar Rationale: </strong>
                  {current.explanation}
                </div>
              )}
            </div>

            {/* SM-2 Recall Rating Buttons */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-600 text-center">
                Rate your recall difficulty (SM-2 interval scheduling):
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleGrade(1)}
                  className="p-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  <div className="font-bold">Blackout</div>
                  <div className="text-[10px] text-red-700">1 day reset</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrade(2)}
                  className="p-2.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  <div className="font-bold">Hard</div>
                  <div className="text-[10px] text-amber-700">Repeat soon</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrade(4)}
                  className="p-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  <div className="font-bold">Good</div>
                  <div className="text-[10px] text-blue-700">Normal interval</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGrade(5)}
                  className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-medium transition-colors cursor-pointer"
                >
                  <div className="font-bold">Flawless</div>
                  <div className="text-[10px] text-emerald-700">Extended gap</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
