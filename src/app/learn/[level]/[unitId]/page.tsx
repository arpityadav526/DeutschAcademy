import React from "react";
import { notFound } from "next/navigation";
import { getUnitContent, getCurriculum } from "@/lib/content";
import { UnitClientWrapper } from "./UnitClientWrapper";
import { RegionKey, RegionScene } from "@/components/illustrations/RegionScenes";
import { Postcard } from "@/components/journey/JourneyUI";

interface PageProps { params: { level: string; unitId: string } }
const regionFor = (level: string): RegionKey => ({ a1: "hamburg", a2: "koeln", b1: "schwarzwald", b2: "berlin", c1: "alpen" }[level.toLowerCase()] as RegionKey) || "hamburg";
const regionNames: Record<RegionKey, string> = { hamburg: "Nordsee & Hamburg", koeln: "Rhein & Köln", schwarzwald: "Schwarzwald", berlin: "Berlin", alpen: "Alpen & Zugspitze" };
const altitudeFor = (level: string): string => ({ a1:"0 m",a2:"37 m",b1:"1.493 m",b2:"34 m",c1:"2.962 m" }[level.toLowerCase()] || "0 m");

export default function UnitPage({ params }: PageProps) {
  const { level, unitId } = params;
  const unit = getUnitContent(level, unitId);
  const curriculum = getCurriculum();
  if (!unit) notFound();
  const currentLevelData = curriculum.levels.find((l) => l.id.toLowerCase() === level.toLowerCase());
  const currentUnitIdx = currentLevelData?.units.findIndex((u) => u.id === unitId) ?? -1;
  const nextUnit = currentLevelData?.units[currentUnitIdx + 1];
  const prevUnit = currentLevelData?.units[currentUnitIdx - 1];
  const region = regionFor(unit.level);

  return (
    <div className="lesson-page" data-region={region}>
      <section className="lesson-region-banner">
        <RegionScene region={region} className="lesson-region-art" />
        <div className="lesson-region-overlay">
          <p className="lesson-route-label">{unit.level} · {regionNames[region]} · {altitudeFor(unit.level)}</p>
          <h1><span>Kapitel {unit.number}</span>{unit.title}</h1>
          <p className="lesson-subtitle">{unit.subtitle}</p>
          <div className="lesson-focus">{unit.grammarFocus.map((focus, idx) => <span key={idx}>{focus}</span>)}</div>
        </div>
      </section>
      <div className="lesson-runningline"><span>DEUTSCHLAND · {regionNames[region]}</span><span>§ {unit.number}.1 · {unit.estimatedMinutes} min</span></div>
      <main className="lesson-book-layout">
        <div className="lesson-main-column">
          <Postcard region={region} greeting={region === "hamburg" ? "Moin! Willkommen im Norden." : region === "koeln" ? "Tach! Grüße vom Rhein." : region === "schwarzwald" ? "Grüß Gott aus dem Wald." : region === "berlin" ? "Guten Tag aus Berlin." : "Grüße vom Gipfel!"}>
            Kapitel {unit.number}: {unit.title}. {unit.subtitle}
          </Postcard>
          <div className="lesson-section-rule"><span>Fachwerk · Kapitel {unit.number}</span></div>
          <UnitClientWrapper unit={unit} nextUnitId={nextUnit?.id} prevUnitId={prevUnit?.id} />
        </div>
        <aside className="lesson-margin">
          <div className="lesson-margin-station"><span>AKTUELLE STATION</span><strong>{unit.level}</strong><b>{regionNames[region]}</b><small>{altitudeFor(unit.level)} über dem Meer</small></div>
          <div className="lesson-margin-note"><span>REISETIPP</span><p>Eine Station nach der anderen. Lies die Regel, prüfe das Beispiel und nimm dir Zeit für die Übung.</p></div>
          <a href="/grammar" className="lesson-reference">Nachschlagewerk öffnen →</a>
        </aside>
      </main>
    </div>
  );
}
