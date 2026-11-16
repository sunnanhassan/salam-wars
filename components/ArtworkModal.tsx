"use client";

import React from "react";
import Image from "next/image";
import { X, ExternalLink, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArtworkModal({ isOpen, onClose }: ArtworkModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-lg w-full bg-slate-900 rounded-3xl border-4 border-amber-400 p-5 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3 className="font-cartoon text-lg font-black text-white">
              Official Salam Wars Artwork
            </h3>
          </div>

          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner">
            <Image
              src="/salam-wars-art.jpg"
              alt="Salam Wars Official Artwork"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-xs text-slate-400 text-center mt-3 font-medium">
            Original cartoon inspiration for the scoreboard dashboard.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

