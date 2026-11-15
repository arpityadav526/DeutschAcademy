import React from "react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getCurriculum } from "@/lib/content";
import { PassportStamp } from "@/components/journey/JourneyUI";

const regions: Record<string, string> = { A1: "HAMBURG", A2: "KÖLN", B1: "SCHWARZWALD", B2: "BERLIN", C1: "ZUGSPITZE" };
export default async function PassportPage() {
  const user = await getCurrentUser();
  const curriculum = getCurriculum();
  const progress = user ? await prisma.userProgress.findMany({ where: { userId: user.id } }) : [];
  const passedLevels = new Set(progress.filter((item) => item.completed).map((item) => item.level.toUpperCase()));
  return <div className="book-page space-y-8"><header><p className="running-head"><span>Reisepass · Deutschland</span><span>Stempel der Ankunft</span></p><h1 className="text-4xl font-bold mt-6">Mein Reisepass</h1><p className="reading-copy">Jedes bestandene Kapitel ist ein neuer Ort auf Ihrer Reise. Every completed unit leaves its mark.</p></header><section className="passport-page"><p className="eyebrow">DeutschAcademy · Reise durch Deutschland</p><h2 className="text-2xl font-bold">Ankunftsstempel</h2><div className="passport-grid">{curriculum.levels.map((level) => <div key={level.id} className="passport-entry"><PassportStamp region={regions[level.id] || level.id} date={passedLevels.has(level.id.toUpperCase()) ? "ANGEKOMMEN" : "OFFEN"} label={passedLevels.has(level.id.toUpperCase()) ? "BESTANDEN" : "NÄCHSTE STATION"} /><span>{level.id} · {level.name}</span></div>)}</div></section></div>;
}
