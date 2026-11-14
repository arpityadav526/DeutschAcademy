"use client";

import React, { useState } from "react";
import { GrammarReferenceTopic } from "@/lib/content";
import { GrammarText } from "@/lib/grammarHighlighter";
import { Search, Compass, BookOpen, Table, Lightbulb } from "lucide-react";

interface GrammarHandbookClientProps {
  topics: GrammarReferenceTopic[];
}

export function GrammarHandbookClient({ topics }: GrammarHandbookClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    topics[0]?.id || "cases"
  );

  // Filter topics or rules matching the search query
  const filteredTopics = topics.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.rules.some(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.explanation.toLowerCase().includes(q)
      ) ||
      t.tables.some((tb) => tb.title.toLowerCase().includes(q))
    );
  });

  const activeTopic =
    topics.find((t) => t.id === selectedTopicId) || topics[0];

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search grammar rules, prepositions, case endings (e.g. 'dative', 'Wechselpräpositionen', 'adjective endings', 'V2')..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-800 shadow-xs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Topic navigation tabs */}
        <div className="lg:col-span-1 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2">
            Handbook Topics ({filteredTopics.length})
          </div>
          {filteredTopics.map((topic) => {
            const isSelected = activeTopic?.id === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopicId(topic.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span
                    className={`font-mono px-1.5 py-0.2 rounded text-[10px] ${
                      isSelected ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {topic.level}
                  </span>
                </div>
                <div className="text-sm font-bold tracking-tight">
                  {topic.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Topic Content */}
        <div className="lg:col-span-3 space-y-8">
          {activeTopic ? (
            <div className="space-y-8">
              {/* Overview Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
                    {activeTopic.level}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 font-serif">
                    {activeTopic.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {activeTopic.summary}
                </p>
              </div>

              {/* Declension & Conjugation Tables */}
              {activeTopic.tables && activeTopic.tables.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider">
                    <Table className="w-4 h-4 text-slate-500" />
                    <span>Reference Matrices</span>
                  </div>

                  {activeTopic.tables.map((tb, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 overflow-hidden shadow-xs bg-white"
                    >
                      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-0.5">
                        <h3 className="text-sm font-bold text-slate-900">
                          {tb.title}
                        </h3>
                        {tb.description && (
                          <p className="text-xs text-slate-500 italic">
                            {tb.description}
                          </p>
                        )}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                          <thead className="bg-slate-100">
                            <tr>
                              {tb.headers.map((h, hIdx) => (
                                <th
                                  key={hIdx}
                                  className="px-4 py-2.5 text-left font-semibold text-slate-700"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {tb.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                              >
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className={`px-4 py-2.5 text-slate-800 ${
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

              {/* Grammatical Rules & Worked Examples */}
              {activeTopic.rules && activeTopic.rules.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Core Grammar Mechanics</span>
                  </div>

                  <div className="space-y-4">
                    {activeTopic.rules.map((rule, rIdx) => (
                      <div
                        key={rIdx}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                      >
                        <h4 className="text-sm font-bold text-slate-900">
                          {rule.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {rule.explanation}
                        </p>

                        {rule.examples && rule.examples.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                              Illustrative Examples:
                            </div>
                            {rule.examples.map((ex, exIdx) => (
                              <div
                                key={exIdx}
                                className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1"
                              >
                                <div className="font-serif font-bold text-slate-900 text-sm">
                                  <GrammarText content={ex.german} />
                                </div>
                                <div className="text-slate-600 italic">
                                  &ldquo;{ex.english}&rdquo;
                                </div>
                                {ex.breakdown && (
                                  <div className="text-[11px] text-indigo-700">
                                    Mechanism: {ex.breakdown}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-sm bg-white rounded-xl border border-slate-200">
              No matching grammar topics found for &ldquo;{searchTerm}&rdquo;. Try searching for &ldquo;case&rdquo;, &ldquo;verb&rdquo;, &ldquo;preposition&rdquo;, or &ldquo;connectors&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
