"use client";

import React, { useState } from "react";
import {
  Award,
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
} from "lucide-react";
import { AudioButton } from "@/components/lesson/AudioButton";

type ExamModule = "lesen" | "hoeren" | "schreiben" | "sprechen";
type ExamLevel = "B1" | "B2";

export default function ExamPrepPage() {
  const [level, setLevel] = useState<ExamLevel>("B1");
  const [activeModule, setActiveModule] = useState<ExamModule>("lesen");
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Simple countdown timer effect
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="book-page exam-rail space-y-6" data-region="berlin">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-700" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Fahrkartenkontrolle · Goethe-Zertifikat
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prüfungstraining für B1 und B2 · Lesen, Hören, Schreiben und Sprechen.
          </p>
        </div>

        {/* Level Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLevel("B1")}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
              level === "B1"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            B1 Zertifikat
          </button>
          <button
            type="button"
            onClick={() => setLevel("B2")}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
              level === "B2"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            B2 Zertifikat
          </button>
        </div>
      </div>

      {/* Module Selector & Timed Mode Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
        {/* Module tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveModule("lesen")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeModule === "lesen"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Modul 1: Lesen (65 Min)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule("hoeren")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeModule === "hoeren"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Modul 2: Hören (40 Min)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule("schreiben")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeModule === "schreiben"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Modul 3: Schreiben (60 Min)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveModule("sprechen")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeModule === "sprechen"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Modul 4: Sprechen (15 Min)</span>
          </button>
        </div>

        {/* Exam Timer Controls */}
        <div className="flex items-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          <Clock className="w-4 h-4 text-slate-500" />
          {timerSeconds !== null ? (
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-slate-900">
                {formatTimer(timerSeconds)}
              </span>
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline"
              >
                {isTimerRunning ? "Pause" : "Resume"}
              </button>
              <button
                type="button"
                onClick={() => setTimerSeconds(null)}
                className="text-[11px] text-red-600 hover:underline"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => startTimer(activeModule === "lesen" ? 65 : 40)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200"
            >
              <Play className="w-3 h-3 text-emerald-600" />
              <span>Prüfungszeit starten</span>
            </button>
          )}
        </div>
      </div>

      {/* Module Content */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {activeModule === "lesen" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                {level} Zertifikat • Modul 1: Lesen • Teil 1
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">
                Leseverstehen: Blogbeitrag & Orientierung
              </h2>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-serif leading-relaxed text-slate-800 space-y-3">
              <div className="font-bold text-slate-900 text-base font-sans">
                Thema: &ldquo;Nachhaltiges Wohnen in deutschen Großstädten&rdquo;
              </div>
              <p>
                Immer mehr Menschen in Deutschland entscheiden sich für umweltfreundliche Wohnkonzepte. In Freiburg und Hamburg entstehen neue Stadtviertel, in denen Autos verboten sind und Solarenergie den gesamten Strombedarf deckt. Allerdings sind die Baukosten für solche Passivhäuser zunächst etwa 15 bis 20 Prozent höher als bei konventionellen Gebäuden. Auf lange Sicht sparen die Mieter jedoch erhebliche Heizkosten ein, sodass sich die Investition innerhalb weniger Jahre amortisiert.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Prüfungsfragen (Richtig / Falsch / Textbeleg):
              </div>
              <div className="p-4 rounded-lg border border-slate-200 space-y-3">
                <div className="text-sm font-semibold text-slate-900">
                  Aussage 1: In den neuen Modellvierteln in Freiburg und Hamburg sind private Autos grundsätzlich gestattet.
                </div>
                <div className="flex gap-3 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="q1" className="text-slate-900" />
                    <span>Richtig</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="q1" className="text-slate-900" />
                    <span>Falsch (Korrekt: Autos sind verboten)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeModule === "hoeren" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                {level} Zertifikat • Modul 2: Hören • Teil 1
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">
                Hörverstehen: Durchsagen & Kurznachrichten
              </h2>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Offizielle Bahnhofsdurchsage am Hauptbahnhof Berlin:
                </span>
                <AudioButton
                  text="Achtung am Gleis 12: Der ICE 804 nach Hamburg Altona über Spandau, planmäßige Abfahrt um 15 Uhr 24, fährt heute ausnahmsweise von Gleis 8 ab. Grund dafür ist eine technische Weichenstörung."
                  label="Audio abspielen (2x hören)"
                />
              </div>
              <p className="text-xs text-slate-500 italic">
                In der offiziellen Prüfung hören Sie jede Durchsage zweimal. Beachten Sie die Gleisänderung und den Grund.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 space-y-3">
              <div className="text-sm font-semibold text-slate-900">
                Von welchem Gleis fährt der ICE 804 heute ab?
              </div>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hq1" />
                  <span>Gleis 12</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hq1" />
                  <span>Gleis 8 (Korrekt laut Durchsage)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="hq1" />
                  <span>Gleis 4</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeModule === "schreiben" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                {level} Zertifikat • Modul 3: Schreiben • Aufgabe 1 (60 Min)
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">
                Schriftlicher Ausdruck: Förmliche Stellungnahme
              </h2>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900">Aufgabenstellung:</div>
              <p className="text-slate-700">
                Sie haben in einer Online-Zeitschrift einen Artikel zum Thema &ldquo;Künstliche Intelligenz am Arbeitsplatz&rdquo; gelesen. Verfassen Sie einen Leserbrief von ca. 80–100 Wörtern ({level === "B2" ? "150 Wörter" : "80 Wörter"}).
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                <li>Drücken Sie Ihre Meinung zum Einsatz von KI im Berufsalltag aus</li>
                <li>Nennen Sie einen konkreten Vorteil und ein mögliches Risiko</li>
                <li>Beschreiben Sie eigene Erfahrungen oder Beobachtungen</li>
              </ul>
            </div>

            <textarea
              rows={6}
              placeholder="Verfassen Sie Ihren Text im offiziellen Prüfungsformat..."
              className="w-full p-3 font-serif text-sm rounded border border-slate-300 focus:outline-none focus:border-slate-800"
            />
          </div>
        )}

        {activeModule === "sprechen" && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                {level} Zertifikat • Modul 4: Sprechen • Teil 2 (Präsentation)
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-serif mt-1">
                Mündlicher Ausdruck: Thema präsentieren & diskutieren
              </h2>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Präsentationsthema: &ldquo;Braucht jeder Mensch ein Auto?&rdquo;
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <p>Strukturieren Sie Ihren 3-minütigen Kurzvortrag wie folgt:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  <li>Folienstruktur vorstellen (Meine Präsentation besteht aus...)</li>
                  <li>Eigene Erfahrungen in Ihrem Heimatland schildern</li>
                  <li>Vor- und Nachteile von öffentlichem Nahverkehr vs. eigenem Pkw abwägen</li>
                  <li>Fazit ziehen und Fragen der Prüfer beantworten</li>
                </ol>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/60 rounded-lg border border-indigo-200 text-xs space-y-1 text-indigo-950">
              <div className="font-bold">Prüfungstipp:</div>
              <div>
                Verwenden Sie Redemittel für Strukturierung: &ldquo;Als Erstes möchte ich betonen...&rdquo;, &ldquo;Ein weiterer wichtiger Aspekt ist...&rdquo;, &ldquo;Zusammenfassend lässt sich sagen, dass...&rdquo;.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
