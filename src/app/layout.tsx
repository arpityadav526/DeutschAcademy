import type { Metadata } from "next";
import "./globals.css";
import { Source_Serif_4, Barlow_Condensed, UnifrakturCook } from "next/font/google";
import { Header } from "@/components/navigation/Header";

const serifReading = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-reading",
});

const wayfinding = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-interface",
});

const frakturWordmark = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraktur",
});

export const metadata: Metadata = {
  title: "DeutschAcademy — Academic German Learning (A1 to C1)",
  description:
    "A structured, teaching-first German language platform that guides learners systematically from zero to B2 and C1.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        className={`min-h-full flex flex-col bg-paper text-ink font-sans ${serifReading.variable} ${wayfinding.variable} ${frakturWordmark.variable}`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule py-8 text-xs text-ink-soft text-center">
          <div className="max-w-5xl mx-auto px-4 space-y-2">
            <p className="font-medium text-ink font-serif">
              DeutschAcademy — Teaching-First German Platform
            </p>
            <p>
              Pedagogical rigor from CEFR A1 to C1 · No gimmicks, streaks, or gamification ·
              Pure conceptual acquisition
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
