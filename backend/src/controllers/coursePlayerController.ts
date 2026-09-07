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

// Direct embeds are deliberately disabled until each lecture has completed a
// human content, source and age-appropriateness review.  Search links give
// learners a useful YouTube route without silently endorsing a guessed ID.
const COURSE_YOUTUBE_SEARCH_TERMS: Record<string, string> = {
  'crs-1': 'HPTLC herbal drug standardisation lecture',
  'crs-2': 'Kerala Ayurveda Panchakarma clinical training lecture',
  'crs-3': 'Good Clinical Practice principles lecture',
  'crs-4': 'yoga therapy metabolic disorders lecture',
  'crs-5': 'GMP batch manufacturing records lecture',
  'crs-6': 'herbal product export compliance dossier writing lecture',
  'crs-7': 'Nadi Pariksha Ashtavidha Pariksha lecture',
  'crs-8': 'patient counselling clinical communication lecture',
  'crs-9': 'in vitro assay controls laboratory lecture',
  'crs-10': 'scientific writing manuscript peer review lecture'
};

const courseVideoSearchUrl = (courseId: string) => {
  const term = COURSE_YOUTUBE_SEARCH_TERMS[courseId] || 'AYUSH clinical laboratory professional lecture';
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(term)}`;
};

// Published courses must remain usable even when an industry author has not
// supplied a bespoke module plan yet. These are full starter lessons, not blank
// placeholders, and are also used by the serverless demo data.
const buildStarterModules = (courseId: string, courseTitle: string) => [
  {
    id: `${courseId}-foundation`, courseId, title: 'Foundation: concepts, safety and scope', order: 1,
    summary: `Build a safe, evidence-aware foundation for ${courseTitle}.`,
    lessons: [
      { id: `${courseId}-l1`, title: 'Orientation and learning outcomes', order: 1, duration: '12 mins', isCompulsory: true, videoSearchUrl: courseVideoSearchUrl(courseId), content: `Welcome to ${courseTitle}. This lesson explains the clinical or laboratory context, expected competencies, professional boundaries and how the course assessment is evaluated.` },
      { id: `${courseId}-l2`, title: 'Standards, documentation and safe practice', order: 2, duration: '18 mins', isCompulsory: true, videoSearchUrl: courseVideoSearchUrl(courseId), content: 'Study the required quality checks, record keeping, consent, adverse-event escalation and the relevant AYUSH/industry standard operating procedures before applying a protocol.' }
    ]
  },
  {
    id: `${courseId}-practice`, courseId, title: 'Applied practice and case review', order: 2,
    summary: 'Apply the framework to a supervised case and consolidate your evidence.',
    lessons: [
      { id: `${courseId}-l3`, title: 'Guided protocol walkthrough', order: 1, duration: '20 mins', isCompulsory: true, videoSearchUrl: courseVideoSearchUrl(courseId), content: 'Follow the workflow step by step: prepare materials, verify the checklist, document observations, interpret findings and identify when referral or supervisor review is required.' },
      { id: `${courseId}-l4`, title: 'Case study, reflection and assessment preparation', order: 2, duration: '15 mins', isCompulsory: true, videoSearchUrl: courseVideoSearchUrl(courseId), content: 'Review a realistic case scenario, compare your decisions to the model answer, note gaps in your evidence and revise the key controls before attempting the final aptitude assessment.' }
    ]
  }
];

const buildStarterAssessment = (courseId: string, courseTitle = 'this course') => ({
  id: `${courseId}-assessment`, courseId, title: `${courseTitle} — Final Aptitude Assessment`, passScorePercent: 75, timeLimitMinutes: 20,
  questionsJson: JSON.stringify([
    { id: 'q1', question: 'What is the first action before beginning a supervised AYUSH clinical or laboratory protocol?', options: ['Document identity, consent and eligibility checks', 'Skip directly to the procedure', 'Record results after completion only', 'Ask a marketing team to approve it'], correctAnswer: 'Document identity, consent and eligibility checks' },
    { id: 'q2', question: 'Why is contemporaneous documentation important in an industry learning workflow?', options: ['It creates a traceable and reviewable record', 'It replaces quality checks', 'It is optional after certification', 'It prevents any supervisor review'], correctAnswer: 'It creates a traceable and reviewable record' },
    { id: 'q3', question: 'When an observation falls outside the approved protocol, what is the appropriate response?', options: ['Pause, record it and escalate to the supervisor', 'Ignore it to maintain timing', 'Change the record later', 'Continue without a checklist'], correctAnswer: 'Pause, record it and escalate to the supervisor' },
    { id: 'q4', question: 'Which evidence best supports safe completion of a learning case?', options: ['Completed checklist, observations and reflective rationale', 'Only a verbal summary', 'An unverified social-media post', 'No records are required'], correctAnswer: 'Completed checklist, observations and reflective rationale' }
  ])
});

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

    const usesStarterModules = modules.length === 0;
    if (usesStarterModules) {
      modules = buildStarterModules(courseId, course.title);
      resources = [{ id: `${courseId}-resource`, courseId, title: 'Course workbook: protocol checklist and case reflection', type: 'WORKSHEET', fileUrl: `/assets/worksheets/${courseId}-workbook.pdf`, fileSize: '3 KB' }];
    }

    resources = resources.map((resource: any) => ({
      ...resource,
      fileUrl: String(resource.fileUrl || '').includes('dummy.pdf') ? `/assets/worksheets/${courseId}-workbook.pdf` : resource.fileUrl
    }));

    modules = modules.map((module: any) => ({
      ...module,
      lessons: (module.lessons || []).map((lesson: any) => ({
        ...lesson,
        // Do not pass through legacy or guessed embeds. A course author may
        // submit a reviewed URL in a future moderation workflow; until then,
        // expose the contextual search link only.
        videoUrl: undefined,
        videoSearchUrl: courseVideoSearchUrl(courseId)
      }))
    }));

    // Map progress status onto lessons
    const progressMap = new Map(lessonProgressList.map(lp => [lp.lessonId, lp]));
    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    const starterCompletedCount = usesStarterModules ? Math.round((enrollment?.progressPercent || 0) / 25) : 0;
    const modulesWithProgress = modules.map((mod: any, mIdx: number) => {
      const lessonsWithStatus = (mod.lessons || []).map((les: any, lIdx: number) => {
        totalLessonsCount++;
        const prog = progressMap.get(les.id);
        const lessonNumber = totalLessonsCount;
        let status = prog ? prog.status : usesStarterModules
          ? (lessonNumber <= starterCompletedCount ? 'COMPLETED' : lessonNumber === starterCompletedCount + 1 ? 'AVAILABLE' : 'LOCKED')
          : (mIdx === 0 && lIdx === 0 ? 'AVAILABLE' : 'LOCKED');
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
        let enrollment = await prisma.enrollment.findFirst({
          where: { courseId, studentId }
        });
        // If a learner arrives from the course catalogue while an earlier
        // enrolment request was interrupted, recover the intended enrolment
        // before saving learning progress. This keeps the learning journey
        // idempotent across slow mobile/serverless requests.
        if (!enrollment) {
          enrollment = await prisma.enrollment.create({
            data: { courseId, studentId, status: 'ENROLLED', progressPercent: 0 }
          });
        }

        // Starter course lessons are intentionally generated at runtime for
        // legacy published courses. Persist their progress on the enrollment
        // itself rather than attempting to create a foreign-key record for a
        // generated lesson id.
        if (lessonId.startsWith(`${courseId}-l`)) {
          const lessonNumber = Number(lessonId.split('-l').pop()) || 1;
          const percent = Math.min(100, Math.max(enrollment.progressPercent || 0, lessonNumber * 25));
          await prisma.enrollment.update({ where: { id: enrollment.id }, data: { progressPercent: percent } });
          return res.json({ message: 'Lesson marked complete', progressPercent: percent });
        }

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
    let memEnr = memoryEnrollments.find(e => e.courseId === courseId && e.studentId === studentId);
    if (!memEnr) {
      const createdEnrollment: MemoryEnrollment = {
        id: `enr-mem-${Date.now()}`, courseId, studentId, status: 'ENROLLED', progressPercent: 0, enrolledAt: new Date()
      };
      memoryEnrollments.push(createdEnrollment);
      memEnr = createdEnrollment;
    }

    if (lessonId.startsWith(`${courseId}-l`)) {
      const lessonNumber = Number(lessonId.split('-l').pop()) || 1;
      const percent = Math.min(100, Math.max(memEnr.progressPercent || 0, lessonNumber * 25));
      memEnr.progressPercent = percent;
      return res.json({ message: 'Lesson marked complete', progressPercent: percent });
    }

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
    if (!assessment) assessment = buildStarterAssessment(courseId, memoryCourses.find(c => c.id === courseId)?.title);

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

    if (!assessment) assessment = buildStarterAssessment(courseId, course?.title);
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
