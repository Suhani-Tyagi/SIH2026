import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DB_NOT_CONFIGURED_MSG =
  'Database Connection Needed: Please add the DATABASE_URL environment variable in your Vercel Project Settings (under Settings -> Environment Variables) to connect your hosted PostgreSQL database.';

export const register = async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConfigured) {
      return res.status(503).json({ message: DB_NOT_CONFIGURED_MSG });
    }

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

    // Check for existing duplicate email
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
  } catch (error: any) {
    console.error('Registration server error:', error);
    if (!isDatabaseConfigured || (error.message && (error.message.includes('DATABASE_URL') || error.message.includes('Can\'t reach database server') || error.message.includes('Error parsing connection string')))) {
      return res.status(503).json({ message: DB_NOT_CONFIGURED_MSG });
    }
    return res.status(500).json({ message: error.message || 'Database error occurred during registration. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    if (!isDatabaseConfigured) {
      return res.status(503).json({ message: DB_NOT_CONFIGURED_MSG });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email address and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { studentProfile: true }
    });

    if (!user) {
      return res.status(404).json({ message: `No registered account found with email "${cleanEmail}". Please check your email or sign up.` });
    }

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
  } catch (error: any) {
    console.error('Login server error:', error);
    if (!isDatabaseConfigured || (error.message && (error.message.includes('DATABASE_URL') || error.message.includes('Can\'t reach database server') || error.message.includes('Error parsing connection string')))) {
      return res.status(503).json({ message: DB_NOT_CONFIGURED_MSG });
    }
    return res.status(500).json({ message: error.message || 'Server error occurred during login. Please try again.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!isDatabaseConfigured) {
      return res.status(503).json({ message: DB_NOT_CONFIGURED_MSG });
    }

    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { studentProfile: true }
    });
    if (!user) return res.status(404).json({ message: 'User account not found' });
    return res.json({ user });
  } catch (error: any) {
    if (!isDatabaseConfigured || (error.message && (error.message.includes('DATABASE_URL') || error.message.includes('Can\'t reach database server') || error.message.includes('Error parsing connection string')))) {
      return res.status(503).json({ message: DB_NOT_CONFIGURED_MSG });
    }
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

