"use client";

import React, { useState } from "react";
import { Volume2, Loader2 } from "lucide-react";
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

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;

    setIsPlaying(true);
    await speakGerman(text, false);
    setIsPlaying(false);
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
        aria-label={`Deutsche Aussprache anhören: ${text}`}
        title="Audio anhören"
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm border border-rule text-ink-soft hover:text-ink hover:bg-paper-deep text-xs"
      >
        {isPlaying ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <Volume2 className={iconSizes[size]} />
        )}
        {label ? <span>{label}</span> : null}
      </button>
    </div>
  );
}
