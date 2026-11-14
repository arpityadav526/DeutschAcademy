"use client";

import React, { useState } from "react";
import { ProductionPrompts } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import {
  isSpeechRecognitionSupported,
  startGermanListening,
} from "@/lib/speech";
import { compareSpokenToTarget, WordDiff } from "@/lib/diff";
import { Mic, MicOff, Send, CheckSquare, Sparkles, AlertCircle } from "lucide-react";

interface ProductionStudioProps {
  production: ProductionPrompts;
  onSaveWriting?: (text: string) => void;
}

export function ProductionStudio({
  production,
  onSaveWriting,
}: ProductionStudioProps) {
  // Writing state
  const [writingText, setWritingText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [feedbackReport, setFeedbackReport] = useState<string | null>(null);
  const [checkedRubric, setCheckedRubric] = useState<Record<number, boolean>>({});
  const [showSample, setShowSample] = useState(false);

  // Speaking state
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState("");
  const [diffResult, setDiffResult] = useState<{
    accuracy: number;
    wordDiffs: WordDiff[];
    isPassing: boolean;
  } | null>(null);

  const handleRubricToggle = (idx: number) => {
    setCheckedRubric({ ...checkedRubric, [idx]: !checkedRubric[idx] });
  };

  const handleAiEvaluation = async () => {
    if (!writingText.trim()) return;
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/writing/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: writingText,
          prompt: production.writing.prompt,
        }),
      });

      const data = await res.json();
      setFeedbackReport(data.feedback);
    } catch {
      setFeedbackReport(
        "Could not contact AI evaluator. Please use the self-check rubric below to review your sentence structures, gender, and verb placements."
      );
    } finally {
      setIsAiLoading(false);
      if (onSaveWriting) {
        onSaveWriting(writingText);
      }
    }
  };

  const handleStartSpeaking = () => {
    if (isListening) return;
    setIsListening(true);
    setSpokenTranscript("");
    setDiffResult(null);

    const handle = startGermanListening(
      (res) => {
        setSpokenTranscript(res.transcript);
        const diff = compareSpokenToTarget(
          production.speaking.targetSentence,
          res.transcript
        );
        setDiffResult(diff);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!handle) {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-8 my-6">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          Active Production Studio (Schreiben & Sprechen)
        </h3>
        <p className="text-xs text-slate-500">
          True German acquisition requires producing language independently, not merely recognizing choices.
        </p>
      </div>

      {/* 1. Writing Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
            Section 1: Guided Written Production
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-1">
            {production.writing.prompt}
          </h4>
        </div>

        {/* Guidelines */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
          <div className="font-semibold text-slate-800">Key Criteria & Guidelines:</div>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            {production.writing.guidelines.map((g, idx) => (
              <li key={idx}>{g}</li>
            ))}
          </ul>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">
            Your German Response:
          </label>
          <textarea
            rows={5}
            value={writingText}
            onChange={(e) => setWritingText(e.target.value)}
            placeholder="Write your German response here in full sentences..."
            className="w-full p-3 font-serif text-slate-900 rounded-lg border border-slate-300 focus:border-slate-800 focus:outline-none shadow-inner text-sm leading-relaxed"
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowSample(!showSample)}
            className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold underline"
          >
            {showSample ? "Hide Model Response" : "View Model German Response"}
          </button>

          <button
            type="button"
            onClick={handleAiEvaluation}
            disabled={!writingText.trim() || isAiLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAiLoading ? "Analyzing..." : "Evaluate Writing"}</span>
          </button>
        </div>

        {/* Model Response Toggle */}
        {showSample && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <div className="font-semibold text-slate-900">Exemplary Target Response:</div>
            <div className="font-serif text-sm text-slate-800 italic leading-relaxed">
              &ldquo;{production.writing.sampleResponse}&rdquo;
            </div>
            <AudioButton text={production.writing.sampleResponse} size="sm" label="Listen" />
          </div>
        )}

        {/* AI / Automated Feedback Report */}
        {feedbackReport && (
          <div className="p-4 bg-indigo-50/70 rounded-lg border border-indigo-200 text-xs space-y-2">
            <div className="font-bold text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Diagnostic Feedback Report</span>
            </div>
            <div className="text-slate-800 whitespace-pre-line leading-relaxed text-xs">
              {feedbackReport}
            </div>
          </div>
        )}

        {/* Self-check Rubric */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-slate-600" />
            <span>Self-Correction Diagnostic Checklist:</span>
          </div>
          <div className="space-y-1.5">
            {production.writing.selfCheckRubric.map((item, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={Boolean(checkedRubric[idx])}
                  onChange={() => handleRubricToggle(idx)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-800 mt-0.5"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Spoken Production Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
            Section 2: Spoken Verbal Production
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-1">
            {production.speaking.prompt}
          </h4>
        </div>

        {/* Target sentence display */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-lg font-serif font-bold text-slate-900">
              {production.speaking.targetSentence}
            </div>
            <div className="text-xs text-slate-500 italic">
              {production.speaking.translation}
            </div>
            <div className="text-[11px] text-indigo-700 font-mono pt-1">
              Phonetics: {production.speaking.phoneticTips}
            </div>
          </div>

          <AudioButton
            text={production.speaking.targetSentence}
            size="md"
            label="Native Cadence"
          />
        </div>

        {/* Speech input */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border border-slate-200 gap-3">
          <button
            type="button"
            onClick={handleStartSpeaking}
            disabled={isListening}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isListening
                ? "bg-red-600 text-white animate-pulse ring-4 ring-red-200"
                : "bg-slate-900 hover:bg-slate-800 text-white hover:scale-105"
            }`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          <div className="text-xs font-medium text-slate-600">
            {isListening
              ? "Recording voice... Speak in German now"
              : "Click microphone to record your German pronunciation"}
          </div>
        </div>

        {/* Result comparison */}
        {spokenTranscript && (
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 border-b pb-2">
              <span>Your Speech Transcript:</span>
              {diffResult && (
                <span
                  className={`px-2 py-0.5 rounded font-mono ${
                    diffResult.isPassing
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  Pronunciation Score: {diffResult.accuracy}%
                </span>
              )}
            </div>
            <div className="text-sm font-serif italic text-slate-800">
              &ldquo;{spokenTranscript}&rdquo;
            </div>

            {diffResult && (
              <div className="space-y-1 pt-1">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Word Accuracy Map:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {diffResult.wordDiffs.map((diff, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-xs font-mono font-medium border ${
                        diff.status === "match"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : diff.status === "missing"
                          ? "bg-amber-50 text-amber-800 border-amber-300 line-through"
                          : "bg-red-50 text-red-800 border-red-300"
                      }`}
                    >
                      {diff.spoken || diff.expected}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
