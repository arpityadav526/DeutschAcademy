"use client";

import React, { useState } from "react";
import { ListeningDialogue } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import { CheckCircle2, XCircle, Headphones, Eye, EyeOff } from "lucide-react";

interface ListeningLabProps {
  dialogue: ListeningDialogue;
}

export function ListeningLab({ dialogue }: ListeningLabProps) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswersChecked, setIsAnswersChecked] = useState(false);

  const fullAudioScript = dialogue.lines
    .map((l) => `${l.speaker}: ${l.text}`)
    .join(". ");

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (isAnswersChecked) return;
    setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx });
  };

  return (
    <div className="space-y-6 my-6">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          Listening Comprehension Dialogue (Hörverstehen)
        </h3>
        <p className="text-xs text-slate-500">
          Listen to native pronunciation without transcript first, then answer the questions.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        {/* Header Audio Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{dialogue.title}</div>
              <div className="text-xs text-slate-500">
                Speakers: {dialogue.speakers.join(", ")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton text={fullAudioScript} label="Play Entire Dialogue" />
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {showTranscript ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide Transcript</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Show Transcript</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Transcript Lines */}
        {showTranscript && (
          <div className="space-y-3 pt-2 divide-y divide-slate-100">
            {dialogue.lines.map((line, idx) => (
              <div key={idx} className="pt-2.5 flex items-start justify-between gap-3 text-sm">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      {line.speaker}:
                    </span>
                    <span className="font-serif text-slate-800">{line.text}</span>
                  </div>
                  <div className="text-xs text-slate-500 italic">
                    {line.translation}
                  </div>
                </div>
                <AudioButton text={line.text} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comprehension Questions */}
      {dialogue.questions && dialogue.questions.length > 0 && (
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Dialogue Questions
          </h4>

          <div className="space-y-4">
            {dialogue.questions.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              return (
                <div
                  key={qIdx}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {qIdx + 1}. {q.question}
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      let optClass = "border-slate-200 hover:border-slate-300";
                      if (isSelected && !isAnswersChecked) {
                        optClass = "border-slate-800 bg-slate-50 font-semibold";
                      } else if (isAnswersChecked) {
                        if (isCorrect) {
                          optClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          optClass = "border-red-400 bg-red-50 text-red-900 line-through";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelect(qIdx, optIdx)}
                          className={`w-full p-2.5 rounded text-left text-xs sm:text-sm border transition-colors cursor-pointer flex items-center justify-between ${optClass}`}
                        >
                          <span>{opt}</span>
                          {isAnswersChecked && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswersChecked && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswersChecked && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="font-semibold text-slate-800">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setIsAnswersChecked(true)}
              disabled={
                isAnswersChecked ||
                Object.keys(selectedAnswers).length < dialogue.questions.length
              }
              className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer shadow-sm transition-all"
            >
              Check Listening Answers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
