import { Request, Response } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';
import {
  memoryCourses,
  memoryEnrollments,
  memoryStudentProfiles,
  memoryUsers,
  MemoryCourse,
  MemoryEnrollment
} from '../store/inMemoryStore';

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    let coursesList: any[] = [];
    let enrollments: any[] = [];

    if (isDatabaseConfigured) {
      try {
        coursesList = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
        if (req.user && req.user.role === 'STUDENT') {
          enrollments = await prisma.enrollment.findMany({ where: { studentId: req.user.id } });
        }
      } catch (e) {}
    }

    if (coursesList.length === 0) {
      coursesList = memoryCourses;
      if (req.user && req.user.role === 'STUDENT') {
        enrollments = memoryEnrollments.filter(e => e.studentId === req.user?.id);
      }
    }

    const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
    const completedCourseIds = new Set(enrollments.filter((e) => e.status === 'COMPLETED').map((e) => e.courseId));

    const result = coursesList.map((c) => {
      let skillsList: string[] = [];
      try {
        skillsList = typeof c.skillsAcquired === 'string' ? JSON.parse(c.skillsAcquired) : c.skillsAcquired;
      } catch (e) {}

      return {
        ...c,
        skillsList,
        isEnrolled: enrolledCourseIds.has(c.id),
        isCompleted: completedCourseIds.has(c.id)
      };
    });

    return res.json({ courses: result });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const { courseId } = req.body;

    if (isDatabaseConfigured) {
      try {
        const existing = await prisma.enrollment.findFirst({
          where: { courseId, studentId }
        });
        if (existing) {
          return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const enrollment = await prisma.enrollment.create({
          data: { courseId, studentId, status: 'ENROLLED' },
          include: { course: true }
        });

        await prisma.course.update({
          where: { id: courseId },
          data: { enrollmentsCount: { increment: 1 } }
        });

        return res.json({ message: 'Successfully enrolled in course!', enrollment });
      } catch (e) {}
    }

    // Memory Fallback
    const existingMem = memoryEnrollments.find(e => e.courseId === courseId && e.studentId === studentId);
    if (existingMem) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const newEnr: MemoryEnrollment = {
      id: `enr-mem-${Date.now()}`,
      courseId,
      studentId,
      status: 'ENROLLED',
      progressPercent: 0,
      enrolledAt: new Date()
    };
    memoryEnrollments.push(newEnr);

    const crs = memoryCourses.find(c => c.id === courseId);
    return res.json({ message: 'Successfully enrolled in course!', enrollment: { ...newEnr, course: crs } });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const completeCourse = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const { courseId } = req.body;
    const certHash = `AYUSH-CERT-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

    if (isDatabaseConfigured) {
      try {
        let enrollment = await prisma.enrollment.findFirst({
          where: { courseId, studentId },
          include: { course: true }
        });

        if (!enrollment) {
          enrollment = await prisma.enrollment.create({
            data: { courseId, studentId, status: 'COMPLETED', progressPercent: 100, certificateHash: certHash, completedAt: new Date() },
            include: { course: true }
          });
        } else {
          enrollment = await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: 'COMPLETED', progressPercent: 100, certificateHash: certHash, completedAt: new Date() },
            include: { course: true }
          });
        }

        // Boost student skill scores and add verified badge!
        const profile = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
        if (profile) {
          let currentScores: any = { panchakarma: 75, herbalFormulation: 75, clinicalDiagnostics: 80, nadiPariksha: 70, yogaTherapy: 65, researchMethodology: 70, patientCounseling: 80, qaGmp: 65 };
          try {
            if (profile.skillScores) currentScores = JSON.parse(profile.skillScores);
          } catch (e) {}

          let skillsAcquiredList: string[] = [];
          try {
            skillsAcquiredList = JSON.parse(enrollment.course.skillsAcquired);
          } catch (e) {}

          skillsAcquiredList.forEach((s) => {
            const lower = s.toLowerCase();
            if (lower.includes('panchakarma')) currentScores.panchakarma = Math.min(100, currentScores.panchakarma + 10);
            if (lower.includes('herbal')) currentScores.herbalFormulation = Math.min(100, currentScores.herbalFormulation + 10);
            if (lower.includes('diagnostic')) currentScores.clinicalDiagnostics = Math.min(100, currentScores.clinicalDiagnostics + 8);
            if (lower.includes('yoga')) currentScores.yogaTherapy = Math.min(100, currentScores.yogaTherapy + 12);
            if (lower.includes('research')) currentScores.researchMethodology = Math.min(100, currentScores.researchMethodology + 10);
            if (lower.includes('qa') || lower.includes('gmp')) currentScores.qaGmp = Math.min(100, currentScores.qaGmp + 12);
          });

          let badges: string[] = [];
          try {
            if (profile.verifiedBadges) badges = JSON.parse(profile.verifiedBadges);
          } catch (e) {}
          if (!badges.includes(enrollment.course.title)) badges.push(enrollment.course.title);

          const newReadiness = Math.round(Object.values(currentScores as Record<string, number>).reduce((a, b) => a + b, 0) / 8);

          await prisma.studentProfile.update({
            where: { userId: studentId },
            data: { skillScores: JSON.stringify(currentScores), verifiedBadges: JSON.stringify(badges), readinessScore: newReadiness }
          });
        }

        return res.json({
          message: `Congratulations! Course "${enrollment.course.title}" completed. Your certificate verification hash is ${certHash}! 🎓`,
          enrollment,
          certificateHash: certHash
        });
      } catch (e) {}
    }

    // Memory Fallback
    let memEnr = memoryEnrollments.find(e => e.courseId === courseId && e.studentId === studentId);
    if (!memEnr) {
      memEnr = {
        id: `enr-mem-${Date.now()}`,
        courseId,
        studentId,
        status: 'COMPLETED',
        progressPercent: 100,
        completedAt: new Date(),
        enrolledAt: new Date()
      };
      memoryEnrollments.push(memEnr);
    } else {
      memEnr.status = 'COMPLETED';
      memEnr.progressPercent = 100;
      memEnr.completedAt = new Date();
    }

    const crs = memoryCourses.find(c => c.id === courseId);
    const memProf = memoryStudentProfiles.find(p => p.userId === studentId);
    if (memProf) {
      let badges: string[] = [];
      try {
        if (memProf.verifiedBadges) badges = JSON.parse(memProf.verifiedBadges);
      } catch (e) {}
      if (crs && !badges.includes(crs.title)) badges.push(crs.title);
      memProf.verifiedBadges = JSON.stringify(badges);
      memProf.readinessScore = Math.min(100, memProf.readinessScore + 4);
    }

    return res.json({
      message: `Congratulations! Course "${crs?.title || 'Certification'}" completed. Your certificate hash is ${certHash}! 🎓`,
      enrollment: { ...memEnr, course: crs },
      certificateHash: certHash
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.id;
    if (!companyId) return res.status(401).json({ message: 'Unauthorized' });

    const { title, duration, level, skillsAcquired, description, image, price } = req.body;

    const courseData = {
      title,
      providerName: req.user?.name || 'Industry Partner',
      companyId,
      duration: duration || '4 Weeks',
      level: level || 'Intermediate',
      skillsAcquired: typeof skillsAcquired === 'string' ? skillsAcquired : JSON.stringify(skillsAcquired || []),
      description,
      image: image || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
      price: price || 'Free (Ministry Sponsored)'
    };

    if (isDatabaseConfigured) {
      try {
        const course = await prisma.course.create({ data: courseData });
        return res.json({ message: 'Course created successfully', course });
      } catch (e) {}
    }

    const newMemCourse: MemoryCourse = {
      id: `crs-mem-${Date.now()}`,
      ...courseData,
      createdAt: new Date()
    };
    memoryCourses.push(newMemCourse);

    return res.json({ message: 'Course created successfully', course: newMemCourse });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
