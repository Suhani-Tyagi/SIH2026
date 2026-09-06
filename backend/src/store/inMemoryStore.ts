import bcrypt from 'bcryptjs';

// Pre-seeded data store with full AYUSH Setu enterprise dataset
const defaultPasswordHash = bcrypt.hashSync('password123', 10);

export interface MemoryUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'STUDENT' | 'INDUSTRY' | 'ACADEMICIAN' | 'INSTITUTION_ADMIN' | 'SUPER_ADMIN';
  system: string;
  avatar?: string;
  institutionName?: string;
  companyName?: string;
  designation?: string;
  createdAt: Date;
}

export interface MemoryStudentProfile {
  id: string;
  userId: string;
  degree: string;
  passoutYear: number;
  readinessScore: number;
  bio: string;
  phone: string;
  location: string;
  skillScores: string;
  assessedSkills?: string;
  coursePassedSkills?: string;
  mentorVerifiedSkills?: string;
  verifiedBadges: string;
  careerGoals: string;
}

export interface MemoryJobRole {
  id: string;
  title: string;
  category: string;
  system: string;
  description: string;
  requiredSkills: string;
  eligibilityDegrees: string;
  marketDemand: string;
  avgSalaryRange: string;
  createdAt: Date;
}

export interface MemoryQuestion {
  id: string;
  category: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
  difficulty: string;
  system: string;
}

export interface MemoryOpportunity {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  type: string;
  system: string;
  skillsRequired: string;
  stipend: string;
  location: string;
  mode: string;
  duration: string;
  description: string;
  createdAt: Date;
}

export interface MemoryApplication {
  id: string;
  opportunityId: string;
  studentId: string;
  status: string;
  matchScore: number;
  coverLetter?: string;
  answers?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface MemoryCourse {
  id: string;
  companyId: string;
  providerName: string;
  title: string;
  duration: string;
  level: string;
  price: string;
  skillsAcquired: string;
  image?: string;
  description: string;
  createdAt: Date;
}

export interface MemoryModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  summary: string;
}

export interface MemoryLesson {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  content: string;
  videoUrl?: string;
  duration: string;
  isCompulsory: boolean;
}

export interface MemoryLearningResource {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  type: string; // PDF, SOP, SLIDE, WORKSHEET, CASE_STUDY
  fileUrl: string;
  fileSize: string;
  createdAt: Date;
}

export interface MemoryLessonProgress {
  id: string;
  enrollmentId: string;
  lessonId: string;
  status: string; // LOCKED, AVAILABLE, IN_PROGRESS, COMPLETED
  completedAt?: Date;
  updatedAt: Date;
}

export interface MemoryCourseAssessment {
  id: string;
  courseId: string;
  title: string;
  passScorePercent: number;
  timeLimitMinutes: number;
  questionsJson: string;
}

export interface MemoryCertificate {
  id: string;
  certificateNumber: string;
  enrollmentId: string;
  studentId: string;
  courseId: string;
  studentName: string;
  courseTitle: string;
  providerName: string;
  issueDate: Date;
  score: number;
  verificationQrToken: string;
  signatory: string;
  status: 'VALID' | 'REVOKED' | 'EXPIRED';
  revocationReason?: string;
}

export interface MemoryEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  status: string;
  progressPercent: number;
  completedAt?: Date;
  enrolledAt: Date;
}

export interface MemoryAcademicProgram {
  id: string;
  title: string;
  type: string;
  academicianId: string;
  organizerName: string;
  targetAudience: string;
  description: string;
  createdAt: Date;
}

export interface MemoryDocumentVault {
  id: string;
  studentId: string;
  title: string;
  category: string;
  fileUrl: string;
  fileChecksum: string;
  verified: boolean;
  verifiedBy: string;
  uploadedAt: Date;
}

export interface MemoryMentorshipRequest {
  id: string;
  studentId: string;
  mentorId: string;
  topic: string;
  status: string;
  meetingDate?: string;
  notes: string;
  createdAt: Date;
}

export interface MemoryMentorshipSession {
  id: string;
  requestId: string;
  studentId: string;
  mentorId: string;
  scheduledAt: string;
  agenda: string;
  notes?: string;
  status: string;
  createdAt: Date;
}

