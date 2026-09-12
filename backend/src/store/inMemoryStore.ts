import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

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
  },
  {
    id: 'usr-stu-abc',
    email: 'abc@gmail.com',
    password: defaultPasswordHash,
    name: 'ABC User',
    role: 'STUDENT',
    system: 'AYURVEDA',
    institutionName: 'All India Institute of Ayurveda, New Delhi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ABC%20User',
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
  },
  {
    id: 'prof-stu-abc',
    userId: 'usr-stu-abc',
    degree: 'BAMS (Final Year)',
    passoutYear: 2025,
    readinessScore: 80,
    bio: 'Student account registered on AYUSH Setu platform.',
    phone: '+91 98765 00000',
    location: 'New Delhi, India',
    skillScores: JSON.stringify({
      panchakarma: 75,
      herbalFormulation: 75,
      clinicalDiagnostics: 80,
      nadiPariksha: 70,
      yogaTherapy: 65,
      researchMethodology: 75,
      patientCounseling: 80,
      qaGmp: 70
    }),
    verifiedBadges: JSON.stringify(['AYUSH Student Portal Registration']),
    careerGoals: JSON.stringify(['Herbal Formulation Scientist'])
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
  },
  {
    id: 'jr-4',
    title: 'Clinical Yoga & Naturopathy Specialist',
    category: 'CLINICAL',
    system: 'YOGA',
    description: 'Designs therapeutic Asana, Pranayama, Hydrotherapy, and Naturopathy diet plans for lifestyle and psychosomatic conditions.',
    requiredSkills: JSON.stringify(['Yoga Therapy', 'Clinical Diagnostics', 'Patient Counseling', 'Research Methodology']),
    eligibilityDegrees: JSON.stringify(['BNYS', 'M.Sc Yoga', 'MD (Naturopathy)']),
    marketDemand: 'VERY_HIGH',
    avgSalaryRange: '₹6.0 - ₹11.5 LPA',
    createdAt: new Date()
  },
  {
    id: 'jr-5',
    title: 'Unani Regimenal Therapy Specialist',
    category: 'CLINICAL',
    system: 'UNANI',
    description: 'Administers classical Ilaj-bit-Tadbeer protocols including Hijama, Cupping, Dalk, and Unani compound drug therapy.',
    requiredSkills: JSON.stringify(['Unani Regimenal Therapy', 'Clinical Diagnostics', 'Patient Counseling', 'Phytochemistry']),
    eligibilityDegrees: JSON.stringify(['BUMS', 'MD (Unani)']),
    marketDemand: 'HIGH',
    avgSalaryRange: '₹5.8 - ₹10.5 LPA',
    createdAt: new Date()
  },
  {
    id: 'jr-6',
    title: 'Siddha Maruthuvam & Varmam Specialist',
    category: 'CLINICAL',
    system: 'SIDDHA',
    description: 'Diagnoses through Naadi & Neerkuri, administers Varmam vital point stimulation, and prescribes classical Gunapadam medicines.',
    requiredSkills: JSON.stringify(['Siddha Varmam', 'Clinical Diagnostics', 'Patient Counseling', 'Herbal Formulation']),
    eligibilityDegrees: JSON.stringify(['BSMS', 'MD (Siddha)']),
    marketDemand: 'HIGH',
    avgSalaryRange: '₹6.2 - ₹11.0 LPA',
    createdAt: new Date()
  },
  {
    id: 'jr-7',
    title: 'Homoeopathic Medical Officer & Potentization Lead',
    category: 'CLINICAL',
    system: 'HOMEOPATHY',
    description: 'Conducts classical case taking, Miasmatic evaluation, computer-assisted Repertorization, and oversees mother tincture QA.',
    requiredSkills: JSON.stringify(['Repertory & Case Taking', 'Clinical Diagnostics', 'Patient Counseling', 'QA/QC & GMP Compliance']),
    eligibilityDegrees: JSON.stringify(['BHMS', 'MD (Homoeopathy)']),
    marketDemand: 'VERY_HIGH',
    avgSalaryRange: '₹6.0 - ₹12.0 LPA',
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
  },
  {
    id: 'q-3', category: 'Clinical Diagnostics', question: 'In Ashtavidha Pariksha, which examination specifically observes the patient’s voice and speech?', optionA: 'Nadi Pariksha', optionB: 'Shabda Pariksha', optionC: 'Drik Pariksha', optionD: 'Aakriti Pariksha', correctOption: 'B', explanation: 'Shabda Pariksha assesses voice, speech quality and related audible clinical signs.', difficulty: 'INTERMEDIATE', system: 'AYURVEDA'
  },
  {
    id: 'q-4', category: 'Research Methodology', question: 'Which document records the planned objectives, methods and safety monitoring for a clinical study?', optionA: 'Batch manufacturing record', optionB: 'Clinical trial protocol', optionC: 'Marketing brochure', optionD: 'Discharge summary', correctOption: 'B', explanation: 'A study protocol defines the approved plan for conducting and monitoring clinical research.', difficulty: 'INTERMEDIATE', system: 'AYURVEDA'
  },
  {
    id: 'q-5', category: 'QA/GMP', question: 'What is the main purpose of a batch manufacturing record in GMP operations?', optionA: 'To advertise a product', optionB: 'To document traceable production and quality checks', optionC: 'To replace laboratory testing', optionD: 'To set staff leave schedules', correctOption: 'B', explanation: 'The BMR provides traceability for materials, process steps, deviations and release checks.', difficulty: 'BEGINNER', system: 'AYURVEDA'
  }
];

