import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

export const applyToOpportunity = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const { opportunityId, coverLetter, matchScore } = req.body;

    const existing = await prisma.application.findFirst({
      where: { opportunityId, studentId }
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this opportunity' });
    }

    const application = await prisma.application.create({
      data: {
        opportunityId,
        studentId,
        coverLetter,
        matchScore: matchScore || 85,
        status: 'APPLIED'
      },
      include: { opportunity: true }
    });

    // Send notification to industry partner
    const studentName = req.user?.name || 'Candidate';
    await prisma.notification.create({
      data: {
        userId: application.opportunity.companyId,
        title: 'New Applicant Received 📥',
        message: `${studentName} applied for "${application.opportunity.title}" (Match Score: ${matchScore || 85}%).`,
        type: 'INFO'
      }
    });

    return res.json({ message: 'Application submitted successfully!', application });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getStudentApplications = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const applications = await prisma.application.findMany({
      where: { studentId },
      include: {
        opportunity: true
      },
      orderBy: { appliedAt: 'desc' }
    });

    return res.json({ applications });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getIndustryApplicants = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.id;
    if (!companyId) return res.status(401).json({ message: 'Unauthorized' });

    const applications = await prisma.application.findMany({
      where: {
        opportunity: { companyId }
      },
      include: {
        opportunity: true,
        student: {
          include: { studentProfile: true }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    return res.json({ applications });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED

    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: { opportunity: true, student: true }
    });

    // Notify student of status update
    await prisma.notification.create({
      data: {
        userId: application.studentId,
        title: `Application Status Updated: ${status} 🔔`,
        message: `Your application for "${application.opportunity.title}" at ${application.opportunity.companyName} is now ${status}.`,
        type: status === 'SELECTED' || status === 'SHORTLISTED' ? 'SUCCESS' : 'INFO'
      }
    });

    return res.json({ message: 'Application status updated', application });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
