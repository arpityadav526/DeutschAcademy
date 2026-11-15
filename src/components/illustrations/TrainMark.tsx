import React from "react";

export function TrainMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 128 64"
      role="img"
      aria-label="Zug unterwegs"
    >
      <path
        d="M12 10h88q16 0 16 16v19H12z"
        fill="var(--ubahn)"
        stroke="var(--ink)"
        strokeWidth="5"
      />
      <path
        d="M22 18h28v18H22zm37 0h28v18H59z"
        fill="var(--gletscherblau)"
        stroke="var(--ink)"
        strokeWidth="4"
      />
      <path
        d="M116 31h8v14h-8"
        fill="var(--signalrot)"
        stroke="var(--ink)"
        strokeWidth="4"
      />
      <path d="M5 47h112" stroke="var(--ink)" strokeWidth="5" />
      <circle cx="36" cy="50" r="9" fill="var(--ink)" />
      <circle cx="92" cy="50" r="9" fill="var(--ink)" />
      <circle cx="36" cy="50" r="3" fill="var(--alpenweiss)" />
      <circle cx="92" cy="50" r="3" fill="var(--alpenweiss)" />
      <path
        d="M18 57h100"
        stroke="var(--fachwerkbraun)"
        strokeWidth="3"
        strokeDasharray="8 5"
      />
    </svg>
  );
}
