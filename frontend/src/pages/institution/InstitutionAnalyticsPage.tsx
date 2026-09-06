import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

export const InstitutionAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/institution')
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-xs text-slate-500">Loading analytics...</div>;

  const COLORS = ['#1B5E20', '#E8A33D', '#0F3812', '#2E7D32', '#D97706'];

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Institutional Skill Gap & Placement Analytics</h1>
        <p className="text-xs text-slate-500">Curriculum alignment & student skill readiness diagnostics across AYUSH departments</p>
      </div>

      {/* Skill Gap Comparison Bar Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" /> Student Average vs Target Industry Skill Benchmark
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.skillGaps || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="skill" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
              <Bar dataKey="currentAvg" fill="#1B5E20" name="Current Student Avg (%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="benchmark" fill="#E8A33D" name="Target Benchmark (%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Placement Rate by System */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">
            Placement Rate % by AYUSH System
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.placementBySystem || []}
                  dataKey="placementRate"
                  nameKey="system"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.system}: ${entry.placementRate}%`}
                >
                  {(data?.placementBySystem || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Recommendations Card */}
        <div className="p-6 bg-gradient-to-br from-emerald-900 to-ayush-dark text-white rounded-3xl space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Academic Council Recommendations
          </div>
          <h4 className="text-lg font-extrabold text-white">
            Curriculum Enhancement Directives
          </h4>
          <ul className="space-y-3 text-xs text-emerald-100">
            <li className="p-3 bg-white/10 rounded-xl border border-white/15">
              <strong className="text-amber-300">1. Introduce Schedule T GMP Module:</strong> 30% gap detected in industrial manufacturing compliance.
            </li>
            <li className="p-3 bg-white/10 rounded-xl border border-white/15">
              <strong className="text-amber-300">2. Mandatory GCP Certification:</strong> Mandatory for all final year BAMS & BHMS clinical interns before hospital posting.
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
