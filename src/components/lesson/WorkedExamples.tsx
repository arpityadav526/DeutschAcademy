"use client";

import React from "react";
import { WorkedExample } from "@/lib/types";
import { AudioButton } from "./AudioButton";

interface WorkedExamplesProps {
  examples: WorkedExample[];
}

const caseTags: Record<string, { label: string; cls: string }> = {
  nom: { label: "Nom.", cls: "case-nom" },
  akk: { label: "Akk.", cls: "case-akk" },
  dat: { label: "Dat.", cls: "case-dat" },
  gen: { label: "Gen.", cls: "case-gen" },
  verb: { label: "Verb", cls: "text-ink" },
  prefix: { label: "Präfix", cls: "text-[color:var(--case-prefix)]" },
};

export function WorkedExamples({ examples }: WorkedExamplesProps) {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="running-head">
          <span>Beispiele · Analyse</span>
        </p>
        <h3 className="text-xl font-bold text-ink font-serif mt-4">
          Beispielsätze und Struktur
        </h3>
        <p className="text-sm text-ink-soft">
          Deconstruct how each sentence is assembled. Use the audio marks to hear the cadence.
        </p>
      </header>

      <div className="space-y-10">
        {examples.map((ex, idx) => {
          const caseTag = ex.breakdown.find((b) => b.caseType && caseTags[b.caseType]);

          return (
            <article key={idx} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="paragraph-num">Bsp. {idx + 1}</span>
                  <AudioButton text={ex.german} />
                </div>
                <p className="german-example text-ink">{ex.german}</p>
                <p className="german-translation">&ldquo;{ex.english}&rdquo;</p>
              </div>

              {/* Granular breakdown table */}
              <div className="overflow-x-auto">
                <table className="book-table text-xs">
                  <thead>
                    <tr>
                      <th>Element</th>
                      <th>Funktion</th>
                      <th>Erklärung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ex.breakdown.map((item, bIdx) => {
                      const tag =
                        item.caseType && caseTags[item.caseType]
                          ? caseTags[item.caseType]
                          : null;
                      return (
                        <tr key={bIdx}>
                          <td className="font-medium text-ink whitespace-nowrap">
                            {item.part}
                          </td>
                          <td className="whitespace-nowrap">
                            <span className={`text-xs font-semibold ${tag ? tag.cls : "text-ink-soft"}`}>
                              {item.role}
                              {tag && (
                                <span className="case-tag">{tag.label}</span>
                              )}
                            </span>
                          </td>
                          <td className="text-ink-soft">{item.explanation || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Note — margin annotation style */}
              {ex.note && (
                <div className="margin-note max-w-xl">
                  <span className="margin-note-label block">Randnotiz</span>
                  {ex.note}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
