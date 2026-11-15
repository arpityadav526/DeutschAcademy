import React from "react";
import { RegionScene, type RegionKey } from "@/components/illustrations/RegionScenes";
import { TrainMark } from "@/components/illustrations/TrainMark";

export function Ampelmann({ state }: { state: "correct" | "wrong" }) {
  const green = state === "correct";
  return (
    <svg
      width="34"
      height="48"
      viewBox="0 0 34 48"
      role="img"
      aria-label={green ? "Richtig" : "Falsch"}
    >
      <rect
        x="1"
        y="1"
        width="32"
        height="46"
        rx="5"
        fill={green ? "var(--signal-green)" : "var(--signal-red)"}
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <circle cx="17" cy="10" r="4" fill="var(--paper)" />
      {green ? (
        <path
          d="M17 15v13m0-8-8 6m8-6 7 6m-7 2-8 11m8-11 9 9"
          fill="none"
          stroke="var(--paper)"
          strokeWidth="3.5"
          strokeLinecap="square"
        />
      ) : (
        <path
          d="M17 15v19m0-13-7 8m7-8 7 8m-7 5-6 8m6-8 6 8"
          fill="none"
          stroke="var(--paper)"
          strokeWidth="3.5"
          strokeLinecap="square"
        />
      )}
    </svg>
  );
}

export function DepartureBoard({
  rows = [
    {
      title: "Dativ-Präpositionen",
      track: "3",
      time: "pünktlich",
      status: "Abfahrt",
    },
    {
      title: "Artikel im Akkusativ",
      track: "2",
      time: "+ 4 min",
      status: "Verspätung",
    },
    {
      title: "Verbzweitstellung",
      track: "1",
      time: "bereit",
      status: "Einfahrt",
    },
  ],
}: {
  rows?: { title: string; track: string; time: string; status: string }[];
}) {
  return (
    <section
      className="departure-board"
      aria-label="Abfahrtstafel für Wiederholungen"
    >
      <div className="board-head">
        <span>Abfahrt · Wiederholung</span>
        <span>Heute</span>
      </div>
      {rows.map((row, index) => (
        <div className="board-row" key={`${row.title}-${index}`}>
          <span className="board-time">{row.status}</span>
          <span className="board-destination">{row.title}</span>
          <span className="board-track">Gl. {row.track}</span>
          <span className="board-status">{row.time}</span>
        </div>
      ))}
      <div className="board-footer">
        Bitte achten Sie auf die Durchsage. · Please mind the announcement.
      </div>
    </section>
  );
}

export function PassportStamp({
  region,
  date = "15 NOV 2026",
  label = "ANGEKOMMEN",
}: {
  region: string;
  date?: string;
  label?: string;
}) {
  return (
    <div className="passport-stamp" aria-label={`${label}: ${region}, ${date}`}>
      <span className="stamp-ring">DEUTSCHLAND · REISEPASS</span>
      <strong>{region}</strong>
      <span className="stamp-label">{label}</span>
      <small>{date}</small>
    </div>
  );
}

export function Postcard({
  region,
  greeting,
  children,
}: {
  region: RegionKey;
  greeting: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`postcard postcard-${region}`} data-region={region}>
      <div className="postcard-art" aria-hidden="true">
        <RegionScene region={region} className="postcard-scene" />
        <span className="postcard-art-label">{regionArt[region]}</span>
      </div>
      <div className="postcard-copy">
        <p className="postcard-kicker">Grüße aus {regionNames[region]}</p>
        <h2>{greeting}</h2>
        <div className="postcard-message">{children}</div>
        <div className="postcard-postmark">
          DEUTSCHLAND
          <br />
          {region.toUpperCase()}
        </div>
      </div>
    </article>
  );
}

const regionNames: Record<RegionKey, string> = {
  hamburg: "Hamburg",
  koeln: "Köln",
  schwarzwald: "dem Schwarzwald",
  berlin: "Berlin",
  alpen: "den Alpen",
};
const regionArt: Record<RegionKey, string> = {
  hamburg: "HAFEN",
  koeln: "RHEIN",
  schwarzwald: "WALD",
  berlin: "BERLIN",
  alpen: "ZUGSPITZE",
};

export function Wegweiser({
  label,
  direction = "→",
  href = "#",
}: {
  label: string;
  direction?: string;
  href?: string;
}) {
  return (
    <a href={href} className="wegweiser">
      <span className="sign-arrow">{direction}</span>
      <span>{label}</span>
    </a>
  );
}

export function FachwerkDivider() {
  return (
    <div className="fachwerk-divider" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export function AltitudeMeter({
  altitude,
  progress = 0,
}: {
  altitude: number;
  progress?: number;
}) {
  return (
    <div
      className="altitude-meter"
      aria-label={`Höhe ${altitude} Meter; ${progress} Prozent der Reise`}
    >
      <div className="altitude-rail">
        <span
          style={{ bottom: `${Math.max(0, Math.min(progress, 100))}%` }}
          className="altitude-marker"
        >
          ▲
        </span>
      </div>
      <div className="altitude-labels">
        <span>2.962 m · Zugspitze</span>
        <strong>{altitude.toLocaleString("de-DE")} m</strong>
        <span>0 m · Nordsee</span>
      </div>
    </div>
  );
}

export function RouteMap({
  active = "hamburg",
  stations = ["Hamburg", "Köln", "Schwarzwald", "Berlin", "Zugspitze"],
}: {
  active?: RegionKey;
  stations?: string[];
}) {
  const keys: RegionKey[] = [
    "hamburg",
    "koeln",
    "schwarzwald",
    "berlin",
    "alpen",
  ];
  const activeIndex = keys.indexOf(active);
  return (
    <div className="route-map" aria-label="Reiseroute durch Deutschland">
      <svg viewBox="0 0 210 390" className="route-outline" aria-hidden="true">
        <path
          d="M87 15l60 27-8 42 35 40-21 44 18 38-34 26 3 42-31 27 9 35-43 41-37-24 9-44-25-28 13-43-20-40 25-46-3-43 39-32z"
          fill="var(--region-wash)"
          stroke="var(--ink)"
          strokeWidth="4"
        />
        <path
          d="M95 41C57 93 142 106 92 151s60 51 0 91 31 61-10 105"
          fill="none"
          stroke="var(--region-accent)"
          strokeWidth="7"
          strokeDasharray="10 8"
        />
      </svg>
      <ol className="route-stations">
        {stations.map((station, index) => (
          <li
            key={station}
            className={
              index === activeIndex
                ? "station active"
                : index < activeIndex
                  ? "station passed"
                  : "station"
            }
          >
            <span className="station-dot">
              {index < activeIndex ? "✓" : index + 1}
            </span>
            <span>{station}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
