import React from "react";
import { getAllGrammarTopics } from "@/lib/content";
import { GrammarHandbookClient } from "./GrammarHandbookClient";

export default function GrammarReferencePage() {
  const topics = getAllGrammarTopics();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
          Searchable Grammar Reference Handbook
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          A definitive, quick-access reference for German cases, prepositions, verb declensions, and sentence structures.
        </p>
      </div>

      <GrammarHandbookClient topics={topics} />
    </div>
  );
}