export interface MemoryTimelineEvent {
  id: string;
  applicationId: string;
  title: string;
  description: string;
  actorRole: string;
  actorName: string;
  createdAt: Date;
}

export interface MemoryInternshipLifecycle {
  id: string;
  opportunityId: string;
  studentId: string;
  mentorName: string;
  startDate: Date;
  endDate: Date;
  status: string;
  weeklyLogs: string;
  midtermScore: number;
  finalScore: number;
}

export interface MemoryAuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  detailsJson: string;
  timestamp: Date;
}

// Initial Data Lists
export const memoryUsers: MemoryUser[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@aiia.gov.in',
    password: defaultPasswordHash,
    name: 'Dr. Tanuja Nesari',
    role: 'SUPER_ADMIN',
    system: 'ALL',
    institutionName: 'All India Institute of Ayurveda (AIIA), New Delhi',
    designation: 'Director & AIIA Super Admin',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    createdAt: new Date()
  },
  {
    id: 'usr-inst-1',
    email: 'admin@aiia-delhi.ac.in',
    password: defaultPasswordHash,
    name: 'AIIA New Delhi Academic Cell',
    role: 'INSTITUTION_ADMIN',
    system: 'AYURVEDA',
    institutionName: 'All India Institute of Ayurveda, New Delhi',
    designation: 'Dean of Academics',
    avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150',
    createdAt: new Date()
  },
  {
    id: 'usr-inst-2',
    email: 'admin@bhu-ayurveda.edu.in',
    password: defaultPasswordHash,
    name: 'Faculty of Ayurveda - BHU',
    role: 'INSTITUTION_ADMIN',
    system: 'AYURVEDA',
    institutionName: 'Banaras Hindu University, Varanasi',
    designation: 'Head of Placement Cell',
    avatar: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=150',
    createdAt: new Date()
  },
  {
    id: 'usr-ind-1',
    email: 'careers@daburayush.com',
    password: defaultPasswordHash,
    name: 'Dabur AYUSH R&D Centre',
    role: 'INDUSTRY',
    system: 'AYURVEDA',
    companyName: 'Dabur India Ltd.',
    designation: 'Head of Herbal R&D Recruitment',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150',
    createdAt: new Date()
  },
  {
    id: 'usr-ind-2',
    email: 'hr@himalayawellness.com',
    password: defaultPasswordHash,
    name: 'Himalaya Wellness Company',
    role: 'INDUSTRY',
    system: 'AYURVEDA',
    companyName: 'Himalaya Wellness',
    designation: 'Senior HR Manager - Clinical Talent',
    avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
    createdAt: new Date()
  },
  {
    id: 'usr-ind-3',
    email: 'contact@keralaayurveda.biz',
    password: defaultPasswordHash,
    name: 'Kerala Ayurveda Ltd.',
    role: 'INDUSTRY',
    system: 'AYURVEDA',
    companyName: 'Kerala Ayurveda Ltd.',
    designation: 'Panchakarma Operations Lead',
    avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150',
    createdAt: new Date()
  },
  {
    id: 'usr-aca-1',
    email: 'dr.sharma@aiia-delhi.ac.in',
    password: defaultPasswordHash,
    name: 'Prof. (Dr.) Rajesh Sharma',
    role: 'ACADEMICIAN',
    system: 'AYURVEDA',
    institutionName: 'All India Institute of Ayurveda',
    designation: 'Professor & HOD, Dravyaguna Department',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
    createdAt: new Date()
  },
  {
    id: 'usr-stu-1',
    email: 'aarav.sharma@student.aiia.ac.in',
    password: defaultPasswordHash,
    name: 'Aarav Sharma',
    role: 'STUDENT',
    system: 'AYURVEDA',
    institutionName: 'All India Institute of Ayurveda, New Delhi',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    createdAt: new Date()
  },
  {
    id: 'usr-stu-2',
    email: 'priya.patel@student.bhu.ac.in',
    password: defaultPasswordHash,
    name: 'Priya Patel',
    role: 'STUDENT',
    system: 'AYURVEDA',
    institutionName: 'Banaras Hindu University, Varanasi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: new Date()
  }
];

