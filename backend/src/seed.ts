import prisma from './prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting AYUSH Setu database seeding...');

  // Clean existing tables
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.academicProgram.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.internshipLifecycle.deleteMany();
  await prisma.documentVault.deleteMany();
  await prisma.mentorshipRequest.deleteMany();
  await prisma.researchProposal.deleteMany();
  await prisma.integrationLog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.assessmentQuestion.deleteMany();
  await prisma.targetRole.deleteMany();
  await prisma.jobRole.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@aiia.gov.in',
      password: defaultPassword,
      name: 'Dr. Tanuja Nesari',
      role: 'SUPER_ADMIN',
      system: 'ALL',
      institutionName: 'All India Institute of Ayurveda (AIIA), New Delhi',
      designation: 'Director & AIIA Super Admin',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'
    }
  });

  // 2. Institutions
  const inst1 = await prisma.user.create({
    data: {
      email: 'admin@aiia-delhi.ac.in',
      password: defaultPassword,
      name: 'AIIA New Delhi Academic Cell',
      role: 'INSTITUTION_ADMIN',
      system: 'AYURVEDA',
      institutionName: 'All India Institute of Ayurveda, New Delhi',
      designation: 'Dean of Academics',
      avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80'
    }
  });

  const inst2 = await prisma.user.create({
    data: {
      email: 'admin@bhu-ayurveda.edu.in',
      password: defaultPassword,
      name: 'Faculty of Ayurveda - BHU',
      role: 'INSTITUTION_ADMIN',
      system: 'AYURVEDA',
      institutionName: 'Banaras Hindu University, Varanasi',
      designation: 'Head of Placement Cell',
      avatar: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=150&auto=format&fit=crop&q=80'
    }
  });

  const inst3 = await prisma.user.create({
    data: {
      email: 'admin@nih-kolkata.nic.in',
      password: defaultPassword,
      name: 'National Institute of Homoeopathy',
      role: 'INSTITUTION_ADMIN',
      system: 'HOMEOPATHY',
      institutionName: 'NIH Kolkata',
      designation: 'Academic Coordinator',
      avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80'
    }
  });

  // 3. Industry Partners (8 companies)
  const ind1 = await prisma.user.create({
    data: {
      email: 'careers@daburayush.com',
      password: defaultPassword,
      name: 'Dabur AYUSH R&D Centre',
      role: 'INDUSTRY',
      system: 'AYURVEDA',
      companyName: 'Dabur India Ltd.',
      designation: 'Head of Herbal R&D Recruitment',
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80'
    }
  });

  const ind2 = await prisma.user.create({
    data: {
      email: 'hr@himalayawellness.com',
      password: defaultPassword,
      name: 'Himalaya Wellness Company',
      role: 'INDUSTRY',
      system: 'AYURVEDA',
      companyName: 'Himalaya Wellness',
      designation: 'Senior HR Manager - Clinical Talent',
      avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80'
    }
  });

  const ind3 = await prisma.user.create({
    data: {
      email: 'contact@keralaayurveda.biz',
      password: defaultPassword,
      name: 'Kerala Ayurveda Ltd.',
      role: 'INDUSTRY',
      system: 'AYURVEDA',
      companyName: 'Kerala Ayurveda Ltd.',
      designation: 'Panchakarma Clinical Operations Director',
      avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80'
    }
  });

  const ind4 = await prisma.user.create({
    data: {
      email: 'recruitment@patanjali-research.org',
      password: defaultPassword,
      name: 'Patanjali Research Foundation',
      role: 'INDUSTRY',
      system: 'YOGA',
      companyName: 'Patanjali Research Foundation',
      designation: 'Lead Research Scientist',
      avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80'
    }
  });

  const ind5 = await prisma.user.create({
    data: {
      email: 'hr@kottakkal.org',
      password: defaultPassword,
      name: 'Kottakkal Arya Vaidya Sala',
      role: 'INDUSTRY',
      system: 'AYURVEDA',
      companyName: 'Kottakkal Arya Vaidya Sala',
      designation: 'Chief Medical Administrator',
      avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80'
    }
  });

  const ind6 = await prisma.user.create({
    data: {
      email: 'talent@charakpharma.com',
      password: defaultPassword,
      name: 'Charak Pharma Pvt Ltd',
      role: 'INDUSTRY',
      system: 'AYURVEDA',
      companyName: 'Charak Pharma',
      designation: 'Formulation QA Manager',
      avatar: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=150&auto=format&fit=crop&q=80'
    }
  });

  const ind7 = await prisma.user.create({
    data: {
      email: 'info@soukya.com',
      password: defaultPassword,
      name: 'Soukya Holistic Health Centre',
      role: 'INDUSTRY',
      system: 'YOGA',
      companyName: 'Soukya International Holistic Centre',
      designation: 'Wellness Programs Lead',
      avatar: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=150&auto=format&fit=crop&q=80'
    }
  });

  const ind8 = await prisma.user.create({
    data: {
      email: 'exports@kapl-herbal.com',
      password: defaultPassword,
      name: 'KAPL Herbal Exporters',
      role: 'INDUSTRY',
      system: 'AYURVEDA',
      companyName: 'Kerala State Ayurvedic Products Exporters',
      designation: 'Regulatory Affairs Manager',
      avatar: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=150&auto=format&fit=crop&q=80'
    }
  });

  // 4. Academicians (6 faculty members)
  const aca1 = await prisma.user.create({
    data: {
      email: 'dr.sharma@aiia-delhi.ac.in',
      password: defaultPassword,
      name: 'Prof. (Dr.) Rajesh Sharma',
      role: 'ACADEMICIAN',
      system: 'AYURVEDA',
      institutionName: 'All India Institute of Ayurveda',
      designation: 'Professor & HOD, Dravyaguna Department',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80'
    }
  });

  const aca2 = await prisma.user.create({
    data: {
      email: 'dr.anitha@bhu.ac.in',
      password: defaultPassword,
      name: 'Dr. Anitha K. Rao',
      role: 'ACADEMICIAN',
      system: 'AYURVEDA',
      institutionName: 'BHU Faculty of Ayurveda',
      designation: 'Associate Professor, Panchakarma Department',
      avatar: 'https://images.unsplash.com/photo-1594824813566-8185b378cb73?w=150&auto=format&fit=crop&q=80'
    }
  });

  const aca3 = await prisma.user.create({
    data: {
      email: 'dr.tariq@unani-delhi.edu',
      password: defaultPassword,
      name: 'Dr. Tariq Ahmad Khan',
      role: 'ACADEMICIAN',
      system: 'UNANI',
      institutionName: 'Ayurvedic & Unani Tibbia College, Delhi',
      designation: 'Professor of Ilmul Advia (Pharmacology)',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
    }
  });

  const aca4 = await prisma.user.create({
    data: {
      email: 'dr.meenakshi@svyasa.edu.in',
      password: defaultPassword,
      name: 'Dr. Meenakshi Sundaram',
      role: 'ACADEMICIAN',
      system: 'YOGA',
      institutionName: 'S-VYASA Yoga University Bangalore',
      designation: 'Director of Yoga Therapy Research',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    }
  });

  const aca5 = await prisma.user.create({
    data: {
      email: 'dr.banerjee@nih-kolkata.nic.in',
      password: defaultPassword,
      name: 'Dr. Sourav Banerjee',
      role: 'ACADEMICIAN',
      system: 'HOMEOPATHY',
      institutionName: 'National Institute of Homoeopathy Kolkata',
      designation: 'Associate Professor, Organon of Medicine',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80'
    }
  });

  const aca6 = await prisma.user.create({
    data: {
      email: 'dr.karthik@siddha-chennai.org',
      password: defaultPassword,
      name: 'Dr. S. Karthikeyan',
      role: 'ACADEMICIAN',
      system: 'SIDDHA',
      institutionName: 'National Institute of Siddha, Chennai',
      designation: 'Professor, Gunapadam (Siddha Pharmacology)',
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80'
    }
  });

  // 5. Students (15 students)
  const studentsData = [
    {
      email: 'aarav.sharma@student.aiia.ac.in',
      name: 'Aarav Sharma',
      degree: 'BAMS (Final Year)',
      system: 'AYURVEDA',
      institution: 'All India Institute of Ayurveda, New Delhi',
      passoutYear: 2025,
      readinessScore: 88,
      location: 'New Delhi',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
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
      verifiedBadges: JSON.stringify(['Advanced Panchakarma Practitioner', 'Clinical Research Associate', 'Ayurvedic Pulse Diagnosis'])
    },
    {
      email: 'priya.patel@student.bhu.ac.in',
      name: 'Priya Patel',
      degree: 'BAMS (Intern)',
      system: 'AYURVEDA',
      institution: 'Banaras Hindu University, Varanasi',
      passoutYear: 2025,
      readinessScore: 92,
      location: 'Varanasi, UP',
      phone: '+91 98123 45678',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
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
      verifiedBadges: JSON.stringify(['Herbal Standardization Expert', 'AYUSH QA/QC Certified', 'NABH Clinical Safety'])
    },
    {
      email: 'rohan.verma@student.nih.nic.in',
      name: 'Rohan Verma',
      degree: 'BHMS (4th Year)',
      system: 'HOMEOPATHY',
      institution: 'National Institute of Homoeopathy Kolkata',
      passoutYear: 2026,
      readinessScore: 76,
      location: 'Kolkata, WB',
      phone: '+91 97890 12345',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 20,
        herbalFormulation: 60,
        clinicalDiagnostics: 82,
        nadiPariksha: 30,
        yogaTherapy: 50,
        researchMethodology: 72,
        patientCounseling: 85,
        qaGmp: 65
      }),
      verifiedBadges: JSON.stringify(['Homeopathic Materia Medica Specialist', 'Repertory & Case Taking'])
    },
    {
      email: 'ananya.iyer@student.svyasa.edu.in',
      name: 'Ananya Iyer',
      degree: 'BNYS (Bachelor of Naturopathy & Yoga)',
      system: 'YOGA',
      institution: 'S-VYASA Yoga University',
      passoutYear: 2025,
      readinessScore: 90,
      location: 'Bengaluru, Karnataka',
      phone: '+91 96543 21098',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 60,
        herbalFormulation: 50,
        clinicalDiagnostics: 75,
        nadiPariksha: 40,
        yogaTherapy: 96,
        researchMethodology: 80,
        patientCounseling: 92,
        qaGmp: 40
      }),
      verifiedBadges: JSON.stringify(['Certified Yoga Therapist (YCB Level 3)', 'Holistic Dietetics & Nutrition'])
    },
    {
      email: 'mohammed.zayd@student.tibbia.edu.in',
      name: 'Mohammed Zayd',
      degree: 'BUMS (Final Year)',
      system: 'UNANI',
      institution: 'Ayurvedic & Unani Tibbia College Delhi',
      passoutYear: 2025,
      readinessScore: 84,
      location: 'New Delhi',
      phone: '+91 95432 10987',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 30,
        herbalFormulation: 85,
        clinicalDiagnostics: 84,
        nadiPariksha: 75,
        yogaTherapy: 45,
        researchMethodology: 70,
        patientCounseling: 80,
        qaGmp: 75
      }),
      verifiedBadges: JSON.stringify(['Unani Regimenal Therapy (Hijama) Cert', 'Pharmacognosy Associate'])
    },
    {
      email: 'siddharth.nair@student.nis.gov.in',
      name: 'Siddharth Nair',
      degree: 'BSMS (Siddha)',
      system: 'SIDDHA',
      institution: 'National Institute of Siddha Chennai',
      passoutYear: 2025,
      readinessScore: 81,
      location: 'Chennai, Tamil Nadu',
      phone: '+91 94321 09876',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 40,
        herbalFormulation: 88,
        clinicalDiagnostics: 80,
        nadiPariksha: 85,
        yogaTherapy: 60,
        researchMethodology: 72,
        patientCounseling: 78,
        qaGmp: 70
      }),
      verifiedBadges: JSON.stringify(['Siddha Varmam Therapy Practitioner', 'Gunapadam Research Fellow'])
    },
    {
      email: 'divya.kulkarni@student.aiia.ac.in',
      name: 'Divya Kulkarni',
      degree: 'MD (Ayurveda - Dravyaguna)',
      system: 'AYURVEDA',
      institution: 'All India Institute of Ayurveda',
      passoutYear: 2024,
      readinessScore: 95,
      location: 'New Delhi',
      phone: '+91 93210 98765',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 70,
        herbalFormulation: 96,
        clinicalDiagnostics: 88,
        nadiPariksha: 80,
        yogaTherapy: 50,
        researchMethodology: 95,
        patientCounseling: 85,
        qaGmp: 92
      }),
      verifiedBadges: JSON.stringify(['PhD Candidate - Phytochemistry', 'HPLC & HPTLC Analytical Specialist', 'AYUSH Export Compliance'])
    },
    {
      email: 'vikram.singh@student.bhu.ac.in',
      name: 'Vikram Singh',
      degree: 'BAMS (3rd Year)',
      system: 'AYURVEDA',
      institution: 'Banaras Hindu University',
      passoutYear: 2026,
      readinessScore: 72,
      location: 'Varanasi, UP',
      phone: '+91 92109 87654',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 68,
        herbalFormulation: 72,
        clinicalDiagnostics: 75,
        nadiPariksha: 65,
        yogaTherapy: 60,
        researchMethodology: 60,
        patientCounseling: 70,
        qaGmp: 55
      }),
      verifiedBadges: JSON.stringify(['Basic Panchakarma Assistant'])
    },
    {
      email: 'meera.joshi@student.gia.edu.in',
      name: 'Meera Joshi',
      degree: 'BAMS (Intern)',
      system: 'AYURVEDA',
      institution: 'Gujarat Ayurved University Jamnagar',
      passoutYear: 2025,
      readinessScore: 86,
      location: 'Jamnagar, Gujarat',
      phone: '+91 91098 76543',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 82,
        herbalFormulation: 85,
        clinicalDiagnostics: 86,
        nadiPariksha: 84,
        yogaTherapy: 70,
        researchMethodology: 78,
        patientCounseling: 88,
        qaGmp: 75
      }),
      verifiedBadges: JSON.stringify(['Rasa Shastra & Bhaishajya Kalpana', 'Ayurvedic Dermatology Associate'])
    },
    {
      email: 'karan.mehta@student.svyasa.edu.in',
      name: 'Karan Mehta',
      degree: 'M.Sc. Yoga Therapy',
      system: 'YOGA',
      institution: 'S-VYASA Yoga University',
      passoutYear: 2024,
      readinessScore: 91,
      location: 'Bengaluru',
      phone: '+91 90987 65432',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 50,
        herbalFormulation: 40,
        clinicalDiagnostics: 70,
        nadiPariksha: 50,
        yogaTherapy: 98,
        researchMethodology: 88,
        patientCounseling: 94,
        qaGmp: 35
      }),
      verifiedBadges: JSON.stringify(['Integrative Cardiac Yoga Rehabilitation', 'Mindfulness Based Stress Reduction (MBSR)'])
    },
    {
      email: 'sneha.reddy@student.aiia.ac.in',
      name: 'Sneha Reddy',
      degree: 'BAMS (Final Year)',
      system: 'AYURVEDA',
      institution: 'All India Institute of Ayurveda',
      passoutYear: 2025,
      readinessScore: 89,
      location: 'Hyderabad / New Delhi',
      phone: '+91 89876 54321',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 88,
        herbalFormulation: 82,
        clinicalDiagnostics: 91,
        nadiPariksha: 85,
        yogaTherapy: 75,
        researchMethodology: 80,
        patientCounseling: 90,
        qaGmp: 78
      }),
      verifiedBadges: JSON.stringify(['Stri Roga & Prasuti Tantra Specialist', 'Clinical Gynecology in Ayurveda'])
    },
    {
      email: 'fardeen.khan@student.tibbia.edu.in',
      name: 'Fardeen Khan',
      degree: 'BUMS (Intern)',
      system: 'UNANI',
      institution: 'Ayurvedic & Unani Tibbia College',
      passoutYear: 2025,
      readinessScore: 82,
      location: 'New Delhi',
      phone: '+91 88765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 30,
        herbalFormulation: 82,
        clinicalDiagnostics: 85,
        nadiPariksha: 70,
        yogaTherapy: 40,
        researchMethodology: 75,
        patientCounseling: 82,
        qaGmp: 70
      }),
      verifiedBadges: JSON.stringify(['Unani Cupping & Leech Therapy'])
    },
    {
      email: 'pooja.deshmukh@student.nih.nic.in',
      name: 'Pooja Deshmukh',
      degree: 'MD (Homoeopathy - Pharmacy)',
      system: 'HOMEOPATHY',
      institution: 'National Institute of Homoeopathy Kolkata',
      passoutYear: 2024,
      readinessScore: 93,
      location: 'Kolkata / Mumbai',
      phone: '+91 87654 32109',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 10,
        herbalFormulation: 75,
        clinicalDiagnostics: 90,
        nadiPariksha: 20,
        yogaTherapy: 45,
        researchMethodology: 94,
        patientCounseling: 88,
        qaGmp: 90
      }),
      verifiedBadges: JSON.stringify(['Homeopathic Pharmacopoeia Specialist', 'Clinical Trial Operations'])
    },
    {
      email: 'arjun.sen@student.bhu.ac.in',
      name: 'Arjun Sen',
      degree: 'BAMS (4th Year)',
      system: 'AYURVEDA',
      institution: 'Banaras Hindu University',
      passoutYear: 2026,
      readinessScore: 78,
      location: 'Varanasi',
      phone: '+91 86543 21098',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 75,
        herbalFormulation: 78,
        clinicalDiagnostics: 80,
        nadiPariksha: 72,
        yogaTherapy: 65,
        researchMethodology: 68,
        patientCounseling: 75,
        qaGmp: 60
      }),
      verifiedBadges: JSON.stringify(['Kayachikitsa Fundamentals'])
    },
    {
      email: 'lakshmi.prabha@student.nis.gov.in',
      name: 'Lakshmi Prabha',
      degree: 'BSMS (Siddha Final Year)',
      system: 'SIDDHA',
      institution: 'National Institute of Siddha Chennai',
      passoutYear: 2025,
      readinessScore: 87,
      location: 'Chennai',
      phone: '+91 85432 10987',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
      skillScores: JSON.stringify({
        panchakarma: 45,
        herbalFormulation: 90,
        clinicalDiagnostics: 86,
        nadiPariksha: 88,
        yogaTherapy: 65,
        researchMethodology: 80,
        patientCounseling: 85,
        qaGmp: 82
      }),
      verifiedBadges: JSON.stringify(['Siddha Formulations & Maruthuvam', 'AYUSH Herbal Quality Assurer'])
    }
  ];

  const createdStudents = [];

  for (const sData of studentsData) {
    const user = await prisma.user.create({
      data: {
        email: sData.email,
        password: defaultPassword,
        name: sData.name,
        role: 'STUDENT',
        system: sData.system,
        institutionName: sData.institution,
        avatar: sData.avatar,
        studentProfile: {
          create: {
            degree: sData.degree,
            passoutYear: sData.passoutYear,
            readinessScore: sData.readinessScore,
            location: sData.location,
            phone: sData.phone,
            bio: `Enthusiastic ${sData.degree} student passionate about evidence-based AYUSH healthcare and clinical research.`,
            skillScores: sData.skillScores,
            verifiedBadges: sData.verifiedBadges
          }
        }
      },
      include: {
        studentProfile: true
      }
    });
    createdStudents.push(user);
  }

  // 6. Opportunities (20 Internship/Job Postings)
  const oppsData = [
    {
      companyId: ind1.id,
      companyName: 'Dabur India Ltd.',
      title: 'Junior Herbal Formulation R&D Associate',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Herbal Formulation', 'QA/QC & GMP Compliance', 'Phytochemistry', 'Research Methodology']),
      stipend: '₹6.5 - ₹8.0 LPA',
      location: 'Ghaziabad / NCR',
      mode: 'ONSITE',
      duration: 'Full Time',
      description: 'Join Dabur’s premier Herbal R&D division. Work on standardized extract formulation, stability testing, and pilot-plant scaleup for new Ayurvedic proprietary medicines.'
    },
    {
      companyId: ind2.id,
      companyName: 'Himalaya Wellness',
      title: 'Clinical Research Intern - AYUSH Therapeutics',
      type: 'INTERNSHIP',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Clinical Diagnostics', 'Research Methodology', 'Patient Counseling', 'Good Clinical Practice (GCP)']),
      stipend: '₹22,000 / month',
      location: 'Bengaluru, Karnataka',
      mode: 'HYBRID',
      duration: '6 Months',
      description: 'Assist Senior Clinical Scientists in conducting phase II/III human clinical trials for herbal formulations. Responsible for patient screening, CRF data entry, and trial compliance.'
    },
    {
      companyId: ind3.id,
      companyName: 'Kerala Ayurveda Ltd.',
      title: 'Senior Panchakarma Resident Physician',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Panchakarma Techniques', 'Nadi Pariksha', 'Clinical Diagnostics', 'Patient Counseling']),
      stipend: '₹7.2 - ₹9.5 LPA',
      location: 'Kochi & Aluva, Kerala',
      mode: 'ONSITE',
      duration: 'Full Time',
      description: 'Direct patient care at Kerala Ayurveda flagship resort and hospital. Oversee classical Shodhana therapies, design customized treatment plans, and conduct Nadi Pariksha consultation.'
    },
    {
      companyId: ind4.id,
      companyName: 'Patanjali Research Foundation',
      title: 'Yoga Therapy Clinical Researcher',
      type: 'RESEARCH_FELLOWSHIP',
      system: 'YOGA',
      skillsRequired: JSON.stringify(['Yoga Therapy', 'Research Methodology', 'Biostatistical Analysis', 'Patient Counseling']),
      stipend: '₹35,000 / month Fellowship',
      location: 'Haridwar, Uttarakhand',
      mode: 'ONSITE',
      duration: '12 Months',
      description: 'Conduct physiological and clinical impact studies of disease-specific Yoga interventions (Diabetes, Hypertension, Chronic Pain) utilizing modern biomarker instrumentation.'
    },
    {
      companyId: ind5.id,
      companyName: 'Kottakkal Arya Vaidya Sala',
      title: 'Ayurvedic Medical Officer - OPD & IPD',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Clinical Diagnostics', 'Nadi Pariksha', 'Classical Formulations', 'Patient Counseling']),
      stipend: '₹6.0 - ₹7.5 LPA',
      location: 'Kottakkal / Delhi Branch',
      mode: 'ONSITE',
      duration: 'Full Time',
      description: 'Manage outpatient clinics and inpatient hospital wards under guidance of senior Chief Physicians. Diagnose conditions according to Ashtavidha and Dashavidha Pariksha.'
    },
    {
      companyId: ind6.id,
      companyName: 'Charak Pharma',
      title: 'AYUSH Quality Assurance & Standardization Specialist',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['QA/QC & GMP Compliance', 'Herbal Formulation', 'HPTLC Fingerprinting', 'AYUSH Regulatory Standards']),
      stipend: '₹5.5 - ₹7.0 LPA',
      location: 'Mumbai / Silvassa',
      mode: 'ONSITE',
      duration: 'Full Time',
      description: 'Ensure strict compliance with Ayurvedic Pharmacopoeia of India (API) standards and WHO-GMP norms across raw material testing and finished formulation batches.'
    },
    {
      companyId: ind7.id,
      companyName: 'Soukya International Holistic Centre',
      title: 'Integrative Wellness Consultant (Yoga & Naturopathy)',
      type: 'JOB',
      system: 'YOGA',
      skillsRequired: JSON.stringify(['Yoga Therapy', 'Patient Counseling', 'Naturopathic Hydrotherapy', 'Mindfulness Training']),
      stipend: '₹6.8 - ₹8.5 LPA',
      location: 'Bengaluru, Karnataka',
      mode: 'ONSITE',
      duration: 'Full Time',
      description: 'Lead personalized wellness regimens for international guests at Soukya. Combine Yoga Nidra, Pranayama, dietetics, and hydrotherapy for lifestyle disease management.'
    },
    {
      companyId: ind8.id,
      companyName: 'KAPL Herbal Exporters',
      title: 'AYUSH Regulatory Affairs & Export Compliance Associate',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['AYUSH Regulatory Standards', 'QA/QC & GMP Compliance', 'Herbal Dossier Preparation', 'Technical Documentation']),
      stipend: '₹6.0 - ₹7.8 LPA',
      location: 'Cochin / Remote',
      mode: 'HYBRID',
      duration: 'Full Time',
      description: 'Draft US-FDA, EU-EMA, and GCC botanical health supplement dossiers. Work closely with international distributors to ensure herb safety and labeling compliance.'
    },
    {
      companyId: ind1.id,
      companyName: 'Dabur India Ltd.',
      title: 'Phytochemistry & Analytical Extraction Intern',
      type: 'INTERNSHIP',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Herbal Formulation', 'Phytochemistry', 'Lab Safety & Documentation']),
      stipend: '₹18,000 / month',
      location: 'Ghaziabad, UP',
      mode: 'ONSITE',
      duration: '3 Months',
      description: 'Hands-on training in supercritical fluid extraction, TLC/HPTLC marker quantification, and active component isolation from classical medicinal plants.'
    },
    {
      companyId: ind2.id,
      companyName: 'Himalaya Wellness',
      title: 'Pharmacovigilance & Herbal Safety Fellow',
      type: 'RESEARCH_FELLOWSHIP',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Research Methodology', 'QA/QC & GMP Compliance', 'Clinical Diagnostics', 'Medical Writing']),
      stipend: '₹28,000 / month',
      location: 'Bengaluru, Karnataka',
      mode: 'REMOTE',
      duration: '6 Months',
      description: 'Monitor adverse drug event reporting for commercial herbal formulations globally. Create pharmacovigilance reports aligned with Ministry of AYUSH national PV framework.'
    },
    {
      companyId: ind3.id,
      companyName: 'Kerala Ayurveda Ltd.',
      title: 'Panchakarma Therapist Trainee (Apprenticeship)',
      type: 'APPRENTICESHIP',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Panchakarma Techniques', 'Patient Counseling', 'Herbal Abhyanga & Swedana']),
      stipend: '₹15,000 / month',
      location: 'Kollam / Trivandrum',
      mode: 'ONSITE',
      duration: '6 Months',
      description: 'Intensive practical apprenticeship under Master Vaidyas. Master classical Kerala Panchakarma rituals (Pizhichil, Navarakizhi, Shirodhara, Elakizhi).'
    },
    {
      companyId: ind4.id,
      companyName: 'Patanjali Research Foundation',
      title: 'Metabolomics & Botanical Genomics Research Scholar',
      type: 'RESEARCH_FELLOWSHIP',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Research Methodology', 'Phytochemistry', 'Bioinformatics', 'Herbal Formulation']),
      stipend: '₹40,000 / month Fellowship',
      location: 'Haridwar',
      mode: 'ONSITE',
      duration: '12 Months',
      description: 'High-throughput mass spectrometry LC-MS analysis of rasayana herbs. Study molecular pathways of traditional formulations on cellular models.'
    },
    {
      companyId: ind5.id,
      companyName: 'Kottakkal Arya Vaidya Sala',
      title: 'Ayurvedic Tele-Medicine Physician',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Patient Counseling', 'Clinical Diagnostics', 'Classical Prescriptions', 'Digital Health Record Keeping']),
      stipend: '₹5.0 - ₹6.5 LPA',
      location: 'Remote / Kottakkal',
      mode: 'REMOTE',
      duration: 'Full Time',
      description: 'Provide virtual consultations to domestic and international patients via Kottakkal e-Health Portal. Conduct detailed case taking and prescribe authentic medications.'
    },
    {
      companyId: ind6.id,
      companyName: 'Charak Pharma',
      title: 'Production Trainee - Ayurvedic Liquid & Tablet Division',
      type: 'INTERNSHIP',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['QA/QC & GMP Compliance', 'Herbal Formulation', 'Industrial Scale Production']),
      stipend: '₹16,000 / month',
      location: 'Silvassa',
      mode: 'ONSITE',
      duration: '6 Months',
      description: 'Learn modern pharmaceutical manufacturing of Ayurvedic churnas, Asavas, Arishtas, and compressed herbal tablets in a GMP-certified manufacturing unit.'
    },
    {
      companyId: ind7.id,
      companyName: 'Soukya International Holistic Centre',
      title: 'Yoga Instructor & Lifestyle Coach Intern',
      type: 'INTERNSHIP',
      system: 'YOGA',
      skillsRequired: JSON.stringify(['Yoga Therapy', 'Patient Counseling', 'Wellness Workshop Facilitation']),
      stipend: '₹20,000 / month',
      location: 'Bengaluru',
      mode: 'ONSITE',
      duration: '3 Months',
      description: 'Assist in guiding morning asana sessions, pranayama workshops, and meditation modules for residential corporate retreat participants.'
    },
    {
      companyId: ind8.id,
      companyName: 'KAPL Herbal Exporters',
      title: 'Herbal Supply Chain & Quality Inspector',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Herbal Standardization', 'QA/QC & GMP Compliance', 'Good Agricultural & Collection Practices (GACP)']),
      stipend: '₹5.8 - ₹7.2 LPA',
      location: 'Western Ghats / Kochi',
      mode: 'HYBRID',
      duration: 'Full Time',
      description: 'Inspect medicinal plant cultivation farms and raw drug mandis across South India. Ensure species authentication, heavy metal compliance, and pesticide-free harvesting.'
    },
    {
      companyId: ind1.id,
      companyName: 'Dabur India Ltd.',
      title: 'Scientific Communications & Medical Content Associate',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Research Methodology', 'Patient Counseling', 'Medical Writing', 'AYUSH Literature Research']),
      stipend: '₹5.5 - ₹6.8 LPA',
      location: 'New Delhi / Remote',
      mode: 'HYBRID',
      duration: 'Full Time',
      description: 'Translate traditional Samhita wisdom and modern clinical clinical trial findings into scientific dossiers for doctors, regulators, and international journals.'
    },
    {
      companyId: ind2.id,
      companyName: 'Himalaya Wellness',
      title: 'Consumer Health Product Manager Trainee',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Herbal Formulation', 'Patient Counseling', 'Market Research & Consumer Insights']),
      stipend: '₹6.5 - ₹8.2 LPA',
      location: 'Bengaluru',
      mode: 'ONSITE',
      duration: 'Full Time',
      description: 'Bridge consumer needs with botanical product innovation. Work with cross-functional teams spanning R&D, clinical evaluation, packaging design, and marketing.'
    },
    {
      companyId: ind3.id,
      companyName: 'Kerala Ayurveda Ltd.',
      title: 'Ayurvedic Wellness Spa Manager & Lead Doctor',
      type: 'JOB',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Panchakarma Techniques', 'Patient Counseling', 'Clinic Management', 'Team Leadership']),
      stipend: '₹8.0 - ₹10.5 LPA',
      location: 'Mumbai / Goa',
      mode: 'ONSITE',
      duration: 'Full Time',
      description: 'Lead clinical operations and spa therapist teams at luxury wellness destinations. Responsible for guest consultations, treatment protocols, and revenue target execution.'
    },
    {
      companyId: ind4.id,
      companyName: 'Patanjali Research Foundation',
      title: 'Ayurvedic Clinical Data Analyst Intern',
      type: 'INTERNSHIP',
      system: 'AYURVEDA',
      skillsRequired: JSON.stringify(['Research Methodology', 'Biostatistical Analysis', 'Clinical Diagnostics', 'Electronic Health Records']),
      stipend: '₹20,000 / month',
      location: 'Remote',
      mode: 'REMOTE',
      duration: '6 Months',
      description: 'Analyze observational real-world clinical data from 100,000+ patients treated at Patanjali Yogpeeth clinics to establish treatment efficacy metrics.'
    }
  ];

  const createdOpps = [];
  for (const opp of oppsData) {
    const o = await prisma.opportunity.create({
      data: opp
    });
    createdOpps.push(o);
  }

  // 7. Applications (Sample applications for student demo)
  const sampleApps = [
    {
      opportunityId: createdOpps[0].id, // Dabur Junior Herbal R&D
      studentId: createdStudents[0].id, // Aarav Sharma
      status: 'SHORTLISTED',
      matchScore: 92,
      coverLetter: 'I have hands-on experience in Dravyaguna phytochemistry lab at AIIA Delhi and have mastered HPLC standardization protocol.'
    },
    {
      opportunityId: createdOpps[1].id, // Himalaya Clinical Research
      studentId: createdStudents[1].id, // Priya Patel
      status: 'INTERVIEW',
      matchScore: 96,
      coverLetter: 'With a 92% readiness score in clinical diagnostics and GCP certification, I am eager to contribute to Himalaya’s clinical research division.'
    },
    {
      opportunityId: createdOpps[2].id, // Kerala Ayurveda Panchakarma Resident
      studentId: createdStudents[0].id, // Aarav Sharma
      status: 'APPLIED',
      matchScore: 88,
      coverLetter: 'Panchakarma is my primary passion. Trained extensively in classical Abhyanga, Basti, and Shirodhara at AIIA hospital.'
    },
    {
      opportunityId: createdOpps[3].id, // Patanjali Yoga Fellow
      studentId: createdStudents[3].id, // Ananya Iyer
      status: 'SELECTED',
      matchScore: 98,
      coverLetter: 'As a BNYS graduate with YCB Level 3 certification and research papers on Pranayama in hypertension, I am ideal for this fellowship.'
    },
    {
      opportunityId: createdOpps[5].id, // Charak Pharma QA Specialist
      studentId: createdStudents[6].id, // Divya Kulkarni
      status: 'SHORTLISTED',
      matchScore: 95,
      coverLetter: 'My MD thesis focused on Ayurvedic pharmacopoeial standards and HPTLC fingerprinting of Dravyaguna formulations.'
    }
  ];

  for (const app of sampleApps) {
    await prisma.application.create({
      data: app
    });
  }

  // 8. Courses (10 Industry Certification Courses)
  const coursesData = [
    {
      companyId: ind1.id,
      providerName: 'Dabur R&D Academy',
      title: 'Industrial Phytochemistry & HPTLC Standardization',
      duration: '4 Weeks (20 Hours)',
      level: 'Advanced',
      price: 'Free (Ministry of AYUSH Sponsored)',
      skillsAcquired: JSON.stringify(['Herbal Formulation', 'QA/QC & GMP Compliance', 'Phytochemistry']),
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
      description: 'Learn modern chromatographic fingerprinting methods, solvent extraction techniques, and marker identification for Ayurvedic botanical raw materials.'
    },
    {
      companyId: ind3.id,
      providerName: 'Kerala Ayurveda Academy',
      title: 'Masterclass in Classical Keraleeya Panchakarma Protocols',
      duration: '6 Weeks (30 Hours)',
      level: 'Intermediate',
      price: 'Free (AIIA Partnered)',
      skillsAcquired: JSON.stringify(['Panchakarma Techniques', 'Nadi Pariksha', 'Clinical Diagnostics']),
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
      description: 'Step-by-step practical masterclass covering Shirodhara, Pizhichil, Navarakizhi, Nasyam, and Vasti dosage computation according to classical Samhitas.'
    },
    {
      companyId: ind2.id,
      providerName: 'Himalaya Clinical Learning',
      title: 'Good Clinical Practice (GCP) in Herbal Therapeutics',
      duration: '3 Weeks (15 Hours)',
      level: 'Beginner',
      price: 'Free',
      skillsAcquired: JSON.stringify(['Research Methodology', 'Clinical Diagnostics', 'Patient Counseling']),
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
      description: 'Essential certification for AYUSH doctors wanting to participate in ethical clinical trials, WHO-GCP guidelines, and ethics committee submissions.'
    },
    {
      companyId: ind4.id,
      providerName: 'Patanjali Research Institute',
      title: 'Clinical Yoga Therapy for Lifestyle & Metabolic Disorders',
      duration: '5 Weeks (25 Hours)',
      level: 'Intermediate',
      price: 'Free',
      skillsAcquired: JSON.stringify(['Yoga Therapy', 'Patient Counseling', 'Research Methodology']),
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop&q=80',
      description: 'Evidence-based yoga protocol design for Type 2 Diabetes, Hypertension, Obesity, and Anxiety disorders backed by published clinical trials.'
    },
    {
      companyId: ind6.id,
      providerName: 'Charak Pharma Quality Institute',
      title: 'AYUSH Manufacturing Practices (GMP) & Regulatory Compliance',
      duration: '4 Weeks (20 Hours)',
      level: 'Advanced',
      price: 'Free',
      skillsAcquired: JSON.stringify(['QA/QC & GMP Compliance', 'AYUSH Regulatory Standards', 'Herbal Formulation']),
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      description: 'Deep dive into Schedule T regulations, heavy metal limits, microbial load testing, shelf-life stability studies, and batch manufacturing records.'
    },
    {
      companyId: ind8.id,
      providerName: 'KAPL Global Academy',
      title: 'International Export Compliance & Herbal Dossier Writing',
      duration: '4 Weeks (18 Hours)',
      level: 'Advanced',
      price: 'Free',
      skillsAcquired: JSON.stringify(['AYUSH Regulatory Standards', 'QA/QC & GMP Compliance']),
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
      description: 'Master how to take Ayurvedic products to North American, European, and Gulf markets. Learn dietary supplement vs drug classification rules.'
    },
    {
      companyId: ind5.id,
      providerName: 'Kottakkal Learning Division',
      title: 'Pulse Diagnosis (Nadi Pariksha) & Ashtavidha Pariksha Masterclass',
      duration: '3 Weeks (12 Hours)',
      level: 'Intermediate',
      price: 'Free',
      skillsAcquired: JSON.stringify(['Nadi Pariksha', 'Clinical Diagnostics', 'Patient Counseling']),
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80',
      description: 'Refine your tactile diagnostic skills. Learn how Gati (movement) of Vata, Pitta, and Kapha signals early stage Dosha imbalances.'
    },
    {
      companyId: ind7.id,
      providerName: 'Soukya Holistic Institute',
      title: 'Holistic Patient Counseling & Integrative Doctor-Patient Communication',
      duration: '2 Weeks (10 Hours)',
      level: 'Beginner',
      price: 'Free',
      skillsAcquired: JSON.stringify(['Patient Counseling', 'Clinical Diagnostics']),
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      description: 'Develop empathetic communication, lifestyle habit modification counseling, and patient compliance techniques for chronic disease management.'
    },
    {
      companyId: ind1.id,
      providerName: 'Dabur Research Academy',
      title: 'Safety Evaluation & In-Vitro Assays for Botanical Drugs',
      duration: '5 Weeks (25 Hours)',
      level: 'Advanced',
      price: 'Free',
      skillsAcquired: JSON.stringify(['Research Methodology', 'Phytochemistry', 'QA/QC & GMP Compliance']),
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
      description: 'Learn cellular toxicity testing, anti-inflammatory assay models, antioxidant assays (DPPH, FRAP), and immune modulation evaluations.'
    },
    {
      companyId: ind4.id,
      providerName: 'Patanjali Research Institute',
      title: 'Scientific Writing & Publishing in PubMed Indexed AYUSH Journals',
      duration: '3 Weeks (15 Hours)',
      level: 'Intermediate',
      price: 'Free',
      skillsAcquired: JSON.stringify(['Research Methodology', 'Scientific Communication']),
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
      description: 'Structure manuscript sections (CARE/CONSORT guidelines), select peer-reviewed journals (Journal of Ayurveda & Integrative Medicine), and address peer reviews.'
    }
  ];

  const createdCourses = [];
  for (const c of coursesData) {
    const crs = await prisma.course.create({ data: c });
    createdCourses.push(crs);
  }

  // Enrollments for Student 0 (Aarav Sharma)
  await prisma.enrollment.create({
    data: {
      courseId: createdCourses[0].id,
      studentId: createdStudents[0].id,
      status: 'COMPLETED',
      completedAt: new Date()
    }
  });

  await prisma.enrollment.create({
    data: {
      courseId: createdCourses[1].id,
      studentId: createdStudents[0].id,
      status: 'ENROLLED'
    }
  });

  // 9. Academic Programs (FDPs, Joint Research)
  await prisma.academicProgram.create({
    data: {
      title: 'National Faculty Development Program (FDP) on Analytical Phytochemistry Instrumentation',
      type: 'FDP',
      academicianId: aca1.id,
      organizerName: 'AIIA New Delhi & Dabur R&D',
      targetAudience: 'AYUSH College Assistant & Associate Professors',
      description: '5-Day intensive hands-on faculty development workshop on LC-MS, HPTLC, and Atomic Absorption Spectroscopy in Dravyaguna laboratories.'
    }
  });

  await prisma.academicProgram.create({
    data: {
      title: 'Joint Industry-Academia Project: Clinical Efficacy of Rasayana Herbo-Mineral Complexes',
      type: 'JOINT_RESEARCH',
      academicianId: aca2.id,
      organizerName: 'BHU Faculty of Ayurveda & Kerala Ayurveda Ltd.',
      targetAudience: 'Postgraduate Scholars & Faculty Researchers',
      description: 'Multi-centric double-blind clinical trial evaluating standardized Bhasma formulations in age-related cognitive decline.'
    }
  });

  await prisma.academicProgram.create({
    data: {
      title: 'Industry Guest Lecture Series: GMP Expectations for Fresh BAMS/BHMS Graduates',
      type: 'GUEST_LECTURE',
      academicianId: aca3.id,
      organizerName: 'Tibbia College & Charak Pharma',
      targetAudience: 'Final Year BAMS, BUMS & BHMS Students',
      description: 'Interactive weekly lectures by industrial QA managers on transitioning from academic college labs to modern automated pharma lines.'
    }
  });

  // 10. Initial Messages & Notifications
  await prisma.message.create({
    data: {
      senderId: ind1.id,
      receiverId: createdStudents[0].id,
      senderName: 'Dabur AYUSH R&D Centre',
      content: 'Hello Aarav! We reviewed your skill assessment profile and were impressed by your 85% Panchakarma & 90% Clinical Diagnostics scores. We would like to schedule an interview for the Junior Herbal Formulation R&D Associate role.'
    }
  });

  await prisma.message.create({
    data: {
      senderId: createdStudents[0].id,
      receiverId: ind1.id,
      senderName: 'Aarav Sharma',
      content: 'Thank you so much! I am very excited about this opportunity with Dabur R&D. I am available for the interview anytime this week.'
    }
  });

  await prisma.notification.create({
    data: {
      userId: createdStudents[0].id,
      title: 'Application Shortlisted! 🎉',
      message: 'Your application for "Junior Herbal Formulation R&D Associate" at Dabur India Ltd. has been shortlisted.',
      type: 'SUCCESS'
    }
  });

  await prisma.notification.create({
    data: {
      userId: createdStudents[0].id,
      title: 'New Course Enrolled',
      message: 'You have enrolled in "Masterclass in Classical Keraleeya Panchakarma Protocols".',
      type: 'INFO'
    }
  });

  // 11. Job Roles Taxonomy (10 Career Tracks)
  const jobRolesData = [
    {
      title: 'Herbal Formulation Scientist',
      code: 'JR-HERBAL-RND-01',
      system: 'AYURVEDA',
      summary: 'Develops standardized herbal extract formulations, stability matrices, and botanical drug delivery systems.',
      careerPathway: 'Assistant Scientist -> Lead Formulator -> VP R&D',
      eligibleDegrees: JSON.stringify(['BAMS', 'MD (Ayurveda)', 'M.Sc Botany', 'B.Pharm (Ayurveda)']),
      coreSkills: JSON.stringify(['Herbal Formulation', 'Phytochemistry', 'HPTLC Fingerprinting']),
      secondarySkills: JSON.stringify(['QA/QC & GMP Compliance']),
      typicalSalaryRange: '₹6.5 - ₹12.0 LPA',
      demandSignal: 'VERY_HIGH'
    },
    {
      title: 'Ayurvedic Medical Officer (Clinical)',
      code: 'JR-CLINICAL-AMO-02',
      system: 'AYURVEDA',
      summary: 'Provides OPD and IPD diagnosis, classical Chikitsa prescription, and patient care management in hospitals.',
      careerPathway: 'Resident Doctor -> Senior Medical Officer -> Chief Medical Officer',
      eligibleDegrees: JSON.stringify(['BAMS', 'MD (Ayurveda)']),
      coreSkills: JSON.stringify(['Clinical Diagnostics', 'Nadi Pariksha', 'Patient Counseling']),
      secondarySkills: JSON.stringify(['Classical Formulations']),
      typicalSalaryRange: '₹5.5 - ₹10.0 LPA',
      demandSignal: 'VERY_HIGH'
    },
    {
      title: 'Panchakarma Consultant & Specialist',
      code: 'JR-PANCHAKARMA-03',
      system: 'AYURVEDA',
      summary: 'Designs and executes classical 5-fold detoxification and Shodhana protocols in wellness centers and hospitals.',
      careerPathway: 'Panchakarma Physician -> Center Head -> Clinical Director',
      eligibleDegrees: JSON.stringify(['BAMS', 'MD (Panchakarma)']),
      coreSkills: JSON.stringify(['Panchakarma Techniques', 'Nadi Pariksha']),
      secondarySkills: JSON.stringify(['Clinical Diagnostics', 'Patient Counseling']),
      typicalSalaryRange: '₹7.0 - ₹14.0 LPA',
      demandSignal: 'HIGH'
    }
  ];

  for (const jr of jobRolesData) {
    await prisma.jobRole.create({ data: jr });
  }

  // 12. Assessment Question Bank
  const questionsData = [
    {
      discipline: 'AYURVEDA',
      skillCategory: 'Panchakarma Techniques',
      questionType: 'MCQ',
      difficulty: 'INTERMEDIATE',
      weight: 10,
      questionText: 'Which Panchakarma procedure is specifically indicated for Pitta-predominant disorders according to Charaka Samhita?',
      options: JSON.stringify(['Vamana (Emesis)', 'Virechana (Purgation)', 'Nasya (Nasal Instillation)', 'Raktamokshana (Bloodletting)']),
      correctAnswer: 'Virechana (Purgation)',
      explanation: 'Virechana (therapeutic purgation) is the primary Shodhana treatment for eliminating excess Pitta dosha from the gastrointestinal tract and body.'
    },
    {
      discipline: 'AYURVEDA',
      skillCategory: 'Herbal Formulation',
      questionType: 'MCQ',
      difficulty: 'ADVANCED',
      weight: 10,
      questionText: 'Which chromatographic method is mandated by the Ayurvedic Pharmacopoeia of India (API) for quantitative marker fingerprinting of herbal raw materials?',
      options: JSON.stringify(['Paper Chromatography', 'Gas Chromatography (GC)', 'High-Performance Thin-Layer Chromatography (HPTLC)', 'Column Chromatography']),
      correctAnswer: 'High-Performance Thin-Layer Chromatography (HPTLC)',
      explanation: 'HPTLC is standard for API herb fingerprinting due to high throughput, visual color densitometry, and reproducibility.'
    }
  ];

  for (const q of questionsData) {
    await prisma.assessmentQuestion.create({ data: q });
  }

  // 13. Student Document Vault items
  await prisma.documentVault.create({
    data: {
      userId: createdStudents[0].id,
      fileName: 'BAMS Final Degree Certificate',
      fileCategory: 'DEGREE_CERTIFICATE',
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      fileSize: '1.5 MB',
      verificationStatus: 'VERIFIED',
      checksum: 'sha256-a1b2c3d4e5f67890'
    }
  });

  // 14. Mentorship Requests
  await prisma.mentorshipRequest.create({
    data: {
      studentId: createdStudents[0].id,
      mentorId: aca1.id,
      topic: 'Guidance on Phytochemistry R&D Career in Top Herbals',
      notes: 'Professor Sharma agreed to review Aarav’s research proposal on Dravyaguna extract standardization.',
      status: 'APPROVED'
    }
  });

  // 15. Timeline Events for Applications
  const apps = await prisma.application.findMany();
  if (apps.length > 0) {
    await prisma.timelineEvent.create({
      data: {
        applicationId: apps[0].id,
        actorName: 'Aarav Sharma',
        actorRole: 'STUDENT',
        stage: 'APPLIED',
        note: 'Candidate submitted verified credentials and tailored cover letter.'
      }
    });

    await prisma.timelineEvent.create({
      data: {
        applicationId: apps[0].id,
        actorName: 'Dabur AYUSH R&D Centre',
        actorRole: 'INDUSTRY',
        stage: 'SHORTLISTED',
        note: 'Dabur R&D recruitment team shortlisted candidate based on 92% match fit score.'
      }
    });

    // 16. Internship Lifecycle for selected application
    const selectedApp = apps.find(a => a.status === 'SELECTED');
    if (selectedApp) {
      await prisma.internshipLifecycle.create({
        data: {
          opportunityId: selectedApp.opportunityId,
          studentId: selectedApp.studentId,
          mentorName: 'Dr. Meenakshi Sundaram (Academic Supervisor)',
          onboardingStatus: 'COMPLETED',
          weeklyLogs: JSON.stringify([
            { week: 1, topic: 'Orientation & Safety protocols', log: 'Completed facility safety & ethics induction.' }
          ]),
          midpointEvaluation: JSON.stringify({ score: 94 }),
          finalEvaluation: JSON.stringify({ score: 96 }),
          completionStatus: 'IN_PROGRESS'
        }
      });
    }
  }

  console.log('✅ AYUSH Setu Seeding complete! Database is fully populated with:');
  console.log(' - 1 Super Admin (AIIA)');
  console.log(' - 3 Institutions');
  console.log(' - 8 Industry Partners');
  console.log(' - 6 Academicians');
  console.log(' - 15 Students');
  console.log(' - 20 Opportunities (Jobs/Internships)');
  console.log(' - 10 Courses/Certifications');
  console.log(' - Applications, Messages & Notifications');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
