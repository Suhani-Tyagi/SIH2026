import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Award, Clock, ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LearningProgramsPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [busyCourseId, setBusyCourseId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCourses = () => {
    fetch('/api/courses', {
      headers: { Authorization: `Bearer ${localStorage.getItem('ayush_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    setBusyCourseId(courseId);
    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('ayush_token')}`
        },
        body: JSON.stringify({ courseId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to enrol in this course');
      setMessage(data.message || 'Enrolled successfully');
      await fetchCourses();
      navigate(`/courses/${courseId}/player`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to enrol in this course');
    } finally {
      setBusyCourseId(null);
    }
  };

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Industry Certification Courses</h1>
        <p className="text-xs text-slate-500">
          Published directly by Dabur R&D, Himalaya Wellness, Kerala Ayurveda & Patanjali. Completing a course automatically updates your skill radar & awards verified profile badges.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading industry courses...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-emerald-600 transition-all"
            >
              <div>
                {/* Course Banner */}
                <div className="h-40 bg-slate-200 relative overflow-hidden">
                  <img
                    src={course.image || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg shadow-sm">
                      {course.providerName}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>⏱️ {course.duration}</span>
                    <span className="font-bold text-emerald-800">{course.price}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">{course.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>

                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Skills Gained:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {course.skillsList?.map((s: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-900 text-[10px] font-bold rounded-md border border-emerald-200">
                          +{s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                {course.isCompleted ? (
                  <div className="w-full py-2.5 bg-emerald-100 text-emerald-900 font-extrabold text-center rounded-xl text-xs border border-emerald-300 flex items-center justify-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-700" /> Course Completed & Badge Verified 🎓
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {!course.isEnrolled && (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={busyCourseId === course.id}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors"
                      >
                        {busyCourseId === course.id ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    )}
                    <button
                      onClick={() => course.isEnrolled ? navigate(`/courses/${course.id}/player`) : handleEnroll(course.id)}
                      disabled={busyCourseId === course.id}
                      className={`${course.isEnrolled ? 'col-span-2' : ''} py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-60`}
                    >
                      <PlayCircle className="w-4 h-4" /> {course.isEnrolled ? 'Continue Learning' : 'Enrol & Start Course'}
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
