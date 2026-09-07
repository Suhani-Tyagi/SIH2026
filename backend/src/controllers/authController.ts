import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured, ensureTablesExist } from '../prisma';
import { memoryUsers, memoryStudentProfiles, MemoryUser, MemoryStudentProfile } from '../store/inMemoryStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, system, institutionName, companyName, designation, degree } = req.body;

    // Server-side Input Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ message: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const targetRole = role || 'STUDENT';
    const allowedRoles = ['STUDENT', 'INDUSTRY', 'ACADEMICIAN', 'INSTITUTION_ADMIN', 'SUPER_ADMIN'];
    if (!allowedRoles.includes(targetRole)) {
      return res.status(400).json({ message: `Invalid user role specified: ${targetRole}` });
    }

    if (targetRole === 'INDUSTRY' && (!companyName || companyName.trim().length === 0)) {
      return res.status(400).json({ message: 'Company / Organization name is required for Industry Partners.' });
    }

    if ((targetRole === 'ACADEMICIAN' || targetRole === 'INSTITUTION_ADMIN') && (!institutionName || institutionName.trim().length === 0)) {
      return res.status(400).json({ message: 'Institution name is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Try Prisma DB first
    if (isDatabaseConfigured) {
      try {
        await ensureTablesExist();
        const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (existingUser) {
          return res.status(409).json({ message: `An account with the email "${cleanEmail}" already exists. Please sign in instead.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            email: cleanEmail,
            password: hashedPassword,
            name: name.trim(),
            role: targetRole,
            system: system || 'AYURVEDA',
            institutionName: institutionName ? institutionName.trim() : null,
            companyName: companyName ? companyName.trim() : null,
            designation: designation ? designation.trim() : null,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
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

        return res.status(201).json({ message: 'Registration successful!', token, user });
      } catch (dbErr: any) {
        console.warn('Prisma DB unavailable during registration, utilizing memory fallback:', dbErr?.message);
      }
    }

    // Memory Store Fallback
    const existingMemUser = memoryUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingMemUser) {
      return res.status(409).json({ message: `An account with the email "${cleanEmail}" already exists. Please sign in instead.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMemUser: MemoryUser = {
      id: `usr-mem-${Date.now()}`,
      email: cleanEmail,
      password: hashedPassword,
      name: name.trim(),
      role: targetRole as any,
      system: system || 'AYURVEDA',
      institutionName: institutionName ? institutionName.trim() : undefined,
      companyName: companyName ? companyName.trim() : undefined,
      designation: designation ? designation.trim() : undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      createdAt: new Date()
    };
    memoryUsers.push(newMemUser);

    if (newMemUser.role === 'STUDENT') {
      const newProf: MemoryStudentProfile = {
        id: `prof-mem-${Date.now()}`,
        userId: newMemUser.id,
        degree: degree || 'BAMS',
        passoutYear: 2025,
        readinessScore: 75,
        bio: `Student registered on AYUSH Setu platform.`,
        phone: '+91 98765 00000',
        location: 'New Delhi, India',
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
        verifiedBadges: JSON.stringify(['AYUSH Student Portal Registration']),
        careerGoals: JSON.stringify(['Herbal Formulation Scientist'])
      };
      memoryStudentProfiles.push(newProf);
    }

    const token = jwt.sign(
      { id: newMemUser.id, email: newMemUser.email, role: newMemUser.role, name: newMemUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ message: 'Registration successful!', token, user: newMemUser });

  } catch (error: any) {
    console.error('Registration server error:', error);
    return res.status(500).json({ message: error.message || 'Error occurred during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email address and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Try Prisma DB first if configured
    if (isDatabaseConfigured) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: cleanEmail },
          include: { studentProfile: true }
        });

        if (user) {
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return res.status(401).json({ message: 'Incorrect password. Please double-check your credentials and try again.' });
          }

          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.json({ message: 'Login successful!', token, user });
        }
      } catch (dbErr: any) {
        console.warn('Prisma DB error during login, trying memory store fallback:', dbErr?.message);
      }
    }

    // Memory Store Fallback
    const memUser = memoryUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!memUser) {
      return res.status(404).json({ message: `No registered account found with email "${cleanEmail}". Please check your email or sign up.` });
    }

    const isValidPassword = await bcrypt.compare(password, memUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Incorrect password. Please double-check your credentials and try again.' });
    }

    const memProfile = memoryStudentProfiles.find(p => p.userId === memUser.id);
    const userWithProf = {
      ...memUser,
      studentProfile: memProfile || null
    };

    const token = jwt.sign(
      { id: memUser.id, email: memUser.email, role: memUser.role, name: memUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ message: 'Login successful!', token, user: userWithProf });
  } catch (error: any) {
    console.error('Login server error:', error);
    return res.status(500).json({ message: error.message || 'Server error occurred during login.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });

    if (isDatabaseConfigured) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: req.user.id },
          include: { studentProfile: true }
        });
        if (user) return res.json({ user });
      } catch (dbErr: any) {
        console.warn('Prisma DB error in getMe, utilizing memory fallback:', dbErr?.message);
      }
    }

    const memUser = memoryUsers.find(u => u.id === req.user?.id);
    if (!memUser) return res.status(404).json({ message: 'User account not found' });
    const memProfile = memoryStudentProfiles.find(p => p.userId === memUser.id);
    return res.json({ user: { ...memUser, studentProfile: memProfile || null } });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
