import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { action, email, password, name } = await req.json();

    if (action === "register") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          passwordHash: hash,
          currentLevel: "A1",
        },
      });

      cookies().set("deutschacademy_user_session", user.id, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    }

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      cookies().set("deutschacademy_user_session", user.id, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });

      return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    }

    if (action === "logout") {
      cookies().delete("deutschacademy_user_session");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Auth error" }, { status: 500 });
  }
}
