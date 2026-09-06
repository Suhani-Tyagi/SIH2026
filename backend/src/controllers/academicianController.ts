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
