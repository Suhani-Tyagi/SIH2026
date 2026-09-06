import React from 'react';

export const HeaderBar: React.FC = () => {
  return (
    <header className="bg-ayush-dark text-white text-xs py-1.5 px-4 shadow-sm border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-emerald-300 tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            GOVERNMENT OF INDIA
          </span>
          <span className="text-emerald-700">|</span>
          <span className="text-emerald-100 font-medium">MINISTRY OF AYUSH</span>
          <span className="text-emerald-700 hidden md:inline">|</span>
          <span className="text-emerald-200 hidden md:inline">ALL INDIA INSTITUTE OF AYURVEDA (AIIA)</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-200/90 text-[11px]">
          <span>National AYUSH Skill & Placement Portal</span>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-mono font-medium">
            SIH 2026 Edition
          </span>
        </div>
      </div>
      <div className="tricolor-strip mt-1.5 -mx-4"></div>
    </header>
  );
};
