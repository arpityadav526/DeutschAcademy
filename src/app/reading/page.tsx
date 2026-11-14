import React from "react";
import { getAllUnitsForLevel } from "@/lib/content";
import { ReadingLab } from "@/components/lesson/ReadingLab";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function ReadingLibraryPage() {
  const a1Units = getAllUnitsForLevel("a1");
  const a2Units = getAllUnitsForLevel("a2");

  const readingPassages = [
    ...a1Units
      .filter((u) => u.readingPassage)
      .map((u) => ({
        unitTitle: `A1 Unit ${u.number}: ${u.title}`,
        unitLink: `/learn/a1/${u.id}`,
        passage: u.readingPassage!,
      })),
    ...a2Units
      .filter((u) => u.readingPassage)
      .map((u) => ({
        unitTitle: `A2 Unit ${u.number}: ${u.title}`,
        unitLink: `/learn/a2/${u.id}`,
        passage: u.readingPassage!,
      })),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-700" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            Graded Reading Lab (Leseverstehen)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Graded, authentic German texts across CEFR levels with interactive word glosses and sentence saving for spaced repetition.
        </p>
      </div>

      <div className="space-y-12">
        {readingPassages.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>{item.unitTitle}</span>
              <Link
                href={item.unitLink}
                className="text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 font-medium"
              >
                <span>Go to full unit lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <ReadingLab passage={item.passage} />
          </div>
        ))}
      </div>
    </div>
  );
}
