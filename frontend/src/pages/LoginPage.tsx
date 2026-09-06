import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, Shield, Zap, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'INDUSTRY' | 'ACADEMICIAN' | 'INSTITUTION_ADMIN' | 'SUPER_ADMIN'>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/student/dashboard');
    } else {
      setError('Invalid email or password. Try our 1-click quick demo buttons below!');
    }
  };

  const handleDemoLogin = async (role: string, path: string) => {
    setLoading(true);
    const success = await demoLogin(role);
    setLoading(false);
    if (success) {
      navigate(path);
    } else {
      setError('Demo login failed. Please ensure backend seed data is loaded.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-ayush-primary text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Sign in to AYUSH Setu
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Academia-Industry Collaboration & Skill Placement Portal
          </p>
        </div>

        {/* 1-Click Demo Login Box (Judge Friendly) */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              1-Click Demo Login (For Evaluation)
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">
              Instant
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoLogin('STUDENT', '/student/dashboard')}
              className="p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 rounded-xl font-bold border border-amber-200 shadow-2xs text-left transition-all"
            >
              <div className="text-emerald-800 font-extrabold">👨‍🎓 Student</div>
              <div className="text-[10px] text-slate-500 font-normal">Aarav Sharma (BAMS)</div>
            </button>
            <button
              onClick={() => handleDemoLogin('INDUSTRY', '/industry/dashboard')}
              className="p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 rounded-xl font-bold border border-amber-200 shadow-2xs text-left transition-all"
            >
              <div className="text-emerald-800 font-extrabold">🏭 Industry Partner</div>
              <div className="text-[10px] text-slate-500 font-normal">Dabur AYUSH R&D</div>
            </button>
            <button
              onClick={() => handleDemoLogin('ACADEMICIAN', '/academician/dashboard')}
              className="p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 rounded-xl font-bold border border-amber-200 shadow-2xs text-left transition-all"
            >
              <div className="text-emerald-800 font-extrabold">🎓 Academician</div>
              <div className="text-[10px] text-slate-500 font-normal">Dr. Rajesh (AIIA)</div>
            </button>
            <button
              onClick={() => handleDemoLogin('INSTITUTION_ADMIN', '/institution/dashboard')}
              className="p-2.5 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 rounded-xl font-bold border border-amber-200 shadow-2xs text-left transition-all"
            >
              <div className="text-emerald-800 font-extrabold">🏛️ Institution</div>
              <div className="text-[10px] text-slate-500 font-normal">AIIA Delhi Cell</div>
            </button>
          </div>
          <button
            onClick={() => handleDemoLogin('SUPER_ADMIN', '/admin/dashboard')}
            className="w-full py-2 bg-gradient-to-r from-emerald-800 to-ayush-dark hover:from-emerald-900 hover:to-slate-900 text-white rounded-xl font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Launch Super Admin Portal (AIIA Director Dashboard)
          </button>
        </div>

        {/* Regular Sign-In Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Or Login with Credentials:
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.ac.in"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-ayush-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
