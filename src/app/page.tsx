import React from "react";
import Link from "next/link";
import { getCurriculum } from "@/lib/content";
import {
  BookOpen,
  Compass,
  Brain,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const curriculum = getCurriculum();

  return (
    <div className="space-y-16 py-10 sm:py-16">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300 bg-white text-xs font-mono font-medium text-slate-700 shadow-xs">
          <GraduationCap className="w-3.5 h-3.5 text-slate-800" />
          <span>Teaching-First Pedagogical German Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-serif leading-tight">
          Master German from Zero to B2.
          <span className="block text-slate-600 font-sans text-2xl sm:text-3xl font-normal mt-2">
            No gamification. No streak guilt. Just pure grammatical mastery.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          DeutschAcademy teaches the <strong>WHY</strong> before drilling the <strong>WHAT</strong>. Every concept begins with rigorous textbook-style explanations, color-coded sentence breakdowns, contextual practice, and active spoken and written production.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/learn/a1/unit-01"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm"
          >
            <span>Start Level A1 (Unit 1: Phonetics)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/placement"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 font-medium text-sm transition-all bg-white"
          >
            <Compass className="w-4 h-4 text-slate-600" />
            <span>Take Adaptive Placement Test</span>
          </Link>
        </div>
      </section>

      {/* Core Pedagogical Philosophy Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-slate-200 pt-10">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-500 text-center mb-8">
            Our Core Pedagogical Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-9 h-9 rounded bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-base mb-3">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Teach the WHY Before the WHAT
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We never force you to guess rules through repetitive trial-and-error. Every lesson begins with transparent grammatical explanations, declension matrices, and syntactic rules.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-9 h-9 rounded bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base mb-3">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Sentence-Building & Grammar Backbone
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Grammar and sentence brackets (Satzklammer) are the true backbone of German. Vocabulary is acquired inside real syntactic contexts, never as detached, isolated word flashcards.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
              <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base mb-3">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Active Production: Speak & Write
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Passive recognition does not build fluency. Produce German with Web Speech pronunciation scoring, sentence construction drills, and structured written composition with rubric feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Breakdown Map */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-t border-slate-200 pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-serif">
              Complete CEFR Curriculum Map (A1 to C1)
            </h2>
            <p className="text-xs text-slate-500">
              Structured progressive modules aligned with the Common European Framework of Reference for Languages.
            </p>
          </div>
          <Link
            href="/grammar"
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open Searchable Grammar Handbook →</span>
          </Link>
        </div>

        <div className="space-y-4">
          {curriculum.levels.map((level) => (
            <div
              key={level.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-md bg-slate-900 text-white font-mono font-bold text-sm flex items-center justify-center">
                    {level.id}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {level.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      ~{level.estimatedHours} hours • {level.units.length} comprehensive units
                    </p>
                  </div>
                </div>

                <Link
                  href={`/learn/${level.id.toLowerCase()}/unit-01`}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors self-start sm:self-auto"
                >
                  <span>Explore {level.id} Units</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {level.description}
              </p>

              {/* Units Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {level.units.map((unit) => (
                  <Link
                    key={unit.id}
                    href={`/learn/${level.id.toLowerCase()}/${unit.id}`}
                    className="p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors text-left flex items-start gap-2 group"
                  >
                    <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-slate-900 mt-0.5">
                      {unit.number}.
                    </span>
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 line-clamp-1">
                        {unit.title}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">
                        {unit.grammarFocus.join(", ")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
