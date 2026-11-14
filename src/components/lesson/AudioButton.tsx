"use client";

import React, { useState } from "react";
import { Volume2, Volume1, Loader2 } from "lucide-react";
import { speakGerman } from "@/lib/speech";

interface AudioButtonProps {
  text: string;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function AudioButton({
  text,
  size = "md",
  label,
  className = "",
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [slowMode, setSlowMode] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;

    setIsPlaying(true);
    await speakGerman(text, slowMode);
    setIsPlaying(false);
  };

  const toggleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlowMode(!slowMode);
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handlePlay}
        disabled={isPlaying}
        aria-label={`Listen to German pronunciation: ${text}`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors text-xs font-medium cursor-pointer shadow-sm"
      >
        {isPlaying ? (
          <Loader2 className={`${iconSizes[size]} animate-spin text-slate-500`} />
        ) : slowMode ? (
          <Volume1 className={`${iconSizes[size]} text-amber-700`} />
        ) : (
          <Volume2 className={`${iconSizes[size]} text-slate-700`} />
        )}
        {label ? <span>{label}</span> : null}
      </button>

      <button
        type="button"
        onClick={toggleSpeed}
        title={slowMode ? "Slow audio active (0.75x). Click for normal." : "Normal audio (1.0x). Click for slow."}
        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${
          slowMode
            ? "bg-amber-100 border-amber-300 text-amber-800 font-semibold"
            : "bg-transparent border-slate-200 text-slate-500 hover:border-slate-300"
        }`}
      >
        {slowMode ? "0.75x" : "1.0x"}
      </button>
    </div>
  );
}
