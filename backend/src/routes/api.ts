import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import {
  getSkillProfile,
  submitAssessment,
  getPublicPortfolio,
  getJobRoles,
  getAssessmentQuestions,
  getCareerGuidance
} from '../controllers/skillsController';
import { getOpportunities, getOpportunityById, createOpportunity, searchCandidates } from '../controllers/opportunitiesController';
import {
  applyToOpportunity,
  getStudentApplications,
  getIndustryApplicants,
  updateApplicationStatus,
  getApplicationTimeline
} from '../controllers/applicationsController';
import { getCourses, enrollCourse, completeCourse, createCourse } from '../controllers/coursesController';
import {
  getCourseDetailsWithModules,
  updateLessonProgress,
  getCourseAssessment,
  submitCourseAssessment,
  saveCourseStructure
} from '../controllers/coursePlayerController';
import {
  verifyCertificatePublic,
  revokeCertificate,
  getStudentCertificates
} from '../controllers/certificateController';
import { getInternshipLifecycle, submitWeeklyLog, submitMentorEvaluation } from '../controllers/internshipController';
import { getStudentDocuments, uploadDocument } from '../controllers/documentController';
import {
  getAcademicPrograms,
  createAcademicProgram,
  getMentorshipRequests,
  requestMentorship,
  getMentorshipSessions,
  scheduleMentorshipSession,
  submitSessionEvaluation
} from '../controllers/academicianController';
import { getInstitutionAnalytics, getSuperAdminAnalytics, exportAnalyticsCSV } from '../controllers/analyticsController';
import { getMessages, sendMessage } from '../controllers/messagesController';
import { getNotifications, markRead } from '../controllers/notificationsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Auth Routes (Public & Me)
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);

// Public Portfolio & Taxonomies & Certificate Verification
router.get('/skills/portfolio/public/:userId', getPublicPortfolio);
router.get('/skills/job-roles', getJobRoles);
router.get('/skills/questions', getAssessmentQuestions);
router.get('/certificate/verify/:certificateId', verifyCertificatePublic);

// Skills & Career Guidance Routes (Protected)
router.get('/skills/profile', authenticateToken, getSkillProfile);
router.post('/skills/assessment', authenticateToken, authorizeRoles('STUDENT'), submitAssessment);
router.get('/skills/guidance', authenticateToken, authorizeRoles('STUDENT'), getCareerGuidance);
router.get('/certificates/student', authenticateToken, authorizeRoles('STUDENT'), getStudentCertificates);
router.post('/certificates/:certificateId/revoke', authenticateToken, authorizeRoles('INDUSTRY', 'SUPER_ADMIN'), revokeCertificate);

// Course Player & Aptitude Assessment Routes
router.get('/courses/:courseId/player', authenticateToken, getCourseDetailsWithModules);
router.post('/courses/:courseId/lessons/:lessonId/progress', authenticateToken, authorizeRoles('STUDENT'), updateLessonProgress);
router.get('/courses/:courseId/assessment', authenticateToken, authorizeRoles('STUDENT'), getCourseAssessment);
router.post('/courses/:courseId/assessment/submit', authenticateToken, authorizeRoles('STUDENT'), submitCourseAssessment);
router.post('/courses/:courseId/structure', authenticateToken, authorizeRoles('INDUSTRY'), saveCourseStructure);

// Opportunities & Candidate Search Routes
router.get('/opportunities', authenticateToken, getOpportunities);
router.get('/opportunities/candidates/search', authenticateToken, authorizeRoles('INDUSTRY', 'SUPER_ADMIN'), searchCandidates);
router.get('/opportunities/:id', authenticateToken, getOpportunityById);
router.post('/opportunities', authenticateToken, authorizeRoles('INDUSTRY'), createOpportunity);

// Applications & Timeline Event Routes (RBAC Protected)
router.post('/applications/apply', authenticateToken, authorizeRoles('STUDENT'), applyToOpportunity);
router.get('/applications/student', authenticateToken, authorizeRoles('STUDENT'), getStudentApplications);
router.get('/applications/industry', authenticateToken, authorizeRoles('INDUSTRY'), getIndustryApplicants);
router.put('/applications/:id/status', authenticateToken, authorizeRoles('INDUSTRY'), updateApplicationStatus);
router.get('/applications/:id/timeline', authenticateToken, getApplicationTimeline);

// Courses & Verified Certificates Routes (RBAC Protected)
router.get('/courses', authenticateToken, getCourses);
router.post('/courses/enroll', authenticateToken, authorizeRoles('STUDENT'), enrollCourse);
router.post('/courses/complete', authenticateToken, authorizeRoles('STUDENT'), completeCourse);
router.post('/courses', authenticateToken, authorizeRoles('INDUSTRY'), createCourse);

// Internship Lifecycle & Mentorship Log
router.get('/internship/lifecycle', authenticateToken, authorizeRoles('STUDENT'), getInternshipLifecycle);
router.post('/internship/weekly-log', authenticateToken, authorizeRoles('STUDENT'), submitWeeklyLog);
router.post('/internship/mentor-eval', authenticateToken, authorizeRoles('INDUSTRY', 'ACADEMICIAN'), submitMentorEvaluation);

// Document Vault & Verified Credential Storage
router.get('/documents', authenticateToken, authorizeRoles('STUDENT'), getStudentDocuments);
router.post('/documents/upload', authenticateToken, authorizeRoles('STUDENT'), uploadDocument);

// Academician & Research Collaboration Hub
router.get('/academician/programs', authenticateToken, getAcademicPrograms);
router.post('/academician/programs', authenticateToken, authorizeRoles('ACADEMICIAN'), createAcademicProgram);
router.get('/academician/mentorship', authenticateToken, getMentorshipRequests);
router.post('/academician/mentorship', authenticateToken, authorizeRoles('STUDENT'), requestMentorship);
router.get('/academician/sessions', authenticateToken, getMentorshipSessions);
router.post('/academician/sessions/schedule', authenticateToken, authorizeRoles('ACADEMICIAN'), scheduleMentorshipSession);
router.post('/academician/sessions/evaluate', authenticateToken, authorizeRoles('ACADEMICIAN'), submitSessionEvaluation);

// Analytics & Reports (RBAC Protected)
router.get('/analytics/institution', authenticateToken, authorizeRoles('INSTITUTION_ADMIN', 'SUPER_ADMIN'), getInstitutionAnalytics);
router.get('/analytics/superadmin', authenticateToken, authorizeRoles('SUPER_ADMIN'), getSuperAdminAnalytics);
router.get('/analytics/export-csv', authenticateToken, authorizeRoles('INSTITUTION_ADMIN', 'SUPER_ADMIN'), exportAnalyticsCSV);

// Communication & Notifications
router.get('/messages', authenticateToken, getMessages);
router.post('/messages', authenticateToken, sendMessage);
router.get('/notifications', authenticateToken, getNotifications);
router.post('/notifications/read', authenticateToken, markRead);

export default router;

