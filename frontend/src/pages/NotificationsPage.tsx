import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ayush_token');
    fetch('/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications) setNotifications(data.notifications);
        fetch('/api/notifications/read', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications & Portal Alerts</h1>
          <p className="text-xs text-slate-500">Real-time updates regarding application status changes, new course enrollments & messages</p>
        </div>
        <Link to="/" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs divide-y divide-slate-100 p-6">
        {loading ? (
          <div className="p-4 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No notifications found</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="py-4 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                n.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {n.type === 'SUCCESS' ? <CheckCircle2 className="w-5 h-5 text-emerald-700" /> : <Bell className="w-5 h-5 text-amber-700" />}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
