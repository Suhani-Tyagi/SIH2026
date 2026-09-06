import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, system, institutionName, companyName, designation, degree } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'STUDENT',
        system: system || 'AYURVEDA',
        institutionName,
        companyName,
        designation,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
      }
    });

    if (user.role === 'STUDENT') {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
          degree: degree || 'BAMS',
          passoutYear: 2025,
          readinessScore: 75,
          skillScores: JSON.stringify({
            panchakarma: 70,
            herbalFormulation: 70,
            clinicalDiagnostics: 75,
            nadiPariksha: 65,
            yogaTherapy: 60,
            researchMethodology: 70,
            patientCounseling: 75,
            qaGmp: 65
          }),
          verifiedBadges: JSON.stringify(['AYUSH Student Portal Registration'])
        }
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token, user });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token, user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const demoLogin = async (req: Request, res: Response) => {
  try {
    const { role } = req.body; // STUDENT, INDUSTRY, ACADEMICIAN, INSTITUTION_ADMIN, SUPER_ADMIN
    
    let targetEmail = 'aarav.sharma@student.aiia.ac.in';
    if (role === 'INDUSTRY') targetEmail = 'careers@daburayush.com';
    else if (role === 'ACADEMICIAN') targetEmail = 'dr.sharma@aiia-delhi.ac.in';
    else if (role === 'INSTITUTION_ADMIN') targetEmail = 'admin@aiia-delhi.ac.in';
    else if (role === 'SUPER_ADMIN') targetEmail = 'admin@aiia.gov.in';

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: { studentProfile: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'Demo account not found. Please run seed script.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token, user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { studentProfile: true }
    });
    return res.json({ user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
