"use client";

import React from "react";
import {
  Scroll,
  X,
  Building2,
  Send,
  MapPin,
  Clock,
  Target,
  AlertTriangle,
  Trophy,
  Laugh,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChampionshipDecreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OFFICIAL_RULES = [
  {
    num: 1,
    title: "Office Presence Mandatory",
    desc: "Dono persons ka office mein present hona lazmi hai. Agar koi WFH ya absent hai, toh us din ka match cancel.",
    icon: Building2,
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    num: 2,
    title: "First Strike Doctrine (+1 Pt)",
    desc: "Jo Slack par sabse pehle Assalam-o-Alaikum bhejega, usko +1 point milega. Reply karne par koi point nahi milega.",
    icon: Send,
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    num: 3,
    title: "No Pre-Arrival Advantage",
    desc: "Office pohanchne se pehle bheja gaya salam count nahi hoga. Match tabhi start hoga jab dono office mein present hon.",
    icon: MapPin,
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    num: 4,
    title: "Slack Timestamp is Absolute Law",
    desc: "Slack ka original timestamp final proof hoga. Edited messages aur excuses accept nahi honge.",
    icon: Clock,
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  {
    num: 5,
    title: "1 Point Daily Cap",
    desc: "Har working day maximum 1 point milega. Multiple messages bhejne se extra points nahi milenge.",
    icon: Target,
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  },
  {
    num: 6,
    title: "Mutual Silence Void",
    desc: "Agar dono mein se koi bhi salam nahi karta, toh us din dono ko zero points milenge.",
    icon: AlertTriangle,
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  {
    num: 7,
    title: "Weekly Coronation 🏆",
    desc: "Week ke end par highest score wala winner declare hoga.",
    icon: Trophy,
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  {
    num: 8,
    title: "Strict Anti-Excuse Clause 😂",
    desc: "“Main salam karne hi wala tha” aur “aap pehle kar dete” jaise excuses strictly prohibited hain.",
    icon: Laugh,
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  },
];

export function ChampionshipDecreeModal({ isOpen, onClose }: ChampionshipDecreeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900/95 border-4 border-amber-400 p-5 sm:p-7 text-slate-200 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-slate-800">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scroll className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-cartoon text-xl sm:text-2xl font-black tracking-tight text-white">
                1973 Salam Constitution
              </h3>
              <p className="font-cartoon text-xs text-amber-400 font-bold uppercase tracking-wider">
                Official 8 Rules of Friendly Engagement
              </p>
            </div>
          </div>

          {/* Scrollable Rules List */}
          <div className="overflow-y-auto pr-1 space-y-3.5 my-2 custom-scrollbar">
            {OFFICIAL_RULES.map((rule) => {
              const IconComponent = rule.icon;
              return (
                <div
                  key={rule.num}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-800/80 hover:border-slate-700 transition-colors flex items-start gap-3.5"
                >
                  <div className="flex flex-col items-center">
                    <span className="w-7 h-7 rounded-xl font-cartoon font-black text-xs flex items-center justify-center bg-amber-400 text-slate-950 shadow-md">
                      #{rule.num}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-cartoon font-bold text-sm text-white">
                        {rule.title}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                      {rule.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Action Button */}
          <div className="pt-4 border-t border-slate-800 mt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl btn-3d-gold font-cartoon font-black text-slate-950 text-sm tracking-wide shadow-lg transition-all"
            >
              I Swear by the 1973 Salam Constitution! 📜
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
