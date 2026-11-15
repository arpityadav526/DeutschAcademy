import React from "react";
import Link from "next/link";
import { getCurriculum } from "@/lib/content";
import { JourneyPanorama, RegionKey } from "@/components/illustrations/RegionScenes";
import { Wegweiser } from "@/components/journey/JourneyUI";

const regionFor = (level: string): RegionKey => ({ A1: "hamburg", A2: "koeln", B1: "schwarzwald", B2: "berlin", C1: "alpen" }[level] as RegionKey) || "hamburg";

export default function HomePage() {
  const curriculum = getCurriculum();
  const route = ["hamburg", "koeln", "schwarzwald", "berlin", "alpen"] as RegionKey[];
  return (
    <div className="home-journey">
      <section className="home-title" data-region="hamburg">
        <div className="home-title-copy">
          <p className="home-kicker">DeutschAcademy · Eine Reise durch Deutschland</p>
          <h1><span className="home-wordmark">Die Reise</span><br />beginnt am Meer.</h1>
          <p className="home-intro">Von der Nordseeküste bis zum Gipfel der Zugspitze: Jede neue Regel bringt dich zu einer neuen Station. Learn German one region at a time.</p>
          <Link href="/learn/a1/unit-01" className="fare-ticket"><span>▰</span> Weiterlernen <span>→</span></Link>
          <div className="home-links"><Link href="/placement">Fahrkartenkontrolle · Einstufungstest</Link><Link href="/grammar">Nachschlagewerk</Link></div>
        </div>
        <div className="home-height" aria-label="Ziel: 2.962 Meter">2.962 <small>m · Zugspitze</small></div>
      </section>

      <section className="home-panorama-wrap">
        <div className="panorama-caption"><span>Die Strecke · 0 m → 2.962 m</span><span>Hamburg Hbf — Zugspitze</span></div>
        <JourneyPanorama />
      </section>

      <section className="home-route-list">
        <div className="route-intro"><p className="eyebrow">Fünf Regionen · Fünf Lernwelten</p><h2>Der Weg nach oben</h2><p>Beginne mit den Grundlagen am Meer. Unterwegs warten Fachwerk, Großstadt und Alpenluft.</p></div>
        <div className="route-stops">
          {curriculum.levels.map((level, index) => {
            const region = route[index] || regionFor(level.id);
            return <Link key={level.id} href={`/learn/${level.id.toLowerCase()}/unit-01`} className="route-stop" data-region={region}>
              <span className="stop-km">{["0 m", "37 m", "1.493 m", "34 m", "2.962 m"][index]}</span>
              <span className="stop-station">{level.id}</span>
              <span className="stop-place">{["Hamburg · Nordsee", "Köln · Rhein", "Schwarzwald", "Berlin", "Zugspitze"][index]}</span>
              <span className="stop-units">{level.units.length} Kapitel <b>→</b></span>
              <span className="stop-track" />
            </Link>;
          })}
        </div>
      </section>
      <section className="home-signs"><Wegweiser label="Zum Nachschlagewerk" href="/grammar" /><Wegweiser label="Zum Studienbuch" href="/dashboard" direction="→" /></section>
    </div>
  );
}
