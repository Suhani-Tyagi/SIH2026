import React from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Briefcase,
  BookOpen,
  Users,
  Building2,
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-12">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-ayush-dark to-emerald-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-700/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            ACADEMIA-INDUSTRY COLLABORATION PORTAL FOR AYUSH
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white max-w-4xl mx-auto">
            AYUSH <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200">Setu</span>
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-emerald-200/90 max-w-3xl mx-auto">
            Bridging AYUSH Academia, Industry & Careers
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminating skill gaps between AYUSH colleges (BAMS, BHMS, BUMS, BSMS, Yoga) and premier industry partners (Dabur, Himalaya, Kerala Ayurveda, Patanjali, Kottakkal, Charak). Smart skill assessment, matched internships, industry certifications, and AIIA national analytics.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-2 text-sm"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 bg-emerald-900/80 hover:bg-emerald-800 text-white font-bold rounded-2xl border border-emerald-700 shadow-md transition-all text-sm"
            >
              Sign In to Portal
            </Link>
          </div>

          {/* Statistics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-700/50">
              <div className="text-3xl font-extrabold text-amber-400">1,500+</div>
              <div className="text-xs text-emerald-200 font-medium">AYUSH Students</div>
            </div>
            <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-700/50">
              <div className="text-3xl font-extrabold text-amber-400">200+</div>
              <div className="text-xs text-emerald-200 font-medium">Pharma & Wellness Co.</div>
            </div>
            <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-700/50">
              <div className="text-3xl font-extrabold text-amber-400">50+</div>
              <div className="text-xs text-emerald-200 font-medium">AYUSH Institutions</div>
            </div>
            <div className="p-4 bg-emerald-900/40 rounded-xl border border-emerald-700/50">
              <div className="text-3xl font-extrabold text-amber-400">94.2%</div>
              <div className="text-xs text-emerald-200 font-medium">Skill Match Placement</div>
            </div>
          </div>

        </div>
      </section>

      {/* CORE MODULE HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-ayush-dark">
            Comprehensive AYUSH Ecosystem Modules
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Designed specifically to address the unique needs of Ayurveda, Yoga, Unani, Siddha, and Homoeopathy education & industrial workforce demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-ayush-primary flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Skill Profiling Radar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students complete technical AYUSH questionnaires (Panchakarma, Dravyaguna, Nadi Pariksha, Yoga Therapy) and receive a visual radar chart benchmarking readiness for 5 career tracks.
            </p>
            <div className="text-xs font-bold text-ayush-primary flex items-center gap-1">
              Interactive Questionnaire & Radar <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Match-Percentage Marketplace</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pharma & hospital partners post opportunities with required skill tags. Students see match percentages (e.g. 94% Match) with visible reasoning ("Matched Panchakarma + GCP").
            </p>
            <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
              Kanban Application Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-ayush-primary flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Industry Certified Courses</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dabur, Himalaya, Kerala Ayurveda, Patanjali publish specialized workshops and certifications. Completing a course automatically updates student skill scores and awards verified digital badges.
            </p>
            <div className="text-xs font-bold text-ayush-primary flex items-center gap-1">
              Simulated Certificate Badge Engine <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">4. Academician FDP & Research</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AYUSH college faculty browse industry-sponsored Faculty Development Programs (FDPs), joint R&D grants, consultancies, and student mentorship opportunities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-ayush-primary flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">5. College Skill Gap Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              College admins get real-time dashboards detailing batch-wise skill gap trends, placement readiness, top missing industrial competencies, and curriculum alignment recommendations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">6. AIIA National Oversight</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Super Admin view for Ministry of AYUSH & AIIA directors aggregating macro data across all institutions, regional skill demand vs supply maps, and partner approvals.
            </p>
          </div>

        </div>
      </section>

      {/* TOP IN-DEMAND SKILLS TICKER */}
      <section className="bg-emerald-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-extrabold text-amber-300">
              Top In-Demand AYUSH Industry Skills (2026)
            </h3>
            <p className="text-xs text-emerald-200 mt-1">
              Mapped directly from Dabur, Himalaya, Kerala Ayurveda, Patanjali & Soukya recruitment feeds
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-emerald-950/70 rounded-xl border border-emerald-700/50">
              <span className="text-sm font-bold text-white block">Panchakarma Shodhana</span>
              <span className="text-[11px] text-amber-400 font-semibold">95% Demand Match</span>
            </div>
            <div className="p-4 bg-emerald-950/70 rounded-xl border border-emerald-700/50">
              <span className="text-sm font-bold text-white block">HPTLC Phytochemistry</span>
              <span className="text-[11px] text-amber-400 font-semibold">92% Demand Match</span>
            </div>
            <div className="p-4 bg-emerald-950/70 rounded-xl border border-emerald-700/50">
              <span className="text-sm font-bold text-white block">AYUSH GMP & Schedule T</span>
              <span className="text-[11px] text-amber-400 font-semibold">90% Demand Match</span>
            </div>
            <div className="p-4 bg-emerald-950/70 rounded-xl border border-emerald-700/50">
              <span className="text-sm font-bold text-white block">Nadi Pariksha Tactile</span>
              <span className="text-[11px] text-amber-400 font-semibold">88% Demand Match</span>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <div className="p-8 bg-gradient-to-r from-emerald-800 to-ayush-dark text-white rounded-3xl shadow-xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Bridge AYUSH Education & Industrial Excellence?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto">
            Join thousands of AYUSH learners, academicians, and top pharma & healthcare companies on AYUSH Setu.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-xs"
            >
              Create Portal Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
