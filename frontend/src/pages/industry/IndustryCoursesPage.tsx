import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Send, Sparkles } from 'lucide-react';

export const IndustryCoursesPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('4 Weeks (20 Hours)');
  const [level, setLevel] = useState('Intermediate');
  const [skillsAcquired, setSkillsAcquired] = useState('Panchakarma Techniques, Clinical Diagnostics, QA/QC & GMP Compliance');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const skillsArray = skillsAcquired.split(',').map((s) => s.trim());

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ayush_token')}`
        },
        body: JSON.stringify({
          title,
          duration,
          level,
          skillsAcquired: JSON.stringify(skillsArray),
          description
        })
      });

      if (res.ok) {
        navigate('/student/learning');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Publish Industry Certification Course / Workshop</h1>
        <p className="text-xs text-slate-500">Provide industry training courses that automatically update student skill scores</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Course / Workshop Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Masterclass in Classical Keraleeya Panchakarma Protocols"
            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 4 Weeks (20 Hours)"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Course Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Skills Boosted Upon Completion (Comma Separated)
          </label>
          <input
            type="text"
            value={skillsAcquired}
            onChange={(e) => setSkillsAcquired(e.target.value)}
            placeholder="e.g. Panchakarma Techniques, Herbal Formulation, Research Methodology"
            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Course Description & Curriculum Summary</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline the practical modules, video lectures, and hands-on laboratory exercises included..."
            className="w-full p-3.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {submitting ? 'Publishing Course...' : 'Publish Course to Student Learning Portal'} <Send className="w-4 h-4" />
        </button>

      </form>

    </div>
  );
};
