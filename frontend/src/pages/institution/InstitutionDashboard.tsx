import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Users, BarChart3, GraduationCap, CheckCircle2, TrendingUp } from 'lucide-react';

export const InstitutionDashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/institution')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-ayush-dark to-emerald-900 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <Building2 className="w-3.5 h-3.5" /> Institution Admin Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.institutionName || 'All India Institute of Ayurveda, New Delhi'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200">
            Institutional Skill Mapping, Internship Sourcing & Placement Monitoring Cell
          </p>
        </div>

        <Link
          to="/institution/analytics"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all text-xs flex items-center gap-2 shrink-0"
        >
          <BarChart3 className="w-4 h-4" /> View Detailed Skill Gap Analytics
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Students</span>
          <div className="text-2xl font-extrabold text-slate-900">850 Enrolled</div>
          <div className="text-[11px] text-emerald-600 font-semibold">BAMS & Postgraduates</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Skill Readiness</span>
          <div className="text-2xl font-extrabold text-slate-900">{metrics?.metrics?.avgSkillReadinessScore || 84}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +6% vs Previous Batch
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Placement Rate</span>
          <div className="text-2xl font-extrabold text-slate-900">{metrics?.metrics?.placementRatePercent || 88}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Matched Placements</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Industry MOUs</span>
          <div className="text-2xl font-extrabold text-slate-900">8 Companies</div>
          <div className="text-[11px] text-slate-500">Dabur, Himalaya, Patanjali</div>
        </div>

      </div>

      {/* Top Deficient Skills Alert Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">
          Priority Curriculum Skill Gaps Identified (AI Engine)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics?.topDeficientSkills?.map((s: any, idx: number) => (
            <div key={idx} className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{s.skill}</h4>
                <p className="text-[11px] text-slate-600">Affected Learners: {s.studentsAffected}</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded-lg">
                {s.severity} Priority
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
