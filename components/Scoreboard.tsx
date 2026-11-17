"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  Sparkles,
  BookOpen,
  Check,
  Flame,
  Image as ImageIcon,
  Radio,
  Clock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { CompetitorCard } from "./CompetitorCard";
import { VsIndicator } from "./VsIndicator";
import { HearingBanner } from "./HearingBanner";
import { LeaderBadge } from "./LeaderBadge";
import { ChampionshipDecreeModal } from "./ChampionshipDecreeModal";
import { ArtworkModal } from "./ArtworkModal";
import { HistoryModal, ScoreHistoryEntry } from "./HistoryModal";
import { OfficePosters } from "./OfficePosters";
import { SlackLogo } from "./SlackLogo";
import { playTrophyFanfare, playScoreUpSound } from "@/lib/sound";

const STORAGE_KEY = "salam_wars_scores_v5";
const CONSTITUTION_SEEN_KEY = "salam_constitution_seen_v1";
const HISTORY_STORAGE_KEY = "salam_wars_history_v5";

interface ScoreboardProps {
  initialData?: {
    sunnan: number;
    alina: number;
    history?: ScoreHistoryEntry[];
  };
}

export function Scoreboard({ initialData }: ScoreboardProps) {
  const [sunnanScore, setSunnanScore] = useState<number>(
    initialData?.sunnan ?? 5
  );
  const [alinaScore, setAlinaScore] = useState<number>(
    initialData?.alina ?? 8
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isDecreeOpen, setIsDecreeOpen] = useState<boolean>(false);
  const [isArtworkOpen, setIsArtworkOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<ScoreHistoryEntry[]>(
    initialData?.history ?? []
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [isServerSynced, setIsServerSynced] = useState<boolean>(false);

  // Fetch current score and history from Server API
  const fetchServerScore = useCallback(async () => {
    try {
      const res = await fetch("/api/score", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.sunnan === "number" && typeof data.alina === "number") {
          setSunnanScore(data.sunnan);
          setAlinaScore(data.alina);
          setIsServerSynced(true);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ sunnan: data.sunnan, alina: data.alina }));
          } catch {
            // Ignore
          }
        }
        if (Array.isArray(data.history)) {
          setHistory(data.history);
          try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data.history));
          } catch {
            // Ignore
          }
        }
      }
    } catch {
      // Offline fallback: try reading from localStorage
      try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (typeof parsed.sunnan === "number" && typeof parsed.alina === "number") {
            setSunnanScore(parsed.sunnan);
            setAlinaScore(parsed.alina);
          }
        }
        const localHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (localHistory) {
          const parsedHistory = JSON.parse(localHistory);
          if (Array.isArray(parsedHistory)) {
            setHistory(parsedHistory);
          }
        }
      } catch {
        // Ignore
      }
    }
  }, []);

  // Post updated score to Server API with meta for history logging
  const syncToServer = async (
    sunnan: number,
    alina: number,
    meta: { target: string; action: string } = { target: "Score", action: "update" }
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sunnan, alina }));
    } catch {
      // Ignore
    }

    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sunnan,
          alina,
          target: meta.target,
          action: meta.action,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsServerSynced(true);
        if (Array.isArray(data.history)) {
          setHistory(data.history);
          try {
            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data.history));
          } catch {
            // Ignore
          }
        }
      }
    } catch (err) {
      console.warn("Server sync error (will persist locally):", err);
    }
  };

  // Mount effect & periodic auto-sync so both users see updates live
  useEffect(() => {
    fetchServerScore();

    // Check sound preference
    try {
      const savedSound = localStorage.getItem("salam_wars_sound");
      if (savedSound !== null) {
        setSoundEnabled(savedSound === "true");
      }
    } catch {
      // Ignore
    }

    // First time visitor check for 1973 Salam Constitution modal
    let decreeTimer: NodeJS.Timeout | undefined;
    try {
      const hasSeenConstitution = localStorage.getItem(CONSTITUTION_SEEN_KEY);
      if (!hasSeenConstitution) {
        decreeTimer = setTimeout(() => {
          setIsDecreeOpen(true);
        }, 300);
      }
    } catch {
      // Ignore
    }

    // Auto-sync every 3 seconds so Sunnan and Alina stay in sync without reload
    const interval = setInterval(fetchServerScore, 3000);

    const onFocus = () => fetchServerScore();
    window.addEventListener("focus", onFocus);

    return () => {
      if (decreeTimer) clearTimeout(decreeTimer);
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchServerScore]);

  const handleDismissDecree = () => {
    try {
      localStorage.setItem(CONSTITUTION_SEEN_KEY, "true");
    } catch {
      // Ignore
    }
    if (soundEnabled) {
      playScoreUpSound();
    }
    setIsDecreeOpen(false);
  };

  const updateSunnan = (score: number, action: "+1" | "-1" | "edit" = "edit") => {
    const valid = Math.max(0, score);
    setSunnanScore(valid);
    syncToServer(valid, alinaScore, { target: "Sunnan", action });
  };

  const updateAlina = (score: number, action: "+1" | "-1" | "edit" = "edit") => {
    const valid = Math.max(0, score);
    setAlinaScore(valid);
    syncToServer(sunnanScore, valid, { target: "Alina", action });
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset the scoreboard to 0 - 0?")) {
      setSunnanScore(0);
      setAlinaScore(0);
      await syncToServer(0, 0, {
        target: "System",
        action: "reset",
      });
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    try {
      localStorage.setItem("salam_wars_sound", String(next));
    } catch {
      // Ignore
    }
  };

  const triggerGrandCelebration = () => {
    if (soundEnabled) {
      playTrophyFanfare();
    }
    const end = Date.now() + 1200;
    const colors = ["#ffb703", "#fb8500", "#38bdf8", "#f472b6", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleShare = () => {
    const leaderText =
      alinaScore > sunnanScore
        ? `Alina is leading by ${alinaScore - sunnanScore} points!`
        : sunnanScore > alinaScore
        ? `Sunnan is leading by ${sunnanScore - alinaScore} points!`
        : "Scores are tied in constitutional deadlock!";

    const text = `🔥 SALAM WARS – The Ultimate Scoreboard\n📜 1973 Salam Constitution Championship\n\n🌸 Alina: ${alinaScore} pts\n🔵 Sunnan: ${sunnanScore} pts\n\n🏆 Status: ${leaderText}\n📅 Next Hearing: Monday\n\nAssalam-o-Alaikum! Update your score live on the board!`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const isSunnanLeader = sunnanScore > alinaScore;
  const isAlinaLeader = alinaScore > sunnanScore;

  // Crown logic matching the artwork: Leader gets #1, trailing gets #2, tied both get #1
  const sunnanRank: 1 | 2 = sunnanScore >= alinaScore ? 1 : 2;
  const alinaRank: 1 | 2 = alinaScore >= sunnanScore ? 1 : 2;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[radial-gradient(ellipse_at_top,_#1e1b4b_0%,_#0b0f19_60%,_#050811_100%)]">
      {/* Wall Posters from the Artwork (Visible on wider screens) */}
      <OfficePosters />

      {/* Decorative ambient sparkles & glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2 mb-2 z-20">
        <div className="flex items-center gap-2">
          <SlackLogo className="w-5 h-5" />
          <span className="font-cartoon text-xs tracking-wider text-amber-300 font-bold uppercase hidden sm:inline">
            Slack Office Arena
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* History / Timestamps Button */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border-2 border-slate-700 text-purple-300 hover:text-white hover:border-purple-400 text-xs font-cartoon font-bold transition-all shadow-md relative"
            title="View activity timestamps and logs"
          >
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Timestamps</span>
            {history.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* View Artwork Button */}
          <button
            onClick={() => setIsArtworkOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border-2 border-slate-700 text-amber-300 hover:text-white hover:border-amber-400 text-xs font-cartoon font-bold transition-all shadow-md"
            title="View original template image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Art</span>
          </button>

          {/* Rules Modal */}
          <button
            onClick={() => setIsDecreeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border-2 border-slate-700 text-slate-300 hover:text-white hover:border-amber-400 text-xs font-cartoon font-bold transition-all shadow-md"
            title="Read 1973 Constitution"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border-2 border-slate-700 text-slate-300 hover:text-white hover:border-sky-400 text-xs font-cartoon font-bold transition-all shadow-md"
            title="Copy Score Update"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900/90 border-2 border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-400 transition-all shadow-md"
            title="Reset scoreboard"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Cartoon Title matching the Image */}
      <header className="max-w-4xl mx-auto w-full text-center space-y-3 my-2 z-10">
        {/* Hearing banner */}
        <div className="flex justify-center">
          <HearingBanner />
        </div>

        {/* 3D Cartoon SALAM WARS Headline */}
        <div className="relative inline-block select-none">
          {/* Top Slack Sparkle from the image */}
          <div className="flex justify-center items-center gap-2 mb-1">
            <SlackLogo className="w-7 h-7 sm:w-8 sm:h-8 animate-bounce" />
          </div>

          <h1 className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 font-black tracking-wider leading-none">
            <span className="cartoon-salam text-5xl sm:text-7xl md:text-8xl">
              SALAM
            </span>
            <span className="cartoon-wars text-5xl sm:text-7xl md:text-8xl">
              WARS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-cartoon text-xs sm:text-sm md:text-base font-bold text-amber-300 tracking-wider uppercase mt-2 drop-shadow">
            1973 Salam Constitution Championship
          </p>
        </div>

        {/* Dynamic Leader Status */}
        <LeaderBadge sunnanScore={sunnanScore} alinaScore={alinaScore} />
      </header>

      {/* Competitor Arena matching the Artwork */}
      <main className="max-w-6xl mx-auto w-full my-4 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 relative pt-6">
          {/* Sunnan (Left character - Crown #2 when behind) */}
          <CompetitorCard
            id="sunnan"
            name="Sunnan"
            score={sunnanScore}
            rank={sunnanRank}
            isLeader={isSunnanLeader}
            soundEnabled={soundEnabled}
            onUpdateScore={updateSunnan}
            accentColor="blue"
            avatarSrc="/sunnan-portrait.jpg"
          />

          {/* Center Comic VS Burst */}
          <VsIndicator sunnanScore={sunnanScore} alinaScore={alinaScore} />

          {/* Alina (Right character - Crown #1 when leading) */}
          <CompetitorCard
            id="alina"
            name="Alina"
            score={alinaScore}
            rank={alinaRank}
            isLeader={isAlinaLeader}
            soundEnabled={soundEnabled}
            onUpdateScore={updateAlina}
            accentColor="pink"
            avatarSrc="/alina-portrait.jpg"
          />
        </div>

        {/* Grand Celebration Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={triggerGrandCelebration}
            className="btn-3d-gold px-6 py-3 rounded-2xl font-cartoon font-black text-slate-950 text-sm tracking-wide flex items-center gap-2 shadow-xl"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>CELEBRATE SALAM BATTLE!</span>
            <Flame className="w-5 h-5 text-orange-600 animate-pulse" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-4 border-t border-slate-800/80 mt-6 text-xs text-slate-500 flex items-center justify-center z-10 font-medium">
        <div className="font-cartoon text-amber-300/60 tracking-wider">
          ⚔️ 1973 Salam Constitution Championship ⚔️
        </div>
      </footer>

      {/* Modals */}
      <ChampionshipDecreeModal
        isOpen={isDecreeOpen}
        onClose={handleDismissDecree}
      />
      <ArtworkModal
        isOpen={isArtworkOpen}
        onClose={() => setIsArtworkOpen(false)}
      />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
      />
    </div>
  );
}
