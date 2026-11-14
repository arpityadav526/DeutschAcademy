import React from "react";
import { notFound } from "next/navigation";
import { getUnitContent, getCurriculum } from "@/lib/content";
import { ConceptViewer } from "@/components/lesson/ConceptViewer";
import { WorkedExamples } from "@/components/lesson/WorkedExamples";
import { VocabularyView } from "@/components/lesson/VocabularyView";
import { ReadingLab } from "@/components/lesson/ReadingLab";
import { ListeningLab } from "@/components/lesson/ListeningLab";
import { ProductionStudio } from "@/components/lesson/ProductionStudio";
import { UnitClientWrapper } from "./UnitClientWrapper";

interface PageProps {
  params: {
    level: string;
    unitId: string;
  };
}

export default function UnitPage({ params }: PageProps) {
  const { level, unitId } = params;
  const unit = getUnitContent(level, unitId);
  const curriculum = getCurriculum();

  if (!unit) {
    notFound();
  }

  // Find current and next unit for navigation
  const currentLevelData = curriculum.levels.find(
    (l) => l.id.toLowerCase() === level.toLowerCase()
  );
  const currentUnitIdx = currentLevelData?.units.findIndex((u) => u.id === unitId) ?? -1;
  const nextUnit = currentLevelData?.units[currentUnitIdx + 1];
  const prevUnit = currentLevelData?.units[currentUnitIdx - 1];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Unit Header */}
      <div className="border-b border-slate-200 pb-5 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-white uppercase tracking-wider">
            {unit.level} • Unit {unit.number}
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {unit.estimatedMinutes} min study time
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
          {unit.title}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          {unit.subtitle}
        </p>

        {/* Grammar Focus Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {unit.grammarFocus.map((focus, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Tabs & Pedagogical Flow Client Wrapper */}
      <UnitClientWrapper
        unit={unit}
        nextUnitId={nextUnit?.id}
        prevUnitId={prevUnit?.id}
      />
    </div>
  );
}
