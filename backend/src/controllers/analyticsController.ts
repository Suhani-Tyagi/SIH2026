import { Request, Response } from 'express';
import prisma, { isDatabaseConfigured } from '../prisma';
import {
  memoryUsers,
  memoryStudentProfiles,
  memoryOpportunities,
  memoryApplications
} from '../store/inMemoryStore';

export const getInstitutionAnalytics = async (req: Request, res: Response) => {
  try {
    const { institutionName, discipline, batch, atRiskOnly } = req.query;
    const targetInstitution = institutionName ? String(institutionName) : 'All India Institute of Ayurveda';

    let totalStudents = 15;
    let totalApplications = 5;
    let placedStudents = 2;
    let activeIndustryPartners = 8;
    let avgScoreVal = 85;
    let studentProfiles: any[] = memoryStudentProfiles;

    if (isDatabaseConfigured) {
      try {
        totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
        totalApplications = await prisma.application.count();
        placedStudents = await prisma.application.count({ where: { status: 'SELECTED' } });
        activeIndustryPartners = await prisma.user.count({ where: { role: 'INDUSTRY' } });

        const avgReadiness = await prisma.studentProfile.aggregate({ _avg: { readinessScore: true } });
        avgScoreVal = Math.round(avgReadiness._avg.readinessScore || 85);
        studentProfiles = await prisma.studentProfile.findMany({ include: { user: true } });
      } catch (e) {}
    }

    // Filter student roster by institution data isolation
    let roster = studentProfiles.map(p => {
      const user = memoryUsers.find(u => u.id === p.userId) || p.user;
      let certCount = 0;
      try {
        if (p.verifiedBadges) {
          const b = typeof p.verifiedBadges === 'string' ? JSON.parse(p.verifiedBadges) : p.verifiedBadges;
          certCount = b.length;
        }
      } catch (e) {}

      const isAtRisk = (p.readinessScore || 75) < 70 || certCount === 0;

      return {
        userId: p.userId,
        studentName: user?.name || 'AYUSH Student',
        email: user?.email || '',
        institutionName: (p as any).institutionName || user?.institutionName || targetInstitution,
        system: (p as any).system || user?.system || 'AYURVEDA',
        degree: p.degree || 'BAMS',
        discipline: p.degree || 'Kayachikitsa & Panchakarma',
        passoutYear: p.passoutYear || 2025,
        readinessScore: p.readinessScore || 75,
        verifiedCertificatesCount: certCount,
        isAtRisk,
        atRiskReason: isAtRisk ? ((p.readinessScore || 75) < 70 ? 'Skill Readiness Score < 70' : '0 Industry Certificates Completed') : null
      };
    });


    // Apply Filters
    if (targetInstitution && targetInstitution !== 'ALL') {
      roster = roster.filter(r => r.institutionName.toLowerCase().includes(targetInstitution.toLowerCase()));
    }
    if (discipline && discipline !== 'ALL') {
      roster = roster.filter(r => r.degree === discipline || r.discipline.includes(String(discipline)));
    }
    if (batch && batch !== 'ALL') {
      roster = roster.filter(r => r.passoutYear === parseInt(String(batch), 10));
    }
    if (atRiskOnly === 'true') {
      roster = roster.filter(r => r.isAtRisk);
    }

    let panchakarmaSum = 0, herbalSum = 0, diagSum = 0, nadiSum = 0, researchSum = 0, qaSum = 0;
    let profileCount = studentProfiles.length || 1;

    studentProfiles.forEach((p) => {
      try {
        if (p.skillScores) {
          const s = typeof p.skillScores === 'string' ? JSON.parse(p.skillScores) : p.skillScores;
          panchakarmaSum += s.panchakarma || 70;
          herbalSum += s.herbalFormulation || 70;
          diagSum += s.clinicalDiagnostics || 75;
          nadiSum += s.nadiPariksha || 65;
          researchSum += s.researchMethodology || 65;
          qaSum += s.qaGmp || 60;
        }
      } catch (e) {}
    });

    const skillGaps = [
      { skill: 'Panchakarma Techniques', benchmark: 90, currentAvg: Math.round(panchakarmaSum / profileCount), gap: 90 - Math.round(panchakarmaSum / profileCount) },
      { skill: 'Herbal Formulation & GMP', benchmark: 85, currentAvg: Math.round(herbalSum / profileCount), gap: 85 - Math.round(herbalSum / profileCount) },
      { skill: 'Clinical Diagnostics', benchmark: 90, currentAvg: Math.round(diagSum / profileCount), gap: 90 - Math.round(diagSum / profileCount) },
      { skill: 'Nadi Pariksha Tactile', benchmark: 85, currentAvg: Math.round(nadiSum / profileCount), gap: 85 - Math.round(nadiSum / profileCount) },
      { skill: 'Research Methodology', benchmark: 80, currentAvg: Math.round(researchSum / profileCount), gap: 80 - Math.round(researchSum / profileCount) },
      { skill: 'AYUSH Export & QA', benchmark: 85, currentAvg: Math.round(qaSum / profileCount), gap: 85 - Math.round(qaSum / profileCount) }
    ];

    const ayushSystems = ['AYURVEDA', 'YOGA', 'UNANI', 'SIDDHA', 'HOMEOPATHY'];
    const placementBySystem = ayushSystems.map((sys) => {
      const sysStudents = memoryUsers.filter(u => u.role === 'STUDENT' && u.system === sys).length;
      const sysPlaced = memoryApplications.filter(a => a.status === 'SELECTED').length;
      const rate = sysStudents > 0 ? Math.round((sysPlaced / sysStudents) * 100) : 85;
      return {
        system: sys,
        placementRate: rate > 0 ? rate : 85,
        activeStudents: sysStudents || 3
      };
    });

    const topDeficientSkills = [
      { skill: 'Industrial GMP Compliance & Schedule T', severity: 'High', studentsAffected: `${Math.round(100 - (qaSum / profileCount))}%` },
      { skill: 'HPTLC Phytochemistry Extraction', severity: 'High', studentsAffected: `${Math.round(100 - (herbalSum / profileCount))}%` },
      { skill: 'Research Methodology & GCP Protocols', severity: 'Medium', studentsAffected: `${Math.round(100 - (researchSum / profileCount))}%` },
      { skill: 'Nadi Pariksha Practical Mastery', severity: 'Medium', studentsAffected: `${Math.round(100 - (nadiSum / profileCount))}%` }
    ];

    return res.json({
      institutionName: targetInstitution,
      metrics: {
        totalStudents: roster.length || totalStudents,
        totalApplications,
        placedStudents,
        placementRatePercent: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 85,
        activeIndustryPartners,
        avgSkillReadinessScore: avgScoreVal,
        atRiskStudentsCount: roster.filter(r => r.isAtRisk).length
      },
      roster,
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
    let totalStudents = memoryUsers.filter(u => u.role === 'STUDENT').length;
    let totalIndustry = memoryUsers.filter(u => u.role === 'INDUSTRY').length;
    let totalAcademicians = memoryUsers.filter(u => u.role === 'ACADEMICIAN').length;
    let totalInstitutions = memoryUsers.filter(u => u.role === 'INSTITUTION_ADMIN').length;
    let totalOpportunities = memoryOpportunities.length;
    let totalApplications = memoryApplications.length;
    let placementsFacilitated = memoryApplications.filter(a => a.status === 'SELECTED').length;

    if (isDatabaseConfigured) {
      try {
        totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
        totalIndustry = await prisma.user.count({ where: { role: 'INDUSTRY' } });
        totalAcademicians = await prisma.user.count({ where: { role: 'ACADEMICIAN' } });
        totalInstitutions = await prisma.user.count({ where: { role: 'INSTITUTION_ADMIN' } });
        totalOpportunities = await prisma.opportunity.count();
        totalApplications = await prisma.application.count();
        placementsFacilitated = await prisma.application.count({ where: { status: 'SELECTED' } });
      } catch (e) {}
    }

    const regionalDistribution = [
      { region: 'North India (Delhi, UP, UK)', students: Math.round(totalStudents * 0.4), industryPartners: Math.round(totalIndustry * 0.35) },
      { region: 'South India (Kerala, TN, KA)', students: Math.round(totalStudents * 0.35), industryPartners: Math.round(totalIndustry * 0.4) },
      { region: 'West India (Gujarat, MH)', students: Math.round(totalStudents * 0.15), industryPartners: Math.round(totalIndustry * 0.15) },
      { region: 'East & NE (WB, Assam)', students: Math.round(totalStudents * 0.1), industryPartners: Math.round(totalIndustry * 0.1) }
    ];

    const industryDemandVsSupply = [
      { skill: 'Panchakarma Clinical Operations', industryDemand: 95, studentSupply: 72 },
      { skill: 'Phytochemistry & Herbal QA/QC', industryDemand: 92, studentSupply: 58 },
      { skill: 'AYUSH Export Regulatory Affairs', industryDemand: 88, studentSupply: 42 },
      { skill: 'Yoga Therapy for Metabolic Diseases', industryDemand: 90, studentSupply: 85 },
      { skill: 'Clinical Research & GCP Protocols', industryDemand: 86, studentSupply: 64 }
    ];

    const pendingApprovals = [
      { id: '1', name: 'Baidyanath Research Labs', type: 'INDUSTRY', system: 'AYURVEDA', registeredAt: new Date().toISOString().split('T')[0] },
      { id: '2', name: 'Government Ayurveda College Thiruvananthapuram', type: 'INSTITUTION', system: 'AYURVEDA', registeredAt: new Date().toISOString().split('T')[0] }
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
        placementsFacilitated,
        nationalPlacementRate: totalStudents > 0 ? `${Math.round((placementsFacilitated / totalStudents) * 100)}%` : '85%'
      },
      regionalDistribution,
      industryDemandVsSupply,
      pendingApprovals
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const exportAnalyticsCSV = async (req: Request, res: Response) => {
  try {
    const profiles = memoryStudentProfiles;
    const csvHeader = 'Candidate ID,Student Name,Email,Institution,System,Degree,Passout Year,Readiness Score,Verified Certs Count,At Risk Flag,At Risk Reason';
    const csvRows = profiles.map(p => {
      const u = memoryUsers.find(usr => usr.id === p.userId);
      let certCount = 0;
      try {
        if (p.verifiedBadges) certCount = (typeof p.verifiedBadges === 'string' ? JSON.parse(p.verifiedBadges) : p.verifiedBadges).length;
      } catch (e) {}
      const isAtRisk = (p.readinessScore || 75) < 70 || certCount === 0;
      const reason = isAtRisk ? ((p.readinessScore || 75) < 70 ? 'Skill Score < 70' : '0 Certificates') : 'None';
      return `"${p.userId}","${u?.name || 'Candidate'}","${u?.email || ''}","${(p as any).institutionName || u?.institutionName || 'AIIA'}","${(p as any).system || u?.system || 'AYURVEDA'}","${p.degree || 'BAMS'}",${p.passoutYear || 2025},${p.readinessScore || 75},${certCount},"${isAtRisk ? 'YES' : 'NO'}","${reason}"`;
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="AYUSH_Setu_Institution_Roster_Report.csv"');
    return res.status(200).send(csvContent);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};


