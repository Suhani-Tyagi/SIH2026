import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Share2, CheckCircle2, ShieldCheck, ExternalLink, GraduationCap, MapPin, Phone, Mail } from 'lucide-react';

export const DigitalPortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/skills/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('ayush_token')}` }
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, []);

  const readinessScore = profile?.overallReadiness || user?.studentProfile?.readinessScore || 88;

  let verifiedBadges: string[] = ['Advanced Panchakarma Practitioner', 'AYUSH QA/QC Certified', 'AYUSH Student Registration'];
  try {
    if (user?.studentProfile?.verifiedBadges) {
      verifiedBadges = JSON.parse(user.studentProfile.verifiedBadges);
    }
  } catch (e) {}

  const publicUrl = `${window.location.origin}/portfolio/public/${user?.id || 'demo-student'}`;

  const handleShare = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Header & Public Share Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Verified Digital AYUSH Portfolio</h1>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> AIIA Authenticated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Official verified credential wallet for AYUSH industry recruitment</p>
        </div>

        <button
          onClick={handleShare}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Share2 className="w-4 h-4" /> {copied ? 'Public Link Copied! ✨' : 'Share Public Portfolio Link'}
        </button>
      </div>

      {/* Main Profile Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        
        {/* Cover Header */}
        <div className="h-32 bg-gradient-to-r from-emerald-950 via-ayush-dark to-emerald-900 p-6 flex items-end">
          <span className="text-xs font-bold text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-400/30">
            {user?.system} SYSTEM OF MEDICINE
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6 relative -mt-12">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name}
                className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-lg object-cover"
              />
              <div className="pb-1">
                <h2 className="text-2xl font-extrabold text-slate-900">{user?.name}</h2>
                <p className="text-xs font-bold text-ayush-primary flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-4 h-4" /> {user?.studentProfile?.degree || 'BAMS'} • {user?.institutionName || 'All India Institute of Ayurveda'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-center shadow-2xs">
              <div className="text-2xl font-extrabold text-amber-900">{readinessScore}%</div>
              <div className="text-[10px] font-bold text-amber-700 uppercase">AIIA Readiness Index</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-4 border-t border-slate-100 text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" /> New Delhi / Aluva, India
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-700" /> +91 98765 43210
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" /> {user?.email}
            </div>
          </div>

          {/* Verified Badges Section */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" /> Verified Skill Badges & Certifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {verifiedBadges.map((badge, idx) => (
                <div key={idx} className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{badge}</h4>
                    <p className="text-[10px] text-emerald-700 font-semibold">Verified by Ministry of AYUSH Portal</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Public Link Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="truncate pr-4">
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Public Share URL:</span>
              <span className="font-mono text-emerald-900 font-bold">{publicUrl}</span>
            </div>
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shrink-0"
            >
              Copy Link
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
