"use client";

import React from "react";
import { Gavel, Calendar, Sparkles } from "lucide-react";

export function HearingBanner() {
  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-full glass-panel border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
      <div className="flex items-center gap-1.5 text-amber-400">
        <Gavel className="w-4 h-4 animate-bounce" style={{ animationDuration: "2s" }} />
        <span className="text-xs uppercase tracking-wider font-semibold">Official Court Notice</span>
      </div>
      <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:inline-block" />
      <div className="flex items-center gap-1.5 text-slate-200">
        <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
        <span className="text-xs sm:text-sm font-medium">
          Next Hearing: <strong className="text-amber-300 font-bold">Monday</strong>
        </span>
      </div>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
    </div>
  );
}

