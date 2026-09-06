import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';
import { calculateMatchScore } from '../services/matchingService';
import { memoryOpportunities, memoryUsers, memoryStudentProfiles, MemoryOpportunity } from '../store/inMemoryStore';

export const getOpportunities = async (req: AuthRequest, res: Response) => {
  try {
    const { type, system, search, mode } = req.query;

    let oppList: any[] = [];
    if (isDatabaseConfigured) {
      try {
        const where: any = { active: true };
        if (type && type !== 'ALL') where.type = type;
        if (system && system !== 'ALL') where.system = system;
        if (mode && mode !== 'ALL') where.mode = mode;
        if (search) {
          where.OR = [
            { title: { contains: String(search) } },
            { companyName: { contains: String(search) } },
            { description: { contains: String(search) } }
          ];
        }
        oppList = await prisma.opportunity.findMany({ where, orderBy: { createdAt: 'desc' } });
      } catch (e) {}
    }

    if (oppList.length === 0) {
      oppList = memoryOpportunities.filter(opp => {
        if (type && type !== 'ALL' && opp.type !== type) return false;
        if (system && system !== 'ALL' && opp.system !== system) return false;
        if (mode && mode !== 'ALL' && opp.mode !== mode) return false;
        if (search) {
          const q = String(search).toLowerCase();
          return opp.title.toLowerCase().includes(q) || opp.companyName.toLowerCase().includes(q) || opp.description.toLowerCase().includes(q);
        }
        return true;
      });
    }

    // Fetch candidate profile if authenticated student
    let candidateData: any = null;
    if (req.user && req.user.role === 'STUDENT') {
      if (isDatabaseConfigured) {
        try {
          const dbProf = await prisma.studentProfile.findUnique({
            where: { userId: req.user.id }
          });
          if (dbProf) candidateData = dbProf;
        } catch (e) {}
      }
      if (!candidateData) {
        candidateData = memoryStudentProfiles.find(p => p.userId === req.user?.id);
      }
    }

    // Process every opportunity with the explainable matching engine
    const oppsWithMatch = oppList.map((opp) => {
      let requiredSkillsList: string[] = [];
      try {
        requiredSkillsList = typeof opp.skillsRequired === 'string' ? JSON.parse(opp.skillsRequired) : opp.skillsRequired;
      } catch (e) {}

      let matchResult: any = {
        totalMatchScore: 82,
        isEligible: true,
        summaryReason: 'Recommended based on strong overall AYUSH readiness profile.',
        breakdown: { skillFitScore: 80, eligibilityScore: 100, careerAlignmentScore: 80, locationModeScore: 85, evidenceScore: 70, employerRecencyScore: 90 }
      };

      if (candidateData) {
        let candidateSkills = {};
        let candidateBadges = [];
        try {
          if (candidateData.skillScores) candidateSkills = typeof candidateData.skillScores === 'string' ? JSON.parse(candidateData.skillScores) : candidateData.skillScores;
          if (candidateData.verifiedBadges) candidateBadges = typeof candidateData.verifiedBadges === 'string' ? JSON.parse(candidateData.verifiedBadges) : candidateData.verifiedBadges;
        } catch (e) {}

        matchResult = calculateMatchScore({
          candidateDegree: candidateData.degree || 'BAMS',
          candidatePassoutYear: candidateData.passoutYear || 2025,
          candidateLocation: candidateData.location || 'New Delhi',
          candidateSkills,
          candidateBadges,
          targetRoleTitle: 'Herbal Formulation Scientist',
          opportunityTitle: opp.title,
          opportunityRequiredSkills: requiredSkillsList,
          opportunityLocation: opp.location,
          opportunityMode: opp.mode,
          minDegree: opp.minDegree || 'BAMS',
          eligibleBatch: opp.eligibleBatch || 2025
        });
      }

      return {
        ...opp,
        skillsRequiredList: requiredSkillsList,
        matchScore: matchResult.totalMatchScore,
        matchReason: matchResult.summaryReason,
        matchBreakdown: matchResult.breakdown,
        isEligible: matchResult.isEligible
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
    let opportunity: any = null;

    if (isDatabaseConfigured) {
      try {
        opportunity = await prisma.opportunity.findUnique({ where: { id }, include: { company: true } });
      } catch (e) {}
    }

    if (!opportunity) {
      const memOpp = memoryOpportunities.find(o => o.id === id);
      if (memOpp) {
        const memComp = memoryUsers.find(u => u.id === memOpp.companyId);
        opportunity = { ...memOpp, company: memComp };
      }
    }

    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    let skillsRequiredList: string[] = [];
    try {
      skillsRequiredList = typeof opportunity.skillsRequired === 'string' ? JSON.parse(opportunity.skillsRequired) : opportunity.skillsRequired;
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

    let companyUser: any = null;
    if (isDatabaseConfigured) {
      try {
        companyUser = await prisma.user.findUnique({ where: { id: userId } });
      } catch (e) {}
    }
    if (!companyUser) {
      companyUser = memoryUsers.find(u => u.id === userId);
    }

    if (!companyUser || companyUser.role !== 'INDUSTRY') {
      return res.status(403).json({ message: 'Only Industry Partners can post opportunities' });
    }

    const { title, type, system, skillsRequired, stipend, location, mode, duration, description } = req.body;

    const oppData = {
      title,
      type: type || 'INTERNSHIP',
      system: system || 'AYURVEDA',
      companyId: userId,
      companyName: companyUser.companyName || companyUser.name,
      skillsRequired: typeof skillsRequired === 'string' ? skillsRequired : JSON.stringify(skillsRequired || []),
      stipend: stipend || 'Stipend Negotiable',
      location: location || 'Multiple Locations',
      mode: mode || 'ONSITE',
      duration: duration || '3 Months',
      description
    };

    if (isDatabaseConfigured) {
      try {
        const opp = await prisma.opportunity.create({ data: oppData });
        return res.json({ message: 'Opportunity posted successfully', opportunity: opp });
      } catch (e) {}
    }

    const newMemOpp: MemoryOpportunity = {
      id: `opp-mem-${Date.now()}`,
      ...oppData,
      createdAt: new Date()
    };
    memoryOpportunities.push(newMemOpp);

    return res.json({ message: 'Opportunity posted successfully', opportunity: newMemOpp });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