export const memoryStudentProfiles: MemoryStudentProfile[] = [
  {
    id: 'prof-stu-1',
    userId: 'usr-stu-1',
    degree: 'BAMS (Final Year)',
    passoutYear: 2025,
    readinessScore: 88,
    bio: 'Enthusiastic BAMS student passionate about evidence-based AYUSH healthcare and clinical research.',
    phone: '+91 98765 43210',
    location: 'New Delhi',
    skillScores: JSON.stringify({
      panchakarma: 85,
      herbalFormulation: 78,
      clinicalDiagnostics: 90,
      nadiPariksha: 82,
      yogaTherapy: 65,
      researchMethodology: 75,
      patientCounseling: 88,
      qaGmp: 70
    }),
    assessedSkills: JSON.stringify({ panchakarma: 85, herbalFormulation: 80, clinicalDiagnostics: 92, nadiPariksha: 80, qaGmp: 75 }),
    mentorVerifiedSkills: JSON.stringify({ panchakarma: 88, clinicalDiagnostics: 90 }),
    coursePassedSkills: JSON.stringify({ herbalFormulation: 85, qaGmp: 80 }),
    verifiedBadges: JSON.stringify(['Advanced Panchakarma Practitioner', 'Clinical Research Associate', 'Ayurvedic Pulse Diagnosis']),
    careerGoals: JSON.stringify(['Herbal Formulation Scientist', 'Panchakarma Consultant'])
  },
  {
    id: 'prof-stu-2',
    userId: 'usr-stu-2',
    degree: 'BAMS (Intern)',
    passoutYear: 2025,
    readinessScore: 92,
    bio: 'Top-ranking BHMS intern with certified expertise in AYUSH quality control and phytochemistry.',
    phone: '+91 98123 45678',
    location: 'Varanasi, UP',
    skillScores: JSON.stringify({
      panchakarma: 92,
      herbalFormulation: 90,
      clinicalDiagnostics: 85,
      nadiPariksha: 88,
      yogaTherapy: 70,
      researchMethodology: 85,
      patientCounseling: 90,
      qaGmp: 80
    }),
    assessedSkills: JSON.stringify({ herbalFormulation: 92, qaGmp: 85, researchMethodology: 88 }),
    mentorVerifiedSkills: JSON.stringify({ herbalFormulation: 90, qaGmp: 85 }),
    coursePassedSkills: JSON.stringify({ herbalFormulation: 90 }),
    verifiedBadges: JSON.stringify(['Herbal Standardization Expert', 'AYUSH QA/QC Certified', 'NABH Clinical Safety']),
    careerGoals: JSON.stringify(['Clinical Research Associate', 'Herbal Formulation Scientist'])
  }
];

export const memoryJobRoles: MemoryJobRole[] = [
  {
    id: 'jr-1',
    title: 'Herbal Formulation Scientist',
    category: 'R&D',
    system: 'AYURVEDA',
    description: 'Develops standardized herbal extract formulations, stability matrices, and botanical drug delivery systems.',
    requiredSkills: JSON.stringify(['Herbal Formulation', 'Phytochemistry', 'QA/QC & GMP Compliance', 'HPTLC Fingerprinting']),
    eligibilityDegrees: JSON.stringify(['BAMS', 'MD (Ayurveda)', 'M.Sc Botany', 'B.Pharm (Ayurveda)']),
    marketDemand: 'VERY_HIGH',
    avgSalaryRange: '₹6.5 - ₹12.0 LPA',
    createdAt: new Date()
  },
  {
    id: 'jr-2',
    title: 'Ayurvedic Medical Officer (Clinical)',
    category: 'CLINICAL',
    system: 'AYURVEDA',
    description: 'Provides OPD and IPD diagnosis, classical Chikitsa prescription, and patient care management in hospitals.',
    requiredSkills: JSON.stringify(['Clinical Diagnostics', 'Nadi Pariksha', 'Patient Counseling', 'Classical Formulations']),
    eligibilityDegrees: JSON.stringify(['BAMS', 'MD (Ayurveda)']),
    marketDemand: 'VERY_HIGH',
    avgSalaryRange: '₹5.5 - ₹10.0 LPA',
    createdAt: new Date()
  },
  {
    id: 'jr-3',
    title: 'Panchakarma Consultant & Specialist',
    category: 'CLINICAL',
    system: 'AYURVEDA',
    description: 'Designs and executes classical 5-fold detoxification and Shodhana protocols in wellness centers.',
    requiredSkills: JSON.stringify(['Panchakarma Techniques', 'Nadi Pariksha', 'Clinical Diagnostics', 'Patient Counseling']),
    eligibilityDegrees: JSON.stringify(['BAMS', 'MD (Panchakarma)']),
    marketDemand: 'HIGH',
    avgSalaryRange: '₹7.0 - ₹14.0 LPA',
    createdAt: new Date()
  }
];

