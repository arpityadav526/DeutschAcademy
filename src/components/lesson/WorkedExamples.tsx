"use client";

import React from "react";
import { WorkedExample } from "@/lib/types";
import { AudioButton } from "./AudioButton";

interface WorkedExamplesProps {
  examples: WorkedExample[];
}

export function WorkedExamples({ examples }: WorkedExamplesProps) {
  if (!examples || examples.length === 0) return null;

  const getRoleBadgeClass = (caseType?: string) => {
    switch (caseType) {
      case "nom":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "akk":
        return "bg-red-100 text-red-800 border-red-200";
      case "dat":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "gen":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "verb":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "prefix":
        return "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 my-6">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          Worked Examples & Structural Breakdown
        </h3>
        <p className="text-xs text-slate-500">
          Deconstruct how each sentence is assembled. Click audio to hear authentic German cadence.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {examples.map((ex, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
          >
            {/* Header: German sentence + Audio + English translation */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-semibold text-slate-900">
                  {ex.german}
                </div>
                <div className="text-sm text-slate-600 italic">
                  &ldquo;{ex.english}&rdquo;
                </div>
              </div>
              <AudioButton text={ex.german} />
            </div>

            {/* Granular Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Grammatical Breakdown
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 font-medium text-slate-600">German Element</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Grammatical Function</th>
                      <th className="px-3 py-2 font-medium text-slate-600">Pedagogical Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {ex.breakdown.map((item, bIdx) => (
                      <tr key={bIdx} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                          {item.part}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getRoleBadgeClass(
                              item.caseType
                            )}`}
                          >
                            {item.role}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">
                          {item.explanation || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Note */}
            {ex.note && (
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="font-semibold text-slate-800">Note: </span>
                {ex.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
