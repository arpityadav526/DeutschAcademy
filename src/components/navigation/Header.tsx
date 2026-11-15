"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/learn/a1/unit-01", label: "Lektion" },
    { href: "/grammar", label: "Nachschlagewerk" },
    { href: "/review", label: "Wiederholung" },
    { href: "/reading", label: "Lesesaal" },
    { href: "/listening", label: "Hörsaal" },
    { href: "/writing", label: "Schreibwerkstatt" },
    { href: "/exam-prep", label: "Prüfungsvorbereitung" },
    { href: "/placement", label: "Einstufungstest" },
    { href: "/dashboard", label: "Studienbuch" },
  ];

  const isActive = (href: string) => {
    if (href === "/learn/a1/unit-01") {
      return pathname.startsWith("/learn");
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-paper border-b border-rule">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Wordmark — the one Fraktur touch, like a book's spine title */}
          <Link href="/" className="flex items-baseline gap-3 group">
            <span className="font-fraktur text-2xl text-ink leading-none">
              DeutschAcademy
            </span>
            <span className="hidden sm:inline eyebrow smallcaps">
              Grammatik · Lektion · Übung
            </span>
          </Link>

          {/* Desktop nav — running-header style */}
          <nav className="hidden xl:flex items-center space-x-4">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-medium pb-0.5 border-b-2 transition-colors ${
                    active
                      ? "border-tintenblau text-ink"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick auth links */}
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login" className="btn btn-quiet text-xs">
              Anmelden
            </Link>
            <Link href="/learn/a1/unit-01" className="btn btn-primary text-xs">
              A1 · Kapitel 1
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex xl:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink-soft hover:text-ink"
              aria-label="Navigation öffnen oder schließen"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-rule bg-paper px-4 pt-2 pb-4 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm ${
                  active
                    ? "text-ink font-semibold bg-paper-deep"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-rule flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-ink-soft hover:text-ink"
            >
              Anmelden / Konto
            </Link>
            <Link
              href="/placement"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-tintenblau"
            >
              Einstufungstest →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