export const memoryQuestions: MemoryQuestion[] = [
  {
    id: 'q-1',
    category: 'Panchakarma Techniques',
    question: 'Which Panchakarma procedure is specifically indicated for Pitta-predominant disorders according to Charaka Samhita?',
    optionA: 'Vamana (Emesis)',
    optionB: 'Virechana (Purgation)',
    optionC: 'Nasya (Nasal Instillation)',
    optionD: 'Raktamokshana (Bloodletting)',
    correctOption: 'B',
    explanation: 'Virechana (therapeutic purgation) is the primary Shodhana treatment for eliminating excess Pitta dosha.',
    difficulty: 'INTERMEDIATE',
    system: 'AYURVEDA'
  },
  {
    id: 'q-2',
    category: 'Herbal Formulation',
    question: 'Which chromatographic method is mandated by the Ayurvedic Pharmacopoeia of India (API) for quantitative marker fingerprinting?',
    optionA: 'Paper Chromatography',
    optionB: 'Gas Chromatography (GC)',
    optionC: 'High-Performance Thin-Layer Chromatography (HPTLC)',
    optionD: 'Column Chromatography',
    correctOption: 'C',
    explanation: 'HPTLC is standard for API herb fingerprinting due to high throughput and reproducibility.',
    difficulty: 'ADVANCED',
    system: 'AYURVEDA'
  }
];

export const memoryOpportunities: MemoryOpportunity[] = [
  {
    id: 'opp-1',
    companyId: 'usr-ind-1',
    companyName: 'Dabur India Ltd.',
    title: 'Junior Herbal Formulation R&D Associate',
    type: 'JOB',
    system: 'AYURVEDA',
    skillsRequired: JSON.stringify(['Herbal Formulation', 'QA/QC & GMP Compliance', 'Phytochemistry', 'Research Methodology']),
    stipend: '₹6.5 - ₹8.0 LPA',
    location: 'Ghaziabad / NCR',
    mode: 'ONSITE',
    duration: 'Full Time',
    description: 'Join Dabur premier Herbal R&D division. Work on standardized extract formulation, stability testing, and pilot-plant scaleup.',
    createdAt: new Date()
  },
  {
    id: 'opp-2',
    companyId: 'usr-ind-2',
    companyName: 'Himalaya Wellness',
    title: 'Clinical Research Intern - AYUSH Therapeutics',
    type: 'INTERNSHIP',
    system: 'AYURVEDA',
    skillsRequired: JSON.stringify(['Clinical Diagnostics', 'Research Methodology', 'Patient Counseling', 'Good Clinical Practice (GCP)']),
    stipend: '₹22,000 / month',
    location: 'Bengaluru, Karnataka',
    mode: 'HYBRID',
    duration: '6 Months',
    description: 'Assist Senior Clinical Scientists in conducting phase II/III human clinical trials for herbal formulations.',
    createdAt: new Date()
  },
  {
    id: 'opp-3',
    companyId: 'usr-ind-3',
    companyName: 'Kerala Ayurveda Ltd.',
    title: 'Senior Panchakarma Resident Physician',
    type: 'JOB',
    system: 'AYURVEDA',
    skillsRequired: JSON.stringify(['Panchakarma Techniques', 'Nadi Pariksha', 'Clinical Diagnostics', 'Patient Counseling']),
    stipend: '₹7.2 - ₹9.5 LPA',
    location: 'Kochi & Aluva, Kerala',
    mode: 'ONSITE',
    duration: 'Full Time',
    description: 'Direct patient care at Kerala Ayurveda flagship resort and hospital. Oversee classical Shodhana therapies.',
    createdAt: new Date()
  }
];

