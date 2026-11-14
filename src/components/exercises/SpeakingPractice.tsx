"use client";

import React, { useState, useEffect } from "react";
import { ExerciseItem } from "@/lib/types";
import {
  isSpeechRecognitionSupported,
  startGermanListening,
} from "@/lib/speech";
import { AudioButton } from "../lesson/AudioButton";
import { compareSpokenToTarget, WordDiff } from "@/lib/diff";
import { Mic, MicOff, AlertCircle } from "lucide-react";

interface SpeakingPracticeProps {
  exercise: ExerciseItem;
  onSubmitResult: (correct: boolean, explanation: string) => void;
  isSubmitted: boolean;
}

export function SpeakingPractice({
  exercise,
  onSubmitResult,
  isSubmitted,
}: SpeakingPracticeProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [diffResult, setDiffResult] = useState<{
    accuracy: number;
    wordDiffs: WordDiff[];
    isPassing: boolean;
  } | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [hasSupport, setHasSupport] = useState(true);

  useEffect(() => {
    setHasSupport(isSpeechRecognitionSupported());
  }, []);

  const handleStartSpeaking = () => {
    if (isSubmitted || isListening) return;
    setRecognitionError(null);
    setIsListening(true);
    setTranscript("");

    const handle = startGermanListening(
      (res) => {
        setTranscript(res.transcript);
        const diff = compareSpokenToTarget(exercise.target, res.transcript);
        setDiffResult(diff);
        setIsListening(false);
        onSubmitResult(diff.isPassing, exercise.explanation);
      },
      (err) => {
        setRecognitionError(err);
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
    <div className="space-y-4">
      <div className="text-sm font-medium text-slate-700">
        {exercise.instruction || "Read and speak the German sentence aloud:"}
      </div>

      {/* Target sentence display */}
      <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-xl font-serif font-bold text-slate-900">
            {exercise.target}
          </div>
          {exercise.prompt && (
            <div className="text-xs text-slate-500 italic mt-0.5">
              &ldquo;{exercise.prompt}&rdquo;
            </div>
          )}
        </div>
        <AudioButton text={exercise.target} label="Hear Model" />
      </div>

      {/* Browser speech recognition support alert */}
      {!hasSupport && (
        <div className="p-3 bg-amber-50 rounded border border-amber-300 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Browser Notice:</strong> Live speech recognition is not supported in this browser. To use speech input, open DeutschAcademy in Chrome, Edge, or Safari. You can still listen to the native model audio above.
          </div>
        </div>
      )}

      {/* Speaking trigger button */}
      {hasSupport && !isSubmitted && (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-slate-200 gap-3">
          <button
            type="button"
            onClick={handleStartSpeaking}
            disabled={isListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isListening
                ? "bg-red-600 text-white animate-pulse ring-4 ring-red-200"
                : "bg-slate-900 hover:bg-slate-800 text-white hover:scale-105"
            }`}
          >
            {isListening ? (
              <MicOff className="w-7 h-7" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </button>
          <div className="text-xs font-medium text-slate-600">
            {isListening
              ? "Listening... Speak clearly in German now"
              : "Click microphone to start speaking"}
          </div>
          {recognitionError && (
            <div className="text-xs text-red-600 font-medium">
              {recognitionError}
            </div>
          )}
        </div>
      )}

      {/* Speech Results & Diff */}
      {transcript && (
        <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 border-b pb-2">
            <span>Recognized Speech:</span>
            {diffResult && (
              <span
                className={`px-2 py-0.5 rounded ${
                  diffResult.isPassing
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                Accuracy: {diffResult.accuracy}%
              </span>
            )}
          </div>
          <div className="text-sm font-serif italic text-slate-800">
            &ldquo;{transcript}&rdquo;
          </div>

          {diffResult && (
            <div className="space-y-1 pt-1">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Word-by-word pronunciation accuracy:
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
  );
}
