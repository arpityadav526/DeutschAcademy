"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

interface PlacementQuestion {
  id: number;
  level: "A1" | "A2" | "B1";
  prompt: string;
  options: string[];
  correctIndex: number;
  topic: string;
  explanation: string;
}

const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // A1 Tier
  {
    id: 1,
    level: "A1",
    prompt: "Woher ___ Sie, Herr Wagner?",
    options: ["komme", "kommst", "kommen", "kommt"],
    correctIndex: 2,
    topic: "Regular Verb Conjugation",
    explanation: "Formal address 'Sie' strictly requires the -en ending: 'Woher kommen Sie?'"
  },
  {
    id: 2,
    level: "A1",
    prompt: "Ich trinke gern Tee, aber ich trinke ___ Kaffee.",
    options: ["nicht", "kein", "keinen", "nichts"],
    correctIndex: 2,
    topic: "Negation (kein)",
    explanation: "'der Kaffee' is a masculine noun without an article; direct object accusative requires 'keinen'."
  },
  {
    id: 3,
    level: "A1",
    prompt: "Heute ___ ich meine Großeltern in München.",
    options: ["besuche", "ich besuche", "besuchen", "besucht"],
    correctIndex: 0,
    topic: "V2 Word Order & Inversion",
    explanation: "Because 'Heute' is in Position 1, the conjugated verb 'besuche' must occupy Position 2."
  },
  {
    id: 4,
    level: "A1",
    prompt: "Wir müssen heute Abend die Hausaufgaben ___ .",
    options: ["machen", "mache", "gemacht", "macht"],
    correctIndex: 0,
    topic: "Modal Verb Satzklammer",
    explanation: "Modal verbs send the main verb in its infinitive form ('machen') to the very end of the sentence."
  },
  // A2 Tier
  {
    id: 5,
    level: "A2",
    prompt: "Der Student dankt ___ Professorin für die Empfehlung.",
    options: ["die", "den", "der", "dem"],
    correctIndex: 2,
    topic: "Dative Case (Feminine)",
    explanation: "'danken' requires the dative case. The dative form of feminine 'die' is 'der': der Professorin."
  },
  {
    id: 6,
    level: "A2",
    prompt: "Er stellt die Blumenvase auf ___ Tisch.",
    options: ["der", "den", "dem", "des"],
    correctIndex: 1,
    topic: "Two-Way Prepositions (Wohin? = Akkusativ)",
    explanation: "'stellen' is an active directional verb (Wohin?), requiring the Accusative: auf den Tisch."
  },
  {
    id: 7,
    level: "A2",
    prompt: "Ich bleibe heute zu Hause, weil ich krank ___ .",
    options: ["bin", "ist", "habe", "werde"],
    correctIndex: 0,
    topic: "Subordinate Clauses (weil = Verb-Final)",
    explanation: "'weil' sends the conjugated verb to the very end of the clause: '...weil ich krank bin.'"
  },
  // B1 Tier
  {
    id: 8,
    level: "B1",
    prompt: "Trotz ___ Regens gingen wir im Wald spazieren.",
    options: ["der", "den", "dem", "des"],
    correctIndex: 3,
    topic: "Genitive Prepositions (trotz)",
    explanation: "The preposition 'trotz' governs the Genitive case: 'trotz des Regens'."
  },
  {
    id: 9,
    level: "B1",
    prompt: "Wenn ich viel Geld hätte, ___ ich eine Weltreise machen.",
    options: ["würde", "wäre", "werde", "hätte"],
    correctIndex: 0,
    topic: "Konjunktiv II (Hypothetical)",
    explanation: "Unreal conditionals use 'würde + Infinitiv': '...würde ich eine Weltreise machen.'"
  },
  {
    id: 10,
    level: "B1",
    prompt: "Das neue Rathaus ___ im nächsten Jahr von der Stadtverwaltung gebaut.",
    options: ["wird", "wurde", "worden", "geworden"],
    correctIndex: 0,
    topic: "Passive Voice (Vorgangspassiv)",
    explanation: "Passive voice uses werden + Partizip II: 'wird gebaut'."
  }
];

