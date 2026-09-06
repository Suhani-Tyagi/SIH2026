import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Career track benchmarks
const CAREER_BENCHMARKS = {
  clinicalPractitioner: {
    name: 'Clinical Practitioner',
    skills: { panchakarma: 85, clinicalDiagnostics: 90, nadiPariksha: 85, patientCounseling: 85, herbalFormulation: 75, researchMethodology: 60, qaGmp: 50, yogaTherapy: 60 }
  },
  pharmaQaGmp: {
    name: 'AYUSH Pharma / QA Specialist',
    skills: { herbalFormulation: 90, qaGmp: 90, researchMethodology: 80, clinicalDiagnostics: 60, panchakarma: 40, nadiPariksha: 40, patientCounseling: 60, yogaTherapy: 30 }
  },
  panchakarmaWellness: {
    name: 'Wellness & Panchakarma Specialist',
    skills: { panchakarma: 95, nadiPariksha: 85, patientCounseling: 90, yogaTherapy: 75, clinicalDiagnostics: 80, herbalFormulation: 70, researchMethodology: 50, qaGmp: 40 }
  },
  yogaConsultant: {
    name: 'Yoga & Naturopathy Consultant',
    skills: { yogaTherapy: 95, patientCounseling: 90, clinicalDiagnostics: 75, researchMethodology: 70, panchakarma: 60, nadiPariksha: 50, herbalFormulation: 40, qaGmp: 30 }
  },
  researchAcademia: {
    name: 'AYUSH Research & Academia',
    skills: { researchMethodology: 95, herbalFormulation: 85, clinicalDiagnostics: 85, qaGmp: 80, patientCounseling: 75, panchakarma: 65, nadiPariksha: 65, yogaTherapy: 65 }
  }
};

export const getSkillProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

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

    // Calculate career readiness scores
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
      ((categoryScores.panchakarma || 70) +
        (categoryScores.herbalFormulation || 70) +
        (categoryScores.clinicalDiagnostics || 75) +
        (categoryScores.nadiPariksha || 70)) / 4
    );

    const softSkillScore = Math.round(
      ((categoryScores.patientCounseling || 80) +
        (categoryScores.researchMethodology || 70) +
        (categoryScores.yogaTherapy || 65) +
        (categoryScores.qaGmp || 65)) / 4
    );

    const overallReadiness = Math.round((technicalScore * 0.6) + (softSkillScore * 0.4));

    // Save assessment record
    await prisma.skillAssessment.create({
      data: {
        studentId: userId,
        technicalScore,
        softSkillScore,
        answers: JSON.stringify(answers || {})
      }
    });

    // Update profile
    const updatedProfile = await prisma.studentProfile.update({
      where: { userId },
      data: {
        readinessScore: overallReadiness,
        skillScores: JSON.stringify(categoryScores)
      }
    });

    return res.json({
      message: 'Skill assessment completed successfully!',
      readinessScore: overallReadiness,
      profile: updatedProfile
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Public read-only portfolio endpoint
export const getPublicPortfolio = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        enrollments: {
          where: { status: 'COMPLETED' },
          include: { course: true }
        },
        applications: {
          where: { status: 'SELECTED' },
          include: { opportunity: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Public portfolio user not found' });
    }

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
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
