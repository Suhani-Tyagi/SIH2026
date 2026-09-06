import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, User as UserIcon, Building2 } from 'lucide-react';

export const StudentMessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    fetch('/api/messages', {
      headers: { Authorization: `Bearer ${localStorage.getItem('ayush_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ayush_token')}`
        },
        body: JSON.stringify({
          receiverId: 'industry-dabur', // default demo recipient
          content: newMsg
        })
      });
      if (res.ok) {
        setNewMsg('');
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Industry & Mentorship Messages</h1>
        <p className="text-xs text-slate-500">Direct inquiry inbox between AYUSH learners, industry recruiters & academic mentors</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden h-[500px] flex flex-col justify-between">
        
        {/* Messages Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-ayush-primary flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900">Dabur AYUSH R&D Centre</h3>
              <p className="text-[10px] text-slate-500 font-medium">Recruitment & Mentorship Inquiry Thread</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
            Active
          </span>
        </div>

        {/* Message Thread Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
          {loading ? (
            <div className="p-4 text-center text-xs text-slate-400">Loading conversation thread...</div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === user?.id;
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="text-[10px] font-bold text-slate-400 mb-1 px-1">{m.senderName}</div>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-ayush-primary text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Composer */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your message or mentorship request..."
            className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-ayush-primary hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
          >
            Send <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
};