export default function PlacementTestPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelect = (optionIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: optionIdx });
  };

  const handleNext = () => {
    if (currentIndex + 1 < PLACEMENT_QUESTIONS.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
  };

  // Evaluation algorithm
  const computePlacement = () => {
    let a1Score = 0;
    let a2Score = 0;
    let b1Score = 0;

    PLACEMENT_QUESTIONS.forEach((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.correctIndex;
      if (isCorrect) {
        if (q.level === "A1") a1Score++;
        if (q.level === "A2") a2Score++;
        if (q.level === "B1") b1Score++;
      }
    });

    if (b1Score >= 2 && a2Score >= 2 && a1Score >= 3) {
      return {
        recommendedLevel: "B1",
        recommendedUnit: "unit-01",
        rationale: "Strong mastery of A1 and A2 grammatical structures. You are ready to tackle full adjective declensions, the genitive case, and Konjunktiv II in B1.",
      };
    }

    if (a2Score >= 2 && a1Score >= 3) {
      return {
        recommendedLevel: "A2",
        recommendedUnit: "unit-01",
        rationale: "Solid foundation in A1 syntax and basic case dynamics. You are prepared to enter A2 starting with the Dative case and two-way prepositions.",
      };
    }

    return {
      recommendedLevel: "A1",
      recommendedUnit: "unit-01",
      rationale: "Starting at A1 will establish an absolute, rock-solid foundation in German phonetics, gender rules, and the V2 sentence structure.",
    };
  };

  if (isCompleted) {
    const placement = computePlacement();
    const totalCorrect = PLACEMENT_QUESTIONS.filter(
      (q, idx) => selectedAnswers[idx] === q.correctIndex
    ).length;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Diagnostic Placement Evaluation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif mt-1">
              Recommended Placement: Level {placement.recommendedLevel}
            </h1>
          </div>

          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-mono font-bold text-2xl flex items-center justify-center shrink-0">
                {placement.recommendedLevel}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900">
                  Diagnostic Score: {totalCorrect} / {PLACEMENT_QUESTIONS.length} Questions Correct
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  {placement.rationale}
                </div>
              </div>
            </div>
          </div>

          {/* Action Choice */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Choose Your Path Forward:
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/learn/${placement.recommendedLevel.toLowerCase()}/${placement.recommendedUnit}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                <span>Accept Placement: Start at {placement.recommendedLevel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/learn/a1/unit-01"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors"
              >
                <span>Start at A1 Unit 1 Anyway</span>
              </Link>
            </div>
          </div>

          {/* Review of all answers */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Question Diagnostics & Feedback
            </h3>
            <div className="space-y-3">
              {PLACEMENT_QUESTIONS.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                      isCorrect
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-red-50/50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">
                        {idx + 1}. [{q.level}] {q.prompt}
                      </span>
                      {isCorrect ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-red-700 font-semibold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>
                    <div className="text-slate-600">
                      Topic: <span className="font-medium text-slate-800">{q.topic}</span>
                    </div>
                    <div className="text-slate-700">{q.explanation}</div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Placement Exam</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = PLACEMENT_QUESTIONS[currentIndex];
  const selected = selectedAnswers[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Adaptive Placement Examination
          </span>
          <h1 className="text-xl font-bold text-slate-900 font-serif">
            Question {currentIndex + 1} of {PLACEMENT_QUESTIONS.length}
          </h1>
        </div>
        <div className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono text-xs font-semibold">
          Level Tier: {currentQ.level}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="text-base sm:text-lg font-medium text-slate-900">
          {currentQ.prompt}
        </div>

        <div className="space-y-2.5">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selected === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelect(optIdx)}
                className={`w-full p-3.5 rounded-lg border text-left text-sm transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "border-slate-900 bg-slate-100 font-semibold text-slate-900 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-400 bg-white text-slate-800"
                }`}
              >
                <span>{opt}</span>
                <span className="text-xs font-mono text-slate-400">
                  {String.fromCharCode(65 + optIdx)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Link
            href="/learn/a1/unit-01"
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Skip test and start at A1 Unit 1 →
          </Link>

          <button
            type="button"
            onClick={handleNext}
            disabled={selected === undefined}
            className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            {currentIndex + 1 === PLACEMENT_QUESTIONS.length
              ? "Complete Diagnostic"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}
