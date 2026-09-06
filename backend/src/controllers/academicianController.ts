import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

export const getAcademicPrograms = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const where: any = {};
    if (type && type !== 'ALL') {
      where.type = type;
    }

    const programs = await prisma.academicProgram.findMany({
      where,
      include: { academician: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ programs });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createAcademicProgram = async (req: AuthRequest, res: Response) => {
  try {
    const academicianId = req.user?.id;
    if (!academicianId) return res.status(401).json({ message: 'Unauthorized' });

    const { title, type, organizerName, targetAudience, description } = req.body;

    const program = await prisma.academicProgram.create({
      data: {
        title,
        type: type || 'FDP',
        academicianId,
        organizerName: organizerName || req.user?.name || 'Academic Faculty',
        targetAudience: targetAudience || 'AYUSH Faculty & Researchers',
        description,
        status: 'OPEN'
      }
    });

    return res.json({ message: 'Academic opportunity posted successfully', program });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
