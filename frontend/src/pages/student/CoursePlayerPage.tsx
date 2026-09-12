import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { KeraleeyaPanchakarmaPlayer } from '../../components/KeraleeyaPanchakarmaPlayer';
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Lock,
  FileText,
  Award,
  ChevronLeft,
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

  // Interactive 10-Slide PPT Video Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0); // 0 to 100%
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const videoDurationSec = 40; // Total 10-slide presentation playback duration in seconds

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

  // Sync active slide index and trigger AI Voice Assistant speech on slide transition
  useEffect(() => {
    const slideIdx = Math.min(9, Math.floor(videoProgress / 10));
    if (slideIdx !== activeSlideIndex) {
      setActiveSlideIndex(slideIdx);
      if (isPlaying) {
        const slides = get10SlidesForLecture(activeLesson, course);
        if (slides[slideIdx]) {
          speakNarration(`Slide ${slideIdx + 1}: ${slides[slideIdx].title}. ${slides[slideIdx].speechText}`);
        }
      }
    }
  }, [videoProgress, isPlaying]);

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
    setActiveSlideIndex(0);
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

  interface SlideData {
    slideNumber: number;
    title: string;
    category: string;
    mainPoints: string[];
    keyHighlight: string;
    speechText: string;
    diagramType: 'HPTLC' | 'SHIRODHARA' | 'YOGA' | 'MANUFACTURING';
  }

  const get10SlidesForLecture = (activeLesson: any, course: any): SlideData[] => {
    const title = (activeLesson?.title || course?.title || '').toLowerCase();
    const discipline = (course?.discipline || '').toLowerCase();

    // 1. HPTLC / HPLC / Quality Control / Standardization
    if (title.includes('hptlc') || title.includes('hplc') || title.includes('quality') || title.includes('analytical') || title.includes('standard') || (discipline.includes('ayurveda') && title.includes('pharmacopoeia'))) {
      return [
        {
          slideNumber: 1,
          title: "Introduction to AYUSH Pharmacopoeial Monographs & SOPs",
          category: "PHARMACOPOEIAL QUALITY CONTROL",
          mainPoints: [
            "Pharmacopoeial monographs define mandatory legal quality standards for raw herbal drugs and finished AYUSH formulations.",
            "Schedule T of Drugs & Cosmetics Act governs Good Manufacturing Practices (GMP) across all manufacturing facilities.",
            "Standardization ensures batch-to-batch therapeutic consistency, active marker quantification, and heavy metal compliance."
          ],
          keyHighlight: "Mandatory Regulatory Reference: Ayurvedic Pharmacopoeia of India (API) & Schedule T GMP Compliance.",
          speechText: "Welcome to Slide 1. In this lecture, we introduce AYUSH Pharmacopoeial Monographs and Standard SOPs. Schedule T mandates strict GMP compliance for raw herb authentication and batch purity.",
          diagramType: 'HPTLC'
        },
        {
          slideNumber: 2,
          title: "Raw Herbal Drug Sampling & Moisture Analysis",
          category: "HERBAL RAW MATERIAL QC",
          mainPoints: [
            "Representative sampling protocols follow WHO guidelines to prevent batch contamination.",
            "Moisture content is determined via Loss on Drying (LOD) to prevent microbial and fungal proliferation.",
            "Foreign matter limits must not exceed 2.0% w/w under API monographs."
          ],
          keyHighlight: "Quality Parameter: Loss on Drying (LOD) <= 8.0% w/w for raw botanical drugs.",
          speechText: "Slide 2 covers Raw Herbal Sampling. Moisture analysis via Loss on Drying is critical to prevent fungal growth, with foreign matter strictly limited under 2 percent.",
          diagramType: 'MANUFACTURING'
        },
        {
          slideNumber: 3,
          title: "Silica Gel HPTLC Stationary Phase Preparation",
          category: "CHROMATOGRAPHY SETUP",
          mainPoints: [
            "Pre-coated Silica Gel 60 F254 aluminum plates (0.2mm thickness) provide high chromatographic resolution.",
            "Sample application using automatic Linomat V applicator delivers precise 6mm band widths.",
            "Pre-washing plates in methanol eliminates organic background interference before spotting."
          ],
          keyHighlight: "Chromatographic Standard: CAMAG Silica Gel 60 F254 plates with 254nm fluorescent indicator.",
          speechText: "Slide 3 explains Silica Gel HPTLC plate preparation. Precise sample spotting with automatic applicators ensures uniform 6 millimeter band width for reproducible separation.",
          diagramType: 'HPTLC'
        },
        {
          slideNumber: 4,
          title: "Mobile Phase Migration & Rf Value Dynamics",
          category: "SOLVENT SEPARATION PHYSICS",
          mainPoints: [
            "Mobile phase selection (Toluene:Ethyl Acetate 9:1 v/v) optimizes phytoconstituent partitioning.",
            "Twin trough chamber saturation for 30 minutes establishes vapor-liquid equilibrium.",
            "Retention Factor (Rf) values quantify exact compound migration distance relative to solvent front."
          ],
          keyHighlight: "Separation Formula: Rf = Distance traveled by solute band / Distance traveled by solvent front.",
          speechText: "Slide 4 demonstrates Mobile Phase Migration. Solvent chamber saturation establishes vapor equilibrium, separating active phytoconstituents according to their distinct Rf values.",
          diagramType: 'HPTLC'
        },
        {
          slideNumber: 5,
          title: "UV Densitometric Scanning (254nm & 366nm)",
          category: "SPECTRAL QUANTIFICATION",
          mainPoints: [
            "Deuterium and Tungsten lamps scan TLC plates across UV-visible spectrum (200nm - 700nm).",
            "UV 254nm fluorescence quenching detects conjugated double bond chromophores.",
            "UV 366nm fluorescent emission visualizes natural flavonoid and alkaloid luminescence."
          ],
          keyHighlight: "Instrumentation: CAMAG TLC Scanner IV operating in absorption/fluorescence mode.",
          speechText: "Slide 5 covers UV Densitometric Scanning. Dual lamps scan the chromatography plate at 254 and 366 nanometers to detect active flavonoid and alkaloid chromophores.",
          diagramType: 'HPTLC'
        },
        {
          slideNumber: 6,
          title: "Active Phytoconstituent Marker Quantification Peak Spectra",
          category: "QUANTITATIVE FINGERPRINTING",
          mainPoints: [
            "Integrated peak areas correlate directly to active marker concentration via calibration curves.",
            "Rf 0.24, 0.48, and 0.72 represent primary bioactive marker compounds in standard extract.",
            "Validation metrics require high linearity (R^2 > 0.995) and precision (RSD < 2.0%)."
          ],
          keyHighlight: "Assay Standard: Minimum 98.5% active marker purity relative to WHO chemical reference standard.",
          speechText: "Slide 6 displays Quantitative Peak Area Integration. Peak absorbance profiles at Rf 0.24 and 0.48 verify marker concentration with R-squared linearity exceeding 0.995.",
          diagramType: 'HPTLC'
        },
        {
          slideNumber: 7,
          title: "Heavy Metal Limit Testing via Atomic Absorption Spectroscopy (AAS)",
          category: "SAFETY & TOXICOLOGY",
          mainPoints: [
            "Inductively Coupled Plasma Mass Spectrometry (ICP-MS) quantifies heavy metals in parts per million (ppm).",
            "Permissible Limits: Lead (Pb) <= 10.0 ppm, Arsenic (As) <= 3.0 ppm, Cadmium (Cd) <= 0.3 ppm.",
            "Mercury (Hg) limits strictly capped at <= 1.0 ppm under Ministry of AYUSH Gazette."
          ],
          keyHighlight: "Toxicology Threshold: Heavy metal concentration must remain strictly within API safety limits.",
          speechText: "Slide 7 focuses on Heavy Metal Testing via AAS and ICP-MS. Permissible limits for Lead, Arsenic, Cadmium, and Mercury are strictly enforced for patient safety.",
          diagramType: 'MANUFACTURING'
        },
        {
          slideNumber: 8,
          title: "Microbial Limit Testing & Aflatoxin Screening",
          category: "BIOLOGICAL SAFETY",
          mainPoints: [
            "Total Viable Aerobic Count (TYMC/TAMC) verified via nutrient agar plate incubation.",
            "Specific pathogen screening confirms total absence of E. coli, Salmonella, and S. aureus.",
            "Immunoaffinity column HPLC screens for Aflatoxins B1, B2, G1, and G2."
          ],
          keyHighlight: "Biological Standard: Zero tolerance for pathogenic E. coli and Salmonella in oral doses.",
          speechText: "Slide 8 details Microbial and Aflatoxin Screening. Culture plate incubation verifies the total absence of pathogenic bacteria and fungal aflatoxins.",
          diagramType: 'MANUFACTURING'
        },
        {
          slideNumber: 9,
          title: "GMP Batch Manufacturing Record (BMR) Signoff",
          category: "INDUSTRIAL COMPLIANCE",
          mainPoints: [
            "Complete raw material weighment logs, operator signatures, and room environmental logs.",
            "In-Process Checks (IPC) record mass uniformity, disintegration time, and dissolution rate.",
            "QA Head verification required prior to commercial batch release."
          ],
          keyHighlight: "Quality Assurance: Dual-operator verification log mandated for full batch traceability.",
          speechText: "Slide 9 covers Batch Manufacturing Record signoff. Complete weighment logs, in-process testing records, and QA signatures ensure 100 percent batch traceability.",
          diagramType: 'MANUFACTURING'
        },
        {
          slideNumber: 10,
          title: "Certificate of Analysis (CoA) & Export Compliance Summary",
          category: "FINAL CERTIFICATION",
          mainPoints: [
            "Final Certificate of Analysis (CoA) summarizes physical, chemical, and biological test results.",
            "WHO-GMP certification unlocks international export compliance for European & US markets.",
            "Verification code registered on Ministry of AYUSH portal for digital verification."
          ],
          keyHighlight: "Final Verification: Course module completed! Automated verified e-certificate unlocked.",
          speechText: "Slide 10 presents the Certificate of Analysis and Export Compliance Summary. The batch meets all WHO-GMP parameters. Congratulations, lecture verification complete!",
          diagramType: 'HPTLC'
        }
      ];
    }

    // 2. Panchakarma / Shirodhara / Ayurveda Therapy
    if (title.includes('shirodhara') || title.includes('panchakarma') || title.includes('ayurvedic') || title.includes('dosha') || title.includes('bhasma') || discipline.includes('ayurveda')) {
      return [
        {
          slideNumber: 1,
          title: "Principles of Shodhana Therapies in Classical Panchakarma",
          category: "AYURVEDIC THERAPEUTICS",
          mainPoints: [
            "Panchakarma constitutes the five primary purification procedures (Vamana, Virechana, Basti, Nasya, Raktamokshana).",
            "Purvakarma (Snehana & Swedana) mobilizes morbid Doshas from peripheral tissues to the gastrointestinal tract.",
            "Shirodhara is a specialized Murdhni Taila procedure targeting neurological and psychosomatic conditions."
          ],
          keyHighlight: "Classical Text Reference: Charaka Samhita Siddhi Sthana Chapter 1-3.",
          speechText: "Welcome to Slide 1 on Panchakarma and Shirodhara. Shodhana therapies eliminate deep-seated morbid Doshas, with Shirodhara providing targeted neurological soothing.",
          diagramType: 'SHIRODHARA'
        },
        {
          slideNumber: 2,
          title: "Clinical Etiology & Indications for Shirodhara",
          category: "CLINICAL DIAGNOSTICS",
          mainPoints: [
            "Indicated for Vata and Pitta disorders: Shiroroga (headaches), Anidra (insomnia), Chittodvega (anxiety).",
            "Normalizes hyperactive sympathetic nervous system and reduces elevated salivary cortisol.",
            "Contraindicated in acute febrile states, head trauma, or acute intoxication."
          ],
          keyHighlight: "Primary Indication: Insomnia (Anidra), Anxiety (Chittodvega), and Essential Hypertension.",
          speechText: "Slide 2 covers Clinical Indications. Shirodhara is indicated for Vata-Pitta disorders such as chronic insomnia, anxiety, and hypertension by calming the nervous system.",
          diagramType: 'SHIRODHARA'
        },
        {
          slideNumber: 3,
          title: "Medicated Oil (Ksheerabala/Mahanarayana) Selection & SOP",
          category: "FORMULATION PREPARATION",
          mainPoints: [
            "Ksheerabala Taila (processed 101 times) provides deep nerve nourishment and Vata pacification.",
            "Oil temperature must be maintained strictly at 38°C - 40°C throughout 30-45 minute session.",
            "Kwatha (decoctions), Takra (medicated buttermilk), or Milk (Ksheeradhara) selected based on Prakriti."
          ],
          keyHighlight: "Therapeutic Parameter: Medicated oil maintained precisely at body temperature (38°C - 40°C).",
          speechText: "Slide 3 details Medicated Oil selection. Warm Ksheerabala Taila, maintained strictly at 38 to 40 degrees Celsius, nourishes cranial nerves and calms Vata dosha.",
          diagramType: 'SHIRODHARA'
        },
        {
          slideNumber: 4,
          title: "Patient Ergonomics & Ajna Chakra Position Setup",
          category: "PROCEDURAL SOP",
          mainPoints: [
            "Patient lies supine on traditional wooden Droni table with head supported in neutral neck alignment.",
            "Shirodhara pot (Patra) suspended 10 cm directly above the forehead (Ajna Chakra / Sthapani Marma).",
            "Gauze pad placed over eyes to protect from oil ingress and maintain relaxing ambient sensory state."
          ],
          keyHighlight: "Anatomical Target: Sthapani Marma / Ajna Chakra (Third Eye Center).",
          speechText: "Slide 4 explains Patient Positioning. The copper vessel is suspended 10 centimeters above the forehead, directing a continuous stream onto the Sthapani Marma point.",
          diagramType: 'SHIRODHARA'
        },
        {
          slideNumber: 5,
          title: "Pendulum Oscillation & Hydrodynamic Flow Physics",
          category: "FLUID DYNAMICS",
          mainPoints: [
            "Continuous, uninterrupted oil stream flows side-to-side across forehead in rhythmic sinusoidal arc.",
            "Laminar fluid flow generates gentle mechanical tactile stimulation across trigeminal cutaneous receptors.",
            "Consistent 30-minute drip rate stimulates serotonin and endorphin release."
          ],
          keyHighlight: "Flow Rate: Steady 100-120 drops per minute continuous pendulum motion.",
          speechText: "Slide 5 demonstrates Hydrodynamic Pendulum Flow. The rhythmic side-to-side stream stimulates cutaneous nerve receptors, triggering serotonin and endorphin release.",
          diagramType: 'SHIRODHARA'
        },
        {
          slideNumber: 6,
          title: "Neurophysiological Impact & Parasympathetic Shift",
          category: "AUTONOMIC PHYSIOLOGY",
          mainPoints: [
            "EEG monitors reveal transition from hyperactive Beta brainwaves to calm Theta (4-8 Hz) relaxation waves.",
            "Baroreceptor activation decreases mean arterial pressure and resting heart rate.",
            "Prefrontal cortex blood perfusion increases, enhancing cognitive clarity and emotional stability."
          ],
          keyHighlight: "Biomarker Outcome: 42% average reduction in plasma cortisol levels post-session.",
          speechText: "Slide 6 highlights Neurophysiological Impact. EEG recordings show a shift to calm Theta brainwaves, reducing plasma cortisol by 42 percent post-procedure.",
          diagramType: 'SHIRODHARA'
        },
        {
          slideNumber: 7,
          title: "Tridosha Equilibrium & Marma Energy Balancing",
          category: "DOSHA MECHANICS",
          mainPoints: [
            "Pacifies Vata (Air/Ether) by grounding Prana Vayu and stabilizing Mind (Manas).",
            "Cools Pitta (Fire/Water) by dissipating excessive cranial metabolic heat (Sadhaka Pitta).",
            "Promotes Kapha (Earth/Water) nourishment to Tarpaka Kapha in brain ventricles."
          ],
          keyHighlight: "Dosha Target: Balancing Prana Vayu, Sadhaka Pitta, and Tarpaka Kapha.",
          speechText: "Slide 7 explains Tridosha Equilibrium. Shirodhara grounds Prana Vayu, cools Sadhaka Pitta, and restores nourishment to Tarpaka Kapha in the central nervous system.",
          diagramType: 'SHIRODHARA'
        },
        {
          slideNumber: 8,
          title: "Intra-Procedure Safety & Vital Monitoring",
          category: "CLINICAL SAFETY",
          mainPoints: [
            "Monitor blood pressure and pulse rate at 10-minute intervals throughout therapy.",
            "Observe for signs of vasovagal syncope, dizziness, or oil temperature fluctuations.",
            "Therapy immediately paused if patient reports nausea or severe chill."
          ],
          keyHighlight: "Safety Protocol: Continuous vital monitoring with emergency warm cloth standby.",
          speechText: "Slide 8 details Clinical Safety. Blood pressure and pulse rates are monitored at 10 minute intervals to ensure complete patient safety throughout treatment.",
          diagramType: 'SHIRODHARA'
        },
        {
          slideNumber: 9,
          title: "Paschatkarma Post-Therapy Management Protocols",
          category: "POST-PROCEDURE CARE",
          mainPoints: [
            "Excess oil gently wiped; patient rests in warm room for 15-20 minutes.",
            "Warm lukewarm water bath recommended using herbal hair wash powder (Snana Churna).",
            "Pathya Ahara: Light, warm, easily digestible diet (Mudga Yusha / Kitchari) prescribed."
          ],
          keyHighlight: "Post-Care Norm: Avoid cold exposure, direct sunlight, and strenuous physical exertion.",
          speechText: "Slide 9 covers Paschatkarma Management. Post-therapy care includes 20 minutes of warm rest, herbal cleansing, and a light Kitchari diet.",
          diagramType: 'SHIRODHARA'
        },
        {
          slideNumber: 10,
          title: "Clinical Outcome Documentation & Final Course Signoff",
          category: "EHR DOCUMENTATION",
          mainPoints: [
            "Document patient feedback, Pittsburgh Sleep Quality Index (PSQI) score improvements.",
            "Log batch details of medicated oil used for full regulatory traceability.",
            "Automatic completion verified! Student assessment unlocked."
          ],
          keyHighlight: "Final Signoff: Shirodhara protocol completed! Verified 100% lecture completion.",
          speechText: "Slide 10 presents Clinical Documentation and Final Verification. Patient sleep scores and batch records are logged. Lecture completed successfully!",
          diagramType: 'SHIRODHARA'
        }
      ];
    }

    // 3. Yoga & Naturopathy (Pranayama / HRV)
    if (title.includes('yoga') || title.includes('pranayama') || title.includes('hrv') || title.includes('naturopathy') || discipline.includes('yoga')) {
      return [
        {
          slideNumber: 1,
          title: "Foundations of Clinical Yoga Therapy & Naturopathy",
          category: "YOGA PHYSIOLOGY",
          mainPoints: [
            "Clinical Yoga integrates Asana, Pranayama, and Dhyana for psychosomatic health management.",
            "Pancha Kosha model: Annamaya, Pranamaya, Manomaya, Vijnanamaya, and Anandamaya Koshas.",
            "Naturopathy emphasizes vitalistic self-healing mechanisms and non-invasive natural modalities."
          ],
          keyHighlight: "Holistic Framework: Pancha Kosha assessment & Vitalistic self-healing.",
          speechText: "Welcome to Slide 1 on Clinical Yoga Therapy and Naturopathy. We explore the Pancha Kosha health model and vitalistic self-healing mechanisms.",
          diagramType: 'YOGA'
        },
        {
          slideNumber: 2,
          title: "Pranayama Breath Mechanics & Respiratory Physiology",
          category: "BREATH MECHANICS",
          mainPoints: [
            "Diaphragmatic excursion increases tidal volume and improves lower lobe pulmonary ventilation.",
            "Inspiration (Puraka), Retention (Kumbhaka), and Expiration (Rechaka) control respiratory cadence.",
            "Reduces anatomical dead space ventilation and optimizes arterial oxygen saturation (SpO2)."
          ],
          keyHighlight: "Physiological Target: Enhanced alveolar gas exchange & vagal nerve stimulation.",
          speechText: "Slide 2 covers Respiratory Breath Mechanics. Diaphragmatic breathing increases tidal volume, optimizing alveolar oxygen exchange and vagal nerve tone.",
          diagramType: 'YOGA'
        },
        {
          slideNumber: 3,
          title: "Anulom Vilom (Nadi Shodhana) Cadence Protocol",
          category: "PRANAYAMA TECHNIQUE",
          mainPoints: [
            "Alternate nostril breathing balances Ida (parasympathetic) and Pingala (sympathetic) Nadis.",
            "Prescribed Cadence: 4 seconds Inhale -> 16 seconds Retention -> 8 seconds Exhale (1:4:2 ratio).",
            "Clears autonomic nasal cycle asymmetry and synchronizes hemispheric EEG activity."
          ],
          keyHighlight: "Classical Ratio: Puraka (1) : Kumbhaka (4) : Rechaka (2) for Nadi purification.",
          speechText: "Slide 3 details Anulom Vilom Nadi Shodhana. Alternate nostril breathing in a 1:4:2 ratio synchronizes left and right brain hemispheric activity.",
          diagramType: 'YOGA'
        },
        {
          slideNumber: 4,
          title: "Autonomic Nervous System & Vagal Tone Activation",
          category: "NEURO-PHYSIOLOGY",
          mainPoints: [
            "Slow, rhythmic breathing at 6 breaths per minute triggers cardiac baroreflex sensitivity.",
            "Vagus nerve (Cranial Nerve X) activation releases acetylcholine, slowing sinoatrial node firing.",
            "Downregulates sympathetic fight-or-flight adrenal response."
          ],
          keyHighlight: "Autonomic Outcome: Parasympathetic dominance with reduced serum catecholamines.",
          speechText: "Slide 4 highlights Autonomic Vagal Activation. Breathing at 6 breaths per minute stimulates the vagus nerve, lowering heart rate and sympathetic stress.",
          diagramType: 'YOGA'
        },
        {
          slideNumber: 5,
          title: "Heart Rate Variability (HRV) Biofeedback Analytics",
          category: "CARDIAC METRICS",
          mainPoints: [
            "HRV quantifies beat-to-beat (RR interval) variation controlled by autonomic inputs.",
            "Time-domain SDNN and RMSSD metrics increase significantly during deep Pranayama.",
            "High-Frequency (HF) power spectrum indicates robust vagal parasympathetic reserve."
          ],
          keyHighlight: "Clinical Metric: High RMSSD & SDNN reflect optimal cardiac autonomic adaptability.",
          speechText: "Slide 5 presents HRV Biofeedback Analytics. Increased SDNN and High-Frequency power confirm elevated parasympathetic cardiac adaptability.",
          diagramType: 'YOGA'
        },
        {
          slideNumber: 6,
          title: "Pranic Energy Meridian & 7 Chakra Alignment",
          category: "ENERGY PHYSIOLOGY",
          mainPoints: [
            "Sushumna Nadi serves as the central energy channel along the vertebral column.",
            "7 Chakra nodes (Muladhara to Sahasrara) regulate endocrine and autonomic nerve plexuses.",
            "Anahata (Heart Chakra) biofeedback correlates with emotional coherence and vagal tone."
          ],
          keyHighlight: "Energy Center: Anahata Chakra alignment enhancing cardiovascular harmony.",
          speechText: "Slide 6 explores Pranic Energy Meridian Alignment. Sushumna Nadi and Chakra energy centers harmonize endocrine and autonomic nerve function.",
          diagramType: 'YOGA'
        },
        {
          slideNumber: 7,
          title: "Naturopathic Hydrotherapy & Dietetics Synergy",
          category: "NATUROPATHIC MODALITIES",
          mainPoints: [
            "Cold mud packs to abdomen reduce visceral hyperemia and stimulate gastrointestinal peristalsis.",
            "Hydrotherapy hip baths enhance pelvic hemodynamics and autonomic circulation.",
            "Elimination diet (raw fruit/vegetables) promotes systemic detoxification and metabolic rest."
          ],
          keyHighlight: "Naturopathic SOP: Hydrotherapy & Mud packs promoting visceral detox.",
          speechText: "Slide 7 details Naturopathic Modalities. Hydrotherapy hip baths and elimination diets enhance pelvic hemodynamics and gastrointestinal detox.",
          diagramType: 'YOGA'
        },
        {
          slideNumber: 8,
          title: "Psychosomatic Stress Reduction & Biomarker Metrics",
          category: "STRESS BIOMARKERS",
          mainPoints: [
            "Galvanic Skin Resistance (GSR) drops, indicating reduced sympathetic palmar sweating.",
            "Salivary alpha-amylase and cortisol levels decline by >35% after 4 weeks of practice.",
            "Systemic inflammatory cytokines (IL-6, TNF-alpha) decrease in chronic stress patients."
          ],
          keyHighlight: "Biomarker Reduction: >35% drop in salivary cortisol & inflammatory cytokines.",
          speechText: "Slide 8 shows Psychosomatic Stress Metrics. Galvanic skin resistance and salivary cortisol drop significantly, confirming reduced systemic inflammation.",
          diagramType: 'YOGA'
        },
        {
          slideNumber: 9,
          title: "Clinical Practice Contraindications & Modifications",
          category: "PATIENT SAFETY",
          mainPoints: [
            "Avoid forceful breath retention (Kumbhaka) in uncontrolled hypertension or cardiac lesions.",
            "Modify Asanas for spinal disc herniations, pregnancy, or joint hypermobility.",
            "Tailor routines according to age, physical constitution, and clinical diagnosis."
          ],
          keyHighlight: "Safety Rule: No breath holding (Kumbhaka) for patients with hypertension.",
          speechText: "Slide 9 covers Patient Safety & Contraindications. Breath retention is avoided in hypertension, with yoga asanas customized to individual patient safety.",
          diagramType: 'YOGA'
        },
        {
          slideNumber: 10,
          title: "Patient Self-Care Prescription & Final Completion",
          category: "CLINICAL SUMMARY",
          mainPoints: [
            "Prescribe structured 20-minute daily Sadhana home practice plan.",
            "Log patient adherence and wearable device HRV metrics via digital portal.",
            "Lecture completed! Verified 100% video completion signal sent."
          ],
          keyHighlight: "Final Summary: Clinical Yoga & Naturopathy module verified complete!",
          speechText: "Slide 10 presents the Patient Prescription and Final Verification. Daily Sadhana routines are assigned. Lecture verification completed successfully!",
          diagramType: 'YOGA'
        }
      ];
    }

    // 4. Default / Homoeopathy / Unani / Siddha / Manufacturing SOP
    return [
      {
        slideNumber: 1,
        title: "Overview of Industrial AYUSH Manufacturing & Clinical SOPs",
        category: "INDUSTRIAL MANUFACTURING",
        mainPoints: [
          "AYUSH manufacturing facilities operate under Schedule T of Drugs & Cosmetics Rules 1945.",
          "Standard Operating Procedures (SOPs) mandate rigorous material handling and hygiene.",
          "Ensures reproducible quality, therapeutic efficacy, and safety across commercial batches."
        ],
        keyHighlight: "Regulatory Standard: Schedule T GMP & ISO 9001:2015 Quality Systems.",
        speechText: "Welcome to Slide 1 on Industrial AYUSH Manufacturing and SOPs. Schedule T mandates strict compliance for raw materials, facility hygiene, and batch consistency.",
        diagramType: 'MANUFACTURING'
      },
      {
        slideNumber: 2,
        title: "Raw Material Botanical Authentication & Storage SOPs",
        category: "BOTANICAL RAW MATERIALS",
        mainPoints: [
          "Herbal species verified via macroscopic, microscopic, and organoleptic parameters.",
          "Quarantine storage maintained at controlled temperature (20-25°C) and relative humidity (<60%).",
          "First-In, First-Out (FIFO) inventory control prevents raw material degradation."
        ],
        keyHighlight: "Material Control: Verified botanical identity & FIFO quarantine release.",
        speechText: "Slide 2 covers Botanical Authentication and Storage. Herbal species undergo microscopic verification and quarantine storage under controlled humidity.",
        diagramType: 'MANUFACTURING'
      },
      {
        slideNumber: 3,
        title: "Herbal Extraction & Decanting Hydrodynamics",
        category: "EXTRACTION TECHNOLOGY",
        mainPoints: [
          "Stainless Steel 316L reactors execute hydro-alcoholic extraction at 85°C.",
          "Mechanical agitation impellers maintain uniform heat distribution and mass transfer.",
          "Decanters and disc-stack centrifuges clarify liquid extracts from insoluble marc."
        ],
        keyHighlight: "Extraction Telemetry: Temp 85.4°C | Pressure 1.2 BAR | Stirrer 120 RPM.",
        speechText: "Slide 3 details Extraction Kettle operations. Stainless steel reactors maintain 85 degrees Celsius with continuous agitation for optimal extract yield.",
        diagramType: 'MANUFACTURING'
      },
      {
        slideNumber: 4,
        title: "In-Process Quality Checks (IPC) & Concentration",
        category: "PROCESS CONTROL",
        mainPoints: [
          "Triple-effect falling film evaporators concentrate extracts under low temperature vacuum.",
          "In-Process Checks monitor specific gravity, total solids, pH, and Brix levels.",
          "Concentrated extract spray-dried into uniform free-flowing botanical powder."
        ],
        keyHighlight: "IPC Parameter: Vacuum evaporation < 50°C to protect thermolabile active compounds.",
        speechText: "Slide 4 covers In-Process Quality Checks. Vacuum evaporation concentrates extracts under 50 degrees to preserve heat-sensitive active constituents.",
        diagramType: 'MANUFACTURING'
      },
      {
        slideNumber: 5,
        title: "Finished Dosage Form (Tablet/Capsule/Syrup) Standardization",
        category: "DOSAGE FORM METROLOGY",
        mainPoints: [
          "Automated rotary tablet presses produce uniform weight tablets (USP/IP limits +/- 5%).",
          "Hardness testers ensure mechanical strength (> 6 kg/cm2) for transport stability.",
          "Disintegration testing confirms rapid gastric release (< 15 minutes)."
        ],
        keyHighlight: "Dosage Metrology: Tablet disintegration < 15 mins & Uniformity of mass compliant.",
        speechText: "Slide 5 details Dosage Form Standardization. Rotary tablet presses enforce weight uniformity and rapid disintegration under 15 minutes.",
        diagramType: 'MANUFACTURING'
      },
      {
        slideNumber: 6,
        title: "Primary & Secondary Packaging Compliance",
        category: "PACKAGING INTEGRITY",
        mainPoints: [
          "Blister packaging lines utilize pharmaceutical PVC/PVDC and aluminum foil seals.",
          "Amber glass bottles shield liquid formulations from photo-degradation.",
          "Batch number, manufacturing date, expiry date, and QR codes printed automatically."
        ],
        keyHighlight: "Packaging Norm: Moisture barrier blister packs & light-resistant amber containers.",
        speechText: "Slide 6 highlights Packaging Compliance. Blister sealing and amber glass bottles shield products against light and moisture degradation.",
        diagramType: 'MANUFACTURING'
      },
      {
        slideNumber: 7,
        title: "Stability Testing & Shelf-Life Estimation (ICH Guidelines)",
        category: "STABILITY ANALYTICS",
        mainPoints: [
          "Accelerated stability testing conducted at 40°C +/- 2°C / 75% RH +/- 5% RH for 6 months.",
          "Real-time stability chambers monitor product physical and chemical integrity over 3 years.",
          "Assay of active markers must remain >90% of labeled claim throughout shelf-life."
        ],
        keyHighlight: "Stability Metric: Minimum 90.0% active potency retention over 36 months.",
        speechText: "Slide 7 covers Stability Testing. Accelerated stability testing at 40 degrees and 75 percent humidity verifies a minimum 3-year shelf life.",
        diagramType: 'MANUFACTURING'
      },
      {
        slideNumber: 8,
        title: "Cleanroom Environmental Monitoring (HVAC & Microbe Counts)",
        category: "ENVIRONMENTAL HYGIENE",
        mainPoints: [
          "HEPA filtration systems maintain Class 100,000 (ISO Class 8) cleanroom air quality.",
          "Positive pressure differentials prevent external dust and contaminant ingress.",
          "Settle plates and air samplers monitor airborne microbial colony forming units (CFU)."
        ],
        keyHighlight: "Cleanroom Spec: ISO Class 8 environment with HEPA 99.97% air filtration.",
        speechText: "Slide 8 details Cleanroom Environmental Hygiene. HEPA filtration maintains ISO Class 8 cleanrooms with positive pressure preventing contamination.",
        diagramType: 'MANUFACTURING'
      },
      {
        slideNumber: 9,
        title: "Quality Assurance Logbook & Digital Audit Trails",
        category: "DATA INTEGRITY",
        mainPoints: [
          "21 CFR Part 11 compliant digital logging system prevents data tampering.",
          "Every batch step records operator ID, timestamp, and QA supervisor signoff.",
          "Deviation reports investigate any out-of-specification (OOS) analytical result."
        ],
        keyHighlight: "Data Integrity: Audit trail security with zero unauthorized log alterations.",
        speechText: "Slide 9 presents Data Integrity and Audit Trails. Tamper-proof digital logs record every operator action and QA signoff for full compliance.",
        diagramType: 'MANUFACTURING'
      },
      {
        slideNumber: 10,
        title: "Final Batch Release & Digital Certificate of Analysis (CoA)",
        category: "BATCH CLEARANCE",
        mainPoints: [
          "QA Manager issues final batch clearance upon reviewing all BMR records.",
          "Digital CoA uploaded to Ministry of AYUSH portal for instant authenticity verification.",
          "Presentation completed! Verified 100% video lecture completion."
        ],
        keyHighlight: "Final Signoff: Batch release authorized! Verified 100% lecture completion.",
        speechText: "Slide 10 presents Final Batch Release and Certification. Quality Assurance authorizes release and registers the digital Certificate of Analysis. Verification complete!",
        diagramType: 'MANUFACTURING'
      }
    ];
  };

  const renderSlideDiagram = (diagramType: string, progress: number) => {
    if (diagramType === 'HPTLC') {
      return (
        <div className="w-full h-44 bg-slate-950 rounded-xl border border-slate-800 p-2 flex flex-col justify-between items-center relative overflow-hidden">
          <div className="text-[9px] font-mono text-emerald-400 font-bold">HPTLC TLC SCANNER IV DIAGRAM</div>
          <div className="relative w-full h-24 bg-slate-900 border border-emerald-500/50 rounded flex items-end p-1 overflow-hidden">
            <svg className="w-full h-full text-emerald-400 overflow-visible" viewBox="0 0 200 50">
              <path d="M 0 45 Q 30 15 60 45 T 120 10 T 170 25 T 200 45" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <path d="M 0 45 Q 30 15 60 45 T 120 10 T 170 25 T 200 45 L 200 50 L 0 50 Z" fill="currentColor" fillOpacity="0.2" />
            </svg>
            <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" style={{ left: `${(progress * 2) % 100}%` }}></div>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[8px] font-mono text-center w-full">
            <span className="bg-slate-900 p-1 rounded text-emerald-300 font-bold">Rf1: 0.24</span>
            <span className="bg-slate-900 p-1 rounded text-amber-300 font-bold">Rf2: 0.48</span>
            <span className="bg-slate-900 p-1 rounded text-purple-300 font-bold">Rf3: 0.72</span>
          </div>
        </div>
      );
    }

    if (diagramType === 'SHIRODHARA') {
      return (
        <div className="w-full h-44 bg-slate-950 rounded-xl border border-slate-800 p-2 flex flex-col justify-between items-center relative overflow-hidden">
          <div className="text-[9px] font-mono text-amber-400 font-bold">SHIRODHARA HYDRODYNAMIC STREAM</div>
          <div className="relative w-20 h-10 bg-amber-700/80 rounded-b-xl border-t-2 border-amber-400 shadow-md animate-pulse"></div>
          <div className="w-1 bg-amber-400 shadow-[0_0_8px_#fbbf24] h-14 animate-pulse"></div>
          <div className="w-24 h-6 bg-slate-900 rounded-t-full border-t border-amber-500 flex items-center justify-center">
            <span className="text-[8px] font-mono text-amber-300 font-bold">AJNA CHAKRA</span>
          </div>
        </div>
      );
    }

    if (diagramType === 'YOGA') {
      return (
        <div className="w-full h-44 bg-slate-950 rounded-xl border border-slate-800 p-2 flex flex-col justify-between items-center relative overflow-hidden">
          <div className="text-[9px] font-mono text-cyan-400 font-bold">RESPIRATORY PHYSIOLOGY & HRV</div>
          <div className="relative w-16 h-16 rounded-full border-2 border-cyan-400/80 flex items-center justify-center bg-cyan-500/10">
            <div className="w-8 h-12 bg-gradient-to-b from-amber-400 via-emerald-400 to-cyan-500 rounded-t-full opacity-80 animate-pulse"></div>
          </div>
          <div className="w-full bg-slate-900 p-1 rounded border border-slate-800 text-[8px] font-mono text-center text-cyan-300 font-bold">
            VAGAL TONE HRV: OPTIMAL (SDNN 68ms)
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-44 bg-slate-950 rounded-xl border border-slate-800 p-2 flex flex-col justify-between items-center relative overflow-hidden">
        <div className="text-[9px] font-mono text-emerald-400 font-bold">EXTRACTION KETTLE & TELEMETRY</div>
        <div className="w-16 h-20 border-2 border-emerald-400 rounded-b-2xl bg-slate-900 flex items-center justify-center relative">
          <div className="w-full h-1 bg-amber-400 animate-spin"></div>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[8px] font-mono text-center w-full">
          <span className="bg-slate-900 p-1 rounded text-amber-300 font-bold">85.4 °C</span>
          <span className="bg-slate-900 p-1 rounded text-cyan-300 font-bold">1.2 BAR</span>
        </div>
      </div>
    );
  };

  const render10SlidePresentationVideo = () => {
    const slides = get10SlidesForLecture(activeLesson, course);
    const slideIdx = Math.min(9, Math.floor(videoProgress / 10));
    const currentSlide = slides[slideIdx] || slides[0];

    return (
      <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-950 text-white font-sans overflow-hidden select-none relative">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none"></div>

        {/* Top Slide Header Bar */}
        <div className="z-10 flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black tracking-wider uppercase">
              Slide {currentSlide.slideNumber} of 10
            </span>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {currentSlide.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-300 bg-slate-900 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {isMuted ? '🎙️ AI Voice Muted' : '🎙️ AI Voice Assistant Explaining'}
            </span>
          </div>
        </div>

        {/* Main Presentation Screen: 2 Cols */}
        <div className="z-10 flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 my-3 overflow-hidden items-center">
          
          {/* Left 3 Cols: PPT Text Content & Bullet Points */}
          <div className="md:col-span-3 space-y-3 flex flex-col justify-between h-full py-1">
            <div>
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h2>
              
              <ul className="mt-2.5 space-y-2 text-xs text-slate-200">
                {currentSlide.mainPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-mono font-medium">
                ⚡ <strong>KEY PHARMACOPOEIAL NORMS:</strong> {currentSlide.keyHighlight}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-emerald-300 font-mono flex items-center gap-2 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse"></span>
                <p className="truncate">
                  <strong>AI Voiceover:</strong> "{currentSlide.speechText}"
                </p>
              </div>
            </div>
          </div>

          {/* Right 2 Cols: Relevant Diagram Graphic */}
          <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-between h-full shadow-2xl relative overflow-hidden">
            <div className="w-full text-center text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-1 font-bold">
              SLIDE DIAGRAM & ILLUSTRATION
            </div>

            {renderSlideDiagram(currentSlide.diagramType, videoProgress)}

            <div className="w-full text-center text-[9px] font-mono text-emerald-400 bg-slate-950 p-1 rounded border border-slate-800 font-bold">
              AYUSH Standard SOP • Illustrated Figure {currentSlide.slideNumber}.1
            </div>
          </div>
        </div>

        {/* 10-Slide Thumbnail Pills Navigation */}
        <div className="z-10 flex items-center justify-between gap-1 border-t border-slate-800 pt-2">
          <div className="flex items-center gap-1 overflow-x-auto w-full justify-between">
            {slides.map((s, idx) => {
              const isActive = idx === slideIdx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    const targetPct = idx * 10;
                    setVideoProgress(targetPct);
                    setActiveSlideIndex(idx);
                    if (isPlaying) {
                      speakNarration(`Slide ${idx + 1}: ${s.title}. ${s.speechText}`);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition shrink-0 flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-105'
                      : idx < slideIdx
                      ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span>Slide {s.slideNumber}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
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
          
          {/* Keraleeya Panchakarma Masterclass Interactive Video Presentation Player */}
          <KeraleeyaPanchakarmaPlayer
            lessonTitle={activeLesson?.title || "Orientation and Learning Outcomes"}
            courseTitle={course?.title || "Masterclass in Classical Keraleeya Panchakarma Protocols"}
            moduleTitle={
              modules.find(m => m.lessons?.some((l: any) => l.id === activeLesson?.id))?.title 
                ? `MODULE ${modules.findIndex(m => m.lessons?.some((l: any) => l.id === activeLesson?.id)) + 1} · ${modules.find(m => m.lessons?.some((l: any) => l.id === activeLesson?.id))?.title}` 
                : "MODULE 1 · FOUNDATION"
            }
            onComplete={handleAutoMarkComplete}
          />

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
