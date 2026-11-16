"use client";

import React from "react";
import {
  Clock,
  X,
  History,
  Smartphone,
  Laptop,
  Monitor,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ScoreHistoryEntry {
  id: string;
  timestamp: string;
  formattedTime: string;
  target: "Sunnan" | "Alina" | "System" | string;
  action: "+1" | "-1" | "edit" | "reset" | string;
  sunnan: number;
  alina: number;
  prevSunnan?: number;
  prevAlina?: number;
  device?: string;
  ip?: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScoreHistoryEntry[];
}

export function HistoryModal({ isOpen, onClose, history }: HistoryModalProps) {
  if (!isOpen) return null;

  const getDeviceIcon = (device?: string) => {
    if (!device) return <Monitor className="w-3.5 h-3.5" />;
    if (/iphone|android|ipad|mobile/i.test(device)) {
      return <Smartphone className="w-3.5 h-3.5" />;
    }
    if (/mac|windows|linux|pc/i.test(device)) {
      return <Laptop className="w-3.5 h-3.5" />;
    }
    return <Monitor className="w-3.5 h-3.5" />;
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "+1":
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Flame className="w-3 h-3 text-emerald-400" />
            +1 Salam
          </span>
        );
      case "-1":
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
            -1 Point
          </span>
        );
      case "edit":
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ✏️ Direct Edit
          </span>
        );
      case "reset":
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-500/20 text-slate-300 border border-slate-500/30">
            🔄 Reset
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
            {action}
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[85vh] bg-gradient-to-b from-slate-900 via-[#0d1527] to-[#080d1a] border-4 border-amber-400/80 rounded-3xl shadow-[0_0_50px_rgba(250,204,21,0.25)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border-2 border-amber-400/40 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-cartoon font-black tracking-wide text-white flex items-center gap-2">
                  <span>Activity Timestamps</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Rule #4: Slack & Server Timestamps are Absolute Law
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Timeline List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <History className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="font-cartoon text-base text-slate-300">
                  No activity recorded yet!
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Any time someone taps +1, -1, or edits scores, the exact timestamp & device will be logged here.
                </p>
              </div>
            ) : (
              history.map((entry, index) => {
                const isSunnan = entry.target === "Sunnan";
                const isAlina = entry.target === "Alina";

                return (
                  <motion.div
                    key={entry.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border-2 border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                  >
                    {/* Left: Target, Action, & Score change */}
                    <div className="flex items-center gap-3">
                      {/* Avatar / Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl font-cartoon font-bold text-xs flex items-center justify-center border-2 ${
                          isSunnan
                            ? "bg-sky-500/20 border-sky-400 text-sky-300"
                            : isAlina
                            ? "bg-pink-500/20 border-pink-400 text-pink-300"
                            : "bg-slate-800 border-slate-600 text-slate-300"
                        }`}
                      >
                        {isSunnan ? "🔵 S" : isAlina ? "🌸 A" : "⚙️"}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-cartoon font-extrabold text-sm sm:text-base text-white">
                            {entry.target}
                          </span>
                          {getActionBadge(entry.action)}
                        </div>

                        {/* Transition preview */}
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                          <span>
                            Board: <strong className="text-sky-300">Sunnan ({entry.sunnan})</strong> vs{" "}
                            <strong className="text-pink-300">Alina ({entry.alina})</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Timestamp and Device */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80 gap-1 text-right">
                      <div className="font-mono text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {entry.formattedTime ||
                            new Date(entry.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        {getDeviceIcon(entry.device)}
                        <span>{entry.device || "Web"}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-center">
            <p className="text-[11px] text-slate-400">
              💡 Timestamps are recorded in <strong className="text-amber-300">Pakistan Time (PKT)</strong> and synced live to Vercel Observability logs.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
