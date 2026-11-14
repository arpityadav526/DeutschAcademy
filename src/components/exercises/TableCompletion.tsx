"use client";

import React, { useState } from "react";
import { ExerciseItem } from "@/lib/types";

interface TableCompletionProps {
  exercise: ExerciseItem;
  onSubmitResult: (correct: boolean, explanation: string) => void;
  isSubmitted: boolean;
}

export function TableCompletion({
  exercise,
  onSubmitResult,
  isSubmitted,
}: TableCompletionProps) {
  const tableData = exercise.tableData;
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!tableData) {
    return <div className="text-red-500">Missing table data</div>;
  }

  const handleChange = (key: string, value: string) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted) return;

    // Check all blank cells against exercise.target or table answers
    // Target is encoded as comma-separated or JSON list
    let targets: string[] = [];
    try {
      targets = JSON.parse(exercise.target);
    } catch {
      targets = exercise.target.split(",").map((s) => s.trim());
    }

    let allCorrect = true;
    let targetIdx = 0;

    tableData.rows.forEach((row, rIdx) => {
      row.blanks.forEach((cIdx) => {
        const key = `${rIdx}-${cIdx}`;
        const userVal = (answers[key] || "").trim().toLowerCase();
        const expected = (targets[targetIdx] || "").trim().toLowerCase();
        if (userVal !== expected) {
          allCorrect = false;
        }
        targetIdx++;
      });
    });

    onSubmitResult(allCorrect, exercise.explanation);
  };

  let targetIdxCounter = 0;
  let parsedTargets: string[] = [];
  try {
    parsedTargets = JSON.parse(exercise.target);
  } catch {
    parsedTargets = exercise.target.split(",").map((s) => s.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm font-medium text-slate-700">
        {exercise.instruction}
      </div>

      <div className="text-xs text-slate-500 italic">{exercise.prompt}</div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-500">
                Pattern
              </th>
              {tableData.headers.map((h, hIdx) => (
                <th
                  key={hIdx}
                  className="px-3 py-2 text-left font-medium text-slate-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableData.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/50">
                <td className="px-3 py-2 font-medium text-slate-600 bg-slate-50/50">
                  {row.label}
                </td>
                {row.cells.map((cell, cIdx) => {
                  const isBlank = row.blanks.includes(cIdx);
                  if (!isBlank) {
                    return (
                      <td key={cIdx} className="px-3 py-2 text-slate-800">
                        {cell}
                      </td>
                    );
                  }

                  const key = `${rIdx}-${cIdx}`;
                  const currentTarget = parsedTargets[targetIdxCounter++];
                  const userVal = answers[key] || "";
                  const isCellCorrect =
                    userVal.trim().toLowerCase() ===
                    (currentTarget || "").trim().toLowerCase();

                  let inputBorder = "border-slate-300 focus:border-slate-800";
                  if (isSubmitted) {
                    inputBorder = isCellCorrect
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-red-400 bg-red-50 text-red-900";
                  }

                  return (
                    <td key={cIdx} className="px-2 py-1.5">
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => handleChange(key, e.target.value)}
                          disabled={isSubmitted}
                          placeholder="..."
                          className={`w-full px-2 py-1 text-sm rounded border ${inputBorder} focus:outline-none`}
                        />
                        {isSubmitted && !isCellCorrect && (
                          <span className="text-[10px] text-emerald-700 font-medium">
                            {currentTarget}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isSubmitted && (
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            Check Table
          </button>
        </div>
      )}
    </form>
  );
}
