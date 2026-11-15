"use client";

import React, { useState } from "react";
import { ListeningDialogue } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="running-head">
          <span>Hörverstehen · Dialog</span>
        </p>
        <h3 className="text-xl font-bold text-ink font-serif mt-4">{dialogue.title}</h3>
        <p className="text-sm text-ink-soft">
          Listen once without the transcript, then answer. Speakers: {dialogue.speakers.join(", ")}.
        </p>
      </header>

      {/* Audio controls */}
      <div className="flex flex-wrap items-center gap-3">
        <AudioButton text={fullAudioScript} label="Dialog abspielen" />
        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="btn btn-outline !text-xs"
        >
          {showTranscript ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Transkript verbergen</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Transkript anzeigen</span>
            </>
          )}
        </button>
      </div>

      {/* Transcript — printed script */}
      {showTranscript && (
        <div className="space-y-3 fade-in border-l-2 border-rule pl-4">
          {dialogue.lines.map((line, idx) => (
            <div key={idx} className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-sm">
                  <span className="font-semibold text-tintenblau text-xs uppercase tracking-wider mr-2">
                    {line.speaker}:
                  </span>
                  <span className="font-serif text-ink">{line.text}</span>
                </p>
                <p className="german-translation">{line.translation}</p>
              </div>
              <AudioButton text={line.text} size="sm" />
            </div>
          ))}
        </div>
      )}

      {/* Questions — workbook page */}
      {dialogue.questions && dialogue.questions.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-rule">
          <p className="eyebrow smallcaps">Übung · Zum Dialog</p>

          <div className="space-y-5">
            {dialogue.questions.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              return (
                <div key={qIdx} className="space-y-2">
                  <p className="text-sm font-medium text-ink font-serif">
                    <span className="paragraph-num mr-1.5">{qIdx + 1}.</span>
                    {q.question}
                  </p>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      const isCorrect = optIdx === q.correctIndex;

                      let optClass = "border-transparent text-ink";
                      if (isSelected && !isAnswersChecked) {
                        optClass = "border-rule bg-paper-deep font-medium";
                      } else if (isAnswersChecked) {
                        if (isCorrect) {
                          optClass = "border-moos text-moos font-medium highlight-ending";
                        } else if (isSelected && !isCorrect) {
                          optClass = "rotstift-strike text-ink-soft";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelect(qIdx, optIdx)}
                          className={`w-full p-2 text-left text-sm border rounded-sm transition-colors flex items-center justify-between ${optClass}`}
                        >
                          <span>{opt}</span>
                          {isAnswersChecked && isCorrect && (
                            <span className="moos-tick text-lg leading-none">✓</span>
                          )}
                          {isAnswersChecked && isSelected && !isCorrect && (
                            <span className="margin-red text-xs">noch einmal hören</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswersChecked && (
                    <div className="margin-note fade-in max-w-xl">
                      <span className="margin-note-label block">Erklärung</span>
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
              className="btn btn-primary"
            >
              Antworten prüfen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