export const memoryApplications: MemoryApplication[] = [
  {
    id: 'app-1',
    opportunityId: 'opp-1',
    studentId: 'usr-stu-1',
    status: 'SHORTLISTED',
    matchScore: 92,
    coverLetter: 'I have hands-on experience in Dravyaguna phytochemistry lab at AIIA Delhi and have mastered HPLC standardization protocol.',
    appliedAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'app-2',
    opportunityId: 'opp-2',
    studentId: 'usr-stu-2',
    status: 'INTERVIEW',
    matchScore: 96,
    coverLetter: 'With a 92% readiness score in clinical diagnostics and GCP certification, I am eager to contribute to Himalaya clinical research division.',
    appliedAt: new Date(),
    updatedAt: new Date()
  }
];

export const memoryCourses: MemoryCourse[] = [
  {
    id: 'crs-1',
    companyId: 'usr-ind-1',
    providerName: 'Dabur R&D Academy',
    title: 'Industrial Phytochemistry & HPTLC Standardization',
    duration: '4 Weeks (20 Hours)',
    level: 'Advanced',
    price: 'Free (Ministry of AYUSH Sponsored)',
    skillsAcquired: JSON.stringify(['Herbal Formulation', 'QA/QC & GMP Compliance', 'Phytochemistry']),
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600',
    description: 'Learn modern chromatographic fingerprinting methods, solvent extraction techniques, and marker identification for Ayurvedic botanical raw materials.',
    createdAt: new Date()
  },
  {
    id: 'crs-2',
    companyId: 'usr-ind-3',
    providerName: 'Kerala Ayurveda Academy',
    title: 'Masterclass in Classical Keraleeya Panchakarma Protocols',
    duration: '6 Weeks (30 Hours)',
    level: 'Intermediate',
    price: 'Free (AIIA Partnered)',
    skillsAcquired: JSON.stringify(['Panchakarma Techniques', 'Nadi Pariksha', 'Clinical Diagnostics']),
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600',
    description: 'Step-by-step practical masterclass covering Shirodhara, Pizhichil, Navarakizhi, Nasyam, and Vasti dosage computation according to classical Samhitas.',
    createdAt: new Date()
  }
];

export const memoryModules: MemoryModule[] = [
  {
    id: 'mod-1',
    courseId: 'crs-1',
    title: 'Module 1: Botanical Raw Material Authentication & Quality Norms',
    order: 1,
    summary: 'Overview of Ayurvedic Pharmacopoeia of India (API) standards, macroscopic & microscopic herb identification.'
  },
  {
    id: 'mod-2',
    courseId: 'crs-1',
    title: 'Module 2: High-Performance Thin-Layer Chromatography (HPTLC) Fingerprinting',
    order: 2,
    summary: 'Sample preparation, plate development, densitometric scanning, and active marker quantification.'
  },
  {
    id: 'mod-3',
    courseId: 'crs-1',
    title: 'Module 3: Practical Lab SOPs & Final Aptitude Assessment',
    order: 3,
    summary: 'Heavy metal limits, pesticide residue testing, and final certification exam.'
  }
];

export const memoryLessons: MemoryLesson[] = [
  {
    id: 'les-1',
    moduleId: 'mod-1',
    title: 'Lesson 1.1: Introduction to API Pharmacopoeial Standards',
    order: 1,
    content: 'Detailed breakdown of Schedules T & Y, foreign matter limits, total ash, and acid-insoluble ash determinations.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15 mins',
    isCompulsory: true
  },
  {
    id: 'les-2',
    moduleId: 'mod-1',
    title: 'Lesson 1.2: Supercritical Extraction & Solvent Selection SOPs',
    order: 2,
    content: 'Polarity index matrices, hydro-alcoholic maceration protocols, and batch yield calculation.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '20 mins',
    isCompulsory: true
  },
  {
    id: 'les-3',
    moduleId: 'mod-2',
    title: 'Lesson 2.1: HPTLC Instrumentation Calibration & Mobile Phase Setup',
    order: 1,
    content: 'CAMAG HPTLC applicator setup, chamber saturation parameters, and derivative spraying techniques.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '25 mins',
    isCompulsory: true
  }
];

