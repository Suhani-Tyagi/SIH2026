import { Router } from 'express';
import { register, login, demoLogin, getMe } from '../controllers/authController';
import { getSkillProfile, submitAssessment } from '../controllers/skillsController';
import { getOpportunities, getOpportunityById, createOpportunity } from '../controllers/opportunitiesController';
import { applyToOpportunity, getStudentApplications, getIndustryApplicants, updateApplicationStatus } from '../controllers/applicationsController';
import { getCourses, enrollCourse, completeCourse, createCourse } from '../controllers/coursesController';
import { getAcademicPrograms, createAcademicProgram } from '../controllers/academicianController';
import { getInstitutionAnalytics, getSuperAdminAnalytics } from '../controllers/analyticsController';
import { getMessages, sendMessage } from '../controllers/messagesController';
import { getNotifications, markRead } from '../controllers/notificationsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/demo-login', demoLogin);
router.get('/auth/me', authenticateToken, getMe);

// Skills Routes
router.get('/skills/profile', authenticateToken, getSkillProfile);
router.post('/skills/assessment', authenticateToken, submitAssessment);

// Opportunities Routes
router.get('/opportunities', authenticateToken, getOpportunities);
router.get('/opportunities/:id', getOpportunityById);
router.post('/opportunities', authenticateToken, createOpportunity);

// Applications Routes
router.post('/applications/apply', authenticateToken, applyToOpportunity);
router.get('/applications/student', authenticateToken, getStudentApplications);
router.get('/applications/industry', authenticateToken, getIndustryApplicants);
router.put('/applications/:id/status', authenticateToken, updateApplicationStatus);

// Courses Routes
router.get('/courses', authenticateToken, getCourses);
router.post('/courses/enroll', authenticateToken, enrollCourse);
router.post('/courses/complete', authenticateToken, completeCourse);
router.post('/courses', authenticateToken, createCourse);

// Academician Routes
router.get('/academician/programs', getAcademicPrograms);
router.post('/academician/programs', authenticateToken, createAcademicProgram);

// Analytics Routes
router.get('/analytics/institution', getInstitutionAnalytics);
router.get('/analytics/superadmin', getSuperAdminAnalytics);

// Communication & Notifications
router.get('/messages', authenticateToken, getMessages);
router.post('/messages', authenticateToken, sendMessage);
router.get('/notifications', authenticateToken, getNotifications);
router.post('/notifications/read', authenticateToken, markRead);

export default router;
