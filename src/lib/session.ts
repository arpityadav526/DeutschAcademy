import { cookies } from "next/headers";
import { prisma } from "./db";

const SESSION_COOKIE_NAME = "deutschacademy_user_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  currentLevel: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      // Default to guest / demo academic user if not explicitly signed in
      const defaultUser = await getOrCreateDefaultUser();
      return defaultUser;
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionCookie.value },
      select: { id: true, email: true, name: true, currentLevel: true },
    });

    if (!user) {
      return await getOrCreateDefaultUser();
    }

    return user;
  } catch {
    return null;
  }
}

export async function getOrCreateDefaultUser(): Promise<SessionUser> {
  const existing = await prisma.user.findFirst({
    where: { email: "scholar@deutschacademy.edu" },
    select: { id: true, email: true, name: true, currentLevel: true },
  });

  if (existing) return existing;

  const created = await prisma.user.create({
    data: {
      email: "scholar@deutschacademy.edu",
      name: "German Scholar",
      passwordHash: "demo_academic_mode",
      currentLevel: "A1",
    },
    select: { id: true, email: true, name: true, currentLevel: true },
  });

  return created;
}
