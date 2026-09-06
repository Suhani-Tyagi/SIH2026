import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Users, BarChart3, TrendingUp, Download, AlertTriangle, Filter, CheckCircle2, ShieldAlert } from 'lucide-react';

export const InstitutionDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedDiscipline, setSelectedDiscipline] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [atRiskOnly, setAtRiskOnly] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedDiscipline, selectedBatch, atRiskOnly, token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        institutionName: user?.institutionName || 'All India Institute of Ayurveda',
        discipline: selectedDiscipline,
        batch: selectedBatch,
        atRiskOnly: String(atRiskOnly)
      });
      const res = await fetch(`/api/analytics/institution?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('ayush_token')}` }
      });
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/analytics/export-csv', {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('ayush_token')}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(user?.institutionName || 'AIIA').replace(/\s+/g, '_')}_Roster_Report.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
    }
  };

  const metrics = data?.metrics;
  const roster = data?.roster || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-ayush-dark to-emerald-900 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <Building2 className="w-3.5 h-3.5" /> Institution Admin Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.institutionName || 'All India Institute of Ayurveda, New Delhi'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200">
            Data Isolated Student Roster, At-Risk Skill Interventions & Placement Monitoring
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-all text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Roster CSV
          </button>
          <Link
            to="/institution/analytics"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/20"
          >
            <BarChart3 className="w-4 h-4" /> Analytics Matrix
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filtered Roster Size</span>
          <div className="text-2xl font-extrabold text-slate-900">{metrics?.totalStudents || roster.length} Candidates</div>
          <div className="text-[11px] text-emerald-600 font-semibold">{user?.institutionName || 'AIIA Node'}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Skill Readiness</span>
          <div className="text-2xl font-extrabold text-slate-900">{metrics?.avgSkillReadinessScore || 84}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> AIIA Index Target Met
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">At-Risk Interventions</span>
          <div className="text-2xl font-extrabold text-red-600">{metrics?.atRiskStudentsCount || 0} Students</div>
          <div className="text-[11px] text-red-700 font-medium">Readiness Score &lt; 70 or 0 Certs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Placement Rate</span>
          <div className="text-2xl font-extrabold text-slate-900">{metrics?.placementRatePercent || 88}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Matched Placements</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Filter className="w-4 h-4 text-emerald-600" /> Filter Student Roster:
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-xs bg-gray-50 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Disciplines (BAMS, MD, BSMS)</option>
            <option value="BAMS">BAMS</option>
            <option value="MD (Ayurveda)">MD (Ayurveda)</option>
            <option value="BSMS">BSMS</option>
          </select>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-xs bg-gray-50 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="ALL">All Batches / Passout Years</option>
            <option value="2025">2025 Passout</option>
            <option value="2026">2026 Passout</option>
            <option value="2024">2024 Passout</option>
          </select>

          <label className="flex items-center gap-1.5 font-semibold text-red-800 cursor-pointer bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
            <input
              type="checkbox"
              checked={atRiskOnly}
              onChange={(e) => setAtRiskOnly(e.target.checked)}
              className="text-red-600 focus:ring-red-500 rounded"
            />
            <span>Show At-Risk Only</span>
          </label>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            Institutional Student Roster ({roster.length})
          </h3>
          <span className="text-xs text-gray-500">Strict Data Isolation Enforced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
              <tr>
                <th className="p-3">Candidate Name</th>
                <th className="p-3">Degree & System</th>
                <th className="p-3">Batch</th>
                <th className="p-3">Readiness Score</th>
                <th className="p-3">Industry Certs</th>
                <th className="p-3">At-Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {roster.map((stu: any) => (
                <tr key={stu.userId} className={stu.isAtRisk ? 'bg-red-50/40 hover:bg-red-50' : 'hover:bg-slate-50'}>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{stu.studentName}</div>
                    <div className="text-[10px] text-slate-400">{stu.email}</div>
                  </td>
                  <td className="p-3">
                    {stu.degree} • {stu.system}
                  </td>
                  <td className="p-3 font-semibold">{stu.passoutYear}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      stu.readinessScore >= 80 ? 'bg-emerald-100 text-emerald-900' : stu.readinessScore >= 70 ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900'
                    }`}>
                      {stu.readinessScore}%
                    </span>
                  </td>
                  <td className="p-3">{stu.verifiedCertificatesCount} Certificates</td>
                  <td className="p-3">
                    {stu.isAtRisk ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 rounded font-bold text-[10px] flex items-center gap-1 w-max">
                        <ShieldAlert className="w-3 h-3" /> {stu.atRiskReason}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                        On Track
                      </span>
                    )}
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
