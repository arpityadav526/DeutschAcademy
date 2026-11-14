import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { level, unitId, score, passed, weakSpots } = await req.json();

    // 1. Record Test Attempt
    await prisma.testAttempt.create({
      data: {
        userId: user.id,
        level,
        unitId,
        score,
        passed,
      },
    });

    // 2. Update or Create UserProgress
    await prisma.userProgress.upsert({
      where: {
        userId_level_unitId: {
          userId: user.id,
          level,
          unitId,
        },
      },
      update: {
        completed: passed,
        score: Math.max(score, 0),
        lastStudied: new Date(),
      },
      create: {
        userId: user.id,
        level,
        unitId,
        completed: passed,
        score,
        lastStudied: new Date(),
      },
    });

    // 3. Track weak spots
    if (weakSpots && Array.isArray(weakSpots) && weakSpots.length > 0) {
      for (const topic of weakSpots) {
        await prisma.userWeakSpot.upsert({
          where: {
            userId_grammarTopic: {
              userId: user.id,
              grammarTopic: topic,
            },
          },
          update: {
            errorCount: { increment: 1 },
            lastErrorAt: new Date(),
          },
          create: {
            userId: user.id,
            grammarTopic: topic,
            errorCount: 1,
            lastErrorAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to record progress" }, { status: 500 });
  }
}
