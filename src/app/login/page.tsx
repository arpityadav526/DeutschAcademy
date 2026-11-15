"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPasswort] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="book-page ticket-login space-y-6">
      <div className="text-center space-y-2">
        <div className="ticket-logo mx-auto">
          D
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif">
          Fahrkarte bitte · Anmelden
        </h1>
        <p className="text-xs text-slate-500">
          Ihre Reise, gespeicherte Karten und Stempel sind hier sicher verwahrt.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scholar@university.edu"
              className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">
              Passwort
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPasswort(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded border border-slate-300 focus:outline-none focus:border-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full justify-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Anmelden</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-600">
          Noch keinen Reisepass?{" "}
          <Link href="/register" className="font-bold text-nordseeblau hover:underline">
            Reisepass anlegen
          </Link>
        </div>
      </div>
    </div>
  );
}
