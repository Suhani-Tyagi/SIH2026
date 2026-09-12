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
  Activity,
  Volume2,
  VolumeX,
  Video
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
  const [videoMode, setVideoMode] = useState<'3D_CANVAS' | 'YOUTUBE_3D'>('3D_CANVAS');
  const [isMuted, setIsMuted] = useState(false);
  const videoDurationSec = 25; // Animated demo lecture playback duration

  // Audio Voiceover Speech Synthesis
  const speakNarration = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;
      utterance.volume = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isPlaying]);

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
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [activeLesson?.id]);

  // Video Animation Timer & Auto-Completion Detection
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setVideoProgress((prev) => {
          const step = (100 / videoDurationSec) * 0.2 * playbackSpeed;
          const next = prev + step;

          // Trigger narration voiceover at scene boundaries
          if (prev < 5 && next >= 5) {
            speakNarration(`Welcome to ${activeLesson?.title || 'this lecture'}. Scene 1: Introduction and core standards.`);
          } else if (prev < 35 && next >= 35) {
            speakNarration("Scene 2: Demonstrating practical analytical extraction, active marker fingerprinting, and clinical guidelines.");
          } else if (prev < 75 && next >= 75) {
            speakNarration("Scene 3: Completing final verification. All parameters match pharmacopoeial standards.");
          }

          if (next >= 100) {
            setIsPlaying(false);
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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
  }, [isPlaying, playbackSpeed, activeLesson?.id, isMuted]);

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

  const renderAnimatedVideoVisualizer = () => {
    const title = (activeLesson?.title || course?.title || '').toLowerCase();
    const discipline = (course?.discipline || '').toLowerCase();

    // 1. HPTLC / HPLC / Quality Control / Standardization / Analytical
    if (title.includes('hptlc') || title.includes('hplc') || title.includes('quality') || title.includes('analytical') || title.includes('standard') || (discipline.includes('ayurveda') && title.includes('pharmacopoeia'))) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 relative text-white font-sans overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-20 animate-pulse"></div>

          <div className="z-10 flex items-center justify-between w-full text-xs font-mono border-b border-slate-800 pb-2">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              INSTRUMENT: HPTLC CAMAG TLC SCANNER IV (254nm / 366nm)
            </span>
            <span className="text-amber-400 font-extrabold bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30">
              Rf Marker Spot Peak Analyzer
            </span>
          </div>

          <div className="z-10 flex-1 w-full flex items-center justify-around gap-6 my-2">
            <div className="relative w-28 h-44 bg-slate-900 border-2 border-emerald-500/60 rounded-lg p-2 shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="text-[9px] font-mono text-emerald-400 text-center border-b border-emerald-950 pb-1">SILICA GEL 60 F254</div>
              
              <div
                className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] transition-all duration-200"
                style={{ bottom: `${Math.min(90, 10 + videoProgress * 0.75)}%` }}
              ></div>

              <div className="flex-1 relative my-1">
                {videoProgress > 15 && (
                  <div className="absolute left-6 bottom-4 w-4 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse text-[8px] text-slate-950 font-bold flex items-center justify-center">
                    Rf1
                  </div>
                )}
                {videoProgress > 35 && (
                  <div className="absolute left-8 bottom-12 w-5 h-4 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24] animate-pulse text-[8px] text-slate-950 font-bold flex items-center justify-center">
                    Rf2
                  </div>
                )}
                {videoProgress > 60 && (
                  <div className="absolute left-5 bottom-24 w-6 h-4 rounded-full bg-purple-400 shadow-[0_0_14px_#c084fc] animate-pulse text-[8px] text-slate-950 font-bold flex items-center justify-center">
                    Rf3
                  </div>
                )}
              </div>

              <div
                className="absolute top-0 bottom-0 w-1 bg-red-500/80 shadow-[0_0_12px_#ef4444] transition-all duration-300"
                style={{ left: `${(videoProgress * 1.5) % 100}%` }}
              ></div>
              <div className="text-[8px] font-mono text-slate-500 text-center">SOLVENT FRONT</div>
            </div>

            <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-inner flex flex-col justify-between h-44">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">ABSORBANCE SPECTRA (AU)</span>
                <span className="text-emerald-400 font-bold">LIVE PEAK INTEGRATION</span>
              </div>

              <div className="relative h-24 w-full bg-slate-950 rounded border border-slate-800 flex items-end p-1 overflow-hidden">
                <svg className="w-full h-full text-emerald-400 overflow-visible" viewBox="0 0 200 60">
                  <path
                    d={`M 0 55 Q 30 ${55 - (videoProgress > 15 ? 30 : 0)} 60 55 T 120 ${55 - (videoProgress > 40 ? 45 : 0)} T 170 ${55 - (videoProgress > 70 ? 35 : 0)} T 200 55`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    d={`M 0 55 Q 30 ${55 - (videoProgress > 15 ? 30 : 0)} 60 55 T 120 ${55 - (videoProgress > 40 ? 45 : 0)} T 170 ${55 - (videoProgress > 70 ? 35 : 0)} T 200 55 L 200 60 L 0 60 Z`}
                    fill="currentColor"
                    fillOpacity="0.15"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
                <div className="bg-slate-950 p-1 rounded border border-slate-800">
                  <span className="text-slate-500 block">Peak 1 (Rf 0.24)</span>
                  <span className="text-emerald-400 font-bold">{videoProgress > 15 ? '98.2% Purity' : 'Scanning...'}</span>
                </div>
                <div className="bg-slate-950 p-1 rounded border border-slate-800">
                  <span className="text-slate-500 block">Peak 2 (Rf 0.48)</span>
                  <span className="text-amber-400 font-bold">{videoProgress > 40 ? 'Active Marker' : 'Pending...'}</span>
                </div>
                <div className="bg-slate-950 p-1 rounded border border-slate-800">
                  <span className="text-slate-500 block">Peak 3 (Rf 0.72)</span>
                  <span className="text-purple-400 font-bold">{videoProgress > 70 ? 'Schedule T Compliant' : 'Pending...'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 w-full bg-slate-900/95 border border-slate-700/80 px-4 py-2 rounded-xl text-[11px] text-amber-300 font-mono text-center shadow-lg">
            {videoProgress < 30 && "[Lecture Video Scene 1] Spotting raw extract on Silica Gel 60 F254 plate & initiating mobile phase migration (Toluene:Ethyl Acetate 9:1)."}
            {videoProgress >= 30 && videoProgress < 75 && "[Lecture Video Scene 2] UV Scanner 254nm sweeping across plate. Quantifying active phytoconstituent markers against WHO reference standard."}
            {videoProgress >= 75 && "[Lecture Video Scene 3] Chromatographic fingerprint verified. Batch meets Pharmacopoeial monograph purity standards (>98.5%)."}
          </div>
        </div>
      );
    }

    // 2. Panchakarma / Shirodhara / Ayurveda Therapy
    if (title.includes('shirodhara') || title.includes('panchakarma') || title.includes('ayurvedic') || title.includes('dosha') || title.includes('bhasma') || discipline.includes('ayurveda')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 relative text-white font-sans overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-slate-950 to-slate-950"></div>

          <div className="z-10 flex items-center justify-between w-full text-xs font-mono border-b border-slate-800 pb-2">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              PANCHAKARMA CLINICAL SIMULATOR: SHIRODHARA & TRIDOSHA BALANCE
            </span>
            <span className="text-emerald-400 font-extrabold bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/30">
              Ajna Chakra Oscillating Stream
            </span>
          </div>

          <div className="z-10 flex-1 w-full flex items-center justify-around gap-6 my-2">
            <div className="relative w-40 h-44 bg-slate-900/90 border border-amber-500/40 rounded-xl p-2 flex flex-col items-center justify-between overflow-hidden shadow-2xl">
              <div
                className="relative w-16 h-10 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 rounded-b-2xl border-t-2 border-amber-400 shadow-lg flex items-center justify-center animate-pulse"
                style={{ transform: `translateX(${Math.sin(videoProgress * 0.2) * 15}px)` }}
              >
                <div className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></div>
              </div>

              <div
                className="w-1 bg-amber-400 shadow-[0_0_8px_#fbbf24] h-20 animate-pulse"
                style={{ transform: `translateX(${Math.sin(videoProgress * 0.2) * 15}px)` }}
              ></div>

              <div className="relative w-24 h-8 bg-slate-950 rounded-t-full border-t border-amber-500/60 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border border-amber-400 animate-ping absolute opacity-75"></div>
                <span className="text-[8px] font-mono text-amber-300 z-10">AJNA CHAKRA</span>
              </div>
            </div>

            <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-inner flex flex-col justify-between h-44">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>PARASYMPATHETIC EEG THETA WAVE</span>
                <span className="text-amber-400 font-bold">DOSHA EQUILIBRIUM</span>
              </div>

              <div className="h-16 w-full bg-slate-950 rounded border border-slate-800 flex items-center p-1 overflow-hidden">
                <svg className="w-full h-full text-amber-400" viewBox="0 0 200 40">
                  <path
                    d={`M 0 20 Q 25 ${20 + Math.sin(videoProgress) * 12} 50 20 T 100 20 T 150 20 T 200 20`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono">
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 block">VATA (Air)</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${Math.max(20, 80 - videoProgress * 0.6)}%` }}></div>
                  </div>
                  <span className="text-cyan-300 text-[8px] font-bold mt-0.5 block">{videoProgress > 50 ? 'Pacified' : 'Elevated'}</span>
                </div>

                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 block">PITTA (Fire)</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${Math.max(30, 70 - videoProgress * 0.4)}%` }}></div>
                  </div>
                  <span className="text-amber-300 text-[8px] font-bold mt-0.5 block">Cooling</span>
                </div>

                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 block">KAPHA (Earth)</span>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${Math.min(65, 40 + videoProgress * 0.25)}%` }}></div>
                  </div>
                  <span className="text-emerald-300 text-[8px] font-bold mt-0.5 block">Nourished</span>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 w-full bg-slate-900/95 border border-slate-700/80 px-4 py-2 rounded-xl text-[11px] text-amber-300 font-mono text-center shadow-lg">
            {videoProgress < 30 && "[Lecture Video Scene 1] Positioning warm Ksheerabala Taila vessel 10cm above forehead. Initiating steady 30-min continuous pendulum stream."}
            {videoProgress >= 30 && videoProgress < 75 && "[Lecture Video Scene 2] Stimulating Ajna Chakra & Prana Vayu. Cortisol level dropping by 42%, inducing parasympathetic theta relaxation."}
            {videoProgress >= 75 && "[Lecture Video Scene 3] Shirodhara protocol complete. Vata pacification verified; clinical post-care SOP recorded."}
          </div>
        </div>
      );
    }

    // 3. Yoga & Naturopathy / Pranayama / HRV
    if (title.includes('yoga') || title.includes('pranayama') || title.includes('hrv') || title.includes('naturopathy') || discipline.includes('yoga')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 relative text-white font-sans overflow-hidden select-none">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-15"></div>

          <div className="z-10 flex items-center justify-between w-full text-xs font-mono border-b border-slate-800 pb-2">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              YOGA PHYSIOLOGY: PRANAYAMA BREATH RHYTHM & AUTONOMIC HRV
            </span>
            <span className="text-emerald-400 font-extrabold bg-slate-900 px-2 py-0.5 rounded border border-emerald-500/30">
              Anahata Biofeedback
            </span>
          </div>

          <div className="z-10 flex-1 w-full flex items-center justify-around gap-6 my-2">
            <div className="relative w-36 h-44 bg-slate-900/90 border border-cyan-500/40 rounded-xl p-3 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute rounded-full border border-cyan-400/60 bg-cyan-500/10 transition-all duration-700"
                  style={{
                    width: `${60 + Math.sin(videoProgress * 0.3) * 30}px`,
                    height: `${60 + Math.sin(videoProgress * 0.3) * 30}px`
                  }}
                ></div>
                <div className="w-12 h-20 bg-gradient-to-b from-amber-400 via-emerald-400 to-cyan-500 rounded-t-full opacity-80 blur-xs"></div>
              </div>
              <span className="text-[9px] font-mono text-cyan-300 mt-2 font-bold">
                PRANA RHYTHM: {Math.sin(videoProgress * 0.3) > 0 ? 'INHALE 4s' : 'EXHALE 8s'}
              </span>
            </div>

            <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-inner flex flex-col justify-between h-44">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>HEART RATE VARIABILITY (HRV SDNN)</span>
                <span className="text-cyan-400 font-bold">VAGAL TONE: OPTIMAL</span>
              </div>

              <div className="h-20 w-full bg-slate-950 rounded border border-slate-800 flex items-center p-2">
                <svg className="w-full h-full text-cyan-400" viewBox="0 0 200 50">
                  <path
                    d={`M 0 25 L 30 25 L 35 10 L 40 40 L 45 25 L 80 25 L 85 5 L 90 45 L 95 25 L 140 25 L 145 10 L 150 40 L 155 25 L 200 25`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[9px] font-mono">
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 block">SYMPATHETIC STRESS</span>
                  <span className="text-amber-400 font-extrabold text-xs">{Math.max(12, Math.round(65 - videoProgress * 0.5))} ms</span>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 block">PARASYMPATHETIC RECOVERY</span>
                  <span className="text-emerald-400 font-extrabold text-xs">{Math.min(98, Math.round(45 + videoProgress * 0.5))}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 w-full bg-slate-900/95 border border-slate-700/80 px-4 py-2 rounded-xl text-[11px] text-amber-300 font-mono text-center shadow-lg">
            {videoProgress < 30 && "[Lecture Video Scene 1] Initiating Anulom Vilom (Alternate Nostril Breathing). Inhale 4s -> Retain 16s -> Exhale 8s."}
            {videoProgress >= 30 && videoProgress < 75 && "[Lecture Video Scene 2] Vagus nerve stimulation enhancing baroreflex sensitivity & lowering arterial blood pressure."}
            {videoProgress >= 75 && "[Lecture Video Scene 3] Autonomic nervous system balance achieved. Autonomic stability score: 98/100."}
          </div>
        </div>
      );
    }

    // 4. Homoeopathy / Potentization / Succussion
    if (title.includes('homoeopath') || title.includes('potentiz') || title.includes('succussion') || title.includes('repertory') || discipline.includes('homeopathy')) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 relative text-white font-sans overflow-hidden select-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950"></div>

          <div className="z-10 flex items-center justify-between w-full text-xs font-mono border-b border-slate-800 pb-2">
            <span className="text-indigo-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              HOMOEOPATHIC PHARMACY: CENTESIMAL POTENTIZATION & SUCCUSSION
            </span>
            <span className="text-amber-400 font-extrabold bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30">
              30C / 200C Dynamic Imprint
            </span>
          </div>

          <div className="z-10 flex-1 w-full flex items-center justify-around gap-6 my-2">
            <div className="relative w-36 h-44 bg-slate-900/90 border border-indigo-500/40 rounded-xl p-3 flex flex-col items-center justify-between overflow-hidden shadow-2xl">
              <div
                className="w-12 h-24 border-2 border-indigo-300/80 rounded-b-xl bg-indigo-950/50 relative overflow-hidden flex items-end shadow-[0_0_15px_#818cf8]"
                style={{ transform: `translateY(${Math.sin(videoProgress * 0.4) * 8}px)` }}
              >
                <div className="w-full bg-indigo-500/60 h-14 relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white/40 animate-ping"></div>
                </div>
              </div>

              <div className="w-24 h-4 bg-amber-950 border border-amber-700 rounded text-[8px] font-mono text-amber-400 text-center font-bold">
                LEATHER PAD IMPACT
              </div>
            </div>

            <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-inner flex flex-col justify-between h-44">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>WATER CLATHRATE NANOSTRUCTURE LATTICE</span>
                <span className="text-indigo-400 font-bold">HAHNEMANNIAN RATIO 1:99</span>
              </div>

              <div className="h-20 w-full bg-slate-950 rounded border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden">
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] animate-ping"
                      style={{ animationDelay: `${i * 150}ms` }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-[9px] font-mono">
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 block">SUCCUSSION STRIKES</span>
                  <span className="text-indigo-400 font-extrabold text-xs">{Math.min(10, Math.floor(videoProgress / 10))} / 10 STRIKES</span>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-400 block">DYNAMIZED POTENCY</span>
                  <span className="text-emerald-400 font-extrabold text-xs">{videoProgress > 50 ? '30C Potency Verified' : 'In Succussion...'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 w-full bg-slate-900/95 border border-slate-700/80 px-4 py-2 rounded-xl text-[11px] text-amber-300 font-mono text-center shadow-lg">
            {videoProgress < 30 && "[Lecture Video Scene 1] Adding 1 part mother tincture (Q) to 99 parts dispensing alcohol in clean glass vial."}
            {videoProgress >= 30 && videoProgress < 75 && "[Lecture Video Scene 2] Applying 10 powerful downward succussion strikes against leather cushion to release dynamic medicinal force."}
            {videoProgress >= 75 && "[Lecture Video Scene 3] Centesimal potency (30C) complete. Nanoparticle electromagnetic imprint verified."}
          </div>
        </div>
      );
    }

    // 5. Default / Industrial SOP & General AYUSH Video Explanation
    return (
      <div className="w-full h-full flex flex-col items-center justify-between p-4 relative text-white font-sans overflow-hidden select-none">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>

        <div className="z-10 flex items-center justify-between w-full text-xs font-mono border-b border-slate-800 pb-2">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            MANUFACTURING SOP & CLINICAL QUALITY ASSURANCE SIMULATION
          </span>
          <span className="text-amber-400 font-extrabold bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30">
            GMP & Schedule T SOP
          </span>
        </div>

        <div className="z-10 flex-1 w-full flex items-center justify-around gap-6 my-2">
          <div className="relative w-36 h-44 bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3 flex flex-col items-center justify-between overflow-hidden shadow-2xl">
            <div className="w-20 h-24 border-2 border-emerald-400 rounded-b-3xl bg-slate-950 relative overflow-hidden flex flex-col justify-end p-1">
              <div className="w-full bg-emerald-600/60 rounded-b-2xl h-16 relative flex items-center justify-center">
                <div className="w-full h-1 bg-amber-400 animate-spin"></div>
              </div>
            </div>
            <span className="text-[9px] font-mono text-emerald-300 font-bold">EXTRACTION KETTLE (85°C)</span>
          </div>

          <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-inner flex flex-col justify-between h-44">
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>ACTIVE SOP WORKFLOW MONITOR</span>
              <span className="text-emerald-400 font-bold">LIVE TELEMETRY</span>
            </div>

            <div className="h-16 w-full bg-slate-950 rounded border border-slate-800 flex items-center p-2 gap-2">
              <div className="flex-1 bg-slate-900 p-2 rounded border border-slate-800 text-[9px] font-mono text-center">
                <span className="text-slate-500 block">TEMP</span>
                <span className="text-amber-400 font-bold text-xs">85.4 °C</span>
              </div>
              <div className="flex-1 bg-slate-900 p-2 rounded border border-slate-800 text-[9px] font-mono text-center">
                <span className="text-cyan-400 font-bold text-xs">1.2 BAR</span>
              </div>
              <div className="flex-1 bg-slate-900 p-2 rounded border border-slate-800 text-[9px] font-mono text-center">
                <span className="text-emerald-400 font-bold text-xs">99.1%</span>
              </div>
            </div>

            <div className="w-full bg-slate-950 p-2 rounded border border-slate-800 text-[9px] font-mono">
              <div className="flex justify-between mb-1 text-slate-400">
                <span>GMP Inspection Checklist</span>
                <span className="text-emerald-400 font-bold">{Math.round(videoProgress)}% Verified</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-200" style={{ width: `${videoProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="z-10 w-full bg-slate-900/95 border border-slate-700/80 px-4 py-2 rounded-xl text-[11px] text-amber-300 font-mono text-center shadow-lg">
          {videoProgress < 30 && `[Lecture Video Scene 1] Initializing ${activeLesson?.title || 'lecture SOP'}. Checking raw material authentication & moisture specs.`}
          {videoProgress >= 30 && videoProgress < 75 && `[Lecture Video Scene 2] Executing extraction SOP under Schedule T GMP parameters. Verifying active yield.`}
          {videoProgress >= 75 && `[Lecture Video Scene 3] Final quality control check complete. Verified 100% video completion & updated student records.`}
        </div>
      </div>
    );
  };

  const getYouTube3DVideoUrl = () => {
    const title = (activeLesson?.title || course?.title || '').toLowerCase();
    const discipline = (course?.discipline || '').toLowerCase();

    if (title.includes('hptlc') || title.includes('hplc') || title.includes('quality') || title.includes('analytical') || title.includes('standard')) {
      return 'https://www.youtube.com/embed/wQI6Y8_Y1Y4?autoplay=1&enablejsapi=1';
    }
    if (title.includes('shirodhara') || title.includes('panchakarma') || title.includes('ayurvedic') || discipline.includes('ayurveda')) {
      return 'https://www.youtube.com/embed/iASOF7MLQHo?autoplay=1&enablejsapi=1';
    }
    if (title.includes('yoga') || title.includes('pranayama') || title.includes('hrv') || discipline.includes('yoga')) {
      return 'https://www.youtube.com/embed/z-Fm8o5dO68?autoplay=1&enablejsapi=1';
    }
    if (title.includes('homoeopath') || title.includes('potentiz') || discipline.includes('homeopathy')) {
      return 'https://www.youtube.com/embed/_8u-t1xG98M?autoplay=1&enablejsapi=1';
    }
    return 'https://www.youtube.com/embed/iASOF7MLQHo?autoplay=1&enablejsapi=1';
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
          
          {/* Video Player Header Mode Switcher Bar */}
          <div className="flex items-center justify-between bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Video className="w-4 h-4 text-emerald-400" /> Animated Video Lecture Mode:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVideoMode('3D_CANVAS')}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 border ${
                  videoMode === '3D_CANVAS'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 3D Motion Graphics & Voiceover
              </button>
              <button
                onClick={() => { setVideoMode('YOUTUBE_3D'); setIsPlaying(true); }}
                className={`px-3 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 border ${
                  videoMode === 'YOUTUBE_3D'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" /> HD 3D Educational Video (Stream)
              </button>
            </div>
          </div>

          {/* Animated Video Lecture Player Canvas */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative aspect-video flex flex-col justify-between group">
            
            {/* Header Overlay Badge */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
              <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold rounded-full flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                {videoMode === '3D_CANVAS' ? '3D Animated Graphics Engine' : 'HD 3D Video Stream'}: {activeLesson?.title || 'AYUSH Module'}
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

            {/* Center Animation Scenes Container / YouTube Embed Container */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-950">
              {videoMode === 'YOUTUBE_3D' ? (
                <iframe
                  className="w-full h-full border-0"
                  src={getYouTube3DVideoUrl()}
                  title="3D Animated Biology & AYUSH Lecture Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  {renderAnimatedVideoVisualizer()}

                  {/* Large Play Button Overlay when Paused */}
                  {!isPlaying && videoProgress < 100 && (
                    <button
                      onClick={() => {
                        setIsPlaying(true);
                        speakNarration(`Welcome to ${activeLesson?.title || 'this lecture'}. Starting video explanation.`);
                      }}
                      className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center group-hover:bg-slate-950/40 transition-all z-20"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all">
                        <Play className="w-8 h-8 ml-1 fill-current" />
                      </div>
                    </button>
                  )}
                </>
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
                    onClick={() => {
                      const nextPlay = !isPlaying;
                      setIsPlaying(nextPlay);
                      if (nextPlay) {
                        speakNarration(`Resuming video explanation for ${activeLesson?.title || 'lecture'}.`);
                      } else if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-bold flex items-center gap-1.5"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause Video' : videoProgress >= 100 ? 'Replay Video' : 'Play Video'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setVideoProgress(0);
                      setIsPlaying(true);
                      speakNarration(`Restarting video lecture for ${activeLesson?.title || 'topic'}.`);
                    }}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                    title="Restart Video"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Mute / Voiceover Audio Toggle */}
                  <button
                    onClick={() => {
                      const nextMute = !isMuted;
                      setIsMuted(nextMute);
                      if (nextMute && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                    }}
                    className={`p-1.5 rounded-lg border transition ${
                      isMuted ? 'bg-rose-950/80 border-rose-700 text-rose-300' : 'bg-slate-800 border-slate-700 text-emerald-400 hover:text-white'
                    }`}
                    title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
