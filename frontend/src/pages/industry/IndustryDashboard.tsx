import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, BookOpen, CheckCircle2, Plus, Sparkles, TrendingUp, Filter } from 'lucide-react';

export const IndustryDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/applications/industry', {
      headers: { Authorization: `Bearer ${localStorage.getItem('ayush_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) setApplicants(data.applications);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const shortlistedCount = applicants.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW').length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-ayush-dark to-emerald-900 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Industry Partner Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.companyName || 'Dabur AYUSH R&D Centre'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200">
            Recruitment & Skill-Matched Candidate Sourcing Portal
          </p>
        </div>

        <Link
          to="/industry/post-opportunity"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all text-xs flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Post New Opportunity
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Postings</span>
            <Briefcase className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">4 Active</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Jobs & Internships</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Applicants</span>
            <Users className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{applicants.length || 5}</div>
          <div className="text-[11px] text-slate-500">Skill-Matched Candidates</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Shortlisted Candidates</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{shortlistedCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">In Interview Pipeline</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Published Courses</span>
            <BookOpen className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">2 Courses</div>
          <Link to="/industry/learning-programs" className="text-[11px] font-bold text-ayush-primary hover:underline">
            Manage Courses →
          </Link>
        </div>

      </div>

      {/* Candidate Pipeline Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Recent Candidate Applications</h3>
            <p className="text-xs text-slate-500">Sorted by algorithm skill match score %</p>
          </div>
          <Link to="/industry/applicants" className="text-xs font-bold text-ayush-primary hover:underline">
            View All Applicants →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
              <tr>
                <th className="p-3">Candidate Name</th>
                <th className="p-3">Role Applied</th>
                <th className="p-3">Degree & College</th>
                <th className="p-3">Skill Match Score</th>
                <th className="p-3">Pipeline Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {applicants.slice(0, 5).map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{app.student?.name || 'Aarav Sharma'}</div>
                    <div className="text-[10px] text-slate-400">{app.student?.email}</div>
                  </td>
                  <td className="p-3 font-semibold text-emerald-900">
                    {app.opportunity?.title || 'Herbal R&D Associate'}
                  </td>
                  <td className="p-3">
                    {app.student?.studentProfile?.degree || 'BAMS (Final Year)'}
                    <div className="text-[10px] text-slate-500">{app.student?.institutionName || 'AIIA Delhi'}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-extrabold rounded-full border border-amber-300">
                      {app.matchScore}% Match
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-lg border border-emerald-200 text-[10px]">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      to="/industry/applicants"
                      className="px-3 py-1.5 bg-ayush-primary text-white font-bold rounded-lg hover:bg-emerald-900 transition-colors text-[11px]"
                    >
                      Review & Shortlist
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
