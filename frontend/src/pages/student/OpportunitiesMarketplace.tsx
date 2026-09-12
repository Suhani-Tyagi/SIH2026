import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  Send,
  X
} from 'lucide-react';

export const OpportunitiesMarketplace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSystem = searchParams.get('system') || 'ALL';

  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [systemFilter, setSystemFilter] = useState(initialSystem);
  const [modeFilter, setModeFilter] = useState('ALL');

  useEffect(() => {
    const sys = searchParams.get('system');
    if (sys) {
      setSystemFilter(sys);
    }
  }, [searchParams]);

  // Application Modal state
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState('');

  const fetchOpps = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (typeFilter !== 'ALL') params.append('type', typeFilter);
    if (systemFilter !== 'ALL') params.append('system', systemFilter);
    if (modeFilter !== 'ALL') params.append('mode', modeFilter);

    const token = localStorage.getItem('ayush_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`/api/opportunities?${params.toString()}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (data.opportunities) setOpportunities(data.opportunities);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOpps();
  }, [typeFilter, systemFilter, modeFilter]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpp) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ayush_token')}`
        },
        body: JSON.stringify({
          opportunityId: selectedOpp.id,
          coverLetter,
          matchScore: selectedOpp.matchScore || 88
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedSuccess(`Application for "${selectedOpp.title}" successfully submitted!`);
        setTimeout(() => {
          setSelectedOpp(null);
          setAppliedSuccess('');
          setCoverLetter('');
        }, 2000);
      } else {
        alert(data.message || 'Application error');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          AYUSH Internship & Career Marketplace
        </h1>
        <p className="text-xs text-slate-500">
          Discover industry opportunities from Dabur, Himalaya, Kerala Ayurveda, Patanjali, Kottakkal & Charak Pharma ranked by skill match %
        </p>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchOpps()}
              placeholder="Search by role, company name, or skills (e.g. Panchakarma, Dabur, GCP)..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <button
            onClick={fetchOpps}
            className="px-5 py-2 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-all shadow-2xs"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filters:
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All Types (Jobs & Internships)</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="JOB">Full Time Job</option>
            <option value="APPRENTICESHIP">Apprenticeship</option>
            <option value="RESEARCH_FELLOWSHIP">Research Fellowship</option>
          </select>

          <select
            value={systemFilter}
            onChange={(e) => setSystemFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All AYUSH Systems</option>
            <option value="AYURVEDA">Ayurveda</option>
            <option value="YOGA">Yoga & Naturopathy</option>
            <option value="UNANI">Unani</option>
            <option value="SIDDHA">Siddha</option>
            <option value="HOMEOPATHY">Homeopathy</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 bg-white font-medium focus:outline-none"
          >
            <option value="ALL">All Work Modes</option>
            <option value="ONSITE">Onsite</option>
            <option value="HYBRID">Hybrid</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Fetching live opportunities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:border-emerald-600 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full border border-emerald-300">
                        {opp.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{opp.mode}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">{opp.title}</h3>
                    <p className="text-xs font-bold text-ayush-primary flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" /> {opp.companyName}
                    </p>
                  </div>

                  <div className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-2xl text-center shadow-2xs">
                    <div className="text-sm font-extrabold text-amber-900">{opp.matchScore || 92}%</div>
                    <div className="text-[9px] font-bold text-amber-700 uppercase">Skill Match</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>

                {/* Required Skills Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {opp.skillsRequiredList?.map((s: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded-md">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-900 font-medium">
                  <span className="font-bold">Recommendation logic:</span> {opp.matchReason}
                </div>
              </div>

              {/* Bottom details & Apply */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-800">{opp.stipend}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>📍 {opp.location}</span>
                    <span>⏱️ {opp.duration}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOpp(opp)}
                  className="px-4 py-2 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  Apply Now
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* APPLY MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            
            <button
              onClick={() => setSelectedOpp(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                {selectedOpp.matchScore}% Skill Match
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                Apply for {selectedOpp.title}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedOpp.companyName} • {selectedOpp.location}
              </p>
            </div>

            {appliedSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>{appliedSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cover Note / Relevant AYUSH Practical Experience
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe your practical experience in Panchakarma, Dravyaguna lab work, or clinical diagnostics..."
                    className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  ></textarea>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800 block mb-1">Verified Digital Profile Attached:</span>
                  Your skill radar score ({selectedOpp.matchScore}%), verified college degree, and completed industry course badges will be automatically attached to this application.
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application to Industry'} <Send className="w-4 h-4" />
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