export const memoryLearningResources: MemoryLearningResource[] = [
  {
    id: 'res-1',
    courseId: 'crs-1',
    lessonId: 'les-1',
    title: 'AYUSH Pharmacopoeia API Guidelines 2025.pdf',
    type: 'PDF',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '3.2 MB',
    createdAt: new Date()
  },
  {
    id: 'res-2',
    courseId: 'crs-1',
    lessonId: 'les-2',
    title: 'Dabur R&D Standard Extraction SOP Checklist.pdf',
    type: 'SOP',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '1.8 MB',
    createdAt: new Date()
  }
];

export const memoryLessonProgress: MemoryLessonProgress[] = [
  {
    id: 'lsp-1',
    enrollmentId: 'enr-1',
    lessonId: 'les-1',
    status: 'COMPLETED',
    completedAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'lsp-2',
    enrollmentId: 'enr-1',
    lessonId: 'les-2',
    status: 'COMPLETED',
    completedAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'lsp-3',
    enrollmentId: 'enr-1',
    lessonId: 'les-3',
    status: 'COMPLETED',
    completedAt: new Date(),
    updatedAt: new Date()
  }
];

export const memoryCourseAssessments: MemoryCourseAssessment[] = [
  {
    id: 'ca-1',
    courseId: 'crs-1',
    title: 'Industrial Phytochemistry Final Aptitude Assessment',
    passScorePercent: 75,
    timeLimitMinutes: 30,
    questionsJson: JSON.stringify([
      {
        id: 'q1',
        question: 'What is the standard permissible Lead (Pb) limit under API Schedule T for Ayurvedic raw drugs?',
        options: ['1.0 ppm', '10.0 ppm', '0.3 ppm', '50.0 ppm'],
        correctAnswer: '10.0 ppm',
        explanation: 'Schedule T specifies a 10.0 ppm maximum threshold for Lead in raw and finished formulations.'
      },
      {
        id: 'q2',
        question: 'Which wavelength range is typically used for UV-Densitometric scanning of flavonoids on HPTLC plates?',
        options: ['254 nm and 366 nm', '600 nm', '100 nm', '800 nm'],
        correctAnswer: '254 nm and 366 nm',
        explanation: 'Short-wave UV 254 nm and long-wave UV 366 nm are standard for non-destructive chromatographic detection.'
      },
      {
        id: 'q3',
        question: 'What is the primary indicator of Vata pulse in Nadi Pariksha?',
        options: ['Frog Jump (Manduka)', 'Snake Slither (Sarpa)', 'Swan Glide (Hamsa)', 'Elephant Walk (Gaja)'],
        correctAnswer: 'Snake Slither (Sarpa)',
        explanation: 'Sarpa Gati characterizes fast, serpentine Vata pulse movement under the index finger.'
      },
      {
        id: 'q4',
        question: 'Under ICMR Good Clinical Practice (GCP) guidelines, who is responsible for verifying Informed Consent Forms?',
        options: ['Sponsor Auditor', 'Clinical Research Associate / Principal Investigator', 'Patient Relative', 'Marketing Manager'],
        correctAnswer: 'Clinical Research Associate / Principal Investigator',
        explanation: 'The PI and CRA ensure informed consent compliance prior to subject enrolment.'
      }
    ])
  }
];

export const memoryCertificates: MemoryCertificate[] = [
  {
    id: 'cert-1',
    certificateNumber: 'AYUSH-CERT-88F192A0',
    enrollmentId: 'enr-1',
    studentId: 'usr-stu-1',
    courseId: 'crs-1',
    studentName: 'Aarav Sharma',
    courseTitle: 'Industrial Phytochemistry & HPTLC Standardization',
    providerName: 'Dabur R&D Academy',
    issueDate: new Date(),
    score: 90,
    verificationQrToken: 'VERIFIED-TOKEN-AARAV-01',
    signatory: 'Dr. Tanuja Nesari (Director AIIA) & Dabur R&D Head',
    status: 'VALID'
  }
];

