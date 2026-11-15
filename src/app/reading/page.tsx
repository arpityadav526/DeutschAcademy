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
    <div className="book-page reading-library space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-700" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
            Lesesaal · Leseverstehen
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Texts to read on your journey, from the first station onward.
        </p>
      </div>

      <div className="space-y-12">
        {readingPassages.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>{item.unitTitle}</span>
              <Link
                href={item.unitLink}
                className="text-tintenblau hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Zur ganzen Lektion</span>
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
