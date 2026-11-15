"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DeepDiveNote } from "@/lib/types";

export function TeacherNote({ title, content, warning = false }: DeepDiveNote) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="margin-note my-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className={`margin-note-label block ${warning ? "achtung" : ""}`}>
          {warning ? "Achtung · häufiger Fehler" : "Randnotiz des Lehrers"}
        </span>
        <span className="text-ink font-serif italic text-[0.95rem]">{title}</span>
        <span className="inline-flex items-center gap-1 text-xs text-tintenblau ml-2 align-middle">
          {isOpen ? "einklappen" : "lesen"}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${isOpen ? "" : "-rotate-90"}`}
          />
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 fade-in whitespace-pre-line text-[0.92rem]">
          {content}
        </div>
      )}
    </aside>
  );
}
