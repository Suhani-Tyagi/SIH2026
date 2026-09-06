import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { getSkillProfile, submitAssessment, getPublicPortfolio } from '../controllers/skillsController';
import { getOpportunities, getOpportunityById, createOpportunity } from '../controllers/opportunitiesController';
import { applyToOpportunity, getStudentApplications, getIndustryApplicants, updateApplicationStatus } from '../controllers/applicationsController';
import { getCourses, enrollCourse, completeCourse, createCourse } from '../controllers/coursesController';
import { getAcademicPrograms, createAcademicProgram } from '../controllers/academicianController';
import { getInstitutionAnalytics, getSuperAdminAnalytics } from '../controllers/analyticsController';
import { getMessages, sendMessage } from '../controllers/messagesController';
import { getNotifications, markRead } from '../controllers/notificationsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Auth Routes (Public & Me)
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);

// Public Portfolio Route (No login required)
router.get('/skills/portfolio/public/:userId', getPublicPortfolio);

// Skills Routes
router.get('/skills/profile', authenticateToken, getSkillProfile);
router.post('/skills/assessment', authenticateToken, authorizeRoles('STUDENT'), submitAssessment);

// Opportunities Routes
router.get('/opportunities', authenticateToken, getOpportunities);
router.get('/opportunities/:id', authenticateToken, getOpportunityById);
router.post('/opportunities', authenticateToken, authorizeRoles('INDUSTRY'), createOpportunity);

// Applications Routes (RBAC Protected)
router.post('/applications/apply', authenticateToken, authorizeRoles('STUDENT'), applyToOpportunity);
router.get('/applications/student', authenticateToken, authorizeRoles('STUDENT'), getStudentApplications);
router.get('/applications/industry', authenticateToken, authorizeRoles('INDUSTRY'), getIndustryApplicants);
router.put('/applications/:id/status', authenticateToken, authorizeRoles('INDUSTRY'), updateApplicationStatus);

// Courses Routes (RBAC Protected)
router.get('/courses', authenticateToken, getCourses);
router.post('/courses/enroll', authenticateToken, authorizeRoles('STUDENT'), enrollCourse);
router.post('/courses/complete', authenticateToken, authorizeRoles('STUDENT'), completeCourse);
router.post('/courses', authenticateToken, authorizeRoles('INDUSTRY'), createCourse);

// Academician Routes (RBAC Protected)
router.get('/academician/programs', authenticateToken, getAcademicPrograms);
router.post('/academician/programs', authenticateToken, authorizeRoles('ACADEMICIAN'), createAcademicProgram);

// Analytics Routes (RBAC Protected)
router.get('/analytics/institution', authenticateToken, authorizeRoles('INSTITUTION_ADMIN', 'SUPER_ADMIN'), getInstitutionAnalytics);
router.get('/analytics/superadmin', authenticateToken, authorizeRoles('SUPER_ADMIN'), getSuperAdminAnalytics);

// Communication & Notifications
router.get('/messages', authenticateToken, getMessages);
router.post('/messages', authenticateToken, sendMessage);
router.get('/notifications', authenticateToken, getNotifications);
router.post('/notifications/read', authenticateToken, markRead);

export default router;
