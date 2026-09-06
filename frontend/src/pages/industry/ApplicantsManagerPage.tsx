import React, { useEffect, useState } from 'react';
import { Users, CheckCircle2, XCircle, ChevronRight, Award, GraduationCap, MapPin } from 'lucide-react';

export const ApplicantsManagerPage: React.FC = () => {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = () => {
    fetch('/api/applications/industry', {
      headers: { Authorization: `Bearer ${localStorage.getItem('ayush_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) setApplicants(data.applications);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ayush_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchApplicants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Applicant Pipeline Management</h1>
        <p className="text-xs text-slate-500">Filter candidate applications by skill-match score and update hiring status</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading applicants pool...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 space-y-4">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="p-3.5">Candidate Details</th>
                  <th className="p-3.5">Applied Position</th>
                  <th className="p-3.5">Skill Match %</th>
                  <th className="p-3.5">Cover Note & Qualifications</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5">Pipeline Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {applicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80">
                    
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{app.student?.name || 'Aarav Sharma'}</div>
                      <div className="text-[10px] text-slate-500">{app.student?.email}</div>
                      <div className="text-[10px] text-emerald-800 font-bold mt-0.5">
                        {app.student?.studentProfile?.degree || 'BAMS'} • {app.student?.institutionName || 'AIIA'}
                      </div>
                    </td>

                    <td className="p-3.5 font-bold text-slate-900">
                      {app.opportunity?.title}
                    </td>

                    <td className="p-3.5">
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold rounded-full border border-amber-300 text-xs">
                        {app.matchScore}% Match
                      </span>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <p className="text-xs text-slate-600 line-clamp-2 italic">
                        "{app.coverLetter || 'I have practical Dravyaguna lab experience and GCP certification.'}"
                      </p>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${
                          app.status === 'SHORTLISTED'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : app.status === 'INTERVIEW'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : app.status === 'SELECTED'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="SHORTLISTED">Shortlist Candidate</option>
                        <option value="INTERVIEW">Schedule Interview</option>
                        <option value="SELECTED">Select / Hire Candidate</option>
                        <option value="REJECTED">Reject Application</option>
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
