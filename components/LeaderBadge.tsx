"use client";

import React from "react";
import { Crown, Scale, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderBadgeProps {
  sunnanScore: number;
  alinaScore: number;
}

export function LeaderBadge({ sunnanScore, alinaScore }: LeaderBadgeProps) {
  const diff = Math.abs(sunnanScore - alinaScore);
  const isTied = sunnanScore === alinaScore;
  const leader = sunnanScore > alinaScore ? "Sunnan" : "Alina";
  const isSunnan = leader === "Sunnan";

  return (
    <div className="flex justify-center my-3">
      <AnimatePresence mode="wait">
        {isTied ? (
          <motion.div
            key="tied"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2 rounded-2xl glass-panel border border-slate-700/60 text-slate-300 text-sm shadow-lg"
          >
            <Scale className="w-4 h-4 text-slate-400" />
            <span className="font-semibold tracking-wide">
              Constitutional Deadlock: Tied at <span className="text-white font-bold">{sunnanScore}</span>
            </span>
          </motion.div>
        ) : (
          <motion.div
            key={leader}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border shadow-xl backdrop-blur-xl ${
              isSunnan
                ? "bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-blue-950/60 border-blue-500/30 text-blue-200 shadow-[0_0_25px_rgba(59,130,246,0.2)]"
                : "bg-gradient-to-r from-pink-950/60 via-slate-900/80 to-pink-950/60 border-pink-500/30 text-pink-200 shadow-[0_0_25px_rgba(236,72,153,0.2)]"
            }`}
          >
            <div className={`p-1 rounded-full ${isSunnan ? "bg-amber-400/20 text-amber-300" : "bg-amber-400/20 text-amber-300"}`}>
              <Crown className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="text-slate-400">Current Leader:</span>
              <strong className={`font-bold tracking-wide uppercase ${isSunnan ? "text-blue-400" : "text-pink-400"}`}>
                {leader}
              </strong>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200 ml-1">
                +{diff} {diff === 1 ? "point" : "points"}
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 hidden sm:block" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

