"use client";

import React from "react";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

interface VsIndicatorProps {
  sunnanScore: number;
  alinaScore: number;
}

export function VsIndicator({ sunnanScore, alinaScore }: VsIndicatorProps) {
  const diff = Math.abs(sunnanScore - alinaScore);

  return (
    <div className="relative flex flex-col items-center justify-center my-6 lg:my-0 lg:px-4 z-20">
      {/* Background Comic Starburst Glow */}
      <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-amber-500/30 via-red-500/20 to-pink-500/30 blur-2xl -z-10 animate-pulse" />

      {/* Comic Book Clash Burst Badge */}
      <motion.div
        whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative group cursor-pointer"
      >
        {/* Outer Comic Star Shape / Multi-layer Starburst */}
        <div className="relative flex items-center justify-center">
          {/* Yellow/Orange Comic Bolt Background */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl rotate-45 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 border-4 border-slate-950 shadow-[0_8px_0_#78350f,0_15px_25px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="-rotate-45 flex flex-col items-center justify-center">
              <span className="font-cartoon text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-[0_4px_0_#b91c1c]">
                VS
              </span>
            </div>
          </div>

          {/* Electric Spark Sparks */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute -top-3 -right-2 bg-yellow-400 text-slate-950 p-1.5 rounded-full border-2 border-slate-950 shadow-md"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -20, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
            className="absolute -bottom-2 -left-2 bg-amber-400 text-slate-950 p-1.5 rounded-full border-2 border-slate-950 shadow-md"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
          </motion.div>
        </div>
      </motion.div>

      {/* Difference Pill */}
      <div className="mt-4 text-center">
        <span className="font-cartoon text-xs font-black tracking-wider px-3 py-1 rounded-full bg-slate-900 border-2 border-slate-700 text-amber-400 shadow-md">
          {diff === 0 ? "TIED BATTLE!" : `Δ ${diff} PTS LEAD`}
        </span>
      </div>
    </div>
  );
}
