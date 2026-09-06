import React, { useState, useEffect } from 'react';
import { GraduationCap, Send, Plus } from 'lucide-react';

export const AcademicOpportunitiesPage: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('FDP');
  const [targetAudience, setTargetAudience] = useState('AYUSH Faculty & Postgraduates');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPrograms = () => {
    fetch('/api/academician/programs')
      .then((res) => res.json())
      .then((data) => {
        if (data.programs) setPrograms(data.programs);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/academician/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ayush_token')}`
        },
        body: JSON.stringify({
          title,
          type,
          targetAudience,
          description
        })
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchPrograms();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Faculty Development & Joint Research Programs</h1>
        <p className="text-xs text-slate-500">Collaborative opportunities between AYUSH colleges and industry R&D teams</p>
      </div>

      {/* Post Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">Post FDP, Joint Grant or Guest Lecture</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FDP on Phytochemistry Analytical Instrumentation"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="FDP">Faculty Development Program (FDP)</option>
              <option value="JOINT_RESEARCH">Joint Industry-Academia Research</option>
              <option value="CONSULTANCY">Industry Consultancy</option>
              <option value="GUEST_LECTURE">Guest Lecture Series</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Description & Objectives</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the research goals, lab facilities involved, and participation criteria..."
            className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          {submitting ? 'Posting...' : 'Publish Academic Opportunity'} <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Program Feed */}
      <div className="space-y-4">
        {programs.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full border border-amber-300">
                {p.type}
              </span>
              <span className="text-[10px] text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900">{p.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
            <div className="text-[11px] font-bold text-emerald-800">
              Organizer: {p.organizerName} • Audience: {p.targetAudience}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
