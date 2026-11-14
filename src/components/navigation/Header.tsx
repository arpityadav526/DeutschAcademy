"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  Compass,
  LayoutDashboard,
  GraduationCap,
  FileText,
  Volume2,
  Menu,
  X,
  Award,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/learn/a1/unit-01", label: "Curriculum", icon: BookOpen },
    { href: "/grammar", label: "Grammar Reference", icon: Compass },
    { href: "/review", label: "SRS Review", icon: Brain },
    { href: "/reading", label: "Reading Lab", icon: FileText },
    { href: "/listening", label: "Listening", icon: Volume2 },
    { href: "/writing", label: "Writing Studio", icon: GraduationCap },
    { href: "/exam-prep", label: "Exam Prep", icon: Award },
    { href: "/placement", label: "Placement Test", icon: Compass },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const isActive = (href: string) => {
    if (href === "/learn/a1/unit-01") {
      return pathname.startsWith("/learn");
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-base shadow-sm group-hover:bg-slate-800 transition-colors">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 tracking-tight text-base font-serif">
                DeutschAcademy
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase -mt-0.5">
                Teaching-First Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-slate-900" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User profile / Quick Auth Link */}
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/learn/a1/unit-01"
              className="text-xs font-semibold bg-slate-900 text-white px-3.5 py-1.5 rounded-md hover:bg-slate-800 transition-colors shadow-sm"
            >
              Start A1 Unit 1
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex xl:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm ${
                  active
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-slate-600 hover:text-slate-900"
            >
              Sign In / Account
            </Link>
            <Link
              href="/placement"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-indigo-700"
            >
              Take Placement Exam →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
