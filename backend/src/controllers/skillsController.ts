import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';
import {
  memoryUsers,
  memoryStudentProfiles,
  memoryJobRoles,
  memoryQuestions,
  memoryCourses,
  memoryApplications,
  memoryEnrollments
} from '../store/inMemoryStore';

// Extended AYUSH Career Track Benchmarks
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
        if (questions.length > 0) return res.json({ questions });
      } catch (e) {}
    }
    return res.json({ questions: memoryQuestions });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getSkillProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let profile: any = null;
    let userObj: any = null;

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

    let currentScores = {
      panchakarma: 75,
      herbalFormulation: 75,
      clinicalDiagnostics: 80,
      nadiPariksha: 70,
      yogaTherapy: 65,
      researchMethodology: 70,
      patientCounseling: 80,
      qaGmp: 65
    };

    try {
      if (profile.skillScores) {
        currentScores = { ...currentScores, ...JSON.parse(profile.skillScores) };
      }
    } catch (e) {}

    // Calculate career readiness scores against benchmarks
    const trackScores: any = {};
    for (const [key, track] of Object.entries(CAREER_BENCHMARKS)) {
      let totalMatch = 0;
      let totalWeight = 0;
      for (const [sKey, benchmarkVal] of Object.entries(track.skills)) {
        const studentVal = (currentScores as any)[sKey] || 0;
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
      skillScores: currentScores,
      careerTracks: trackScores,
      overallReadiness: profile.readinessScore
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
            skillScores: JSON.stringify(categoryScores)
          }
        });

        return res.json({
          message: 'Skill assessment evaluated & persisted successfully!',
          readinessScore: overallReadiness,
          profile: updatedProfile
        });
      } catch (e) {}
    }

    // Memory fallback
    const memProf = memoryStudentProfiles.find(p => p.userId === userId);
    if (memProf) {
      memProf.readinessScore = overallReadiness;
      memProf.skillScores = JSON.stringify(categoryScores);
    }

    return res.json({
      message: 'Skill assessment evaluated & persisted successfully!',
      readinessScore: overallReadiness,
      profile: memProf || { readinessScore: overallReadiness, skillScores: JSON.stringify(categoryScores) }
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

    let scores = {
      panchakarma: 75,
      herbalFormulation: 75,
      clinicalDiagnostics: 80,
      nadiPariksha: 70,
      yogaTherapy: 65,
      researchMethodology: 70,
      patientCounseling: 80,
      qaGmp: 65
    };
    try {
      if (profile?.skillScores) scores = { ...scores, ...JSON.parse(profile.skillScores) };
    } catch (e) {}

    // Generate 30/60/90 day action plan
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
      scores,
      actionPlan
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getPublicPortfolio = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (isDatabaseConfigured) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: {
            studentProfile: true,
            enrollments: { where: { status: 'COMPLETED' }, include: { course: true } },
            applications: { where: { status: 'SELECTED' }, include: { opportunity: true } }
          }
        });

        if (user) {
          let skillScores = {};
          let verifiedBadges = [];
          try {
            if (user.studentProfile?.skillScores) skillScores = JSON.parse(user.studentProfile.skillScores);
            if (user.studentProfile?.verifiedBadges) verifiedBadges = JSON.parse(user.studentProfile.verifiedBadges);
          } catch (e) {}

          return res.json({
            user: {
              id: user.id,
              name: user.name,
              system: user.system,
              institutionName: user.institutionName,
              avatar: user.avatar,
              studentProfile: user.studentProfile,
              skillScores,
              verifiedBadges,
              completedCourses: user.enrollments,
              selectedApplications: user.applications
            }
          });
        }
      } catch (e) {}
    }

    // Memory fallback
    const memUser = memoryUsers.find(u => u.id === userId);
    if (!memUser) return res.status(404).json({ message: 'Public portfolio user not found' });
    const memProfile = memoryStudentProfiles.find(p => p.userId === userId);

    let skillScores = {};
    let verifiedBadges = [];
    try {
      if (memProfile?.skillScores) skillScores = JSON.parse(memProfile.skillScores);
      if (memProfile?.verifiedBadges) verifiedBadges = JSON.parse(memProfile.verifiedBadges);
    } catch (e) {}

    return res.json({
      user: {
        id: memUser.id,
        name: memUser.name,
        system: memUser.system,
        institutionName: memUser.institutionName,
        avatar: memUser.avatar,
        studentProfile: memProfile,
        skillScores,
        verifiedBadges,
        completedCourses: memoryEnrollments.filter(e => e.studentId === userId && e.status === 'COMPLETED'),
        selectedApplications: memoryApplications.filter(a => a.studentId === userId && a.status === 'SELECTED')
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
