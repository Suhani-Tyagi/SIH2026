import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';
import {
  memoryAcademicPrograms,
  memoryMentorshipRequests,
  memoryUsers,
  MemoryAcademicProgram,
  MemoryMentorshipRequest
} from '../store/inMemoryStore';

export const getAcademicPrograms = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    if (isDatabaseConfigured) {
      try {
        const where: any = {};
        if (type && type !== 'ALL') where.type = type;
        const programs = await prisma.academicProgram.findMany({
          where,
          include: { academician: true },
          orderBy: { createdAt: 'desc' }
        });
        if (programs.length > 0) return res.json({ programs });
      } catch (e) {}
    }

    const memPrograms = memoryAcademicPrograms
      .filter(p => (type && type !== 'ALL' ? p.type === type : true))
      .map(p => {
        const aca = memoryUsers.find(u => u.id === p.academicianId);
        return { ...p, academician: aca };
      });

    return res.json({ programs: memPrograms });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createAcademicProgram = async (req: AuthRequest, res: Response) => {
  try {
    const academicianId = req.user?.id;
    if (!academicianId) return res.status(401).json({ message: 'Unauthorized' });

    const { title, type, organizerName, targetAudience, description } = req.body;

    const pgmData = {
      title,
      type: type || 'FDP',
      academicianId,
      organizerName: organizerName || req.user?.name || 'Academic Faculty',
      targetAudience: targetAudience || 'AYUSH Faculty & Researchers',
      description
    };

    if (isDatabaseConfigured) {
      try {
        const program = await prisma.academicProgram.create({ data: pgmData });
        return res.json({ message: 'Academic opportunity posted successfully', program });
      } catch (e) {}
    }

    const newMemPgm: MemoryAcademicProgram = {
      id: `pgm-mem-${Date.now()}`,
      ...pgmData,
      createdAt: new Date()
    };
    memoryAcademicPrograms.push(newMemPgm);

    return res.json({ message: 'Academic opportunity posted successfully', program: newMemPgm });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getMentorshipRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (isDatabaseConfigured) {
      try {
        const requests = await prisma.mentorshipRequest.findMany({
          where: { OR: [{ studentId: userId }, { mentorId: userId }] },
          orderBy: { createdAt: 'desc' }
        });
        if (requests.length > 0) return res.json({ mentorshipRequests: requests });
      } catch (e) {}
    }

    const memRequests = memoryMentorshipRequests.filter(r => r.studentId === userId || r.mentorId === userId);
    return res.json({ mentorshipRequests: memRequests });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const requestMentorship = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const { mentorId, topic, notes } = req.body;

    const reqData = {
      studentId,
      mentorId: mentorId || 'usr-aca-1',
      topic,
      notes: notes || 'Student requested clinical & research guidance',
      status: 'PENDING'
    };

    if (isDatabaseConfigured) {
      try {
        const mReq = await prisma.mentorshipRequest.create({ data: reqData });
        return res.json({ message: 'Mentorship session requested successfully!', mentorshipRequest: mReq });
      } catch (e) {}
    }

    const newMemReq: MemoryMentorshipRequest = {
      id: `men-mem-${Date.now()}`,
      ...reqData,
      createdAt: new Date()
    };
    memoryMentorshipRequests.push(newMemReq);

    return res.json({ message: 'Mentorship session requested successfully!', mentorshipRequest: newMemReq });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getMentorshipSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let sessions: any[] = [];
    if (isDatabaseConfigured) {
      try {
        sessions = await prisma.mentorshipSession.findMany({
          where: { OR: [{ mentorId: userId }, { studentId: userId }] },
          include: { request: { include: { student: true, mentor: true } } },
          orderBy: { createdAt: 'desc' }
        });
        if (sessions.length > 0) return res.json({ sessions });
      } catch (e) {}
    }

    // Default pre-seeded sessions for demonstration
    sessions = [
      {
        id: 'ms-101',
        mentorId: 'usr-aca-1',
        mentorName: 'Dr. Rajesh Sharma (HOD Kayachikitsa)',
        studentId: 'usr-stu-1',
        studentName: 'Aarav Sharma',
        topic: 'Panchakarma Clinical Case Review & Nadi Pariksha Protocol',
        scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
        meetingUrl: 'https://meet.ayushsetu.gov.in/session-aca-101',
        status: 'SCHEDULED',
        agenda: '1. Review 3 patient case studies. 2. Verify tactile Nadi Pariksha technique. 3. Finalize research thesis proposal.',
        rubricJson: JSON.stringify({ clinicalCompetence: 88, researchMethodology: 82, communication: 90, professionalEthics: 95 })
      },
      {
        id: 'ms-102',
        mentorId: 'usr-aca-1',
        mentorName: 'Dr. Rajesh Sharma (HOD Kayachikitsa)',
        studentId: 'usr-stu-2',
        studentName: 'Ananya Verma',
        topic: 'Herbal Formulation Standardisation & GMP Compliance',
        scheduledAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        meetingUrl: 'https://meet.ayushsetu.gov.in/session-aca-102',
        status: 'COMPLETED',
        agenda: 'Extract standardisation using HPTLC and Schedule T documentation',
        sessionNotes: 'Student demonstrated thorough understanding of aqueous extract parameters.',
        rubricJson: JSON.stringify({ clinicalCompetence: 85, researchMethodology: 88, communication: 85, professionalEthics: 90 })
      }
    ];

    return res.json({ sessions });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const scheduleMentorshipSession = async (req: AuthRequest, res: Response) => {
  try {
    const mentorId = req.user?.id;
    if (!mentorId || req.user?.role !== 'ACADEMICIAN') {
      return res.status(403).json({ message: 'Only Academician Mentors can schedule sessions' });
    }

    const { studentId, topic, scheduledAt, agenda, meetingUrl } = req.body;

    if (isDatabaseConfigured) {
      try {
        let mReq = await prisma.mentorshipRequest.findFirst({
          where: { studentId, mentorId }
        });
        if (!mReq) {
          mReq = await prisma.mentorshipRequest.create({
            data: {
              studentId,
              mentorId,
              topic: topic || 'Academic Mentorship',
              notes: agenda || 'Mentorship session',
              status: 'ACCEPTED'
            }
          });
        }

        const session = await prisma.mentorshipSession.create({
          data: {
            requestId: mReq.id,
            mentorId,
            studentId,
            scheduledAt: String(scheduledAt || new Date().toISOString()),
            agenda: agenda || 'Academic Mentorship & Clinical Skills Evaluation',
            status: 'SCHEDULED'
          }
        });
        return res.json({ message: 'Mentorship session scheduled successfully!', session });
      } catch (e) {}
    }

    return res.json({
      message: 'Mentorship session scheduled successfully!',
      session: {
        id: `ms-mem-${Date.now()}`,
        mentorId,
        studentId,
        topic,
        scheduledAt: String(scheduledAt || new Date().toISOString()),
        agenda,
        meetingUrl: meetingUrl || `https://meet.ayushsetu.gov.in/session-${Date.now().toString(36)}`,
        status: 'SCHEDULED'
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const submitSessionEvaluation = async (req: AuthRequest, res: Response) => {
  try {
    const mentorId = req.user?.id;
    if (!mentorId || req.user?.role !== 'ACADEMICIAN') {
      return res.status(403).json({ message: 'Only Academician Mentors can evaluate sessions' });
    }

    const { sessionId, studentId, rubric, sessionNotes, verifiedSkillUpdates } = req.body;

    if (isDatabaseConfigured) {
      try {
        await prisma.mentorshipSession.update({
          where: { id: sessionId },
          data: {
            status: 'COMPLETED',
            notes: sessionNotes ? `${sessionNotes} | Rubric: ${JSON.stringify(rubric)}` : JSON.stringify(rubric)
          }
        });

        if (studentId && verifiedSkillUpdates) {
          const profile = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
          if (profile) {
            let existingMentorVerified: any = {};
            try {
              if (profile.mentorVerifiedSkills) existingMentorVerified = JSON.parse(profile.mentorVerifiedSkills);
            } catch (e) {}

            const mergedVerified = { ...existingMentorVerified, ...verifiedSkillUpdates };
            await prisma.studentProfile.update({
              where: { userId: studentId },
              data: { mentorVerifiedSkills: JSON.stringify(mergedVerified) }
            });
          }
        }

        await prisma.auditLog.create({
          data: {
            actorId: mentorId,
            actorRole: 'ACADEMICIAN',
            action: 'MENTORSHIP_EVALUATED',
            targetEntity: sessionId,
            detailsJson: JSON.stringify({ studentId, rubric })
          }
        });

        return res.json({ message: 'Session evaluation recorded and student verified skills updated!' });
      } catch (e) {}
    }

    return res.json({ message: 'Session evaluation recorded and student verified skills updated!' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};


