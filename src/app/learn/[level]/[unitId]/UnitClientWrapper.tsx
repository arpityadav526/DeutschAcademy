"use client";

import React, { useState } from "react";
import { UnitContent, ExerciseItem, VocabularyItem } from "@/lib/types";
import { ConceptViewer } from "@/components/lesson/ConceptViewer";
import { WorkedExamples } from "@/components/lesson/WorkedExamples";
import { VocabularyView } from "@/components/lesson/VocabularyView";
import { ReadingLab } from "@/components/lesson/ReadingLab";
import { ListeningLab } from "@/components/lesson/ListeningLab";
import { ProductionStudio } from "@/components/lesson/ProductionStudio";
import { ExerciseContainer } from "@/components/exercises/ExerciseContainer";
import { UnitReviewTest } from "@/components/lesson/UnitReviewTest";
import Link from "next/link";
import {
  BookOpen,
  ListChecks,
  Languages,
  PenTool,
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface UnitClientWrapperProps {
  unit: UnitContent;
  nextUnitId?: string;
  prevUnitId?: string;
}

export function UnitClientWrapper({
  unit,
  nextUnitId,
  prevUnitId,
}: UnitClientWrapperProps) {
  const [activeTab, setActiveTab] = useState<
    "concept" | "examples" | "practice" | "vocab" | "immersion" | "production" | "test"
  >("concept");

  const [practiceIndex, setPracticeIndex] = useState(0);
  const [completedPracticeCount, setCompletedPracticeCount] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  const tabs = [
    { id: "concept", label: "1. Concept & Theory", icon: BookOpen },
    { id: "examples", label: "2. Worked Examples", icon: ListChecks },
    { id: "practice", label: "3. Guided Practice", icon: HelpCircle },
    { id: "vocab", label: "4. Vocabulary in Context", icon: Languages },
    { id: "immersion", label: "5. Reading & Listening", icon: BookOpen },
    { id: "production", label: "6. Active Production", icon: PenTool },
    { id: "test", label: "7. Unit Mastery Test (80%)", icon: CheckCircle },
  ];

  const handleSaveVocabToSRS = async (vocab: VocabularyItem) => {
    try {
      await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          itemType: "vocab",
          prompt: vocab.exampleSentence.replace(vocab.word, "[ ... ]"),
          answer: vocab.word,
          translation: vocab.exampleTranslation,
          grammarTopic: unit.grammarFocus[0] || "vocabulary",
          explanation: `${vocab.article ? vocab.article + " " : ""}${vocab.word} (${vocab.english})`,
        }),
      });
      setNotification(`Saved "${vocab.word}" to daily review queue`);
      setTimeout(() => setNotification(null), 3500);
    } catch {
      // ignore
    }
  };

  const handleSaveSentenceToSRS = async (german: string, english: string) => {
    try {
      await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          itemType: "sentence",
          prompt: german,
          answer: german,
          translation: english,
          grammarTopic: unit.grammarFocus[0] || "reading",
          explanation: `Full sentence from Unit ${unit.number} reading passage.`,
        }),
      });
      setNotification(`Saved sentence to daily review queue`);
      setTimeout(() => setNotification(null), 3500);
    } catch {
      // ignore
    }
  };

  const handlePracticeExerciseComplete = (isCorrect: boolean, exercise: ExerciseItem) => {
    setCompletedPracticeCount((prev) => prev + 1);
    if (practiceIndex + 1 < unit.guidedPractice.length) {
      setPracticeIndex(practiceIndex + 1);
    }
  };

  const handleTestComplete = async (score: number, passed: boolean, weakSpots: string[]) => {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: unit.level,
          unitId: unit.id,
          score,
          passed,
          weakSpots,
        }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Navigation tabs · station signposts */}
      <div className="lesson-tab-rail overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 sm:space-x-2 min-w-max pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`lesson-tab ${active ? "active" : ""}`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-slate-900" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "concept" && (
          <div className="space-y-6">
            <ConceptViewer
              title={unit.concept.title}
              explanation={unit.concept.explanation}
              tables={unit.concept.tables}
              deepDives={unit.concept.deepDives}
            />
            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("examples")}
                className="btn btn-primary"
              >
                <span>Weiter zu den Beispielen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "examples" && (
          <div className="space-y-6">
            <WorkedExamples examples={unit.workedExamples} />
            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("concept")}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Zur Theorie</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("practice")}
                className="btn btn-primary"
              >
                <span>Übung beginnen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "practice" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Übung · Geführtes Training
                </h3>
                <p className="text-xs text-slate-500">
                  Schritt für Schritt üben; jede Rückmeldung erklärt die Regel.
                </p>
              </div>
              <div className="practice-stations" aria-label={`Übung ${practiceIndex + 1} von ${unit.guidedPractice.length}`}>
                {unit.guidedPractice.map((_, idx) => <span key={idx} className={idx === practiceIndex ? "current" : idx < completedPracticeCount ? "passed" : ""}>{idx + 1}</span>)}
              </div>
            </div>

            {unit.guidedPractice.length > 0 ? (
              <ExerciseContainer
                key={unit.guidedPractice[practiceIndex].id}
                exercise={unit.guidedPractice[practiceIndex]}
                exerciseIndex={practiceIndex}
                totalExercises={unit.guidedPractice.length}
                onComplete={handlePracticeExerciseComplete}
              />
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                No practice exercises available for this unit.
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                disabled={practiceIndex === 0}
                onClick={() => setPracticeIndex(practiceIndex - 1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-slate-700 disabled:opacity-40 rounded text-xs font-medium cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Vorherige Übung</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("vocab")}
                className="btn btn-primary"
              >
                <span>Weiter zum Wortschatz</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "vocab" && (
          <div className="space-y-6">
            <VocabularyView
              vocabulary={unit.vocabulary}
              onSaveToSRS={handleSaveVocabToSRS}
            />
            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("practice")}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Zur Übung</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("immersion")}
                className="btn btn-primary"
              >
                <span>Lese- und Hörsaal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "immersion" && (
          <div className="space-y-8">
            {unit.readingPassage && (
              <ReadingLab
                passage={unit.readingPassage}
                onSaveSentence={handleSaveSentenceToSRS}
              />
            )}
            {unit.listeningDialogue && (
              <ListeningLab dialogue={unit.listeningDialogue} />
            )}
            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("vocab")}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Zum Wortschatz</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("production")}
                className="btn btn-primary"
              >
                <span>Schreiben & Sprechen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "production" && (
          <div className="space-y-6">
            <ProductionStudio production={unit.production} />
            <div className="flex justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("immersion")}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Zu Lesen & Hören</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("test")}
                className="btn btn-primary"
              >
                <span>Kapitelkontrolle starten</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "test" && (
          <div className="space-y-6">
            <UnitReviewTest
              unitTitle={unit.title}
              unitNumber={unit.number}
              level={unit.level}
              nextUnitId={nextUnitId}
              questions={unit.unitTest.questions}
              onTestComplete={handleTestComplete}
            />
          </div>
        )}
      </div>

      {/* Unit Footer Navigation */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        {prevUnitId ? (
          <Link
            href={`/learn/${unit.level.toLowerCase()}/${prevUnitId}`}
            className="inline-flex items-center gap-1 hover:text-slate-900 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Vorherige Station</span>
          </Link>
        ) : (
          <div />
        )}

        {nextUnitId && (
          <Link
            href={`/learn/${unit.level.toLowerCase()}/${nextUnitId}`}
            className="inline-flex items-center gap-1 hover:text-slate-900 font-medium"
          >
            <span>Nächste Station</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
