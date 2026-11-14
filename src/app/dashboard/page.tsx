import React from "react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getCurriculum } from "@/lib/content";
import Link from "next/link";
import {
  Brain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Compass,
} from "lucide-react";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            Academic Performance Radar
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif mt-1">
            Learner Progress & Grammar Diagnostics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective, informational feedback on curriculum advancement, weak spots, and spaced retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/review"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-300" />
            <span>Review Queue ({dueReviewCount} Due)</span>
          </Link>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Current Estimated CEFR Tier
          </div>
          <div className="text-3xl font-bold font-serif text-slate-900">
            {user?.currentLevel || "A1"}
          </div>
          <div className="text-xs text-slate-500">
            Based on unit mastery and diagnostic evaluations
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Daily SRS Retention Queue
          </div>
          <div className="text-3xl font-bold font-serif text-slate-900">
            {dueReviewCount}
          </div>
          <div className="text-xs text-slate-500">
            Sentences and vocabulary scheduled for SM-2 review today
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            A1 Breakthrough Mastery
          </div>
          <div className="text-3xl font-bold font-serif text-slate-900">
            {levelStats.find((l) => l.levelId === "A1")?.percentage || 0}%
          </div>
          <div className="text-xs text-slate-500">
            {levelStats.find((l) => l.levelId === "A1")?.completedUnits || 0} of 14 A1 units passed with ≥80%
          </div>
        </div>
      </div>

      {/* CEFR Level Progress Breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Curriculum Completion by Level
          </h2>
          <span className="text-xs text-slate-400 font-mono">80% passing threshold per unit</span>
        </div>

        <div className="space-y-4">
          {levelStats.map((stat) => (
            <div key={stat.levelId} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  {stat.name}
                </span>
                <span className="font-mono text-slate-600">
                  {stat.completedUnits} / {stat.totalUnits} Units ({stat.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className="bg-slate-900 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak-Spot Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">
                Weak-Spot Diagnostic Tracking
              </h2>
            </div>
            <Link
              href="/grammar"
              className="text-xs text-indigo-700 hover:text-indigo-900 font-medium"
            >
              Grammar Handbook →
            </Link>
          </div>

          <div className="space-y-2.5">
            {weakSpots.length > 0 ? (
              weakSpots.map((ws) => (
                <div
                  key={ws.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      {ws.grammarTopic}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {ws.errorCount} logged mistake{ws.errorCount > 1 ? "s" : ""} during drills
                    </span>
                  </div>
                  <Link
                    href={`/grammar`}
                    className="px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-100"
                  >
                    Targeted Review
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No recurring weak spots recorded yet. Mistakes during unit tests and exercises are automatically categorized here for targeted remediation.
              </div>
            )}
          </div>
        </div>

        {/* Recent Test Attempts */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Recent Unit Mastery Evaluations
            </h2>
          </div>

          <div className="space-y-2.5">
            {testAttempts.length > 0 ? (
              testAttempts.map((test) => (
                <div
                  key={test.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900">
                      {test.level} • {test.unitId}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        test.passed
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {Math.round(test.score)}%
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">
                      {test.passed ? "Mastered" : "Review needed"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                No evaluation attempts recorded yet. Complete unit review tests to populate diagnostic analytics.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
