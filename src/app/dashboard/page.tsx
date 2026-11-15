import React from "react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getCurriculum } from "@/lib/content";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const curriculum = getCurriculum();

  let userProgress: any[] = [];
  let weakSpots: any[] = [];
  let dueReviewCount = 0;
  let testAttempts: any[] = [];

  if (user) {
    userProgress = await prisma.userProgress.findMany({
      where: { userId: user.id },
    });

    weakSpots = await prisma.userWeakSpot.findMany({
      where: { userId: user.id },
      orderBy: { errorCount: "desc" },
      take: 6,
    });

    const now = new Date();
    dueReviewCount = await prisma.sRSItem.count({
      where: {
        userId: user.id,
        nextReviewDate: { lte: now },
      },
    });

    testAttempts = await prisma.testAttempt.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  }

  // Calculate level completions
  const levelStats = curriculum.levels.map((level) => {
    const totalUnits = level.units.length;
    const completedUnits = userProgress.filter(
      (p) => p.level.toLowerCase() === level.id.toLowerCase() && p.completed
    ).length;
    const percentage = Math.round((completedUnits / (totalUnits || 1)) * 100);

    return {
      levelId: level.id,
      name: level.name,
      totalUnits,
      completedUnits,
      percentage,
    };
  });

  return (
    <div className="book-page space-y-10 py-10">
      {/* Studienbuch header */}
      <header className="border-b border-rule pb-5">
        <p className="running-head">
          <span>Studienbuch · Studienlog</span>
          <span>Heute: {new Date().toLocaleDateString("de-DE")}</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight font-serif mt-5">
          Ihr Studienbuch
        </h1>
        <p className="text-sm text-ink-soft mt-1 max-w-2xl">
          A quiet record of where you stand: today&apos;s Wiederholung, weak spots to revisit,
          and the curriculum as a table of contents. Nothing here shouts — it just informs.
        </p>
      </header>

      {/* Today's line — like a diary entry */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <div className="space-y-1">
          <span className="margin-note-label">Aktuelles Niveau</span>
          <div className="text-3xl font-serif font-bold text-ink tabular-nums">
            {user?.currentLevel || "A1"}
          </div>
          <p className="text-xs text-ink-soft">
            Based on unit mastery and diagnostic evaluations
          </p>
        </div>
        <div className="space-y-1">
          <span className="margin-note-label">Heute fällig</span>
          <div className="text-3xl font-serif font-bold text-ink tabular-nums">
            {dueReviewCount}
          </div>
          <p className="text-xs text-ink-soft">
            Karten und Sätze zur Wiederholung (SM-2-Intervall)
          </p>
        </div>
        <div className="space-y-1">
          <span className="margin-note-label">A1 bestanden</span>
          <div className="text-3xl font-serif font-bold text-ink tabular-nums">
            {levelStats.find((l) => l.levelId === "A1")?.percentage || 0}
            <span className="text-lg text-ink-soft"> %</span>
          </div>
          <p className="text-xs text-ink-soft">
            {levelStats.find((l) => l.levelId === "A1")?.completedUnits || 0} von 14 Kapiteln
            mit ≥ 80 % bestanden
          </p>
        </div>
      </section>

      {/* Curriculum as table of contents with progress marks */}
      <section className="space-y-4">
        <div className="border-b border-rule pb-2 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-ink font-serif">Fortschritt im Lehrplan</h2>
          <span className="eyebrow">80 % pro Kapitel</span>
        </div>

        <div className="space-y-2">
          {levelStats.map((stat) => (
            <div key={stat.levelId} className="toc-row text-sm">
              <span className="paragraph-num">{stat.levelId}</span>
              <span className="font-medium text-ink">{stat.name}</span>
              <span className="leader" />
              <span className="text-xs text-ink-soft tabular-nums">
                {stat.completedUnits} / {stat.totalUnits} Kapitel · {stat.percentage} %
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Weak spots — ruled list, like a teacher's note page */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="border-b border-rule pb-2 flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-ink font-serif">Schwachstellen</h2>
            <Link
              href="/grammar"
              className="text-xs text-tintenblau hover:underline underline-offset-4"
            >
              Nachschlagewerk →
            </Link>
          </div>

          <div className="space-y-0">
            {weakSpots.length > 0 ? (
              weakSpots.map((ws, idx) => (
                <div
                  key={ws.id}
                  className="flex items-baseline justify-between gap-3 py-2.5 border-b border-rule last:border-b-0"
                >
                  <div>
                    <span className="text-sm font-medium text-ink block">
                      <span className="paragraph-num mr-1.5">{idx + 1}.</span>
                      {ws.grammarTopic}
                    </span>
                    <span className="text-xs text-ink-soft">
                      {ws.errorCount} protokollierte Fehler in Übungen
                    </span>
                  </div>
                  <Link
                    href="/grammar"
                    className="text-xs text-tintenblau hover:underline underline-offset-4 whitespace-nowrap"
                  >
                    Wiederholen
                  </Link>
                </div>
              ))
            ) : (
              <div className="margin-note">
                No recurring weak spots recorded yet. Mistakes during unit tests and
                exercises are automatically collected here for targeted revision.
              </div>
            )}
          </div>
        </div>

        {/* Recent tests — log entries */}
        <div className="space-y-4">
          <div className="border-b border-rule pb-2">
            <h2 className="text-lg font-bold text-ink font-serif">
              Letzte Kapiteltests
            </h2>
          </div>

          <div className="space-y-0">
            {testAttempts.length > 0 ? (
              testAttempts.map((test) => (
                <div
                  key={test.id}
                  className="flex items-baseline justify-between gap-3 py-2.5 border-b border-rule last:border-b-0"
                >
                  <div>
                    <span className="text-sm font-medium text-ink block">
                      {test.level} · Kapitel {test.unitId.replace("unit-", "")}
                    </span>
                    <span className="text-xs text-ink-soft">
                      {new Date(test.createdAt).toLocaleDateString("de-DE")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-soft tabular-nums">
                      {Math.round(test.score)} %
                    </span>
                    {test.passed ? (
                      <span className="stamp !text-[0.55rem] !px-1.5 !py-0.5 !border !tracking-[0.18em]">
                        Bestanden
                      </span>
                    ) : (
                      <span className="margin-red text-xs">Wiederholen</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="margin-note">
                No evaluation attempts recorded yet. Complete unit review tests to
                populate this log.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="pt-2">
        <Link href="/review" className="btn btn-primary">
          Wiederholung beginnen ({dueReviewCount} fällig)
        </Link>
      </div>
    </div>
  );
}
