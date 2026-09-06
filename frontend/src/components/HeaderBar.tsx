import React from 'react';

export const HeaderBar: React.FC = () => {
  return (
    <header className="bg-white text-slate-800 text-xs py-2 px-4 shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Emblem Logos */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <img 
              src="/assets/emblem-gov-india.png" 
              alt="Government of India" 
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>
          <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <img 
              src="/assets/emblem-ministry-ayush.png" 
              alt="Ministry of AYUSH" 
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>
          <div className="h-6 w-px bg-slate-300 hidden md:block"></div>
          <span className="text-xs font-semibold text-emerald-900 hidden md:inline tracking-wide">
            ALL INDIA INSTITUTE OF AYURVEDA (AIIA)
          </span>
        </div>

        {/* Tagline & Badges */}
        <div className="flex items-center gap-3 text-slate-600 text-[11px] font-medium">
          <span className="hidden lg:inline text-slate-500">National AYUSH Skill & Placement Portal</span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 font-mono font-bold text-[11px]">
            SIH 2026 Edition
          </span>
        </div>
      </div>
      <div className="tricolor-strip mt-2 -mx-4"></div>
    </header>
  );
};