export const memoryEnrollments: MemoryEnrollment[] = [
  {
    id: 'enr-1',
    courseId: 'crs-1',
    studentId: 'usr-stu-1',
    status: 'COMPLETED',
    progressPercent: 100,
    completedAt: new Date(),
    enrolledAt: new Date()
  }
];

export const memoryAcademicPrograms: MemoryAcademicProgram[] = [
  {
    id: 'pgm-1',
    title: 'National Faculty Development Program (FDP) on Analytical Phytochemistry Instrumentation',
    type: 'FDP',
    academicianId: 'usr-aca-1',
    organizerName: 'AIIA New Delhi & Dabur R&D',
    targetAudience: 'AYUSH College Assistant & Associate Professors',
    description: '5-Day intensive hands-on faculty development workshop on LC-MS, HPTLC, and Atomic Absorption Spectroscopy.',
    createdAt: new Date()
  }
];

export const memoryDocumentVaults: MemoryDocumentVault[] = [
  {
    id: 'doc-1',
    studentId: 'usr-stu-1',
    title: 'BAMS Final Degree Certificate',
    category: 'DEGREE_CERTIFICATE',
    fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
    fileChecksum: 'sha256-a1b2c3d4e5f67890',
    verified: true,
    verifiedBy: 'AIIA New Delhi Academic Cell',
    uploadedAt: new Date()
  }
];

export const memoryMentorshipRequests: MemoryMentorshipRequest[] = [
  {
    id: 'men-1',
    studentId: 'usr-stu-1',
    mentorId: 'usr-aca-1',
    topic: 'Guidance on Phytochemistry R&D Career in Top Herbals',
    status: 'APPROVED',
    meetingDate: '2026-09-15 14:00',
    notes: 'Professor Sharma agreed to review Aarav research proposal on Dravyaguna extract standardization.',
    createdAt: new Date()
  }
];

export const memoryMentorshipSessions: MemoryMentorshipSession[] = [
  {
    id: 'm-sess-1',
    requestId: 'men-1',
    studentId: 'usr-stu-1',
    mentorId: 'usr-aca-1',
    scheduledAt: '2026-09-15T14:00:00.000Z',
    agenda: 'Review Dravyaguna phytochemistry extraction methodology and paper draft.',
    notes: 'Approved outline. Advised student to submit to Journal of Ayurveda & Integrative Medicine.',
    status: 'SCHEDULED',
    createdAt: new Date()
  }
];

export const memoryTimelineEvents: MemoryTimelineEvent[] = [
  {
    id: 'tml-1',
    applicationId: 'app-1',
    title: 'Application Submitted',
    description: 'Candidate submitted verified credentials and tailored cover letter.',
    actorRole: 'STUDENT',
    actorName: 'Aarav Sharma',
    createdAt: new Date()
  },
  {
    id: 'tml-2',
    applicationId: 'app-1',
    title: 'Profile Shortlisted by HR',
    description: 'Dabur R&D recruitment team shortlisted candidate based on 92% match fit score.',
    actorRole: 'INDUSTRY',
    actorName: 'Dabur AYUSH R&D Centre',
    createdAt: new Date()
  }
];

export const memoryInternshipLifecycles: MemoryInternshipLifecycle[] = [
  {
    id: 'lfc-1',
    opportunityId: 'opp-2',
    studentId: 'usr-stu-2',
    mentorName: 'Dr. Meenakshi Sundaram (Academic Supervisor)',
    startDate: new Date('2026-10-01'),
    endDate: new Date('2027-03-31'),
    status: 'IN_PROGRESS',
    weeklyLogs: JSON.stringify([
      { week: 1, topic: 'Orientation & Safety protocols', log: 'Completed facility safety & ethics induction.' }
    ]),
    midtermScore: 94,
    finalScore: 96
  }
];

export const memoryAuditLogs: MemoryAuditLog[] = [
  {
    id: 'audit-1',
    actorId: 'usr-ind-1',
    actorRole: 'INDUSTRY',
    action: 'COURSE_PUBLISHED',
    targetEntity: 'Industrial Phytochemistry & HPTLC Standardization',
    detailsJson: JSON.stringify({ passScorePercent: 75 }),
    timestamp: new Date()
  }
];
