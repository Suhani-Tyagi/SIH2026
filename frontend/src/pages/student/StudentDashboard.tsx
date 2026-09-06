import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Target,
  Briefcase,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ayush_token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/skills/profile', { headers }).then((res) => res.json()),
      fetch('/api/opportunities', { headers }).then((res) => res.json()),
      fetch('/api/applications/student', { headers }).then((res) => res.json())
    ])
      .then(([prof, opps, apps]) => {
        setProfileData(prof);
        if (opps.opportunities) setOpportunities(opps.opportunities);
        if (apps.applications) setApplications(apps.applications);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const readinessScore = profileData?.overallReadiness || user?.studentProfile?.readinessScore || 85;

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 via-ayush-primary to-emerald-800 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" /> AYUSH Student Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {user?.studentProfile?.degree || 'BAMS'} Student at {user?.institutionName || 'AIIA New Delhi'}. Track your skill benchmarks, matched industry internships, and active applications.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex flex-col items-center justify-center font-extrabold shadow-md">
              <span className="text-xl leading-none">{readinessScore}%</span>
              <span className="text-[9px] uppercase font-bold tracking-tighter">Readiness</span>
            </div>
            <div>
              <div className="text-xs font-bold text-white">Overall Skill Readiness</div>
              <div className="text-[11px] text-emerald-200">High Industry Compatibility</div>
              <Link
                to="/student/skill-assessment"
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:underline"
              >
                Retake Assessment <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Skill Readiness</span>
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{readinessScore}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Top 10% in Panchakarma
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Applications</span>
            <Briefcase className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{applications.length || 3}</div>
          <div className="text-[11px] text-slate-500">
            1 Shortlisted • 1 Interview Scheduled
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Industry Courses</span>
            <BookOpen className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">2 Enrolled</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            1 Certificate Earned
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Badges</span>
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">3 Badges</div>
          <Link to="/student/portfolio" className="text-[11px] font-bold text-ayush-primary hover:underline">
            View Public Digital Portfolio →
          </Link>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Top Matched Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Top Skill-Matched Opportunities</h3>
              <p className="text-xs text-slate-500">Ranked by algorithm based on your Dravyaguna & Panchakarma scores</p>
            </div>
            <Link to="/student/opportunities" className="text-xs font-bold text-ayush-primary hover:underline">
              View All 20 Posts →
            </Link>
          </div>

          <div className="space-y-4">
            {opportunities.slice(0, 4).map((opp) => (
              <div
                key={opp.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-500 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300">
                        {opp.type}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{opp.mode}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 mt-1">{opp.title}</h4>
                    <p className="text-xs font-bold text-ayush-primary flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" /> {opp.companyName}
                    </p>
                  </div>

                  <div className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-center">
                    <div className="text-xs font-extrabold text-amber-900">{opp.matchScore || 92}%</div>
                    <div className="text-[9px] font-bold text-amber-700 uppercase">Match</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 font-medium">
                  <span className="font-bold text-emerald-900">Why matched:</span> {opp.matchReason}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="text-slate-500">
                    Stipend: <span className="font-bold text-slate-800">{opp.stipend}</span> • {opp.location}
                  </div>
                  <Link
                    to="/student/opportunities"
                    className="px-3 py-1.5 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors text-xs"
                  >
                    View & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Applications Tracker Summary */}
        <div className="space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">Application Pipeline</h3>
              <Link to="/student/applications" className="text-xs font-bold text-ayush-primary hover:underline">
                Tracker →
              </Link>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                      {app.opportunity?.title || 'Herbal R&D Associate'}
                    </h5>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.status === 'SHORTLISTED'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : app.status === 'INTERVIEW'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : app.status === 'SELECTED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    {app.opportunity?.companyName || 'Dabur India Ltd.'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Learning Card */}
          <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-300 rounded-2xl space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-600" /> Next Learning Step
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Masterclass in Classical Keraleeya Panchakarma
            </h4>
            <p className="text-xs text-slate-600">
              Provided by Kerala Ayurveda Academy. Boost your Panchakarma radar score by +10 points upon completion.
            </p>
            <Link
              to="/student/learning"
              className="inline-block w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-center font-extrabold rounded-xl text-xs shadow-xs transition-all"
            >
              Browse Industry Courses
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
