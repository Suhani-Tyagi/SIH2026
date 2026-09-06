import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';
import { calculateMatchScore } from '../services/matchingService';
import {
  memoryApplications,
  memoryOpportunities,
  memoryUsers,
  memoryStudentProfiles,
  memoryTimelineEvents,
  MemoryApplication,
  MemoryTimelineEvent
} from '../store/inMemoryStore';

export const applyToOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const { opportunityId, coverLetter, answers } = req.body;

    let oppObj: any = null;
    let studentProf: any = null;

    if (isDatabaseConfigured) {
      try {
        oppObj = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
        studentProf = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
      } catch (e) {}
    }

    if (!oppObj) oppObj = memoryOpportunities.find(o => o.id === opportunityId);
    if (!studentProf) studentProf = memoryStudentProfiles.find(p => p.userId === studentId);

    if (!oppObj) return res.status(404).json({ message: 'Target opportunity not found' });

    // Calculate server-side match score & snapshot
    let reqSkills: string[] = [];
    try {
      reqSkills = typeof oppObj.skillsRequired === 'string' ? JSON.parse(oppObj.skillsRequired) : oppObj.skillsRequired;
    } catch (e) {}

    let candSkills = {};
    let candBadges = [];
    try {
      if (studentProf?.skillScores) candSkills = typeof studentProf.skillScores === 'string' ? JSON.parse(studentProf.skillScores) : studentProf.skillScores;
      if (studentProf?.verifiedBadges) candBadges = typeof studentProf.verifiedBadges === 'string' ? JSON.parse(studentProf.verifiedBadges) : studentProf.verifiedBadges;
    } catch (e) {}

    const matchEval = calculateMatchScore({
      candidateDegree: studentProf?.degree || 'BAMS',
      candidatePassoutYear: studentProf?.passoutYear || 2025,
      candidateLocation: studentProf?.location || 'New Delhi',
      candidateSkills: candSkills,
      candidateBadges: candBadges,
      targetRoleTitle: 'Herbal Formulation Scientist',
      opportunityTitle: oppObj.title,
      opportunityRequiredSkills: reqSkills,
      opportunityLocation: oppObj.location,
      opportunityMode: oppObj.mode,
      minDegree: oppObj.minDegree || 'BAMS',
      eligibleBatch: oppObj.eligibleBatch || 2025
    });

    if (isDatabaseConfigured) {
      try {
        const existing = await prisma.application.findFirst({
          where: { opportunityId, studentId }
        });
        if (existing) {
          return res.status(400).json({ message: 'You have already applied for this opportunity' });
        }

        const app = await prisma.application.create({
          data: {
            opportunityId,
            studentId,
            coverLetter,
            answers: JSON.stringify(answers || {}),
            matchScore: matchEval.totalMatchScore,
            matchSnapshot: JSON.stringify(matchEval),
            status: 'APPLIED'
          },
          include: { opportunity: true }
        });

        await prisma.timelineEvent.create({
          data: {
            applicationId: app.id,
            actorName: req.user?.name || 'Student Candidate',
            actorRole: 'STUDENT',
            stage: 'APPLIED',
            note: `Candidate submitted application with ${matchEval.totalMatchScore}% verified server match score.`
          }
        });

        await prisma.notification.create({
          data: {
            userId: oppObj.companyId,
            title: 'New Applicant Received 📥',
            message: `${req.user?.name || 'Candidate'} applied for "${oppObj.title}" (Match Score: ${matchEval.totalMatchScore}%).`,
            type: 'INFO'
          }
        });

        return res.json({ message: 'Application submitted successfully!', application: app });
      } catch (e) {}
    }

    // Memory Fallback
    const existingMem = memoryApplications.find(a => a.opportunityId === opportunityId && a.studentId === studentId);
    if (existingMem) {
      return res.status(400).json({ message: 'You have already applied for this opportunity' });
    }

    const newApp: MemoryApplication = {
      id: `app-mem-${Date.now()}`,
      opportunityId,
      studentId,
      coverLetter,
      answers: JSON.stringify(answers || {}),
      matchScore: matchEval.totalMatchScore,
      status: 'APPLIED',
      appliedAt: new Date(),
      updatedAt: new Date()
    };
    memoryApplications.push(newApp);

    const newTimeline: MemoryTimelineEvent = {
      id: `tml-mem-${Date.now()}`,
      applicationId: newApp.id,
      actorName: req.user?.name || 'Student Candidate',
      actorRole: 'STUDENT',
      title: 'Application Submitted',
      description: `Candidate submitted application with ${matchEval.totalMatchScore}% verified server match score.`,
      createdAt: new Date()
    };
    memoryTimelineEvents.push(newTimeline);

    return res.json({
      message: 'Application submitted successfully!',
      application: { ...newApp, opportunity: oppObj }
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getStudentApplications = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    if (isDatabaseConfigured) {
      try {
        const applications = await prisma.application.findMany({
          where: { studentId },
          include: { opportunity: true },
          orderBy: { appliedAt: 'desc' }
        });
        if (applications.length > 0) return res.json({ applications });
      } catch (e) {}
    }

    const memApps = memoryApplications
      .filter(a => a.studentId === studentId)
      .map(a => {
        const opp = memoryOpportunities.find(o => o.id === a.opportunityId);
        return { ...a, opportunity: opp };
      });

    return res.json({ applications: memApps });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getIndustryApplicants = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.id;
    if (!companyId) return res.status(401).json({ message: 'Unauthorized' });

    if (isDatabaseConfigured) {
      try {
        const applications = await prisma.application.findMany({
          where: { opportunity: { companyId } },
          include: {
            opportunity: true,
            student: { include: { studentProfile: true } }
          },
          orderBy: { appliedAt: 'desc' }
        });
        if (applications.length > 0) return res.json({ applications });
      } catch (e) {}
    }

    const myOppIds = memoryOpportunities.filter(o => o.companyId === companyId).map(o => o.id);
    const memApps = memoryApplications
      .filter(a => myOppIds.includes(a.opportunityId))
      .map(a => {
        const opp = memoryOpportunities.find(o => o.id === a.opportunityId);
        const stuUser = memoryUsers.find(u => u.id === a.studentId);
        const stuProf = memoryStudentProfiles.find(p => p.userId === a.studentId);
        return {
          ...a,
          opportunity: opp,
          student: { ...stuUser, studentProfile: stuProf }
        };
      });

    return res.json({ applications: memApps });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note, interviewDate } = req.body; // APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED

    if (isDatabaseConfigured) {
      try {
        const application = await prisma.application.update({
          where: { id },
          data: {
            status,
            ...(interviewDate ? { interviewDate } : {}),
            updatedAt: new Date()
          },
          include: { opportunity: true, student: true }
        });

        await prisma.timelineEvent.create({
          data: {
            applicationId: id,
            actorName: req.user?.name || 'Recruiter',
            actorRole: 'INDUSTRY',
            stage: status,
            note: note || `Application status updated to ${status}.`
          }
        });

        await prisma.notification.create({
          data: {
            userId: application.studentId,
            title: `Application Status Updated: ${status} 🔔`,
            message: `Your application for "${application.opportunity.title}" at ${application.opportunity.companyName} is now ${status}.`,
            type: status === 'SELECTED' || status === 'SHORTLISTED' ? 'SUCCESS' : 'INFO'
          }
        });

        return res.json({ message: 'Application status updated', application });
      } catch (e) {}
    }

    // Memory Fallback
    const memApp = memoryApplications.find(a => a.id === id);
    if (!memApp) return res.status(404).json({ message: 'Application record not found' });

    memApp.status = status;
    memApp.updatedAt = new Date();

    const newTimeline: MemoryTimelineEvent = {
      id: `tml-mem-${Date.now()}`,
      applicationId: id,
      actorName: req.user?.name || 'Recruiter',
      actorRole: 'INDUSTRY',
      title: `Status: ${status}`,
      description: note || `Application status updated to ${status}.`,
      createdAt: new Date()
    };
    memoryTimelineEvents.push(newTimeline);

    return res.json({ message: 'Application status updated', application: memApp });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getApplicationTimeline = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (isDatabaseConfigured) {
      try {
        const events = await prisma.timelineEvent.findMany({
          where: { applicationId: id },
          orderBy: { createdAt: 'asc' }
        });
        if (events.length > 0) return res.json({ timeline: events });
      } catch (e) {}
    }

    const memEvents = memoryTimelineEvents.filter(t => t.applicationId === id);
    return res.json({ timeline: memEvents });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
