import React from "react";
import Link from "next/link";
import { getCurriculum } from "@/lib/content";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const curriculum = getCurriculum();

  return (
    <div className="book-page space-y-14 py-10 sm:py-14">
      {/* Title page */}
      <section className="max-w-3xl mx-auto text-center space-y-6 border-b border-rule pb-12">
        <p className="eyebrow smallcaps">Lehrbuch · Deutsch als Fremdsprache · A1–C1</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink tracking-tight font-serif leading-tight">
          Deutsch gründlich lernen.
          <span className="block text-ink-soft font-sans text-lg sm:text-xl font-normal mt-3 leading-relaxed">
            No gamification. No streak guilt. Just careful, structured instruction —
            the way a good grammar book teaches.
          </span>
        </h1>
        <p className="reading-copy mx-auto text-ink-soft">
          DeutschAcademy teaches the <strong className="text-ink">why</strong> before
          drilling the <strong className="text-ink">what</strong>. Every concept begins
          with textbook-style explanations, declension tables, colour-coded sentence
          breakdowns, and structured practice — like sitting down with a well-made
          grammar book and a patient teacher.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/learn/a1/unit-01"
            className="btn btn-primary w-full sm:w-auto justify-center"
          >
            <span>Lektion beginnen — A1, Kapitel 1</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/placement"
            className="btn btn-outline w-full sm:w-auto justify-center"
          >
            <span>Einstufungstest machen</span>
          </Link>
        </div>
      </section>

      {/* Method — three numbered sections, book-style */}
      <section className="max-w-4xl mx-auto">
        <h2 className="eyebrow smallcaps text-center mb-8">Die Methode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">
          {[
            {
              n: "§ 1",
              t: "Erst die Regel, dann die Übung",
              p: "We never force you to guess rules through trial and error. Every lesson opens with a transparent explanation, a declension matrix, and worked examples you can cite by section number.",
            },
            {
              n: "§ 2",
              t: "Satzklammer und Satzbau",
              p: "Grammar and the sentence bracket are the true backbone of German. Vocabulary is acquired inside real syntactic contexts, never as detached, isolated word lists.",
            },
            {
              n: "§ 3",
              t: "Selbst schreiben, selbst sprechen",
              p: "Passive recognition does not build fluency. You produce German with pronunciation scoring, sentence construction drills, and written composition marked like a teacher's correction.",
            },
          ].map((item) => (
            <div key={item.n} className="space-y-2">
              <span className="paragraph-num">{item.n}</span>
              <h3 className="text-base font-bold text-ink font-serif">{item.t}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{item.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum — table of contents with dotted leaders */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="border-t border-rule pt-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-ink tracking-tight font-serif">
              Inhaltsverzeichnis
            </h2>
            <p className="text-xs text-ink-soft mt-1">
              Structured modules aligned with the Common European Framework of Reference.
            </p>
          </div>
          <Link href="/grammar" className="text-xs font-semibold text-tintenblau hover:underline underline-offset-4">
            Nachschlagewerk öffnen →
          </Link>
        </div>

        <div className="space-y-10">
          {curriculum.levels.map((level) => (
            <div key={level.id} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-rule pb-2">
                <h3 className="text-lg font-bold text-ink font-serif">
                  <span className="paragraph-num mr-2">{level.id}</span>
                  {level.name}
                </h3>
                <span className="text-xs text-ink-soft">
                  ~{level.estimatedHours} Std. · {level.units.length} Kapitel
                </span>
              </div>

              <p className="text-sm text-ink-soft leading-relaxed max-w-2xl">
                {level.description}
              </p>

              <div className="space-y-1.5 pt-1">
                {level.units.map((unit) => (
                  <Link
                    key={unit.id}
                    href={`/learn/${level.id.toLowerCase()}/${unit.id}`}
                    className="toc-row group text-sm"
                  >
                    <span className="paragraph-num group-hover:text-ink">
                      {unit.number}.
                    </span>
                    <span className="text-ink group-hover:hand-underline line-clamp-1">
                      {unit.title}
                    </span>
                    <span className="leader" />
                    <span className="text-xs text-ink-soft line-clamp-1 hidden md:block max-w-[16rem]">
                      {unit.grammarFocus[0]}
                    </span>
                    <ArrowRight className="w-3 h-3 text-ink-soft opacity-0 group-hover:opacity-100 shrink-0" />
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
