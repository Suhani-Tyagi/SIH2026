import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-ayush-dark text-slate-300 text-xs py-10 border-t border-emerald-950 mt-16 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Brand & Mission */}
        <div className="space-y-3 sm:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-white">AYUSH Setu</span>
          </div>
          <p className="text-[11px] text-emerald-200/70 leading-relaxed">
            Academia–Industry Collaboration Portal for Skill Mapping, Internships & Placements in Ayurveda, Yoga, Unani, Siddha & Homeopathy.
          </p>
          <p className="text-[10px] text-amber-400 font-mono">
            Conceptually Sponsored by Ministry of AYUSH & AIIA
          </p>
        </div>

        {/* Portals & Page Links */}
        <div>
          <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-emerald-400">
            Portals & Features
          </h4>
          <ul className="space-y-2 text-[11px] text-slate-300">
            <li>
              <Link to={user ? '/student/skill-profile' : '/login'} className="hover:text-amber-400 transition-colors">
                Student Skill Profiling
              </Link>
            </li>
            <li>
              <Link to={user ? '/student/opportunities' : '/login'} className="hover:text-amber-400 transition-colors">
                AYUSH Industry Marketplace
              </Link>
            </li>
            <li>
              <Link to={user ? '/academician/opportunities' : '/login'} className="hover:text-amber-400 transition-colors">
                Academician FDP & Research
              </Link>
            </li>
            <li>
              <Link to={user ? '/institution/analytics' : '/login'} className="hover:text-amber-400 transition-colors">
                Institution Skill Analytics
              </Link>
            </li>
            <li>
              <Link to={user ? '/admin/dashboard' : '/login'} className="hover:text-amber-400 transition-colors">
                AIIA Super Admin Control
              </Link>
            </li>
          </ul>
        </div>

        {/* AYUSH Disciplines */}
        <div>
          <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-emerald-400">
            AYUSH Disciplines
          </h4>
          <ul className="space-y-2 text-[11px] text-slate-300">
            <li>Ayurveda (BAMS, MD/MS)</li>
            <li>Yoga & Naturopathy (BNYS)</li>
            <li>Unani Medicine (BUMS)</li>
            <li>Siddha Medicine (BSMS)</li>
            <li>Homoeopathy (BHMS)</li>
          </ul>
        </div>

        {/* Nodal Authority */}
        <div>
          <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider text-emerald-400">
            Nodal Authority
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            All India Institute of Ayurveda (AIIA)<br />
            Mathura Road, Gautampuri, Sarita Vihar,<br />
            New Delhi, Delhi 110076, India
          </p>
          <div className="mt-3 tricolor-strip"></div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-emerald-300/60">
        <p>© 2026 AYUSH Setu Platform. Built for Smart India Hackathon (SIH 2026).</p>
        <p>Designed with Deep Herbal Green & Warm Saffron Palette</p>
      </div>
    </footer>
  );
};
