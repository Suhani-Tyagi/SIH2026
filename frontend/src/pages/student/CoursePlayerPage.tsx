import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Lock,
  FileText,
  Award,
  ChevronRight,
  MessageSquare,
  Send,
  AlertCircle,
  ArrowLeft,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Tv,
  Activity
} from 'lucide-react';

export const CoursePlayerPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'RESOURCES' | 'QA'>('CONTENT');
  const [lessonStarted, setLessonStarted] = useState(false);

  // Animated Video Lecture Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0); // 0 to 100%
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoDurationSec = 25; // Animated demo lecture playback duration

  // Q&A state
  const [questions, setQuestions] = useState<{ author: string; role: string; text: string; date: string }[]>([
    { author: 'Aarav Sharma', role: 'Student', text: 'Does this course cover Schedule T HPLC extraction norms for export batches?', date: 'Yesterday' },
    { author: 'Dr. Rajesh Sharma', role: 'Academic Lead', text: 'Yes! Module 2 Lesson 3 covers HPLC & HPTLC quality standards under Schedule T.', date: 'Today' }
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId, token]);

  // Reset video player when active lesson changes
  useEffect(() => {
    setIsPlaying(false);
    setVideoProgress(activeLesson?.status === 'COMPLETED' ? 100 : 0);
  }, [activeLesson?.id]);

  // Video Animation Timer & Auto-Completion Detection
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setVideoProgress((prev) => {
          const step = (100 / videoDurationSec) * 0.2 * playbackSpeed;
          const next = prev + step;
          if (next >= 100) {
            setIsPlaying(false);
            handleAutoMarkComplete();
            return 100;
          }
          return next;
        });
      }, 200);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed, activeLesson?.id]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/player`, {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('ayush_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
        setModules(data.modules || []);
        setResources(data.resources || []);

        // Default to first available or in-progress lesson
        let foundLesson: any = null;
        for (const mod of data.modules || []) {
          for (const les of mod.lessons || []) {
            if (!foundLesson && (les.status === 'AVAILABLE' || les.status === 'IN_PROGRESS')) {
              foundLesson = les;
            }
          }
        }
        if (!foundLesson && data.modules?.[0]?.lessons?.[0]) {
          foundLesson = data.modules[0].lessons[0];
        }
        setActiveLesson(foundLesson);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoMarkComplete = async () => {
    if (!activeLesson || updating || activeLesson.status === 'COMPLETED') return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/${activeLesson.id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('ayush_token')}`
        },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      if (res.ok) {
        await fetchCourseDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestions([
      ...questions,
      { author: user?.name || 'AYUSH Learner', role: user?.role || 'Student', text: newQuestion, date: 'Just now' }
    ]);
    setNewQuestion('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-ayush-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-800">Course Not Found</h3>
        <p className="text-gray-600 mt-1 mb-4">The course you are attempting to view is unavailable or not enrolled.</p>
        <Link to="/student/learning" className="px-4 py-2 bg-ayush-primary text-white rounded-lg inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Learning Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Progress Banner */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ayush-primary mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {course.providerName || 'Industry Learning Partner'}
            </span>
            <span>•</span>
            <span>{course.duration || '4 Weeks'}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-sm text-gray-600 mt-1 max-w-3xl">{course.description}</p>
        </div>

        <div className="w-full md:w-auto flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <span className="text-xs text-gray-500">Overall Progress</span>
            <span className="text-sm font-bold text-ayush-primary">{course.progressPercent || 0}%</span>
          </div>
          <div className="w-full md:w-48 bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-ayush-primary h-full transition-all duration-300"
              style={{ width: `${course.progressPercent || 0}%` }}
            ></div>
          </div>
          {course.progressPercent === 100 ? (
            <button
              onClick={() => navigate(`/courses/${courseId}/assessment`)}
              className="mt-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Award className="w-4 h-4" /> Take Aptitude Test (75% to Earn Cert)
            </button>
          ) : (
            <span className="text-[11px] text-gray-500">
              Complete all lessons to unlock the 75% Pass Aptitude Test
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left Lesson Content Player, Right Syllabus Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lesson Player & Workspace */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Animated Video Lecture Player Canvas */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative aspect-video flex flex-col justify-between group">
            
            {/* Header Overlay Badge */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
              <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold rounded-full flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> Animated Video Lecture: {activeLesson?.title || 'AYUSH Module'}
              </span>
              {activeLesson?.status === 'COMPLETED' || videoProgress >= 100 ? (
                <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full flex items-center gap-1 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Video Completed & Auto-Verified
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-400/90 text-slate-950 text-[10px] font-bold rounded-full">
                  Auto-Detection Active ({Math.round(videoProgress)}%)
                </span>
              )}
            </div>

            {/* Center Animation Scenes Container */}
            <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/40 to-slate-950">
              
              <div className="text-center space-y-4 max-w-lg z-10">
                {videoProgress < 35 && (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-600 to-ayush-primary p-0.5 shadow-2xl shadow-emerald-900/50">
                      <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/10 animate-ping rounded-full"></div>
                        <Tv className="w-9 h-9 text-amber-400 relative z-10" />
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-white tracking-tight">{activeLesson?.title || 'Lesson Overview'}</h3>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      Scene 1: Introduction to AYUSH Pharmacopoeial Monographs, Standard SOPs & Clinical Safety Norms
                    </p>
                  </div>
                )}

                {videoProgress >= 35 && videoProgress < 75 && (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 mx-auto rounded-full border-2 border-emerald-500/40 flex items-center justify-center relative">
                      <svg className="w-28 h-28 absolute inset-[-8px] animate-spin text-emerald-400" style={{ animationDuration: '8s' }} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="15 35" />
                      </svg>
                      <Activity className="w-10 h-10 text-amber-400 animate-bounce" />
                    </div>
                    <h3 className="text-base font-extrabold text-amber-300">Scene 2: Practical Analytical Demonstration</h3>
                    <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                      Simulating extraction laboratory parameters, active marker fingerprinting, and clinical diagnostic guidelines.
                    </p>
                  </div>
                )}

                {videoProgress >= 75 && (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                      <CheckCircle2 className="w-10 h-10 animate-bounce" />
                    </div>
                    <h3 className="text-lg font-black text-emerald-400">Scene 3: Final Lecture Verification</h3>
                    <p className="text-xs text-slate-200 font-medium">
                      Completing final assessment checks & automatically verifying 100% video completion.
                    </p>
                  </div>
                )}

                {/* Subtitle Narration Overlay */}
                <div className="bg-slate-900/95 border border-slate-700/80 px-4 py-2 rounded-xl text-[11px] text-amber-300 font-mono shadow-lg max-w-md mx-auto">
                  {videoProgress < 25 && `[Narration] Welcome to ${activeLesson?.title || 'this lecture'}. Let's examine the core standards and clinical guidelines.`}
                  {videoProgress >= 25 && videoProgress < 60 && `[Narration] Step 2: Observing active marker extraction, Schedule T compliance, and dosage parameters.`}
                  {videoProgress >= 60 && videoProgress < 90 && `[Narration] Step 3: Documenting clinical outcomes and verified profile evidence.`}
                  {videoProgress >= 90 && `[Narration] Lecture video completed! Automatic completion signal verified.`}
                </div>
              </div>

              {/* Large Play Button Overlay when Paused */}
              {!isPlaying && videoProgress < 100 && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center group-hover:bg-slate-950/40 transition-all z-20"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all">
                    <Play className="w-8 h-8 ml-1 fill-current" />
                  </div>
                </button>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-2 z-20">
              
              {/* Scrubber Bar */}
              <div
                className="relative w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
                  setVideoProgress(newPct);
                  if (newPct >= 100) handleAutoMarkComplete();
                }}
              >
                <div
                  className="bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 h-full transition-all duration-150"
                  style={{ width: `${videoProgress}%` }}
                ></div>
              </div>

              {/* Controls & Speed Selectors */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-bold flex items-center gap-1.5"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause Video' : videoProgress >= 100 ? 'Replay Video' : 'Play Video'}</span>
                  </button>

                  <button
                    onClick={() => { setVideoProgress(0); setIsPlaying(true); }}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="Restart Video"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-[11px] text-slate-400">
                    {Math.floor((videoProgress / 100) * videoDurationSec)}s / {videoDurationSec}s ({Math.round(videoProgress)}%)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">Speed:</span>
                  {[1, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                        playbackSpeed === spd
                          ? 'bg-amber-400 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <span className="text-emerald-900 font-medium">
              🎓 <strong>Automatic Completion Detection:</strong> Play and watch the animated lecture video to 100% completion. The lecture is automatically verified and marked complete upon finishing the video.
            </span>
            <button onClick={() => { setLessonStarted(!lessonStarted); setActiveTab('CONTENT'); }} className="font-bold text-emerald-800 underline shrink-0">{lessonStarted ? 'Hide lesson notes' : 'Show lesson notes'}</button>
          </div>

          {/* Lesson Action Header */}
          <div className="bg-white rounded-xl p-5 border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{activeLesson?.title || 'Module Overview'}</h2>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeLesson?.duration || '15 mins'}</span>
                  <span>•</span>
                  <span>{activeLesson?.isCompulsory ? 'Compulsory Lesson' : 'Optional Extra'}</span>
                </div>
              </div>

              {/* Automatic completion status badge */}
              <div className="flex items-center gap-2">
                {activeLesson?.status === 'COMPLETED' || videoProgress >= 100 ? (
                  <span className="text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Automatically Completed 🎓
                  </span>
                ) : (
                  <span className="text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" /> Watch Video to Complete
                  </span>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b text-xs font-medium text-gray-600 gap-6">
              <button
                onClick={() => setActiveTab('CONTENT')}
                className={`pb-2 transition ${activeTab === 'CONTENT' ? 'border-b-2 border-ayush-primary text-ayush-primary font-bold' : 'hover:text-gray-900'}`}
              >
                Lesson Reading & Notes
              </button>
              <button
                onClick={() => setActiveTab('RESOURCES')}
                className={`pb-2 transition ${activeTab === 'RESOURCES' ? 'border-b-2 border-ayush-primary text-ayush-primary font-bold' : 'hover:text-gray-900'}`}
              >
                Downloads & Standard Formulations ({resources.length})
              </button>
              <button
                onClick={() => setActiveTab('QA')}
                className={`pb-2 transition ${activeTab === 'QA' ? 'border-b-2 border-ayush-primary text-ayush-primary font-bold' : 'hover:text-gray-900'}`}
              >
                Mentor Q&A Forum
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'CONTENT' && (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed pt-2">
                <p>{activeLesson?.content || 'Select a lesson from the syllabus sidebar to read standard operating procedures, clinical guidelines, and industry formulation specs.'}</p>
                {lessonStarted && <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 p-4 text-xs"><strong>Study instruction:</strong> Write down the three decisions that need evidence, one safety or ethics checkpoint, and one question to take to a mentor. The matching learning pack contains detailed notes and practice questions.</div>}
                
                <div className="mt-4 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">Key Learning Outcomes</h4>
                  <ul className="list-disc list-inside text-xs text-emerald-800 space-y-1">
                    <li>Understand standard AYUSH formulation monographs and active marker quantification.</li>
                    <li>Apply Good Manufacturing Practices (GMP) and Schedule T compliance guidelines.</li>
                    <li>Perform clinical case diagnosis with verified evidence documentation.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'RESOURCES' && (
              <div className="space-y-3 pt-2">
                {resources.length === 0 ? (
                  <p className="text-xs text-gray-500">No additional resource files attached to this course.</p>
                ) : (
                  resources.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border text-xs">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="font-semibold text-gray-900">{r.title}</p>
                          <p className="text-gray-500 text-[11px]">{r.type || 'PDF Document'} • {r.fileSize || 'Resource'}</p>
                        </div>
                      </div>
                      <a
                        href={r.fileUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded font-medium text-gray-700"
                      >
                        Download
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'QA' && (
              <div className="space-y-4 pt-2">
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {questions.map((q, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg border text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">{q.author} <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">({q.role})</span></span>
                        <span className="text-[10px] text-gray-400">{q.date}</span>
                      </div>
                      <p className="text-gray-700">{q.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendQuestion} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask an industry mentor or academic lead a question..."
                    value={newQuestion}
                    onChange={e => setNewQuestion(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-ayush-primary outline-none"
                  />
                  <button type="submit" className="px-4 py-2 bg-ayush-primary text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Post
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Course Syllabus Modules & Lessons */}
        <div className="bg-white rounded-xl p-5 border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-ayush-primary" /> Course Syllabus
            </h3>
            <span className="text-xs text-gray-500">{modules.length} Modules</span>
          </div>

          <div className="space-y-3">
            {modules.map((mod, mIdx) => (
              <div key={mod.id || mIdx} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2.5 border-b font-semibold text-xs text-gray-800 flex items-center justify-between">
                  <span>Module {mIdx + 1}: {mod.title}</span>
                </div>

                <div className="divide-y bg-white">
                  {(mod.lessons || []).map((les: any, lIdx: number) => {
                    const isActive = activeLesson?.id === les.id;
                    const isCompleted = les.status === 'COMPLETED';
                    const isLocked = les.status === 'LOCKED';

                    return (
                      <button
                        key={les.id || lIdx}
                      onClick={() => { if (!isLocked) { setActiveLesson(les); setLessonStarted(false); } }}
                        disabled={isLocked}
                        className={`w-full text-left p-3 text-xs flex items-center justify-between transition ${
                          isActive ? 'bg-emerald-50/80 border-l-4 border-emerald-600 font-semibold' : 'hover:bg-gray-50'
                        } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : isLocked ? (
                            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <span className="truncate text-gray-800">{les.order || lIdx + 1}. {les.title}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">{les.duration || '15 min'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Test Action Card */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 text-center space-y-2">
            <Award className="w-8 h-8 text-amber-600 mx-auto" />
            <h4 className="font-bold text-xs text-amber-900">75% Aptitude E-Certificate</h4>
            <p className="text-[11px] text-amber-800 leading-tight">
              Pass the server-graded assessment after finishing lessons to earn your verifiable Ministry-attested certificate.
            </p>
            {course.progressPercent === 100 ? (
              <button
                onClick={() => navigate(`/courses/${courseId}/assessment`)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded shadow-sm transition"
              >
                Start Aptitude Test
              </button>
            ) : (
              <div className="text-[11px] text-amber-700 font-medium pt-1">
                Progress: {course.progressPercent || 0}% Complete
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
