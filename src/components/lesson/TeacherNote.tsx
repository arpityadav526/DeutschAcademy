"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, AlertCircle } from "lucide-react";
import { DeepDiveNote } from "@/lib/types";

export function TeacherNote({ title, content, warning = false }: DeepDiveNote) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-lg border my-4 overflow-hidden transition-all ${
        warning
          ? "border-amber-300 bg-amber-50/50"
          : "border-slate-300 bg-slate-50/70"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-black/5 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          {warning ? (
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <BookOpen className="w-4 h-4 text-indigo-700 shrink-0" />
          )}
          <span className="text-sm font-semibold text-slate-800">
            {warning ? "Achtung! (Common Pitfall): " : "Grammatik-Tipp: "}
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span>{isOpen ? "Collapse" : "Read note"}</span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-sm text-slate-700 leading-relaxed border-t border-slate-200/80">
          <div className="whitespace-pre-line">{content}</div>
        </div>
      )}
    </div>
  );
}
