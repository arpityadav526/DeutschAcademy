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
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Conceptual theory and grammatical mechanics explained step by step.
        </p>
      </div>

      {/* Main explanation body */}
      <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
        <GrammarText content={explanation} />
      </div>

      {/* Grammar Tables */}
      {tables && tables.length > 0 && (
        <div className="space-y-6 my-6">
          {tables.map((table, tIdx) => (
            <div
              key={tIdx}
              className="rounded-lg border border-slate-200 overflow-hidden shadow-sm bg-white"
            >
              {table.caption && (
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 font-semibold text-xs text-slate-700 uppercase tracking-wider">
                  {table.caption}
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      {table.headers.map((h, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-3 sm:px-4 py-2.5 font-semibold text-slate-700"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {table.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-3 sm:px-4 py-2.5 text-slate-800 ${
                              cIdx === 0 ? "font-medium" : ""
                            }`}
                          >
                            <GrammarText content={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Teacher Deep Dive Notes */}
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
