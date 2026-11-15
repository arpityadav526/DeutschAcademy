"use client";

import React, { useState } from "react";
import { ProductionPrompts } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import {
  isSpeechRecognitionSupported,
  startGermanListening,
} from "@/lib/speech";
import { compareSpokenToTarget, WordDiff } from "@/lib/diff";
import { Mic, MicOff } from "lucide-react";

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
        "Could not reach the evaluator. Please use the self-check rubric below to review your sentence structures, gender, and verb placements."
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
    <div className="space-y-10">
      <header className="space-y-1">
        <p className="running-head">
          <span>Schreiben &amp; Sprechen · Produktion</span>
        </p>
        <h3 className="text-xl font-bold text-ink font-serif mt-4">
          Freie Produktion
        </h3>
        <p className="text-sm text-ink-soft">
          True acquisition requires producing language yourself, not merely recognising choices.
        </p>
      </header>

      {/* 1. Writing — marked-up essay page */}
      <section className="space-y-4 border-t border-rule pt-6">
        <div>
          <p className="eyebrow smallcaps">Aufgabe 1 · Schreiben</p>
          <h4 className="text-lg font-bold text-ink font-serif mt-1">
            {production.writing.prompt}
          </h4>
        </div>

        {/* Guidelines as margin notes */}
        <div className="margin-note max-w-xl space-y-1">
          <span className="margin-note-label block">Kriterien</span>
          <ul className="list-disc list-inside space-y-0.5">
            {production.writing.guidelines.map((g, idx) => (
              <li key={idx}>{g}</li>
            ))}
          </ul>
        </div>

        {/* Writing area — ruled page */}
        <div className="space-y-2">
          <label htmlFor="writing-response" className="eyebrow">
            Ihr Text
          </label>
          <textarea
            id="writing-response"
            rows={6}
            value={writingText}
            onChange={(e) => setWritingText(e.target.value)}
            placeholder="Schreiben Sie Ihren Text in ganzen Sätzen …"
            className="exercise-line w-full p-3 text-base leading-loose resize-y"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowSample(!showSample)}
            className="text-xs text-tintenblau hover:underline underline-offset-4"
          >
            {showSample ? "Musterantwort verbergen" : "Musterantwort anzeigen"}
          </button>

          <button
            type="button"
            onClick={handleAiEvaluation}
            disabled={!writingText.trim() || isAiLoading}
            className="btn btn-primary"
          >
            <span>{isAiLoading ? "Wird geprüft …" : "Text korrigieren lassen"}</span>
          </button>
        </div>

        {/* Model response */}
        {showSample && (
          <div className="margin-note max-w-xl fade-in space-y-1.5">
            <span className="margin-note-label block">Musterantwort</span>
            <p className="german-example !text-[1.05rem] text-ink">
              &ldquo;{production.writing.sampleResponse}&rdquo;
            </p>
            <AudioButton text={production.writing.sampleResponse} size="sm" label="Anhören" />
          </div>
        )}

        {/* Teacher's red-pencil feedback */}
        {feedbackReport && (
          <div className="border-l-2 border-rotstift pl-4 max-w-2xl fade-in space-y-1.5">
            <span className="achtung">Korrektur des Lehrers</span>
            <div className="margin-red whitespace-pre-line">{feedbackReport}</div>
          </div>
        )}

        {/* Self-check rubric — checklist on a ruled page */}
        <div className="border-t border-rule pt-4 space-y-2 max-w-2xl">
          <span className="margin-note-label">Selbstkontrolle</span>
          <div className="space-y-1.5">
            {production.writing.selfCheckRubric.map((item, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2 text-sm text-ink-soft cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={Boolean(checkedRubric[idx])}
                  onChange={() => handleRubricToggle(idx)}
                  className="mt-1 accent-[color:var(--tintenblau)]"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Speaking */}
      <section className="space-y-4 border-t border-rule pt-6">
        <div>
          <p className="eyebrow smallcaps">Aufgabe 2 · Sprechen</p>
          <h4 className="text-lg font-bold text-ink font-serif mt-1">
            {production.speaking.prompt}
          </h4>
        </div>

        {/* Target sentence */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <p className="german-example text-ink verb-pos">
              {production.speaking.targetSentence}
            </p>
            <AudioButton text={production.speaking.targetSentence} label="Aussprache" />
          </div>
          <p className="german-translation">{production.speaking.translation}</p>
          <p className="text-xs text-ink-soft mt-1">
            Phonetik: {production.speaking.phoneticTips}
          </p>
        </div>

        {/* Record */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleStartSpeaking}
            disabled={isListening}
            aria-label={isListening ? "Aufnahme läuft" : "Aufnahme starten"}
            className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors ${
              isListening
                ? "border-rotstift text-rotstift bg-paper-deep"
                : "border-tintenblau text-tintenblau hover:bg-paper-deep"
            }`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            <span>{isListening ? "Aufnahme läuft …" : "Aussprache aufnehmen"}</span>
          </button>
          <span className="text-xs text-ink-soft">
            {isListening
              ? "Sprechen Sie jetzt auf Deutsch."
              : "Nehmen Sie Ihre Aussprache auf und vergleichen Sie."}
          </span>
        </div>

        {/* Result comparison — marked-up like corrections */}
        {spokenTranscript && (
          <div className="space-y-3 fade-in">
            <div className="border-t border-rule pt-3">
              <span className="margin-note-label">Ihre Aussprache</span>
              {diffResult && (
                <span
                  className={`ml-3 text-xs font-semibold tabular-nums ${
                    diffResult.isPassing ? "text-moos" : "text-rotstift"
                  }`}
                >
                  Genauigkeit: {diffResult.accuracy} %
                </span>
              )}
              <p className="german-example text-ink mt-1">
                &ldquo;{spokenTranscript}&rdquo;
              </p>
            </div>

            {diffResult && (
              <div className="space-y-1">
                <span className="margin-note-label block">Wort für Wort</span>
                <p className="text-sm leading-loose">
                  {diffResult.wordDiffs.map((diff, idx) => (
                    <span
                      key={idx}
                      className={`mr-2 inline-block ${
                        diff.status === "match"
                          ? "text-ink"
                          : diff.status === "missing"
                          ? "text-ink-soft underline decoration-dotted underline-offset-4"
                          : "rotstift-strike"
                      }`}
                    >
                      {diff.spoken || diff.expected}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
