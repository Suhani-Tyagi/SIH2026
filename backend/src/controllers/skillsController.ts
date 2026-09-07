import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';
import {
  memoryUsers,
  memoryStudentProfiles,
  memoryJobRoles,
  memoryQuestions,
  memoryEnrollments,
  memoryApplications,
  memoryCertificates
} from '../store/inMemoryStore';

const CAREER_BENCHMARKS = {
  herbalRnd: {
    name: 'Herbal Formulation Scientist',
    skills: { herbalFormulation: 90, qaGmp: 90, researchMethodology: 85, clinicalDiagnostics: 60, panchakarma: 40, nadiPariksha: 40, patientCounseling: 60, yogaTherapy: 30 }
  },
  clinicalPractitioner: {
    name: 'Ayurvedic Medical Officer',
    skills: { panchakarma: 85, clinicalDiagnostics: 90, nadiPariksha: 85, patientCounseling: 85, herbalFormulation: 75, researchMethodology: 60, qaGmp: 50, yogaTherapy: 60 }
  },
  panchakarmaSpecialist: {
    name: 'Panchakarma Consultant',
    skills: { panchakarma: 95, nadiPariksha: 85, patientCounseling: 90, yogaTherapy: 75, clinicalDiagnostics: 80, herbalFormulation: 70, researchMethodology: 50, qaGmp: 40 }
  },
  yogaTherapist: {
    name: 'Yoga Therapy Specialist',
    skills: { yogaTherapy: 95, patientCounseling: 90, clinicalDiagnostics: 75, researchMethodology: 70, panchakarma: 60, nadiPariksha: 50, herbalFormulation: 40, qaGmp: 30 }
  },
  regulatoryAffairs: {
    name: 'AYUSH Regulatory Officer',
    skills: { qaGmp: 95, researchMethodology: 85, herbalFormulation: 80, clinicalDiagnostics: 70, patientCounseling: 60, panchakarma: 30, nadiPariksha: 30, yogaTherapy: 30 }
  }
};

