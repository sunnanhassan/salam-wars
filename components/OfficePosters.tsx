"use client";

import React from "react";
import { Smile, Heart } from "lucide-react";

export function OfficePosters() {
  return (
    <div className="hidden xl:flex items-center justify-between w-full max-w-7xl px-8 pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 -z-0">
      {/* Left Wall Poster from the artwork */}
      <div className="office-poster p-4 rounded-xl max-w-[190px] text-center shadow-2xl border-4 border-slate-700 bg-amber-50/95 text-slate-800">
        <div className="border-2 border-dashed border-slate-400 p-3 rounded-lg">
          <p className="font-cartoon text-sm font-black leading-tight uppercase tracking-wide text-slate-900">
            GOOD PEOPLE
          </p>
          <p className="font-cartoon text-lg font-black uppercase text-amber-600 my-0.5">
            SAY SALAM
          </p>
          <Smile className="w-5 h-5 mx-auto text-slate-700 mt-1" />
        </div>
      </div>

      {/* Right Wall Poster from the artwork */}
      <div className="office-poster-right p-4 rounded-xl max-w-[200px] text-center shadow-2xl border-4 border-slate-700 bg-pink-50/95 text-slate-800">
        <div className="border-2 border-dashed border-slate-400 p-3 rounded-lg">
          <p className="font-cartoon text-xs font-black tracking-wider uppercase text-slate-700">
            SAME OFFICE
          </p>
          <p className="font-cartoon text-xs font-black tracking-wider uppercase text-slate-700">
            SAME VIBES
          </p>
          <p className="font-cartoon text-sm font-black tracking-wide uppercase text-pink-600 mt-0.5">
            SAME SALAM
          </p>
          <Heart className="w-4 h-4 mx-auto text-pink-500 fill-pink-500 mt-1" />
        </div>
      </div>
    </div>
  );
}

