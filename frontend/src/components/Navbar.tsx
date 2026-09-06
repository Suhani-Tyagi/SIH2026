import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Bell, LogOut, User as UserIcon, Shield, ChevronDown, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('ayush_token')}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) setUnreadNotifications(data.notifications);
        })
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleRoleSwitch = async (role: string, targetPath: string) => {
    await demoLogin(role);
    setRoleMenuOpen(false);
    navigate(targetPath);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'STUDENT': return '/student/dashboard';
      case 'INDUSTRY': return '/industry/dashboard';
      case 'ACADEMICIAN': return '/academician/dashboard';
      case 'INSTITUTION_ADMIN': return '/institution/dashboard';
      case 'SUPER_ADMIN': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-ayush-primary flex items-center justify-center text-amber-400 shadow-md group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-ayush-dark tracking-tight">AYUSH Setu</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  AIIA Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Bridging AYUSH Academia, Industry & Careers
              </p>
            </div>
          </Link>

          {/* Center Links (if logged in) */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to={getDashboardPath()}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  location.pathname.includes('dashboard')
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </Link>

              {user.role === 'STUDENT' && (
                <>
                  <Link
                    to="/student/skill-assessment"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    Skill Assessment
                  </Link>
                  <Link
                    to="/student/opportunities"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    Opportunities
                  </Link>
                  <Link
                    to="/student/learning"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    Industry Courses
                  </Link>
                  <Link
                    to="/student/portfolio"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    Digital Portfolio
                  </Link>
                </>
              )}

              {user.role === 'INDUSTRY' && (
                <>
                  <Link
                    to="/industry/post-opportunity"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    Post Job/Internship
                  </Link>
                  <Link
                    to="/industry/applicants"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    Applicants
                  </Link>
                  <Link
                    to="/industry/learning-programs"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    Publish Course
                  </Link>
                </>
              )}

              {user.role === 'ACADEMICIAN' && (
                <>
                  <Link
                    to="/academician/opportunities"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    FDPs & Research
                  </Link>
                </>
              )}

              {user.role === 'INSTITUTION_ADMIN' && (
                <>
                  <Link
                    to="/institution/analytics"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    Skill Gap Analytics
                  </Link>
                </>
              )}

              {user.role === 'SUPER_ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                  >
                    National Analytics
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Right Actions & User Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Demo Switcher Quick Menu */}
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-bold transition-all shadow-xs"
                    title="Switch persona instantly for demo"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-700" />
                    <span className="hidden sm:inline">Role:</span> {user.role.replace('_', ' ')}
                    <ChevronDown className="w-3 h-3 text-amber-700" />
                  </button>

                  {roleMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Quick Demo Role Switcher
                      </div>
                      <button
                        onClick={() => handleRoleSwitch('STUDENT', '/student/dashboard')}
                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${user.role === 'STUDENT' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'}`}
                      >
                        <span>Student (BAMS Final Year)</span>
                        {user.role === 'STUDENT' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('INDUSTRY', '/industry/dashboard')}
                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${user.role === 'INDUSTRY' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'}`}
                      >
                        <span>Industry Partner (Dabur R&D)</span>
                        {user.role === 'INDUSTRY' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('ACADEMICIAN', '/academician/dashboard')}
                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${user.role === 'ACADEMICIAN' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'}`}
                      >
                        <span>Academician (AIIA Professor)</span>
                        {user.role === 'ACADEMICIAN' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('INSTITUTION_ADMIN', '/institution/dashboard')}
                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${user.role === 'INSTITUTION_ADMIN' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'}`}
                      >
                        <span>Institution Admin (AIIA Cell)</span>
                        {user.role === 'INSTITUTION_ADMIN' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('SUPER_ADMIN', '/admin/dashboard')}
                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50 ${user.role === 'SUPER_ADMIN' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'}`}
                      >
                        <span>Super Admin (AIIA Director)</span>
                        {user.role === 'SUPER_ADMIN' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-full relative transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white"></span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">Notifications</span>
                        <Link to="/notifications" onClick={() => setNotificationsOpen(false)} className="text-[11px] font-semibold text-emerald-700 hover:underline">
                          View All
                        </Link>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                        {unreadNotifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                        ) : (
                          unreadNotifications.slice(0, 4).map((n) => (
                            <div key={n.id} className="p-3 hover:bg-slate-50">
                              <p className="text-xs font-bold text-slate-800">{n.title}</p>
                              <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                              <p className="text-[9px] text-slate-400 mt-1">Just now</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-emerald-600 object-cover"
                  />
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-ayush-primary hover:text-emerald-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold bg-ayush-primary hover:bg-emerald-900 text-white rounded-xl shadow-md transition-all hover:scale-102"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
