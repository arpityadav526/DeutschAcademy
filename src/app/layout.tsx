import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/navigation/Header";

export const metadata: Metadata = {
  title: "DeutschAcademy — Academic German Learning (A1 to C1)",
  description:
    "A structured, teaching-first German language platform that guides learners systematically from zero to B2 and C1. Built on conceptual explanations, rigorous grammar, active production, and contextual spaced repetition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500 text-center">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <p className="font-medium text-slate-700">
              DeutschAcademy — Teaching-First German Platform
            </p>
            <p>
              Pedagogical rigor from CEFR A1 to C1 • No gimmicks, streaks, or gamification • Pure conceptual acquisition
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
