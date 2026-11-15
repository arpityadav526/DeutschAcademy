import React from "react";
import {
  RegionScene,
  type RegionKey,
} from "@/components/illustrations/RegionScenes";
import {
  AltitudeMeter,
  Ampelmann,
  DepartureBoard,
  FachwerkDivider,
  PassportStamp,
  Postcard,
  RouteMap,
  Wegweiser,
} from "@/components/journey/JourneyUI";

const regions: { id: RegionKey; title: string; level: string }[] = [
  { id: "hamburg", title: "Nordsee & Hamburg", level: "A1" },
  { id: "koeln", title: "Rhein & Köln", level: "A2" },
  { id: "schwarzwald", title: "Schwarzwald", level: "B1" },
  { id: "berlin", title: "Berlin", level: "B2" },
  { id: "alpen", title: "Alpen & Zugspitze", level: "C1" },
];

export default function DesignSystemPage() {
  return (
    <div className="book-page design-system space-y-12">
      <header className="region-banner" data-region="hamburg">
        <p className="eyebrow">DeutschAcademy · Designhandbuch</p>
        <h1>
          Die Reise <span>— Gestaltungssystem</span>
        </h1>
        <p>
          Fünf Regionen, eine Route. A railway journey through German language
          and place.
        </p>
      </header>

      <section className="space-y-4">
        <header className="ds-section-head">
          <span>01</span>
          <h2>Regionen · fünf Farbwelten</h2>
        </header>
        <div className="region-swatch-grid">
          {regions.map((region) => (
            <article
              key={region.id}
              className="region-swatch"
              data-region={region.id}
            >
              <RegionScene region={region.id} className="region-mini-scene" />
              <div>
                <span>{region.level}</span>
                <h3>{region.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <header className="ds-section-head">
          <span>02</span>
          <h2>Schrift · Type scale</h2>
        </header>
        <div className="type-specimen">
          <p className="type-sign">DIN WAYFINDING · BARLOW CONDENSED</p>
          <h2 className="type-display">Der Zug fährt weiter.</h2>
          <p className="type-reading">
            Am Bahnhof wartet der Zug nach Süden. Lernen Sie ein Kapitel, dann
            erreichen Sie die nächste Station.{" "}
            <i>Every new rule takes you somewhere.</i>
          </p>
          <p className="type-caption">KAPITEL 3 · § 3.2 · BESCHILDERUNG</p>
        </div>
      </section>

      <section className="space-y-4">
        <header className="ds-section-head">
          <span>03</span>
          <h2>Bahnhof · Abfahrtstafel</h2>
        </header>
        <DepartureBoard />
      </section>

      <section className="space-y-4">
        <header className="ds-section-head">
          <span>04</span>
          <h2>Reisepass · Stempel und Ampelmännchen</h2>
        </header>
        <div className="ds-inline">
          <PassportStamp region="Hamburg" />
          <PassportStamp
            region="KÖLN Hbf"
            label="BESTANDEN"
            date="12 JUN 2026"
          />
          <div className="ampel-showcase">
            <Ampelmann state="correct" />
            <Ampelmann state="wrong" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <header className="ds-section-head">
          <span>05</span>
          <h2>Postkarte · aus dem Lerngebiet</h2>
        </header>
        <Postcard region="koeln" greeting="Liebe Grüße vom Rhein!">
          Heute habe ich den Dativ geübt. Der Dom ist wirklich beeindruckend.
        </Postcard>
      </section>

      <section className="space-y-4">
        <header className="ds-section-head">
          <span>06</span>
          <h2>Wegweiser · Fachwerk · Höhenmeter</h2>
        </header>
        <div className="ds-inline">
          <Wegweiser label="Weiter zum nächsten Kapitel" />
          <Wegweiser label="Nachschlagewerk" direction="←" />
          <FachwerkDivider />
        </div>
        <div className="ds-inline">
          <RouteMap active="schwarzwald" />
          <AltitudeMeter altitude={1460} progress={52} />
        </div>
      </section>

      <section className="space-y-4">
        <header className="ds-section-head">
          <span>07</span>
          <h2>Übung · Tabelle · Rückmeldung</h2>
        </header>
        <div className="table-scroll">
          <table className="journey-table">
            <thead>
              <tr>
                <th>Kasus</th>
                <th>Maskulin</th>
                <th>Feminin</th>
                <th>Neutrum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Nominativ <small>Nom.</small>
                </td>
                <td>der Zug</td>
                <td>die Karte</td>
                <td>das Gleis</td>
              </tr>
              <tr>
                <td>
                  Akkusativ <small>Akk.</small>
                </td>
                <td>
                  <mark>den Zug</mark>
                </td>
                <td>die Karte</td>
                <td>das Gleis</td>
              </tr>
              <tr>
                <td>
                  Dativ <small>Dat.</small>
                </td>
                <td>dem Zug</td>
                <td>der Karte</td>
                <td>dem Gleis</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="exercise-demo">
          <p>
            Ich fahre mit{" "}
            <input
              className="journey-blank"
              aria-label="Beispielantwort"
              placeholder="dem Zug"
            />{" "}
            nach Köln.
          </p>
          <div className="ds-inline">
            <div className="feedback-demo">
              <Ampelmann state="correct" />
              <span>Richtig — mit verlangt den Dativ.</span>
            </div>
            <div className="feedback-demo wrong">
              <Ampelmann state="wrong" />
              <span>Achtung: mit dem Zug, nicht mit den Zug.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
