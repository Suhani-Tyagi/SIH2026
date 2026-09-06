import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, BookOpen, Users, Sparkles, Plus, ArrowRight, Building2 } from 'lucide-react';

export const AcademicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/academician/programs')
      .then((res) => res.json())
      .then((data) => {
        if (data.programs) setPrograms(data.programs);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-900 via-ayush-primary to-emerald-800 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Academician & Faculty Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Prof. (Dr.) Rajesh Sharma'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200">
            {user?.designation || 'Professor & HOD, Dravyaguna Department'} • {user?.institutionName || 'AIIA New Delhi'}
          </p>
        </div>

        <Link
          to="/academician/opportunities"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all text-xs flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Post FDP / Joint Research
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active FDPs</span>
          <div className="text-2xl font-extrabold text-slate-900">3 FDPs</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Faculty Development</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Joint R&D Projects</span>
          <div className="text-2xl font-extrabold text-slate-900">2 Active</div>
          <div className="text-[11px] text-amber-600 font-semibold">Pharma-Academia Grants</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mentorship Requests</span>
          <div className="text-2xl font-extrabold text-slate-900">12 Students</div>
          <div className="text-[11px] text-slate-500">Career Guidance</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Guest Lectures</span>
          <div className="text-2xl font-extrabold text-slate-900">5 Scheduled</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Industry Webinars</div>
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900">Active FDPs & Joint Research Projects</h3>

        {loading ? (
          <div className="p-4 text-center text-xs text-slate-400">Loading academic opportunities...</div>
        ) : (
          <div className="space-y-4">
            {programs.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full border border-emerald-300">
                    {p.type}
                  </span>
                  <span className="text-[10px] text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900">{p.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                <div className="text-[11px] font-bold text-ayush-primary pt-1">
                  Organizer: {p.organizerName} • Audience: {p.targetAudience}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
