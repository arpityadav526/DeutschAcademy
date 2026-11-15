"use client";

import React from "react";
import { GrammarTable, DeepDiveNote } from "@/lib/types";
import { GrammarText } from "@/lib/grammarHighlighter";
import { TeacherNote } from "./TeacherNote";

interface ConceptViewerProps {
  title: string;
  explanation: string;
  tables?: GrammarTable[];
  deepDives?: DeepDiveNote[];
}

export function ConceptViewer({
  title,
  explanation,
  tables,
  deepDives,
}: ConceptViewerProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="running-head">
          <span>Theorie · Regeln</span>
        </p>
        <h2 className="text-2xl font-bold text-ink tracking-tight font-serif mt-4">
          {title}
        </h2>
        <p className="text-sm text-ink-soft">
          Conceptual theory and grammatical mechanics, explained step by step.
        </p>
      </header>

      {/* Explanation body — reading column */}
      <div className="reading-copy text-ink">
        <GrammarText content={explanation} />
      </div>

      {/* Grammar tables — printed-book style */}
      {tables && tables.length > 0 && (
        <div className="space-y-8">
          {tables.map((table, tIdx) => (
            <figure key={tIdx} className="space-y-2">
              {table.caption && (
                <figcaption className="eyebrow smallcaps">
                  Tabelle {tIdx + 1} — {table.caption}
                </figcaption>
              )}
              <div className="overflow-x-auto">
                <table className="book-table text-sm">
                  <thead>
                    <tr>
                      {table.headers.map((h, hIdx) => (
                        <th key={hIdx}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={cIdx === 0 ? "font-medium text-ink" : "text-ink"}>
                            <GrammarText content={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </figure>
          ))}
        </div>
      )}

      {/* Teacher deep-dive notes as margin asides */}
      {deepDives && deepDives.length > 0 && (
        <div className="space-y-3">
          {deepDives.map((note, nIdx) => (
            <TeacherNote key={nIdx} {...note} />
          ))}
        </div>
      )}
    </div>
  );
}
