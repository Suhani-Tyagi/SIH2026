import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';
import { memoryInternshipLifecycles, memoryOpportunities, memoryUsers } from '../store/inMemoryStore';

export const getInternshipLifecycle = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (isDatabaseConfigured) {
      try {
        const lifecycle = await prisma.internshipLifecycle.findFirst({
          where: { studentId: userId }
        });
        if (lifecycle) {
          const opp = await prisma.opportunity.findUnique({ where: { id: lifecycle.opportunityId } });
          const student = await prisma.user.findUnique({ where: { id: lifecycle.studentId } });
          return res.json({ lifecycle: { ...lifecycle, opportunity: opp, student } });
        }
      } catch (e) {}
    }

    const memLfc = memoryInternshipLifecycles.find(l => l.studentId === userId);
    if (memLfc) {
      const opp = memoryOpportunities.find(o => o.id === memLfc.opportunityId);
      const student = memoryUsers.find(u => u.id === memLfc.studentId);
      return res.json({ lifecycle: { ...memLfc, opportunity: opp, student } });
    }

    return res.json({ lifecycle: null });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const submitWeeklyLog = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { week, topic, log } = req.body;

    if (isDatabaseConfigured) {
      try {
        const existing = await prisma.internshipLifecycle.findFirst({
          where: { studentId: userId }
        });

        if (existing) {
          let currentLogs = [];
          try {
            if (existing.weeklyLogs) currentLogs = JSON.parse(existing.weeklyLogs);
          } catch (e) {}

          currentLogs.push({ week, topic, log, submittedAt: new Date() });

          const updated = await prisma.internshipLifecycle.update({
            where: { id: existing.id },
            data: { weeklyLogs: JSON.stringify(currentLogs) }
          });

          return res.json({ message: `Week ${week} log submitted successfully!`, lifecycle: updated });
        }
      } catch (e) {}
    }

    const memLfc = memoryInternshipLifecycles.find(l => l.studentId === userId);
    if (memLfc) {
      let currentLogs = [];
      try {
        if (memLfc.weeklyLogs) currentLogs = JSON.parse(memLfc.weeklyLogs);
      } catch (e) {}

      currentLogs.push({ week, topic, log, submittedAt: new Date() });
      memLfc.weeklyLogs = JSON.stringify(currentLogs);

      return res.json({ message: `Week ${week} log submitted successfully!`, lifecycle: memLfc });
    }

    return res.status(404).json({ message: 'Active internship lifecycle record not found' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const submitMentorEvaluation = async (req: AuthRequest, res: Response) => {
  try {
    const { lifecycleId, type, score, notes } = req.body;

    if (isDatabaseConfigured) {
      try {
        const updated = await prisma.internshipLifecycle.update({
          where: { id: lifecycleId },
          data: {
            ...(type === 'MIDTERM' ? { midtermScore: score } : { finalScore: score }),
            ...(type === 'FINAL' ? { completionStatus: 'COMPLETED', completedAt: new Date() } : {})
          }
        });
        return res.json({ message: `${type} evaluation saved!`, lifecycle: updated });
      } catch (e) {}
    }

    const memLfc = memoryInternshipLifecycles.find(l => l.id === lifecycleId);
    if (memLfc) {
      if (type === 'MIDTERM') memLfc.midtermScore = score;
      else {
        memLfc.finalScore = score;
        memLfc.status = 'COMPLETED';
      }
      return res.json({ message: `${type} evaluation saved!`, lifecycle: memLfc });
    }

    return res.status(404).json({ message: 'Internship record not found' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
