import React from "react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getCurriculum } from "@/lib/content";
import { AltitudeMeter, DepartureBoard, RouteMap, PassportStamp, Wegweiser } from "@/components/journey/JourneyUI";
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

  const currentLevel = (user?.currentLevel || "A1").toUpperCase();
  const currentRegion = ({ A1: "hamburg", A2: "koeln", B1: "schwarzwald", B2: "berlin", C1: "alpen" } as const)[currentLevel as "A1" | "A2" | "B1" | "B2" | "C1"] || "hamburg";
  const altitude = ({ A1: 0, A2: 37, B1: 1493, B2: 2400, C1: 2962 } as const)[currentLevel as "A1" | "A2" | "B1" | "B2" | "C1"] || 0;
  const journeyProgress = Math.round((altitude / 2962) * 100);

  return (
    <div className="book-page space-y-10 py-10" data-region={currentRegion}>
      {/* Studienbuch header */}
      <header className="border-b border-rule pb-5">
        <p className="running-head">
          <span>Reiseplan · Studienbuch</span>
          <span>Heute: {new Date().toLocaleDateString("de-DE")}</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight font-serif mt-5">
          Ihr Reiseplan
        </h1>
        <p className="text-sm text-ink-soft mt-1 max-w-2xl">
          Your route through Germany: today&apos;s departures, topics to revisit, current station and the height still ahead.
        </p>
      </header>

      <section className="journey-dashboard-top">
        <RouteMap active={currentRegion} />
        <AltitudeMeter altitude={altitude} progress={journeyProgress} />
        <div className="journey-today">
          <div className="space-y-1"><span className="margin-note-label">Aktuelle Station</span><div className="text-3xl font-bold text-ink">{currentLevel}</div><p className="text-xs text-ink-soft">{altitude.toLocaleString("de-DE")} m · Reisestrecke {journeyProgress} %</p></div>
          <div className="space-y-1"><span className="margin-note-label">Heute fällig</span><div className="text-3xl font-bold text-ink">{dueReviewCount}</div><p className="text-xs text-ink-soft">Karten und Sätze zur Wiederholung</p></div>
          <div className="space-y-1"><span className="margin-note-label">A1 angekommen</span><div className="text-3xl font-bold text-ink">{levelStats.find((l) => l.levelId === "A1")?.completedUnits || 0}<span className="text-base"> / 14</span></div><p className="text-xs text-ink-soft">Kapitel bestanden</p></div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink font-serif">Abfahrt · Heute</h2>
        <DepartureBoard rows={dueReviewCount ? [{ title: "Wiederholung · " + dueReviewCount + " fällige Karten", track: "3", time: "pünktlich", status: "Abfahrt" }, { title: "Grammatik wiederholen", track: "2", time: "bereit", status: "Einfahrt" }] : [{ title: "Keine fälligen Wiederholungen", track: "—", time: "frei", status: "Pünktlich" }]} />
        {dueReviewCount > 0 && <Link href="/review" className="btn btn-primary">Zum Gleis · Wiederholung öffnen →</Link>}
      </section>

      {/* Curriculum as route schedule */}
      <section className="space-y-4">
        <div className="border-b border-rule pb-2 flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-ink font-serif">Fahrplan · Stationen</h2>
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
            <h2 className="text-lg font-bold text-ink font-serif">Verspätungen · Themen zur Wiederholung</h2>
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
                No delays logged. When a grammar rule needs more practice, it will appear here as a station to revisit.
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

      <section className="passport-preview">
        <div><p className="eyebrow">Reisepass · Ihre bisherigen Ankünfte</p><h2>Stempel gesammelt</h2><p>Nach bestandenen Kapiteln wartet ein neuer Eintrag für Ihren Reisepass.</p></div>
        <div className="passport-stamps-row">{levelStats.filter((level) => level.completedUnits > 0).map((level) => <PassportStamp key={level.levelId} region={level.levelId} label="BESTANDEN" />)}{!levelStats.some((level) => level.completedUnits > 0) && <PassportStamp region="HAMBURG" label="ERSTE STATION" />}</div>
        <Wegweiser label="Reisepass ansehen" href="/reisepass" />
      </section>
    </div>
  );
}
