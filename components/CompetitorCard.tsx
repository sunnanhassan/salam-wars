"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, Crown, Flame, Edit3, Check, X, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playScoreUpSound, playScoreDownSound } from "@/lib/sound";
import { SlackLogo } from "./SlackLogo";

interface CompetitorCardProps {
  id: "sunnan" | "alina";
  name: string;
  role?: string;
  subtitle?: string;
  score: number;
  rank: 1 | 2;
  isLeader: boolean;
  soundEnabled: boolean;
  onUpdateScore: (newScore: number, actionType?: "+1" | "-1" | "edit") => void;
  accentColor: "blue" | "pink";
  avatarSrc: string;
}

export function CompetitorCard({
  id,
  name,
  role,
  subtitle,
  score,
  rank,
  isLeader,
  soundEnabled,
  onUpdateScore,
  accentColor,
  avatarSrc,
}: CompetitorCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempScore, setTempScore] = useState(score.toString());
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const [bubbleAnimationKey, setBubbleAnimationKey] = useState(0);

  const isBlue = accentColor === "blue";

  const handleIncrement = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    if (soundEnabled) {
      playScoreUpSound();
    }

    // Trigger speech bubble bounce & pop
    setBubbleAnimationKey((prev) => prev + 1);
    setShowSpeechBubble(true);

    // Burst confetti from button coordinates
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x, y },
      colors: isBlue ? ["#38bdf8", "#0284c7", "#facc15", "#ffffff"] : ["#f472b6", "#db2777", "#facc15", "#ffffff"],
      ticks: 200,
      gravity: 1.1,
      scalar: 1,
    });

    onUpdateScore(score + 1, "+1");
  };

  const handleDecrement = () => {
    if (score <= 0) return;
    if (soundEnabled) {
      playScoreDownSound();
    }
    onUpdateScore(score - 1, "-1");
  };

  const handleSaveEdit = () => {
    const parsed = parseInt(tempScore, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateScore(parsed, "edit");
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempScore(score.toString());
    setIsEditing(false);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative w-full max-w-sm sm:max-w-md mx-auto rounded-3xl p-5 sm:p-7 transition-all duration-300 border-4 ${
        isLeader
          ? isBlue
            ? "bg-slate-900/90 border-amber-400 shadow-[0_0_40px_rgba(250,204,21,0.35)]"
            : "bg-slate-900/90 border-amber-400 shadow-[0_0_40px_rgba(250,204,21,0.35)]"
          : isBlue
          ? "bg-slate-900/75 border-sky-600/70 shadow-xl"
          : "bg-slate-900/75 border-pink-600/70 shadow-xl"
      }`}
    >
      {/* Cartoon Speech Bubble: Assalam-o-Alaikum! */}
      <div className="absolute -top-14 sm:-top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <AnimatePresence>
          {showSpeechBubble && (
            <motion.div
              key={bubbleAnimationKey}
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`px-4 py-2 text-slate-950 font-black text-xs sm:text-sm tracking-wide whitespace-nowrap shadow-xl ${
                isBlue ? "comic-bubble-left" : "comic-bubble-right"
              }`}
            >
              <span className="font-cartoon font-extrabold text-sm sm:text-base text-slate-900">
                Assalam-o-Alaikum! 👋
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Crown with Rank (1 or 2 as seen in the poster) */}
      <div className="absolute -top-5 right-5 sm:right-7 z-20">
        <motion.div
          animate={{ rotate: [-4, 4, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`flex items-center gap-1 px-3 py-1 rounded-full border-2 border-slate-950 font-black text-xs uppercase tracking-wider shadow-lg ${
            rank === 1
              ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 shadow-[0_0_15px_rgba(250,204,21,0.6)]"
              : "bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-900"
          }`}
        >
          <Crown className="w-4 h-4 fill-current" />
          <span className="font-cartoon text-sm font-black">#{rank}</span>
        </motion.div>
      </div>

      {/* Character Card Header & Portrait Avatar */}
      <div className="flex items-center gap-4 mb-4 mt-2">
        {/* Character Image from the Artwork */}
        <div className="relative group">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 shadow-xl relative bg-slate-950 ${
              isBlue ? "border-sky-400" : "border-pink-400"
            }`}
          >
            <Image
              src={avatarSrc}
              alt={name}
              width={96}
              height={96}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>

          {/* Mini Slack Laptop Badge on Avatar */}
          <div className="absolute -bottom-2 -right-2 bg-slate-950 p-1.5 rounded-xl border-2 border-slate-700 shadow-md">
            <SlackLogo className="w-4 h-4" />
          </div>
        </div>

        {/* Competitor Name & Office Role */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-cartoon font-black tracking-wide text-white">
              {name}
            </h2>
            {isLeader && <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />}
          </div>

          {role && (
            <div
              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase mt-0.5 ${
                isBlue ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "bg-pink-500/20 text-pink-300 border border-pink-500/40"
              }`}
            >
              {role}
            </div>
          )}

          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
              {subtitle}
            </p>
          )}
        </div>

        {/* Direct edit toggle button */}
        <button
          onClick={() => {
            setTempScore(score.toString());
            setIsEditing(!isEditing);
          }}
          title="Direct score editor"
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* Giant Score Display */}
      <div className="py-2 text-center my-1 relative">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-2 my-4"
            >
              <input
                type="number"
                min="0"
                max="999"
                value={tempScore}
                onChange={(e) => setTempScore(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                autoFocus
                className="w-32 text-center text-5xl font-cartoon font-black rounded-2xl bg-slate-950 border-4 border-amber-400 text-white focus:outline-none focus:ring-4 focus:ring-amber-500/30"
              />
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={handleSaveEdit}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              className="relative inline-block"
            >
              <span
                className={`font-cartoon font-black tracking-tighter text-7xl sm:text-8xl md:text-9xl select-none ${
                  isBlue ? "text-sky-400" : "text-pink-400"
                }`}
                style={{
                  textShadow: isBlue
                    ? "0 6px 0 #0369a1, 0 10px 0 #075985, 0 15px 25px rgba(0,0,0,0.8)"
                    : "0 6px 0 #be185d, 0 10px 0 #9d174d, 0 15px 25px rgba(0,0,0,0.8)",
                }}
              >
                {score}
              </span>
              <span className="block text-[11px] font-cartoon font-bold uppercase tracking-widest text-slate-400 mt-1">
                Salam Points
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3D Tactile Buttons (Both can update!) */}
      <div className="grid grid-cols-4 gap-2.5 mt-4">
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          disabled={score <= 0}
          className="col-span-1 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-slate-300 hover:text-white flex items-center justify-center font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-md"
          title="Deduct 1 point"
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Big 3D Cartoon Increment Button */}
        <button
          onClick={handleIncrement}
          className={`col-span-3 py-3.5 px-4 rounded-2xl font-cartoon font-black text-sm tracking-wide flex items-center justify-center gap-2 text-white active:scale-95 ${
            isBlue ? "btn-3d-blue" : "btn-3d-pink"
          }`}
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>+1 SAYS SALAM!</span>
          <Flame className="w-4 h-4 ml-0.5 text-yellow-300 animate-bounce" />
        </button>
      </div>

      {/* Footer hint */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" />
          Both can update anytime
        </span>
        <span>Tap ✏️ to type</span>
      </div>
    </motion.div>
  );
}
