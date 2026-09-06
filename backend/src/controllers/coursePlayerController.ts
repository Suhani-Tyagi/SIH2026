import { Request, Response } from 'express';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/auth';
import prisma, { isDatabaseConfigured } from '../prisma';
import {
  memoryCourses,
  memoryModules,
  memoryLessons,
  memoryLearningResources,
  memoryEnrollments,
  memoryLessonProgress,
  memoryCourseAssessments,
  memoryCertificates,
  memoryStudentProfiles,
  memoryUsers,
  memoryAuditLogs,
  MemoryCertificate,
  MemoryLessonProgress,
  MemoryEnrollment,
  MemoryAuditLog
} from '../store/inMemoryStore';

export const getCourseDetailsWithModules = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    let course: any = null;
    let modules: any[] = [];
    let resources: any[] = [];
    let enrollment: any = null;
    let lessonProgressList: any[] = [];

    if (isDatabaseConfigured) {
      try {
        course = await prisma.course.findUnique({ where: { id: courseId } });
        if (course) {
          modules = await prisma.module.findMany({
            where: { courseId },
            include: { lessons: { orderBy: { order: 'asc' } } },
            orderBy: { order: 'asc' }
          });
          resources = await prisma.learningResource.findMany({ where: { courseId } });
          if (userId) {
            enrollment = await prisma.enrollment.findFirst({
              where: { courseId, studentId: userId }
            });
            if (enrollment) {
              lessonProgressList = await prisma.lessonProgress.findMany({
                where: { enrollmentId: enrollment.id }
              });
            }
          }
        }
      } catch (e) {}
    }

    if (!course) {
      course = memoryCourses.find(c => c.id === courseId);
      if (course) {
        modules = memoryModules
          .filter(m => m.courseId === courseId)
          .map(m => {
            const lessons = memoryLessons.filter(l => l.moduleId === m.id).sort((a, b) => a.order - b.order);
            return { ...m, lessons };
          })
          .sort((a, b) => a.order - b.order);
        resources = memoryLearningResources.filter(r => r.courseId === courseId);

        if (userId) {
          enrollment = memoryEnrollments.find(e => e.courseId === courseId && e.studentId === userId);
          if (enrollment) {
            lessonProgressList = memoryLessonProgress.filter(lp => lp.enrollmentId === enrollment.id);
          }
        }
      }
    }

    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Map progress status onto lessons
    const progressMap = new Map(lessonProgressList.map(lp => [lp.lessonId, lp]));
    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    const modulesWithProgress = modules.map((mod: any, mIdx: number) => {
      const lessonsWithStatus = (mod.lessons || []).map((les: any, lIdx: number) => {
        totalLessonsCount++;
        const prog = progressMap.get(les.id);
        let status = prog ? prog.status : (mIdx === 0 && lIdx === 0 ? 'AVAILABLE' : 'LOCKED');
        if (status === 'COMPLETED') completedLessonsCount++;
        return {
          ...les,
          status,
          completedAt: prog?.completedAt
        };
      });
      return { ...mod, lessons: lessonsWithStatus };
    });

    const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

    let skillsList: string[] = [];
    try {
      skillsList = typeof course.skillsAcquired === 'string' ? JSON.parse(course.skillsAcquired) : course.skillsAcquired;
    } catch (e) {}

    return res.json({
      course: {
        ...course,
        skillsList,
        progressPercent,
        isEnrolled: Boolean(enrollment),
        isCompleted: enrollment?.status === 'COMPLETED',
        completedLessonsCount,
        totalLessonsCount
      },
      modules: modulesWithProgress,
      resources,
      enrollment
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const updateLessonProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, lessonId } = req.params;
    const { status } = req.body; // IN_PROGRESS, COMPLETED
    const studentId = req.user?.id;

    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    if (isDatabaseConfigured) {
      try {
        const enrollment = await prisma.enrollment.findFirst({
          where: { courseId, studentId }
        });
        if (!enrollment) return res.status(400).json({ message: 'Must be enrolled in course first' });

        let prog = await prisma.lessonProgress.findFirst({
          where: { enrollmentId: enrollment.id, lessonId }
        });

        if (!prog) {
          prog = await prisma.lessonProgress.create({
            data: {
              enrollmentId: enrollment.id,
              lessonId,
              status: status || 'COMPLETED',
              completedAt: status === 'COMPLETED' ? new Date() : null
            }
          });
        } else {
          prog = await prisma.lessonProgress.update({
            where: { id: prog.id },
            data: {
              status: status || 'COMPLETED',
              completedAt: status === 'COMPLETED' ? new Date() : prog.completedAt
            }
          });
        }

        // Recalculate progress percentage
        const allModules = await prisma.module.findMany({
          where: { courseId },
          include: { lessons: true }
        });
        const allLessonIds = allModules.flatMap(m => m.lessons.map(l => l.id));
        const completedProgs = await prisma.lessonProgress.findMany({
          where: { enrollmentId: enrollment.id, status: 'COMPLETED' }
        });

        const percent = allLessonIds.length > 0 ? Math.round((completedProgs.length / allLessonIds.length) * 100) : 100;
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { progressPercent: percent }
        });

        return res.json({ message: 'Lesson progress updated', progressPercent: percent });
      } catch (e) {}
    }

    // Memory Fallback
    const memEnr = memoryEnrollments.find(e => e.courseId === courseId && e.studentId === studentId);
    if (!memEnr) return res.status(400).json({ message: 'Must be enrolled in course first' });

    let memProg = memoryLessonProgress.find(lp => lp.enrollmentId === memEnr.id && lp.lessonId === lessonId);
    if (!memProg) {
      memProg = {
        id: `lsp-mem-${Date.now()}`,
        enrollmentId: memEnr.id,
        lessonId,
        status: status || 'COMPLETED',
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
        updatedAt: new Date()
      };
      memoryLessonProgress.push(memProg);
    } else {
      memProg.status = status || 'COMPLETED';
      if (status === 'COMPLETED') memProg.completedAt = new Date();
      memProg.updatedAt = new Date();
    }

    const courseMods = memoryModules.filter(m => m.courseId === courseId);
    const modIds = courseMods.map(m => m.id);
    const courseLess = memoryLessons.filter(l => modIds.includes(l.moduleId));
    const compCount = memoryLessonProgress.filter(lp => lp.enrollmentId === memEnr.id && lp.status === 'COMPLETED').length;
    const percent = courseLess.length > 0 ? Math.round((compCount / courseLess.length) * 100) : 100;
    memEnr.progressPercent = percent;

    return res.json({ message: 'Lesson progress updated', progressPercent: percent });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const getCourseAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    let assessment: any = null;
    let enrollment: any = null;

    if (isDatabaseConfigured) {
      try {
        enrollment = await prisma.enrollment.findFirst({ where: { courseId, studentId } });
        assessment = await prisma.courseAssessment.findFirst({ where: { courseId } });
      } catch (e) {}
    }

    if (!assessment) {
      enrollment = memoryEnrollments.find(e => e.courseId === courseId && e.studentId === studentId);
      assessment = memoryCourseAssessments.find(ca => ca.courseId === courseId);
    }

    if (!enrollment) return res.status(400).json({ message: 'Must be enrolled in course to take aptitude test' });
    if (!assessment) return res.status(404).json({ message: 'No aptitude test configured for this course yet' });

    // Strip answers from returned questions for security
    let questionsList: any[] = [];
    try {
      const raw = typeof assessment.questionsJson === 'string' ? JSON.parse(assessment.questionsJson) : assessment.questionsJson;
      questionsList = raw.map(({ correctAnswer, ...qWithoutAns }: any) => qWithoutAns);
    } catch (e) {}

    return res.json({
      assessment: {
        id: assessment.id,
        courseId: assessment.courseId,
        title: assessment.title,
        passScorePercent: assessment.passScorePercent || 75,
        timeLimitMinutes: assessment.timeLimitMinutes || 30,
        questions: questionsList
      }
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const submitCourseAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body; // Record<questionId, selectedOption>
    const studentId = req.user?.id;

    if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

    let assessment: any = null;
    let course: any = null;
    let enrollment: any = null;
    let studentUser: any = null;

    if (isDatabaseConfigured) {
      try {
        course = await prisma.course.findUnique({ where: { id: courseId } });
        assessment = await prisma.courseAssessment.findFirst({ where: { courseId } });
        enrollment = await prisma.enrollment.findFirst({ where: { courseId, studentId } });
        studentUser = await prisma.user.findUnique({ where: { id: studentId } });
      } catch (e) {}
    }

    if (!assessment) {
      course = memoryCourses.find(c => c.id === courseId);
      assessment = memoryCourseAssessments.find(ca => ca.courseId === courseId);
      enrollment = memoryEnrollments.find(e => e.courseId === courseId && e.studentId === studentId);
      studentUser = memoryUsers.find(u => u.id === studentId);
    }

    if (!assessment) return res.status(404).json({ message: 'Aptitude test not found' });
    if (!enrollment) return res.status(400).json({ message: 'Enrollment not found' });

    // Server-side grading logic
    let rawQuestions: any[] = [];
    try {
      rawQuestions = typeof assessment.questionsJson === 'string' ? JSON.parse(assessment.questionsJson) : assessment.questionsJson;
    } catch (e) {}

    let correctCount = 0;
    const missedDomains: string[] = [];

    rawQuestions.forEach((q: any) => {
      const given = answers ? answers[q.id] : null;
      if (given && String(given).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
        correctCount++;
      } else {
        missedDomains.push(q.question || q.id);
      }
    });

    const totalQuestions = rawQuestions.length || 1;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passThreshold = assessment.passScorePercent || 75;
    const isPassed = scorePercent >= passThreshold;

    if (!isPassed) {
      return res.json({
        success: false,
        passed: false,
        scorePercent,
        passThreshold,
        message: `Score of ${scorePercent}% is below the mandatory ${passThreshold}% pass threshold. Certificate not issued. Review missed domains and retry after retake timer.`,
        missedDomains
      });
    }

    // Server generates a tamper-resistant E-Certificate
    const certNum = `AYUSH-CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const qrToken = `VERIFIED-AYUSH-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

    if (isDatabaseConfigured) {
      try {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: 'COMPLETED', quizScore: scorePercent, completedAt: new Date(), certificateHash: certNum }
        });

        const certRecord = await prisma.certificate.create({
          data: {
            certificateNumber: certNum,
            enrollmentId: enrollment.id,
            studentId,
            courseId,
            studentName: studentUser?.name || 'AYUSH Candidate',
            courseTitle: course?.title || 'Industry Learning Program',
            providerName: course?.providerName || 'Industry Partner',
            score: scorePercent,
            verificationQrToken: qrToken,
            signatory: 'Ministry of AYUSH & AIIA Academic Cell',
            status: 'VALID'
          }
        });

        // Upgrade student's provenance skills (coursePassedSkills)
        const profile = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
        if (profile) {
          let passedSkillsObj: any = {};
          try {
            if (profile.coursePassedSkills) passedSkillsObj = JSON.parse(profile.coursePassedSkills);
          } catch (e) {}

          let courseSkills: string[] = [];
          try {
            courseSkills = typeof course?.skillsAcquired === 'string' ? JSON.parse(course.skillsAcquired) : (course?.skillsAcquired || []);
          } catch (e) {}

          courseSkills.forEach((s: string) => {
            passedSkillsObj[s] = Math.max(passedSkillsObj[s] || 0, scorePercent);
          });

          let badges: string[] = [];
          try {
            if (profile.verifiedBadges) badges = JSON.parse(profile.verifiedBadges);
          } catch (e) {}
          if (course?.title && !badges.includes(course.title)) badges.push(course.title);

          await prisma.studentProfile.update({
            where: { userId: studentId },
            data: {
              coursePassedSkills: JSON.stringify(passedSkillsObj),
              verifiedBadges: JSON.stringify(badges)
            }
          });
        }

        // Audit Log
        await prisma.auditLog.create({
          data: {
            actorId: studentId,
            actorRole: 'STUDENT',
            action: 'CERTIFICATE_ISSUED',
            targetEntity: certNum,
            detailsJson: JSON.stringify({ courseId, scorePercent })
          }
        });

        return res.json({
          success: true,
          passed: true,
          scorePercent,
          passThreshold,
          certificate: certRecord,
          verificationUrl: `/certificate/verify/${certRecord.id}`,
          message: `Congratulations! Score: ${scorePercent}%. E-Certificate ${certNum} generated and added to your Digital Portfolio.`
        });
      } catch (e) {}
    }

    // Memory Fallback
    enrollment.status = 'COMPLETED';
    enrollment.quizScore = scorePercent;
    enrollment.completedAt = new Date();
    enrollment.certificateHash = certNum;

    const memCert: MemoryCertificate = {
      id: `cert-mem-${Date.now()}`,
      certificateNumber: certNum,
      enrollmentId: enrollment.id,
      studentId,
      courseId,
      studentName: studentUser?.name || 'AYUSH Candidate',
      courseTitle: course?.title || 'Industry Learning Program',
      providerName: course?.providerName || 'Industry Partner',
      issueDate: new Date(),
      score: scorePercent,
      verificationQrToken: qrToken,
      signatory: 'Ministry of AYUSH & AIIA Academic Cell',
      status: 'VALID'
    };
    memoryCertificates.push(memCert);

    const memProf = memoryStudentProfiles.find(p => p.userId === studentId);
    if (memProf) {
      let passedSkillsObj: any = {};
      try {
        if (memProf.coursePassedSkills) passedSkillsObj = JSON.parse(memProf.coursePassedSkills);
      } catch (e) {}

      let courseSkills: string[] = [];
      try {
        courseSkills = typeof course?.skillsAcquired === 'string' ? JSON.parse(course.skillsAcquired) : (course?.skillsAcquired || []);
      } catch (e) {}

      courseSkills.forEach((s: string) => {
        passedSkillsObj[s] = Math.max(passedSkillsObj[s] || 0, scorePercent);
      });
      memProf.coursePassedSkills = JSON.stringify(passedSkillsObj);

      let badges: string[] = [];
      try {
        if (memProf.verifiedBadges) badges = JSON.parse(memProf.verifiedBadges);
      } catch (e) {}
      if (course?.title && !badges.includes(course.title)) badges.push(course.title);
      memProf.verifiedBadges = JSON.stringify(badges);
    }

    const memAudit: MemoryAuditLog = {
      id: `audit-mem-${Date.now()}`,
      actorId: studentId,
      actorRole: 'STUDENT',
      action: 'CERTIFICATE_ISSUED',
      targetEntity: certNum,
      detailsJson: JSON.stringify({ courseId, scorePercent }),
      timestamp: new Date()
    };
    memoryAuditLogs.push(memAudit);

    return res.json({
      success: true,
      passed: true,
      scorePercent,
      passThreshold,
      certificate: memCert,
      verificationUrl: `/certificate/verify/${memCert.id}`,
      message: `Congratulations! Score: ${scorePercent}%. E-Certificate ${certNum} generated and added to your Digital Portfolio.`
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Industry Course Authoring & Configuration
export const saveCourseStructure = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { modules } = req.body; // Array of { title, summary, lessons: [{ title, content, videoUrl, duration, isCompulsory }] }
    const userId = req.user?.id;

    if (!userId || req.user?.role !== 'INDUSTRY') {
      return res.status(403).json({ message: 'Only Industry Partners can configure course structure' });
    }

    if (isDatabaseConfigured) {
      try {
        // Clear existing modules & lessons for course
        await prisma.module.deleteMany({ where: { courseId } });
        if (Array.isArray(modules)) {
          for (let mIdx = 0; mIdx < modules.length; mIdx++) {
            const mData = modules[mIdx];
            const mod = await prisma.module.create({
              data: {
                courseId,
                title: mData.title,
                order: mIdx + 1,
                summary: mData.summary || ''
              }
            });

            if (Array.isArray(mData.lessons)) {
              for (let lIdx = 0; lIdx < mData.lessons.length; lIdx++) {
                const lData = mData.lessons[lIdx];
                await prisma.lesson.create({
                  data: {
                    moduleId: mod.id,
                    title: lData.title,
                    order: lIdx + 1,
                    content: lData.content || '',
                    videoUrl: lData.videoUrl,
                    duration: lData.duration || '15 mins',
                    isCompulsory: lData.isCompulsory !== false
                  }
                });
              }
            }
          }
        }
        return res.json({ message: 'Course structure saved and published successfully!' });
      } catch (e) {}
    }

    // Memory Fallback
    const existingMods = memoryModules.filter(m => m.courseId === courseId);
    const modIds = existingMods.map(m => m.id);
    for (let i = memoryLessons.length - 1; i >= 0; i--) {
      if (modIds.includes(memoryLessons[i].moduleId)) memoryLessons.splice(i, 1);
    }
    for (let i = memoryModules.length - 1; i >= 0; i--) {
      if (memoryModules[i].courseId === courseId) memoryModules.splice(i, 1);
    }

    if (Array.isArray(modules)) {
      modules.forEach((mData: any, mIdx: number) => {
        const modId = `mod-mem-${Date.now()}-${mIdx}`;
        memoryModules.push({
          id: modId,
          courseId,
          title: mData.title,
          order: mIdx + 1,
          summary: mData.summary || ''
        });

        if (Array.isArray(mData.lessons)) {
          mData.lessons.forEach((lData: any, lIdx: number) => {
            memoryLessons.push({
              id: `les-mem-${Date.now()}-${mIdx}-${lIdx}`,
              moduleId: modId,
              title: lData.title,
              order: lIdx + 1,
              content: lData.content || '',
              videoUrl: lData.videoUrl,
              duration: lData.duration || '15 mins',
              isCompulsory: lData.isCompulsory !== false
            });
          });
        }
      });
    }

    return res.json({ message: 'Course structure saved and published successfully!' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};
