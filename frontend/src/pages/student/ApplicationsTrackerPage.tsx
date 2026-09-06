import React, { useEffect, useState } from 'react';
import { FileCheck, Building2, Calendar, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';

export const ApplicationsTrackerPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/applications/student', {
      headers: { Authorization: `Bearer ${localStorage.getItem('ayush_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) setApplications(data.applications);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stages = [
    { id: 'APPLIED', title: 'Applied', color: 'bg-slate-100 border-slate-300 text-slate-800' },
    { id: 'SHORTLISTED', title: 'Shortlisted', color: 'bg-amber-100 border-amber-300 text-amber-900' },
    { id: 'INTERVIEW', title: 'Interview Scheduled', color: 'bg-blue-100 border-blue-300 text-blue-900' },
    { id: 'SELECTED', title: 'Selected / Offer', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
    { id: 'REJECTED', title: 'Rejected', color: 'bg-red-100 border-red-300 text-red-900' }
  ];

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Application Kanban Tracker</h1>
        <p className="text-xs text-slate-500">Track real-time candidate pipeline progression from application submission to final offer selection</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading application pipeline...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageApps = applications.filter((a) => a.status === stage.id);

            return (
              <div key={stage.id} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 min-h-[400px] flex flex-col justify-between">
                <div className="space-y-3">
                  
                  {/* Stage Header */}
                  <div className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-between ${stage.color}`}>
                    <span>{stage.title}</span>
                    <span className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-[10px]">
                      {stageApps.length}
                    </span>
                  </div>

                  {/* App Cards in Stage */}
                  <div className="space-y-3">
                    {stageApps.map((app) => (
                      <div
                        key={app.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs hover:border-emerald-600 transition-all"
                      >
                        <h4 className="font-bold text-slate-900 leading-tight">
                          {app.opportunity?.title || 'Herbal R&D Specialist'}
                        </h4>
                        <p className="text-[11px] font-semibold text-ayush-primary flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {app.opportunity?.companyName}
                        </p>
                        <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                          <span>Match: <strong className="text-emerald-800">{app.matchScore}%</strong></span>
                          <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}

                    {stageApps.length === 0 && (
                      <div className="p-6 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No applications in this stage
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
