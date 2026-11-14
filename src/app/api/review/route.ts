import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { calculateSM2 } from "@/lib/srs";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");

    const now = new Date();

    if (mode === "all") {
      const items = await prisma.sRSItem.findMany({
        where: { userId: user.id },
        orderBy: { nextReviewDate: "asc" },
      });
      return NextResponse.json({ items });
    }

    // Due items: nextReviewDate is on or before now
    const dueItems = await prisma.sRSItem.findMany({
      where: {
        userId: user.id,
        nextReviewDate: { lte: now },
      },
      orderBy: { nextReviewDate: "asc" },
      take: 50,
    });

    return NextResponse.json({ items: dueItems });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    // Action: Add new item to review queue
    if (action === "create") {
      const { itemType, prompt, answer, translation, grammarTopic, explanation } = body;

      const item = await prisma.sRSItem.create({
        data: {
          userId: user.id,
          itemType: itemType || "sentence",
          prompt,
          answer,
          translation: translation || "",
          grammarTopic: grammarTopic || "general",
          explanation: explanation || "",
          repetition: 0,
          interval: 1,
          easeFactor: 2.5,
          nextReviewDate: new Date(),
        },
      });

      return NextResponse.json({ success: true, item });
    }

    // Action: Grade and schedule SM-2 review
    if (action === "review") {
      const { itemId, quality } = body; // quality 0 to 5

      const existing = await prisma.sRSItem.findUnique({
        where: { id: itemId },
      });

      if (!existing || existing.userId !== user.id) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }

      const sm2 = calculateSM2(
        quality,
        existing.repetition,
        existing.interval,
        existing.easeFactor
      );

      const updated = await prisma.sRSItem.update({
        where: { id: itemId },
        data: {
          repetition: sm2.repetition,
          interval: sm2.interval,
          easeFactor: sm2.easeFactor,
          nextReviewDate: sm2.nextReviewDate,
          lastReviewed: new Date(),
        },
      });

      // If user failed (quality < 3), log a weak spot
      if (quality < 3 && existing.grammarTopic) {
        await prisma.userWeakSpot.upsert({
          where: {
            userId_grammarTopic: {
              userId: user.id,
              grammarTopic: existing.grammarTopic,
            },
          },
          update: {
            errorCount: { increment: 1 },
            lastErrorAt: new Date(),
          },
          create: {
            userId: user.id,
            grammarTopic: existing.grammarTopic,
            errorCount: 1,
            lastErrorAt: new Date(),
          },
        });
      }

      return NextResponse.json({ success: true, item: updated, sm2 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
