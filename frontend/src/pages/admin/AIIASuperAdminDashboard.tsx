import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { Shield, Users, Building2, Briefcase, CheckCircle2, Sparkles, Download, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AIIASuperAdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetch('/api/analytics/superadmin', { headers: { Authorization: `Bearer ${token || localStorage.getItem('ayush_token')}` } })
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        if (resData.pendingApprovals) setApprovals(resData.pendingApprovals);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleApprove = (id: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading AIIA Super Admin platform metrics...</div>;

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-ayush-dark to-emerald-950 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> ALL INDIA INSTITUTE OF AYURVEDA (AIIA)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            National AYUSH Platform Control Center
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200">
            Platform-wide oversight, institution approvals, and national skill demand vs supply metrics
          </p>
        </div>

        <button
          onClick={() => alert('Exporting AIIA National AYUSH Skill & Placement Report 2026 (PDF/CSV)...')}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl shadow-lg transition-all text-xs flex items-center gap-2 shrink-0"
        >
          <Download className="w-4 h-4" /> Download National Report
        </button>
      </div>

      {/* Summary Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Registered Students</span>
          <div className="text-2xl font-extrabold text-slate-900">{data?.summary?.totalStudents || 1500}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Across 5 AYUSH Systems</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Industry Partners</span>
          <div className="text-2xl font-extrabold text-slate-900">{data?.summary?.totalIndustry || 200}+</div>
          <span className="text-[10px] text-amber-600 font-semibold">Pharma, Wellness & Exporters</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">AYUSH Institutions</span>
          <div className="text-2xl font-extrabold text-slate-900">{data?.summary?.totalInstitutions || 50}+</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Colleges & Universities</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Placements Facilitated</span>
          <div className="text-2xl font-extrabold text-slate-900">{data?.summary?.placementsFacilitated || 1420}</div>
          <span className="text-[10px] text-emerald-600 font-bold">87.4% Success Rate</span>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: National Demand vs Supply */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">
            National Industry Demand vs Student Skill Supply
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.industryDemandVsSupply || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="skill" tick={{ fontSize: 9 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="industryDemand" fill="#E8A33D" name="Industry Demand (%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="studentSupply" fill="#1B5E20" name="Student Supply (%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Regional Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">
            Regional Ecosystem Distribution
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.regionalDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="region" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="students" fill="#2E7D32" name="Students" radius={[6, 6, 0, 0]} />
                <Bar dataKey="industryPartners" fill="#D97706" name="Industry Partners" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Pending Approvals Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" /> Pending Industry & Institution Verification Queue
          </h3>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
            {approvals.length} Action Items Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
              <tr>
                <th className="p-3">Organization Name</th>
                <th className="p-3">Entity Type</th>
                <th className="p-3">AYUSH Discipline</th>
                <th className="p-3">Registration Date</th>
                <th className="p-3">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {approvals.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{item.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-100 font-bold rounded text-[10px]">
                      {item.type}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-emerald-800">{item.system}</td>
                  <td className="p-3 text-slate-500">{item.registeredAt}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Approve & Verify
                    </button>
                  </td>
                </tr>
              ))}

              {approvals.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-emerald-800 font-bold text-xs">
                    All partner organizations verified and active!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
