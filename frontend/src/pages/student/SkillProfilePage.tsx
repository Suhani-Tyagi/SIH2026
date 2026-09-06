import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Target, Award, ArrowRight, BookOpen, CheckCircle2, TrendingUp } from 'lucide-react';

export const SkillProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [selectedTrack, setSelectedTrack] = useState<string>('clinicalPractitioner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('ayush_token')}` }
    })
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading skill radar metrics...</div>;
  }

  const skillScores = profileData?.skillScores || {
    panchakarma: 85,
    herbalFormulation: 78,
    clinicalDiagnostics: 90,
    nadiPariksha: 82,
    yogaTherapy: 65,
    researchMethodology: 75,
    patientCounseling: 88,
    qaGmp: 70
  };

  const careerTracks = profileData?.careerTracks || {
    clinicalPractitioner: { name: 'Clinical Practitioner', score: 88 },
    pharmaQaGmp: { name: 'AYUSH Pharma / QA Specialist', score: 76 },
    panchakarmaWellness: { name: 'Wellness & Panchakarma Specialist', score: 85 },
    yogaConsultant: { name: 'Yoga & Naturopathy Consultant', score: 72 },
    researchAcademia: { name: 'AYUSH Research & Academia', score: 81 }
  };

  // Recharts Radar data structure
  const radarData = [
    { subject: 'Panchakarma', student: skillScores.panchakarma || 85, benchmark: 90 },
    { subject: 'Herbal Formulation', student: skillScores.herbalFormulation || 78, benchmark: 85 },
    { subject: 'Clinical Diagnostics', student: skillScores.clinicalDiagnostics || 90, benchmark: 90 },
    { subject: 'Nadi Pariksha', student: skillScores.nadiPariksha || 82, benchmark: 85 },
    { subject: 'Yoga Therapy', student: skillScores.yogaTherapy || 65, benchmark: 80 },
    { subject: 'Research Method', student: skillScores.researchMethodology || 75, benchmark: 80 },
    { subject: 'Patient Counseling', student: skillScores.patientCounseling || 88, benchmark: 85 },
    { subject: 'QA / GMP', student: skillScores.qaGmp || 70, benchmark: 85 }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Your AYUSH Skill Profile & Career Radar</h1>
          <p className="text-xs text-slate-500">Visualized competency mapping across technical, clinical, and industrial domains</p>
        </div>
        <Link
          to="/student/skill-assessment"
          className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-300 transition-colors"
        >
          Retake Skill Questionnaire
        </Link>
      </div>

      {/* Main Radar & Track Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Radar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" /> Skill Competency Radar
            </h3>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
              Student vs Industry Benchmark
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Your Score (%)" dataKey="student" stroke="#1B5E20" fill="#1B5E20" fillOpacity={0.5} />
                <Radar name="Industry Benchmark" dataKey="benchmark" stroke="#E8A33D" fill="#E8A33D" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Computed Readiness Scores per Track */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" /> Computed Career Readiness
          </h3>

          <div className="space-y-3">
            {Object.entries(careerTracks).map(([key, track]: [string, any]) => (
              <div
                key={key}
                onClick={() => setSelectedTrack(key)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedTrack === key
                    ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>{track.name}</span>
                  <span className="text-emerald-800 font-extrabold text-sm">{track.score}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${track.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/student/opportunities"
            className="block w-full py-2.5 bg-ayush-primary hover:bg-emerald-900 text-white text-center font-bold rounded-xl text-xs transition-all shadow-xs"
          >
            Find Matching Opportunities →
          </Link>
        </div>

      </div>

      {/* Bar Chart: Detailed Skill Breakdown & Recommended Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">
            Competency Score Breakdown
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={radarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey="student" fill="#2E7D32" radius={[6, 6, 0, 0]} name="Your Score" />
                <Bar dataKey="benchmark" fill="#E8A33D" radius={[6, 6, 0, 0]} name="Target Benchmark" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations based on gaps */}
        <div className="p-6 bg-gradient-to-br from-emerald-900 to-ayush-dark text-white rounded-3xl space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-amber-400" /> Recommended Action Roadmap
          </div>
          <h4 className="text-base font-extrabold text-white">
            Recommended Next Learning Courses
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
              <div className="font-bold text-amber-300">AYUSH QA/QC & Schedule T GMP</div>
              <div className="text-[11px] text-emerald-200 mt-0.5">By Charak Pharma • +12 Skill Boost</div>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
              <div className="font-bold text-amber-300">Phytochemistry HPTLC Assay</div>
              <div className="text-[11px] text-emerald-200 mt-0.5">By Dabur R&D • +10 Skill Boost</div>
            </div>
          </div>

          <Link
            to="/student/learning"
            className="block w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-center rounded-xl text-xs transition-all shadow-md"
          >
            Enroll & Boost Skill Radar Score
          </Link>
        </div>

      </div>

    </div>
  );
};
