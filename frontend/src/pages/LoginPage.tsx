import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, Mail, ArrowRight, AlertCircle, UserCheck, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const isRemembered = localStorage.getItem('ayush_remember_me') === 'true';
      const savedEmail = localStorage.getItem('ayush_saved_email');
      const savedPassword = localStorage.getItem('ayush_saved_password');

      if (isRemembered && savedEmail) {
        setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        setRememberMe(true);
        setAutoLoaded(true);
      }
    } catch (e) {
      console.error('Failed to read saved login credentials:', e);
    }
  }, []);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    try {
      const savedEmail = localStorage.getItem('ayush_saved_email');
      if (savedEmail && val.trim().toLowerCase() !== savedEmail.trim().toLowerCase()) {
        setAutoLoaded(false);
      }
    } catch (e) {}
  };

  const saveOrClearCredentials = (emailVal: string, passVal: string) => {
    try {
      if (rememberMe) {
        localStorage.setItem('ayush_remember_me', 'true');
        localStorage.setItem('ayush_saved_email', emailVal);
        localStorage.setItem('ayush_saved_password', passVal);
      } else {
        localStorage.removeItem('ayush_remember_me');
        localStorage.removeItem('ayush_saved_email');
        localStorage.removeItem('ayush_saved_password');
      }
    } catch (e) {
      console.error('Failed to save login credentials state:', e);
    }
  };

  const redirectByRole = (role?: string) => {
    if (role === 'SUPER_ADMIN') navigate('/admin/dashboard');
    else if (role === 'INSTITUTION_ADMIN') navigate('/institution/dashboard');
    else if (role === 'ACADEMICIAN') navigate('/academician/dashboard');
    else if (role === 'INDUSTRY') navigate('/industry/dashboard');
    else navigate('/student/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanEmail = email.trim();
    saveOrClearCredentials(cleanEmail, password);

    const result = await login(cleanEmail, password);
    setLoading(false);

    if (result.success) {
      // Decode user role from local storage token or response
      try {
        const token = localStorage.getItem('ayush_token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          redirectByRole(payload.role);
          return;
        }
      } catch (err) {}
      redirectByRole('STUDENT');
    } else {
      setError(result.message || 'Login failed. Please check your email and password.');
    }
  };

  const handleQuickDemo = async (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setError('');

    saveOrClearCredentials(demoEmail, 'password123');

    const result = await login(demoEmail, 'password123');
    setLoading(false);
    if (result.success) {
      redirectByRole(roleName);
    } else {
      setError(result.message || 'Demo login error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-ayush-primary text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <Leaf className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Sign in to AYUSH Setu
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Ministry of AYUSH & AIIA National Academia-Industry Collaboration Platform
          </p>
        </div>

        {/* Demo Persona Quick Selectors */}
        <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-700" /> Quick Demo Role Sign-In:
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">Default Pass: password123</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('aarav.sharma@student.aiia.ac.in', 'STUDENT')}
              className="p-2 text-left bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs transition-all"
            >
              <div className="font-extrabold text-slate-900">👨‍🎓 Student</div>
              <div className="text-[10px] text-slate-500 truncate">Aarav Sharma (BAMS)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('careers@daburayush.com', 'INDUSTRY')}
              className="p-2 text-left bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs transition-all"
            >
              <div className="font-extrabold text-slate-900">🏭 Industry Partner</div>
              <div className="text-[10px] text-slate-500 truncate">Dabur AYUSH R&D</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('dr.sharma@aiia-delhi.ac.in', 'ACADEMICIAN')}
              className="p-2 text-left bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs transition-all"
            >
              <div className="font-extrabold text-slate-900">🎓 Academician</div>
              <div className="text-[10px] text-slate-500 truncate">Prof. Rajesh Sharma</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin@aiia-delhi.ac.in', 'INSTITUTION_ADMIN')}
              className="p-2 text-left bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs transition-all"
            >
              <div className="font-extrabold text-slate-900">🏛️ Institution</div>
              <div className="text-[10px] text-slate-500 truncate">AIIA Academic Cell</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin@aiia.gov.in', 'SUPER_ADMIN')}
              className="p-2 text-left bg-white hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs transition-all col-span-2 sm:col-span-2"
            >
              <div className="font-extrabold text-slate-900">👑 AIIA Super Admin</div>
              <div className="text-[10px] text-slate-500 truncate">Dr. Tanuja Nesari (Director)</div>
            </button>
          </div>
        </div>

        {/* Regular Sign-In Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          
          {autoLoaded && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Saved login credentials automatically loaded</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail('');
                  setPassword('');
                  setAutoLoaded(false);
                }}
                className="text-[10px] text-emerald-700 underline font-semibold hover:text-emerald-900"
              >
                Clear
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
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
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="name@domain.com"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium">Save login information</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Saved securely in browser</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-ayush-primary hover:underline">
                Create Portal Account
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