export const memoryOpportunities: MemoryOpportunity[] = [
  // AYURVEDA OPPORTUNITIES
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
  },
  {
    id: 'opp-ayur-4',
    companyId: 'usr-ind-1',
    companyName: 'Baidyanath Ayurveda',
    title: 'Ayurvedic Pharmacovigilance & Quality Officer',
    type: 'JOB',
    system: 'AYURVEDA',
    skillsRequired: JSON.stringify(['QA/QC & GMP Compliance', 'AYUSH Regulatory Standards', 'Clinical Diagnostics']),
    stipend: '₹5.8 - ₹7.5 LPA',
    location: 'Kolkata, WB',
    mode: 'ONSITE',
    duration: 'Full Time',
    description: 'Oversee classical batch safety records, heavy metal testing compliance, and adverse drug event reporting under Ministry of AYUSH norms.',
    createdAt: new Date()
  },

  // YOGA & NATUROPATHY (BNYS) OPPORTUNITIES
  {
    id: 'opp-yoga-1',
    companyId: 'usr-ind-2',
    companyName: 'Patanjali Research Institute',
    title: 'Clinical Yoga Therapist & Metabolic Wellness Specialist',
    type: 'JOB',
    system: 'YOGA',
    skillsRequired: JSON.stringify(['Yoga Therapy', 'Patient Counseling', 'Clinical Diagnostics', 'Research Methodology']),
    stipend: '₹6.0 - ₹9.0 LPA',
    location: 'Haridwar, Uttarakhand',
    mode: 'ONSITE',
    duration: 'Full Time',
    description: 'Design clinical yoga and Naturopathy intervention protocols for Type-2 Diabetes, Hypertension, and Metabolic Syndrome patients.',
    createdAt: new Date()
  },
  {
    id: 'opp-yoga-2',
    companyId: 'usr-ind-1',
    companyName: 'Morarji Desai National Institute of Yoga (MDNIY)',
    title: 'Yoga & Naturopathy Clinical Research Fellow (BNYS)',
    type: 'INTERNSHIP',
    system: 'YOGA',
    skillsRequired: JSON.stringify(['Yoga Therapy', 'Research Methodology', 'Patient Counseling', 'Good Clinical Practice (GCP)']),
    stipend: '₹25,000 / month',
    location: 'New Delhi',
    mode: 'HYBRID',
    duration: '6 Months',
    description: 'Conduct physiological and electro-encephalographic (EEG) impact measurements on clinical yoga practitioners under Ministry guidelines.',
    createdAt: new Date()
  },
  {
    id: 'opp-yoga-3',
    companyId: 'usr-ind-3',
    companyName: 'Soukya Holistic Health Centre',
    title: 'Integrative Naturopathy & Hydrotherapy Medical Officer',
    type: 'JOB',
    system: 'YOGA',
    skillsRequired: JSON.stringify(['Yoga Therapy', 'Clinical Diagnostics', 'Patient Counseling']),
    stipend: '₹7.0 - ₹11.0 LPA',
    location: 'Bengaluru, Karnataka',
    mode: 'ONSITE',
    duration: 'Full Time',
    description: 'Oversee holistic BNYS treatments including Hydrotherapy, Mud Therapy, Dietetics, and Therapeutic Asana routines in an international resort clinic.',
    createdAt: new Date()
  },

  // UNANI MEDICINE (BUMS) OPPORTUNITIES
  {
    id: 'opp-unani-1',
    companyId: 'usr-ind-1',
    companyName: 'Hamdard Laboratories India',
    title: 'Unani Ilaj-bit-Tadbeer Clinical Specialist',
    type: 'JOB',
    system: 'UNANI',
    skillsRequired: JSON.stringify(['Unani Regimenal Therapy', 'Clinical Diagnostics', 'Patient Counseling', 'Phytochemistry']),
    stipend: '₹6.2 - ₹8.8 LPA',
    location: 'New Delhi / Manesar',
    mode: 'ONSITE',
    duration: 'Full Time',
    description: 'Lead classical Unani Regimenal Therapy (Hijama, Cupping, Hamam, and Dalk) administration for chronic inflammatory and musculoskeletal conditions.',
    createdAt: new Date()
  },
  {
    id: 'opp-unani-2',
    companyId: 'usr-ind-2',
    companyName: 'Central Council for Research in Unani Medicine (CCRUM)',
    title: 'Unani Phytotherapy & Drug Standardization Fellow (BUMS)',
    type: 'INTERNSHIP',
    system: 'UNANI',
    skillsRequired: JSON.stringify(['Phytochemistry', 'Research Methodology', 'QA/QC & GMP Compliance']),
    stipend: '₹24,000 / month',
    location: 'Hyderabad, Telangana',
    mode: 'ONSITE',
    duration: '6 Months',
    description: 'Assist in single and compound Unani pharmacopoeial drug standardization, thin-layer chromatography, and marker identification.',
    createdAt: new Date()
  },

  // SIDDHA MEDICINE (BSMS) OPPORTUNITIES
  {
    id: 'opp-siddha-1',
    companyId: 'usr-ind-3',
    companyName: 'National Institute of Siddha (NIS)',
    title: 'Siddha Maruthuvam & Gunapadam Clinical Specialist',
    type: 'JOB',
    system: 'SIDDHA',
    skillsRequired: JSON.stringify(['Siddha Varmam', 'Clinical Diagnostics', 'Patient Counseling', 'Herbal Formulation']),
    stipend: '₹6.5 - ₹9.5 LPA',
    location: 'Chennai, Tamil Nadu',
    mode: 'ONSITE',
    duration: 'Full Time',
    description: 'Manage OPD/IPD consultations utilizing Naadi Parikshai, Neerkuri, and classical Siddha Pariksha; administer Varmam and Thokkanam therapies.',
    createdAt: new Date()
  },
  {
    id: 'opp-siddha-2',
    companyId: 'usr-ind-1',
    companyName: 'SKM Siddha & Ayurvedic Medicines',
    title: 'Siddha Herbal Formulations R&D Intern (BSMS)',
    type: 'INTERNSHIP',
    system: 'SIDDHA',
    skillsRequired: JSON.stringify(['Herbal Formulation', 'QA/QC & GMP Compliance', 'Phytochemistry']),
    stipend: '₹20,000 / month',
    location: 'Erode, Tamil Nadu',
    mode: 'HYBRID',
    duration: '6 Months',
    description: 'Standardize classical Siddha Parpam, Chendooram, and Chooranam preparations under GMP and heavy metal compliance norms.',
    createdAt: new Date()
  },

  // HOMOEOPATHY (BHMS) OPPORTUNITIES
  {
    id: 'opp-homeo-1',
    companyId: 'usr-ind-1',
    companyName: 'SBL Global Homoeopathy Ltd.',
    title: 'Homoeopathic Potentization & QA/QC Specialist',
    type: 'JOB',
    system: 'HOMEOPATHY',
    skillsRequired: JSON.stringify(['QA/QC & GMP Compliance', 'Phytochemistry', 'Research Methodology']),
    stipend: '₹6.0 - ₹8.5 LPA',
    location: 'Jaipur, Rajasthan',
    mode: 'ONSITE',
    duration: 'Full Time',
    description: 'Supervise mother tincture extraction, decimal/centesimal dilution potentization, alcohol purity testing, and finished product quality release.',
    createdAt: new Date()
  },
  {
    id: 'opp-homeo-2',
    companyId: 'usr-ind-2',
    companyName: "Dr. Batra's Healthcare",
    title: 'Clinical Homoeopathy Resident Physician (BHMS)',
    type: 'INTERNSHIP',
    system: 'HOMEOPATHY',
    skillsRequired: JSON.stringify(['Clinical Diagnostics', 'Patient Counseling', 'Repertory & Case Taking']),
    stipend: '₹22,500 / month',
    location: 'Mumbai, Maharashtra',
    mode: 'ONSITE',
    duration: '6 Months',
    description: 'Perform detailed classical case taking, Miasmatic analysis, computer-assisted Repertorization, and follow-up evaluation in a multi-specialty Homoeopathy clinic.',
    createdAt: new Date()
  },
  {
    id: 'opp-homeo-3',
    companyId: 'usr-ind-3',
    companyName: 'National Institute of Homoeopathy (NIH)',
    title: 'Homoeopathic Repertory & Pharmacovigilance Fellow',
    type: 'JOB',
    system: 'HOMEOPATHY',
    skillsRequired: JSON.stringify(['Research Methodology', 'Good Clinical Practice (GCP)', 'Patient Counseling']),
    stipend: '₹7.0 - ₹10.0 LPA',
    location: 'Kolkata, WB',
    mode: 'HYBRID',
    duration: 'Full Time',
    description: 'Document clinical proving data, Repertorial synthesis, and drug safety signal monitoring under Central Council for Research in Homoeopathy (CCRH).',
    createdAt: new Date()
  },

  // ALL AYUSH DISCIPLINES / INTERDISCIPLINARY
  {
    id: 'opp-all-1',
    companyId: 'usr-ind-1',
    companyName: 'Ministry of AYUSH & AIIA Centre of Excellence',
    title: 'National Interdisciplinary AYUSH Clinical Trial Fellow',
    type: 'INTERNSHIP',
    system: 'ALL',
    skillsRequired: JSON.stringify(['Research Methodology', 'Good Clinical Practice (GCP)', 'Clinical Diagnostics', 'Patient Counseling']),
    stipend: '₹30,000 / month',
    location: 'New Delhi',
    mode: 'HYBRID',
    duration: '6 Months',
    description: 'Prestigious national fellowship for top BAMS, BNYS, BUMS, BSMS, and BHMS graduates to conduct multi-center integrative health research.',
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
  },
  {
    id: 'crs-3', companyId: 'usr-ind-2', providerName: 'Himalaya Clinical Learning', title: 'Good Clinical Practice (GCP) in Herbal Therapeutics', duration: '3 Weeks (15 Hours)', level: 'Beginner', price: 'Free (Ministry Sponsored)', skillsAcquired: JSON.stringify(['Research Methodology', 'Clinical Diagnostics', 'Patient Counseling']), image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600', description: 'Ethical clinical trials, protocol design, participant safety, and evidence documentation for AYUSH therapeutics.', createdAt: new Date()
  },
  {
    id: 'crs-4', companyId: 'usr-ind-3', providerName: 'Patanjali Research Institute', title: 'Clinical Yoga Therapy for Lifestyle & Metabolic Disorders', duration: '5 Weeks (25 Hours)', level: 'Intermediate', price: 'Free (AIIA Partnered)', skillsAcquired: JSON.stringify(['Yoga Therapy', 'Patient Counseling', 'Research Methodology']), image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600', description: 'Evidence-led yoga protocol design for diabetes, hypertension, obesity, anxiety and lifestyle conditions.', createdAt: new Date()
  },
  {
    id: 'crs-5', companyId: 'usr-ind-1', providerName: 'Charak Pharma Quality Institute', title: 'AYUSH Manufacturing Practices (GMP) & Regulatory Compliance', duration: '4 Weeks (20 Hours)', level: 'Advanced', price: 'Free', skillsAcquired: JSON.stringify(['QA/QC & GMP Compliance', 'AYUSH Regulatory Standards', 'Herbal Formulation']), image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600', description: 'Schedule T, quality systems, batch records, stability testing and regulatory inspection readiness.', createdAt: new Date()
  },
  {
    id: 'crs-6', companyId: 'usr-ind-1', providerName: 'KAPL Global Academy', title: 'International Export Compliance & Herbal Dossier Writing', duration: '4 Weeks (18 Hours)', level: 'Advanced', price: 'Free', skillsAcquired: JSON.stringify(['AYUSH Regulatory Standards', 'QA/QC & GMP Compliance']), image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600', description: 'Build export-ready botanical dossiers, labeling evidence and market-specific compliance packs.', createdAt: new Date()
  },
  {
    id: 'crs-7', companyId: 'usr-ind-3', providerName: 'Kottakkal Learning Division', title: 'Pulse Diagnosis (Nadi Pariksha) & Ashtavidha Pariksha', duration: '3 Weeks (12 Hours)', level: 'Intermediate', price: 'Free', skillsAcquired: JSON.stringify(['Nadi Pariksha', 'Clinical Diagnostics', 'Patient Counseling']), image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600', description: 'Structured diagnostic observation and supervised clinical reasoning through classical examination methods.', createdAt: new Date()
  },
  {
    id: 'crs-8', companyId: 'usr-ind-2', providerName: 'Soukya Holistic Institute', title: 'Holistic Patient Counseling & Integrative Communication', duration: '2 Weeks (10 Hours)', level: 'Beginner', price: 'Free', skillsAcquired: JSON.stringify(['Patient Counseling', 'Clinical Diagnostics']), image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600', description: 'Practical, ethical communication for shared decision-making, lifestyle support and patient follow-up.', createdAt: new Date()
  },
  {
    id: 'crs-9', companyId: 'usr-ind-1', providerName: 'Dabur Research Academy', title: 'Safety Evaluation & In-Vitro Assays for Botanical Drugs', duration: '5 Weeks (25 Hours)', level: 'Advanced', price: 'Free', skillsAcquired: JSON.stringify(['Research Methodology', 'Phytochemistry', 'QA/QC & GMP Compliance']), image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600', description: 'Learn safety screening, assay planning, data integrity and interpretation for botanical research.', createdAt: new Date()
  },
  {
    id: 'crs-10', companyId: 'usr-ind-1', providerName: 'Patanjali Research Institute', title: 'Scientific Writing & Publishing in AYUSH Journals', duration: '3 Weeks (15 Hours)', level: 'Intermediate', price: 'Free', skillsAcquired: JSON.stringify(['Research Methodology', 'Scientific Communication']), image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600', description: 'Prepare robust AYUSH manuscripts, use reporting guidelines and respond professionally to peer review.', createdAt: new Date()
  },
  {
    id: 'crs-11', companyId: 'usr-ind-1', providerName: 'Hamdard Unani Academy', title: 'Classical Unani Formulation & Regimenal Therapy SOPs', duration: '4 Weeks (20 Hours)', level: 'Intermediate', price: 'Free', skillsAcquired: JSON.stringify(['Unani Regimenal Therapy', 'Phytochemistry', 'Clinical Diagnostics']), image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600', description: 'Master classical Unani Ilaj-bit-Tadbeer protocols, Hijama cupping standards, and Kushta standardization.', createdAt: new Date()
  },
  {
    id: 'crs-12', companyId: 'usr-ind-3', providerName: 'NIS Siddha Academy', title: 'Siddha Gunapadam & Varmam Clinical Applications', duration: '5 Weeks (25 Hours)', level: 'Advanced', price: 'Free', skillsAcquired: JSON.stringify(['Siddha Varmam', 'Clinical Diagnostics', 'Herbal Formulation']), image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600', description: 'In-depth clinical masterclass on Siddha vital Varmam point manipulation, Thokkanam massage, and Gunapadam formulation.', createdAt: new Date()
  },
  {
    id: 'crs-13', companyId: 'usr-ind-2', providerName: 'SBL Homoeopathy Institute', title: 'Homoeopathic Potentization & Case Repertorization', duration: '4 Weeks (18 Hours)', level: 'Intermediate', price: 'Free', skillsAcquired: JSON.stringify(['Repertory & Case Taking', 'QA/QC & GMP Compliance', 'Clinical Diagnostics']), image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600', description: 'Learn decimal/centesimal scale potentization techniques, mother tincture quality testing, and radar repertory synthesis.', createdAt: new Date()
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
    duration: '15 mins',
    isCompulsory: true
  },
  {
    id: 'les-2',
    moduleId: 'mod-1',
    title: 'Lesson 1.2: Supercritical Extraction & Solvent Selection SOPs',
    order: 2,
    content: 'Polarity index matrices, hydro-alcoholic maceration protocols, and batch yield calculation.',
    duration: '20 mins',
    isCompulsory: true
  },
  {
    id: 'les-3',
    moduleId: 'mod-2',
    title: 'Lesson 2.1: HPTLC Instrumentation Calibration & Mobile Phase Setup',
    order: 1,
    content: 'CAMAG HPTLC applicator setup, chamber saturation parameters, and derivative spraying techniques.',
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
  },
  {
    id: 'pgm-2', title: 'Faculty Development Program: Clinical Research Methods & GCP', type: 'FDP', academicianId: 'usr-aca-1', organizerName: 'AIIA Clinical Research Unit & Himalaya Wellness', targetAudience: 'AYUSH Faculty, PG Scholars and Clinical Mentors', description: 'A five-session FDP on protocol writing, informed consent, adverse-event reporting and evidence-based teaching practice.', createdAt: new Date()
  },
  {
    id: 'pgm-3', title: 'Joint R&D: Standardised Ashwagandha Extract Stability Study', type: 'JOINT_RESEARCH', academicianId: 'usr-aca-1', organizerName: 'AIIA Dravyaguna Department & Dabur R&D', targetAudience: 'Faculty Researchers and Final-Year PG Scholars', description: 'A collaborative stability and marker-fingerprinting study with shared laboratory SOPs, milestone reviews and an industry mentor panel.', createdAt: new Date()
  },
  {
    id: 'pgm-4', title: 'Industry Guest Lecture: From AYUSH Lab Notebook to GMP Batch Record', type: 'GUEST_LECTURE', academicianId: 'usr-aca-1', organizerName: 'Charak Pharma Quality Institute', targetAudience: 'Final-Year BAMS, B.Pharm and Quality Interns', description: 'Live industry webinar on traceable documentation, deviations, CAPA and entry-level quality roles.', createdAt: new Date()
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

import os from 'os';

const PERSISTENT_DB_FILE = path.join(os.tmpdir(), 'ayush_setu_persistent_user_store.json');

export function saveMemoryStoreToDisk(): void {
  try {
    const dataToSave = {
      users: memoryUsers,
      profiles: memoryStudentProfiles
    };
    const content = JSON.stringify(dataToSave, null, 2);
    fs.writeFileSync(PERSISTENT_DB_FILE, content, 'utf-8');
  } catch (err) {
    console.warn('Failed to persist memory store to disk:', err);
  }
}

export function loadMemoryStoreFromDisk(): void {
  try {
    if (fs.existsSync(PERSISTENT_DB_FILE)) {
      const raw = fs.readFileSync(PERSISTENT_DB_FILE, 'utf-8');
      if (!raw || !raw.trim()) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.users)) {
        parsed.users.forEach((u: MemoryUser) => {
          const idx = memoryUsers.findIndex(existing => existing.email.trim().toLowerCase() === u.email.trim().toLowerCase());
          if (idx === -1) {
            memoryUsers.push({ ...u, createdAt: new Date(u.createdAt) });
          } else {
            memoryUsers[idx] = { ...u, createdAt: new Date(u.createdAt) };
          }
        });
      }
      if (Array.isArray(parsed.profiles)) {
        parsed.profiles.forEach((p: MemoryStudentProfile) => {
          const pIdx = memoryStudentProfiles.findIndex(existing => existing.id === p.id || existing.userId === p.userId);
          if (pIdx === -1) {
            memoryStudentProfiles.push(p);
          } else {
            memoryStudentProfiles[pIdx] = p;
          }
        });
      }
    }
  } catch (err) {
    console.warn('Failed to load memory store from disk:', err);
  }
}

// Auto-load persistent accounts on startup
loadMemoryStoreFromDisk();
