import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Send, Plus, ArrowLeft } from 'lucide-react';

export const PostOpportunityPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState('INTERNSHIP');
  const [system, setSystem] = useState('AYURVEDA');
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [location, setLocation] = useState('New Delhi / NCR');
  const [mode, setMode] = useState('ONSITE');
  const [duration, setDuration] = useState('6 Months');
  const [skillsRequired, setSkillsRequired] = useState('Panchakarma Techniques, Clinical Diagnostics, Patient Counseling');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const skillsArray = skillsRequired.split(',').map((s) => s.trim());

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ayush_token')}`
        },
        body: JSON.stringify({
          title,
          type,
          system,
          stipend,
          location,
          mode,
          duration,
          skillsRequired: JSON.stringify(skillsArray),
          description
        })
      });

      if (res.ok) {
        navigate('/industry/dashboard');
      } else {
        alert('Failed to post opportunity');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Post New Internship / Job Posting</h1>
          <p className="text-xs text-slate-500">Reach qualified BAMS, BHMS, BUMS, BSMS & Yoga candidates across India</p>
        </div>
        <button
          onClick={() => navigate('/industry/dashboard')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Junior Herbal Formulation R&D Associate"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Opportunity Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="INTERNSHIP">Internship</option>
              <option value="JOB">Full Time Job</option>
              <option value="APPRENTICESHIP">Panchakarma Apprenticeship</option>
              <option value="RESEARCH_FELLOWSHIP">Research Fellowship</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target AYUSH System</label>
            <select
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="AYURVEDA">Ayurveda</option>
              <option value="YOGA">Yoga & Naturopathy</option>
              <option value="UNANI">Unani</option>
              <option value="SIDDHA">Siddha</option>
              <option value="HOMEOPATHY">Homoeopathy</option>
              <option value="ALL">All Systems</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Stipend / Salary</label>
            <input
              type="text"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              placeholder="e.g. ₹25,000 / month or ₹6.5 LPA"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="ONSITE">Onsite</option>
              <option value="HYBRID">Hybrid</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, Karnataka"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 6 Months or Full Time"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Required Skill Tags (Comma Separated)
          </label>
          <input
            type="text"
            value={skillsRequired}
            onChange={(e) => setSkillsRequired(e.target.value)}
            placeholder="e.g. Panchakarma Techniques, Herbal Formulation, QA/QC & GMP Compliance"
            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Job Description & Responsibilities</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail the role responsibilities, required qualifications, and daily clinical / lab tasks..."
            className="w-full p-3.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {submitting ? 'Publishing Opportunity...' : 'Publish Opportunity to AYUSH Marketplace'} <Send className="w-4 h-4" />
        </button>

      </form>

    </div>
  );
};
