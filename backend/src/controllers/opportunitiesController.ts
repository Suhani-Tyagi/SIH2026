import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

export const getOpportunities = async (req: AuthRequest, res: Response) => {
  try {
    const { type, system, search, mode } = req.query;

    const where: any = { active: true };

    if (type && type !== 'ALL') {
      where.type = type;
    }
    if (system && system !== 'ALL') {
      where.system = system;
    }
    if (mode && mode !== 'ALL') {
      where.mode = mode;
    }
    if (search) {
      where.OR = [
        { title: { contains: String(search) } },
        { companyName: { contains: String(search) } },
        { description: { contains: String(search) } }
      ];
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // If user is a student, compute match percentage for each opportunity
    let studentSkills: any = {
      panchakarma: 75,
      herbalFormulation: 75,
      clinicalDiagnostics: 80,
      nadiPariksha: 70,
      yogaTherapy: 65,
      researchMethodology: 70,
      patientCounseling: 80,
      qaGmp: 65
    };

    if (req.user && req.user.role === 'STUDENT') {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: req.user.id }
      });
      if (profile && profile.skillScores) {
        try {
          studentSkills = { ...studentSkills, ...JSON.parse(profile.skillScores) };
        } catch (e) {}
      }
    }

    const oppsWithMatch = opportunities.map((opp) => {
      let requiredSkillsList: string[] = [];
      try {
        requiredSkillsList = JSON.parse(opp.skillsRequired);
      } catch (e) {}

      // Calculate rule-based match score
      let matchScore = 75; // baseline
      const matchReasons: string[] = [];

      if (requiredSkillsList.length > 0) {
        let scoreSum = 0;
        requiredSkillsList.forEach((reqSkill) => {
          const lower = reqSkill.toLowerCase();
          if (lower.includes('panchakarma') && studentSkills.panchakarma > 70) {
            scoreSum += studentSkills.panchakarma;
            matchReasons.push(`High Panchakarma score (${studentSkills.panchakarma}%)`);
          } else if (lower.includes('herbal') && studentSkills.herbalFormulation > 70) {
            scoreSum += studentSkills.herbalFormulation;
            matchReasons.push(`Strong Herbal Formulation capability (${studentSkills.herbalFormulation}%)`);
          } else if (lower.includes('diagnostic') && studentSkills.clinicalDiagnostics > 70) {
            scoreSum += studentSkills.clinicalDiagnostics;
            matchReasons.push(`Excellent Clinical Diagnostics (${studentSkills.clinicalDiagnostics}%)`);
          } else if (lower.includes('yoga') && studentSkills.yogaTherapy > 70) {
            scoreSum += studentSkills.yogaTherapy;
            matchReasons.push(`Yoga Therapy expertise (${studentSkills.yogaTherapy}%)`);
          } else if (lower.includes('research') && studentSkills.researchMethodology > 70) {
            scoreSum += studentSkills.researchMethodology;
            matchReasons.push(`Solid Research Methodology grounding (${studentSkills.researchMethodology}%)`);
          } else if (lower.includes('qa') || lower.includes('gmp') && studentSkills.qaGmp > 70) {
            scoreSum += studentSkills.qaGmp;
            matchReasons.push(`Industrial QA/GMP proficiency (${studentSkills.qaGmp}%)`);
          } else {
            scoreSum += 75;
          }
        });
        matchScore = Math.min(98, Math.max(65, Math.round(scoreSum / requiredSkillsList.length)));
      }

      return {
        ...opp,
        skillsRequiredList: requiredSkillsList,
        matchScore,
        matchReason: matchReasons.length > 0
          ? `Recommended because you matched: ${matchReasons.join(', ')}.`
          : `Recommended based on your overall AYUSH readiness profile.`
      };
    });

    return res.json({ opportunities: oppsWithMatch });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getOpportunityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    let skillsRequiredList: string[] = [];
    try {
      skillsRequiredList = JSON.parse(opportunity.skillsRequired);
    } catch (e) {}

    return res.json({ opportunity: { ...opportunity, skillsRequiredList } });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'INDUSTRY') {
      return res.status(403).json({ message: 'Only Industry Partners can post opportunities' });
    }

    const { title, type, system, skillsRequired, stipend, location, mode, duration, description } = req.body;

    const opportunity = await prisma.opportunity.create({
      data: {
        title,
        type: type || 'INTERNSHIP',
        system: system || 'AYURVEDA',
        companyId: userId,
        companyName: user.companyName || user.name,
        skillsRequired: typeof skillsRequired === 'string' ? skillsRequired : JSON.stringify(skillsRequired || []),
        stipend: stipend || 'Stipend Negotiable',
        location: location || 'Multiple Locations',
        mode: mode || 'ONSITE',
        duration: duration || '3 Months',
        description
      }
    });

    return res.json({ message: 'Opportunity posted successfully', opportunity });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