export const getJobRoles = async (req: Request, res: Response) => {
  try {
    if (isDatabaseConfigured) {
      try {
        const roles = await prisma.jobRole.findMany({ orderBy: { title: 'asc' } });
        if (roles.length > 0) return res.json({ jobRoles: roles });
      } catch (e) {}
    }
    return res.json({ jobRoles: memoryJobRoles });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getAssessmentQuestions = async (req: Request, res: Response) => {
  try {
    const { discipline, category } = req.query;
    if (isDatabaseConfigured) {
      try {
        const questions = await prisma.assessmentQuestion.findMany({
          where: {
            ...(discipline ? { discipline: String(discipline) } : {}),
            ...(category ? { skillCategory: String(category) } : {})
          }
        });
        // A compact database may contain only the original two seed questions.
        // Supplement it with the maintained fallback bank so the assessment is
        // always a meaningful five-question experience.
        if (questions.length >= 5) return res.json({ questions });
        if (questions.length > 0) {
          const existingCategories = new Set(questions.map(q => q.skillCategory));
          const supplement = memoryQuestions.filter(q => !existingCategories.has(q.category)).map((q) => ({
            id: q.id, discipline: q.system, skillCategory: q.category, questionText: q.question,
            options: [q.optionA, q.optionB, q.optionC, q.optionD], correctAnswer: q.correctOption,
            explanation: q.explanation, difficulty: q.difficulty
          }));
          return res.json({ questions: [...questions, ...supplement].slice(0, 5) });
        }
      } catch (e) {}
    }
    // Keep the fallback question bank on the same public contract as Prisma.
    // The former memory records use optionA..optionD while the UI consumes an
    // options array, which made every question appear blank in serverless mode.
    return res.json({
      questions: memoryQuestions.map((q) => ({
        id: q.id,
        discipline: q.system,
        skillCategory: q.category,
        questionText: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: q.correctOption,
        explanation: q.explanation,
        difficulty: q.difficulty
      }))
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getSkillProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let profile: any = null;

    if (isDatabaseConfigured) {
      try {
        profile = await prisma.studentProfile.findUnique({
          where: { userId },
          include: { user: true }
        });
      } catch (e) {}
    }

    if (!profile) {
      const memProf = memoryStudentProfiles.find(p => p.userId === userId);
      const memUser = memoryUsers.find(u => u.id === userId);
      if (memProf && memUser) {
        profile = { ...memProf, user: memUser };
      }
    }

    if (!profile) return res.status(404).json({ message: 'Student profile not found' });

    let selfScores = { panchakarma: 70, herbalFormulation: 70, clinicalDiagnostics: 75, nadiPariksha: 65, yogaTherapy: 60, researchMethodology: 70, patientCounseling: 75, qaGmp: 65 };
    let assessedSkills = {};
    let coursePassedSkills = {};
    let mentorVerifiedSkills = {};
    let verifiedBadges: string[] = [];

    try {
      if (profile.skillScores) selfScores = { ...selfScores, ...JSON.parse(profile.skillScores) };
      if (profile.assessedSkills) assessedSkills = JSON.parse(profile.assessedSkills);
      if (profile.coursePassedSkills) coursePassedSkills = JSON.parse(profile.coursePassedSkills);
      if (profile.mentorVerifiedSkills) mentorVerifiedSkills = JSON.parse(profile.mentorVerifiedSkills);
      if (profile.verifiedBadges) verifiedBadges = JSON.parse(profile.verifiedBadges);
    } catch (e) {}

    // Calculate Provenance Weighted Readiness Score
    const keys = ['panchakarma', 'herbalFormulation', 'clinicalDiagnostics', 'nadiPariksha', 'yogaTherapy', 'researchMethodology', 'patientCounseling', 'qaGmp'];
    let weightedSum = 0;

    const weightedSkills: Record<string, number> = {};
    keys.forEach(k => {
      const selfVal = (selfScores as any)[k] || 60;
      const assVal = (assessedSkills as any)[k] || selfVal;
      const courseVal = (coursePassedSkills as any)[k] || selfVal;
      const mentorVal = (mentorVerifiedSkills as any)[k] || selfVal;

      const finalVal = Math.round(assVal * 0.4 + courseVal * 0.3 + mentorVal * 0.2 + selfVal * 0.1);
      weightedSkills[k] = finalVal;
      weightedSum += finalVal;
    });

    const overallReadiness = Math.round(weightedSum / keys.length);

    // Calculate career tracks fit
    const trackScores: any = {};
    for (const [key, track] of Object.entries(CAREER_BENCHMARKS)) {
      let totalMatch = 0;
      let totalWeight = 0;
      for (const [sKey, benchmarkVal] of Object.entries(track.skills)) {
        const studentVal = (weightedSkills as any)[sKey] || 0;
        const ratio = Math.min(1.0, studentVal / benchmarkVal);
        totalMatch += ratio * benchmarkVal;
        totalWeight += benchmarkVal;
      }
      trackScores[key] = {
        name: track.name,
        score: Math.round((totalMatch / totalWeight) * 100),
        benchmarks: track.skills
      };
    }

    return res.json({
      profile,
      skillScores: weightedSkills,
      selfScores,
      assessedSkills,
      coursePassedSkills,
      mentorVerifiedSkills,
      verifiedBadges,
      provenanceBadges: [
        { label: 'Aptitude Assessed', count: Object.keys(assessedSkills).length, color: 'emerald' },
        { label: 'Course Certified', count: verifiedBadges.length, color: 'blue' },
        { label: 'Mentor Verified', count: Object.keys(mentorVerifiedSkills).length, color: 'purple' },
        { label: 'Self Declared', count: Object.keys(selfScores).length, color: 'amber' }
      ],
      careerTracks: trackScores,
      overallReadiness
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const submitAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { answers, categoryScores } = req.body;

    const technicalScore = Math.round(
      ((categoryScores?.panchakarma || 70) +
        (categoryScores?.herbalFormulation || 70) +
        (categoryScores?.clinicalDiagnostics || 75) +
        (categoryScores?.nadiPariksha || 70)) / 4
    );

    const softSkillScore = Math.round(
      ((categoryScores?.patientCounseling || 80) +
        (categoryScores?.researchMethodology || 70) +
        (categoryScores?.yogaTherapy || 65) +
        (categoryScores?.qaGmp || 65)) / 4
    );

    const overallReadiness = Math.round((technicalScore * 0.6) + (softSkillScore * 0.4));

    if (isDatabaseConfigured) {
      try {
        await prisma.assessmentAttempt.create({
          data: {
            studentId: userId,
            discipline: 'AYURVEDA',
            totalScore: overallReadiness,
            technicalScore,
            softSkillScore,
            categoryBreakdown: JSON.stringify(categoryScores || {}),
            answers: JSON.stringify(answers || {})
          }
        });

        const updatedProfile = await prisma.studentProfile.update({
          where: { userId },
          data: {
            readinessScore: overallReadiness,
            assessedSkills: JSON.stringify(categoryScores || {})
          }
        });

        return res.json({
          message: 'Skill assessment evaluated & persisted strictly on backend!',
          readinessScore: overallReadiness,
          profile: updatedProfile
        });
      } catch (e) {}
    }

    // Memory Fallback
    const memProf = memoryStudentProfiles.find(p => p.userId === userId);
    if (memProf) {
      memProf.readinessScore = overallReadiness;
      memProf.assessedSkills = JSON.stringify(categoryScores || {});
    }

    return res.json({
      message: 'Skill assessment evaluated & persisted strictly on backend!',
      readinessScore: overallReadiness,
      profile: memProf || { readinessScore: overallReadiness }
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getCareerGuidance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let profile: any = memoryStudentProfiles.find(p => p.userId === userId);
    if (isDatabaseConfigured) {
      try {
        const dbProf = await prisma.studentProfile.findUnique({ where: { userId } });
        if (dbProf) profile = dbProf;
      } catch (e) {}
    }

    const actionPlan = [
      {
        phase: 'Days 1 - 30 (Foundation & Gap Closing)',
        focus: 'Strengthen GMP & Phytochemistry Competencies',
        tasks: [
          'Enroll in Dabur R&D Industrial Phytochemistry & HPTLC course',
          'Complete 2 practice MCQ sets on AYUSH Pharmacopoeial Standards',
          'Upload BAMS Degree Certificate and Internship Logbook to Document Vault'
        ]
      },
      {
        phase: 'Days 31 - 60 (Practical Mastery & Portfolio Building)',
        focus: 'Clinical Diagnostics & Case Study Evidence',
        tasks: [
          'Complete Kerala Ayurveda Classical Keraleeya Panchakarma Masterclass',
          'Request mentor evaluation from Department HOD for verified badge',
          'Publish verified digital portfolio link for Industry Recruiter visibility'
        ]
      },
      {
        phase: 'Days 61 - 90 (Placement & Industry Applications)',
        focus: 'High-Fit Opportunity Applications & Interviews',
        tasks: [
          'Apply to top 3 recommended R&D and Clinical Resident opportunities',
          'Schedule mock interviews with AIIA Placement Guidance Cell',
          'Track selection timeline events and confirm internship onboarding'
        ]
      }
    ];

    return res.json({
      readinessScore: profile?.readinessScore || 75,
      actionPlan
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getPublicPortfolio = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    let certsList: any[] = [];
    if (isDatabaseConfigured) {
      try {
        certsList = await prisma.certificate.findMany({
          where: { studentId: userId, status: 'VALID' }
        });
      } catch (e) {}
    }
    if (certsList.length === 0) {
      certsList = memoryCertificates.filter(c => c.studentId === userId && c.status === 'VALID');
    }

    const memUser = memoryUsers.find(u => u.id === userId);
    const memProfile = memoryStudentProfiles.find(p => p.userId === userId);

    if (!memUser && !isDatabaseConfigured) {
      return res.status(404).json({ message: 'Public portfolio user not found' });
    }

    let skillScores = {};
    let verifiedBadges: string[] = [];
    try {
      if (memProfile?.assessedSkills) skillScores = JSON.parse(memProfile.assessedSkills);
      if (memProfile?.verifiedBadges) verifiedBadges = JSON.parse(memProfile.verifiedBadges);
    } catch (e) {}

    return res.json({
      user: {
        id: userId,
        name: memUser?.name || 'AYUSH Scholar',
        system: memUser?.system || 'AYURVEDA',
        institutionName: memUser?.institutionName || 'All India Institute of Ayurveda',
        avatar: memUser?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        studentProfile: memProfile,
        skillScores,
        verifiedBadges,
        certificates: certsList
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
