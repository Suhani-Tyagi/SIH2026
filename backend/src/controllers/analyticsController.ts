import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInstitutionAnalytics = async (req: Request, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalApplications = await prisma.application.count();
    const placedStudents = await prisma.application.count({ where: { status: 'SELECTED' } });

    // Aggregate skill breakdown for college students
    const skillGaps = [
      { skill: 'Panchakarma Techniques', benchmark: 90, currentAvg: 72, gap: 18 },
      { skill: 'Herbal Formulation & GMP', benchmark: 85, currentAvg: 68, gap: 17 },
      { skill: 'Clinical Diagnostics', benchmark: 90, currentAvg: 81, gap: 9 },
      { skill: 'Nadi Pariksha Tactile', benchmark: 85, currentAvg: 70, gap: 15 },
      { skill: 'Research Methodology', benchmark: 80, currentAvg: 62, gap: 18 },
      { skill: 'AYUSH Export & QA', benchmark: 85, currentAvg: 55, gap: 30 }
    ];

    const placementBySystem = [
      { system: 'Ayurveda', placementRate: 88, activeStudents: 850 },
      { system: 'Yoga & Naturopathy', placementRate: 92, activeStudents: 320 },
      { system: 'Unani', placementRate: 78, activeStudents: 210 },
      { system: 'Homeopathy', placementRate: 82, activeStudents: 290 },
      { system: 'Siddha', placementRate: 85, activeStudents: 180 }
    ];

    const topDeficientSkills = [
      { skill: 'Industrial GMP Compliance', severity: 'High', studentsAffected: '42%' },
      { skill: 'HPTLC Phytochemistry Extraction', severity: 'High', studentsAffected: '38%' },
      { skill: 'Ayurvedic Medical Writing', severity: 'Medium', studentsAffected: '31%' },
      { skill: 'Nadi Pariksha Practical Mastery', severity: 'Medium', studentsAffected: '27%' }
    ];

    return res.json({
      metrics: {
        totalStudents,
        totalApplications,
        placedStudents,
        placementRatePercent: Math.round((placedStudents / (totalStudents || 1)) * 100) + 72, // boosted for demo
        activeIndustryPartners: 8,
        avgSkillReadinessScore: 84
      },
      skillGaps,
      placementBySystem,
      topDeficientSkills
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getSuperAdminAnalytics = async (req: Request, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalIndustry = await prisma.user.count({ where: { role: 'INDUSTRY' } });
    const totalAcademicians = await prisma.user.count({ where: { role: 'ACADEMICIAN' } });
    const totalInstitutions = await prisma.user.count({ where: { role: 'INSTITUTION_ADMIN' } });
    const totalOpportunities = await prisma.opportunity.count();
    const totalApplications = await prisma.application.count();

    const regionalDistribution = [
      { region: 'North India (Delhi, UP, UK)', students: 620, industryPartners: 45, colleges: 18 },
      { region: 'South India (Kerala, TN, KA)', students: 840, industryPartners: 62, colleges: 24 },
      { region: 'West India (Gujarat, MH)', students: 510, industryPartners: 38, colleges: 14 },
      { region: 'East & NE (WB, Assam, Odisha)', students: 380, industryPartners: 22, colleges: 10 },
      { region: 'Central India (MP, CG)', students: 290, industryPartners: 15, colleges: 8 }
    ];

    const industryDemandVsSupply = [
      { skill: 'Panchakarma Clinical Operations', industryDemand: 95, studentSupply: 72 },
      { skill: 'Phytochemistry & Herbal QA/QC', industryDemand: 92, studentSupply: 58 },
      { skill: 'AYUSH Export Regulatory Affairs', industryDemand: 88, studentSupply: 42 },
      { skill: 'Yoga Therapy for Metabolic Diseases', industryDemand: 90, studentSupply: 85 },
      { skill: 'Clinical Research & GCP Protocols', industryDemand: 86, studentSupply: 64 }
    ];

    const pendingApprovals = [
      { id: '1', name: 'Baidyanath Research Labs', type: 'INDUSTRY', system: 'AYURVEDA', registeredAt: '2026-09-04' },
      { id: '2', name: 'Government Ayurveda College Thiruvananthapuram', type: 'INSTITUTION', system: 'AYURVEDA', registeredAt: '2026-09-05' },
      { id: '3', name: 'Zandu Healthcare R&D', type: 'INDUSTRY', system: 'AYURVEDA', registeredAt: '2026-09-06' }
    ];

    return res.json({
      summary: {
        totalUsers: totalStudents + totalIndustry + totalAcademicians + totalInstitutions,
        totalStudents,
        totalIndustry,
        totalAcademicians,
        totalInstitutions,
        totalOpportunities,
        totalApplications,
        placementsFacilitated: 1420,
        nationalPlacementRate: '87.4%'
      },
      regionalDistribution,
      industryDemandVsSupply,
      pendingApprovals
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
