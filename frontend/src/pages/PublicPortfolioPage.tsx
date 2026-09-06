import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, ShieldCheck, GraduationCap, MapPin, CheckCircle2, Leaf, ArrowLeft } from 'lucide-react';

export const PublicPortfolioPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetch(`/api/skills/portfolio/public/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Portfolio not found');
          return res.json();
        })
        .then((data) => setUserData(data.user))
        .catch((err) => setError('This public portfolio is either private or does not exist.'))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500 font-medium">Loading public AYUSH portfolio...</div>;
  }

  if (error || !userData) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Leaf className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Portfolio Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'The requested public portfolio could not be retrieved.'}</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-ayush-primary text-white font-bold text-xs rounded-xl">
          Return to AYUSH Setu Portal
        </Link>
      </div>
    );
  }

  const readinessScore = userData?.studentProfile?.readinessScore || 85;
  const verifiedBadges: string[] = userData?.verifiedBadges || ['AYUSH Verified Student'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <Link to="/" className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to AYUSH Setu
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Authenticated Public Credential
        </div>
      </div>

      {/* Main Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        
        <div className="h-32 bg-gradient-to-r from-emerald-950 via-ayush-dark to-emerald-900 p-6 flex items-end">
          <span className="text-xs font-bold text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-400/30">
            {userData?.system} SYSTEM OF MEDICINE
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6 relative -mt-12">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name}`}
                alt={userData?.name}
                className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-lg object-cover"
              />
              <div className="pb-1">
                <h1 className="text-2xl font-extrabold text-slate-900">{userData?.name}</h1>
                <p className="text-xs font-bold text-ayush-primary flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="w-4 h-4" /> {userData?.studentProfile?.degree || 'BAMS'} • {userData?.institutionName || 'All India Institute of Ayurveda'}
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-center shadow-2xs">
              <div className="text-2xl font-extrabold text-amber-900">{readinessScore}%</div>
              <div className="text-[10px] font-bold text-amber-700 uppercase">AIIA Readiness Score</div>
            </div>
          </div>

          {/* Verified Badges Section */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" /> Verified Skill Badges & Certifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {verifiedBadges.map((badge: string, idx: number) => (
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

          {/* Completed Industry Courses */}
          {userData?.completedCourses && userData.completedCourses.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Completed Industry Programs</h3>
              <div className="space-y-2">
                {userData.completedCourses.map((item: any) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.course?.title}</h4>
                      <p className="text-[11px] text-emerald-800 font-medium">Provided by {item.course?.providerName}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-lg">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
