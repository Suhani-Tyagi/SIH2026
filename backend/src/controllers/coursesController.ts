import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' }
    });

    let enrollments: any[] = [];
    if (req.user && req.user.role === 'STUDENT') {
      enrollments = await prisma.enrollment.findMany({
        where: { studentId: req.user.id }
      });
    }

    const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
    const completedCourseIds = new Set(enrollments.filter((e) => e.status === 'COMPLETED').map((e) => e.courseId));

    const result = courses.map((c) => {
      let skillsList: string[] = [];
      try {
        skillsList = JSON.parse(c.skillsAcquired);
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

    const existing = await prisma.enrollment.findFirst({
      where: { courseId, studentId }
    });

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId,
        studentId,
        status: 'ENROLLED'
      },
      include: { course: true }
    });

    // Increment course count
    await prisma.course.update({
      where: { id: courseId },
      data: { enrollmentsCount: { increment: 1 } }
    });

    return res.json({ message: 'Successfully enrolled in course!', enrollment });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const completeCourse = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    const { courseId } = req.body;

    let enrollment = await prisma.enrollment.findFirst({
      where: { courseId, studentId },
      include: { course: true }
    });

    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: { courseId, studentId, status: 'COMPLETED', completedAt: new Date() },
        include: { course: true }
      });
    } else {
      enrollment = await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
        include: { course: true }
      });
    }

    // Boost student skill scores and add verified badge!
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: studentId }
    });

    if (profile) {
      let currentScores: any = {
        panchakarma: 75,
        herbalFormulation: 75,
        clinicalDiagnostics: 80,
        nadiPariksha: 70,
        yogaTherapy: 65,
        researchMethodology: 70,
        patientCounseling: 80,
        qaGmp: 65
      };
      try {
        if (profile.skillScores) currentScores = JSON.parse(profile.skillScores);
      } catch (e) {}

      // Boost scores by +8 to +12 points upon completing course
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
      if (!badges.includes(enrollment.course.title)) {
        badges.push(enrollment.course.title);
      }

      const newReadiness = Math.round(
        Object.values(currentScores as Record<string, number>).reduce((a, b) => a + b, 0) / 8
      );

      await prisma.studentProfile.update({
        where: { userId: studentId },
        data: {
          skillScores: JSON.stringify(currentScores),
          verifiedBadges: JSON.stringify(badges),
          readinessScore: newReadiness
        }
      });
    }

    return res.json({
      message: `Congratulations! Course "${enrollment.course.title}" completed. Your skill scores & verified profile badge have been updated! 🎓`,
      enrollment
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

    const course = await prisma.course.create({
      data: {
        title,
        providerName: req.user?.name || 'Industry Partner',
        companyId,
        duration: duration || '4 Weeks',
        level: level || 'Intermediate',
        skillsAcquired: typeof skillsAcquired === 'string' ? skillsAcquired : JSON.stringify(skillsAcquired || []),
        description,
        image: image || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80',
        price: price || 'Free (Ministry Sponsored)'
      }
    });

    return res.json({ message: 'Course created successfully', course });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
