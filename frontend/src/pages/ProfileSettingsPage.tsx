import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Save, Shield } from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Profile Settings</h1>
        <p className="text-xs text-slate-500">Manage account information, AYUSH system preferences & security</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl border-2 border-emerald-600 object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">AYUSH System Discipline</label>
            <input
              type="text"
              defaultValue={user?.system || 'AYURVEDA'}
              readOnly
              className="w-full px-3.5 py-2 text-xs border border-slate-200 bg-slate-50 rounded-xl text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Institution / Organization</label>
            <input
              type="text"
              defaultValue={user?.institutionName || user?.companyName || 'All India Institute of Ayurveda'}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => alert('Profile settings updated successfully!')}
          className="w-full py-2.5 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
        >
          <Save className="w-4 h-4" /> Save Profile Changes
        </button>

      </div>

    </div>
  );
};
