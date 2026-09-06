import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Target,
  BarChart3,
  Briefcase,
  BookOpen,
  Award,
  MessageSquare,
  Building2,
  Users,
  GraduationCap,
  FileCheck,
  Settings,
  Flame
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        
        {/* User Card */}
        <div className="p-3 bg-gradient-to-r from-emerald-900 to-ayush-primary rounded-xl text-white shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-amber-400 bg-white object-cover"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold truncate">{user.name}</h4>
              <p className="text-[10px] text-emerald-200 font-medium truncate">
                {user.role.replace('_', ' ')}
              </p>
              <span className="inline-block px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] rounded mt-0.5 border border-amber-400/30">
                {user.system} System
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links based on Role */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Portal
          </p>

          {user.role === 'STUDENT' && (
            <>
              <SidebarItem to="/student/dashboard" icon={LayoutDashboard} label="Dashboard" active={isActive('/student/dashboard')} />
              <SidebarItem to="/student/skill-assessment" icon={Target} label="Skill Assessment" active={isActive('/student/skill-assessment')} />
              <SidebarItem to="/student/skill-profile" icon={BarChart3} label="Skill Profile Radar" active={isActive('/student/skill-profile')} />
              <SidebarItem to="/student/opportunities" icon={Briefcase} label="Internships & Jobs" active={isActive('/student/opportunities')} />
              <SidebarItem to="/student/applications" icon={FileCheck} label="My Applications" active={isActive('/student/applications')} />
              <SidebarItem to="/student/learning" icon={BookOpen} label="Industry Courses" active={isActive('/student/learning')} />
              <SidebarItem to="/student/portfolio" icon={Award} label="Digital Portfolio" active={isActive('/student/portfolio')} />
              <SidebarItem to="/student/messages" icon={MessageSquare} label="Mentorship & Messages" active={isActive('/student/messages')} />
            </>
          )}

          {user.role === 'INDUSTRY' && (
            <>
              <SidebarItem to="/industry/dashboard" icon={LayoutDashboard} label="Industry Dashboard" active={isActive('/industry/dashboard')} />
              <SidebarItem to="/industry/post-opportunity" icon={Briefcase} label="Post Internship/Job" active={isActive('/industry/post-opportunity')} />
              <SidebarItem to="/industry/applicants" icon={Users} label="Review Applicants" active={isActive('/industry/applicants')} />
              <SidebarItem to="/industry/learning-programs" icon={BookOpen} label="Publish Course / FDP" active={isActive('/industry/learning-programs')} />
              <SidebarItem to="/student/messages" icon={MessageSquare} label="Direct Messages" active={isActive('/student/messages')} />
            </>
          )}

          {user.role === 'ACADEMICIAN' && (
            <>
              <SidebarItem to="/academician/dashboard" icon={LayoutDashboard} label="Faculty Dashboard" active={isActive('/academician/dashboard')} />
              <SidebarItem to="/academician/opportunities" icon={GraduationCap} label="FDPs & Research Grants" active={isActive('/academician/opportunities')} />
              <SidebarItem to="/student/messages" icon={MessageSquare} label="Student Mentorship" active={isActive('/student/messages')} />
            </>
          )}

          {user.role === 'INSTITUTION_ADMIN' && (
            <>
              <SidebarItem to="/institution/dashboard" icon={Building2} label="College Dashboard" active={isActive('/institution/dashboard')} />
              <SidebarItem to="/institution/analytics" icon={BarChart3} label="Skill Gap Analytics" active={isActive('/institution/analytics')} />
            </>
          )}

          {user.role === 'SUPER_ADMIN' && (
            <>
              <SidebarItem to="/admin/dashboard" icon={Flame} label="AIIA National Dashboard" active={isActive('/admin/dashboard')} />
            </>
          )}
        </div>
      </div>

      {/* Footer link in Sidebar */}
      <div className="pt-4 border-t border-slate-100">
        <SidebarItem to="/profile/settings" icon={Settings} label="Settings" active={isActive('/profile/settings')} />
      </div>
    </aside>
  );
};

const SidebarItem: React.FC<{ to: string; icon: any; label: string; active: boolean }> = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      active
        ? 'bg-emerald-900 text-white shadow-sm font-bold'
        : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/80'
    }`}
  >
    <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
    <span>{label}</span>
  </Link>
);
