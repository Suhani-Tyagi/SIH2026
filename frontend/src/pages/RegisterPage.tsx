import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, User, Mail, Lock, Building, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'STUDENT' | 'INDUSTRY' | 'ACADEMICIAN' | 'INSTITUTION_ADMIN'>('STUDENT');
  const [system, setSystem] = useState('AYURVEDA');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [degree, setDegree] = useState('BAMS');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    const result = await register({
      name,
      email,
      password,
      role,
      system,
      institutionName,
      companyName,
      degree
    });

    setLoading(false);
    if (result.success) {
      try {
        localStorage.setItem('ayush_remember_me', 'true');
        localStorage.setItem('ayush_saved_email', email.trim());
        localStorage.setItem('ayush_saved_password', password);
      } catch (e) {}

      if (role === 'STUDENT') navigate('/student/skill-assessment');
      else if (role === 'INDUSTRY') navigate('/industry/dashboard');
      else if (role === 'ACADEMICIAN') navigate('/academician/dashboard');
      else navigate('/institution/dashboard');
    } else {
      setError(result.message || 'Registration failed. Please review your input.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-ayush-primary text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Create Your AYUSH Setu Account
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Join India's official AYUSH Academia-Industry collaboration network
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Role Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Select Your Role / Persona:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  role === 'STUDENT'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg">👨‍🎓</span>
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('INDUSTRY')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  role === 'INDUSTRY'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg">🏭</span>
                <span>Industry</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('ACADEMICIAN')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  role === 'ACADEMICIAN'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg">🎓</span>
                <span>Academician</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('INSTITUTION_ADMIN')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  role === 'INSTITUTION_ADMIN'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs ring-1 ring-emerald-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg">🏛️</span>
                <span>Institution</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
              {error.toLowerCase().includes('already exists') && (
                <Link
                  to="/login"
                  className="px-3 py-1 bg-ayush-primary hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shrink-0 transition-all shadow-xs"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. / Student Full Name"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">AYUSH System</label>
                <select
                  value={system}
                  onChange={(e) => setSystem(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="AYURVEDA">Ayurveda</option>
                  <option value="YOGA">Yoga & Naturopathy</option>
                  <option value="UNANI">Unani</option>
                  <option value="SIDDHA">Siddha</option>
                  <option value="HOMEOPATHY">Homoeopathy</option>
                  <option value="ALL">All AYUSH Systems</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password (Min 8 Characters)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {role === 'STUDENT' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="e.g. AIIA Delhi / BHU"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degree / Course</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="BAMS">BAMS (Ayurveda)</option>
                    <option value="BHMS">BHMS (Homoeopathy)</option>
                    <option value="BUMS">BUMS (Unani)</option>
                    <option value="BSMS">BSMS (Siddha)</option>
                    <option value="BNYS">BNYS (Naturopathy & Yoga)</option>
                    <option value="MD/MS (AYUSH)">MD / MS (AYUSH Specialization)</option>
                  </select>
                </div>
              </div>
            )}

            {role === 'INDUSTRY' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Dabur R&D / Himalaya Wellness / Hospital Name"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>
            )}

            {(role === 'ACADEMICIAN' || role === 'INSTITUTION_ADMIN') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">AYUSH Institution Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. AIIA New Delhi / National Institute of Homoeopathy"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-ayush-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
