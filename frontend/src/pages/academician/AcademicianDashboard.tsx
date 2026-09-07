import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, BookOpen, Users, Sparkles, Plus, ArrowRight, Building2, CalendarDays, Handshake } from 'lucide-react';

export const AcademicianDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [programs, setPrograms] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token || localStorage.getItem('ayush_token')}` };
    fetch('/api/academician/programs', { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.programs) setPrograms(data.programs);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    fetch('/api/academician/mentorship', { headers }).then(res => res.json()).then(data => setRequests(data.mentorshipRequests || [])).catch(console.error);
    fetch('/api/academician/sessions', { headers }).then(res => res.json()).then(data => setSessions(data.sessions || [])).catch(console.error);
  }, [token]);

  const programsOfType = (type: string) => programs.filter(program => program.type === type);

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
          <div className="text-2xl font-extrabold text-slate-900">{programsOfType('FDP').length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Faculty Development</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Joint R&D Projects</span>
          <div className="text-2xl font-extrabold text-slate-900">{programsOfType('JOINT_RESEARCH').length}</div>
          <div className="text-[11px] text-amber-600 font-semibold">Pharma-Academia Grants</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mentorship Requests</span>
          <div className="text-2xl font-extrabold text-slate-900">{requests.length}</div>
          <div className="text-[11px] text-slate-500">Career Guidance</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Guest Lectures</span>
          <div className="text-2xl font-extrabold text-slate-900">{programsOfType('GUEST_LECTURE').length + sessions.filter(session => session.status === 'SCHEDULED').length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Industry Webinars</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 flex items-center gap-2"><Handshake className="w-4 h-4 text-emerald-700" /> Mentorship requests</h3>
          {requests.length === 0 ? <p className="text-xs text-slate-500">No open mentorship requests.</p> : requests.map(request => <div className="p-3 border rounded-xl bg-stone-50" key={request.id}><p className="font-bold text-xs">{request.student?.name || 'AYUSH student'} - {request.topic}</p><p className="text-xs text-slate-600 mt-1">{request.notes}</p><p className="text-[10px] mt-2 text-emerald-800 font-bold">{request.status} {request.meetingDate ? `· ${request.meetingDate}` : ''}</p></div>)}
        </section>
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 flex items-center gap-2"><CalendarDays className="w-4 h-4 text-emerald-700" /> Guest lectures & mentoring calendar</h3>
          {sessions.length === 0 ? <p className="text-xs text-slate-500">No sessions scheduled.</p> : sessions.map(session => <div className="p-3 border rounded-xl bg-stone-50" key={session.id}><p className="font-bold text-xs">{session.topic || session.agenda}</p><p className="text-xs text-slate-600 mt-1">{session.agenda}</p><p className="text-[10px] mt-2 text-emerald-800 font-bold">{new Date(session.scheduledAt).toLocaleString()} · {session.status}</p></div>)}
        </section>
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
