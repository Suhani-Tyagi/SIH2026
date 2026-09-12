import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export function getCleanDatabaseUrl(): string | null {
  const rawUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.NEON_DATABASE_URL ||
    process.env.STORAGE_DATABASE_URL;
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  let clean = rawUrl.trim().replace(/^["']|["']$/g, '');

  if (
    clean.includes('dummy') ||
    clean.includes('placeholder') ||
    clean.includes('ep-placeholder') ||
    clean.includes('ep-damp-flower') ||
    clean.includes('ep-damp') ||
    (!clean.startsWith('postgres://') && !clean.startsWith('postgresql://'))
  ) {
    return null;
  }

  return clean;
}

const activeUrl = getCleanDatabaseUrl();
export const isDatabaseConfigured = Boolean(activeUrl);

if (!isDatabaseConfigured) {
  console.warn('[AYUSH SETU] WARNING: No DATABASE_URL configured. Falling back to ephemeral in-memory/tmp storage. Password hashes and accounts WILL NOT reliably persist or stay consistent across serverless instances. Set DATABASE_URL (or POSTGRES_URL / POSTGRES_PRISMA_URL) in your deployment environment variables to fix this permanently.');
}

const clientDatasourceUrl =
  activeUrl || 'postgresql://postgres:postgres@localhost:5432/ayush_setu?sslmode=disable';

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: clientDatasourceUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

let isTableCheckDone = false;

export async function ensureTablesExist(): Promise<void> {
  if (isTableCheckDone || !isDatabaseConfigured) return;

  const statements = [
    `CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL,
      "system" TEXT NOT NULL DEFAULT 'AYURVEDA',
      "avatar" TEXT,
      "institutionName" TEXT,
      "companyName" TEXT,
      "designation" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "StudentProfile" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL UNIQUE,
      "degree" TEXT NOT NULL DEFAULT 'BAMS',
      "passoutYear" INTEGER NOT NULL DEFAULT 2025,
      "readinessScore" INTEGER NOT NULL DEFAULT 75,
      "bio" TEXT,
      "phone" TEXT,
      "location" TEXT DEFAULT 'New Delhi, India',
      "skillScores" TEXT NOT NULL DEFAULT '{}',
      "assessedSkills" TEXT NOT NULL DEFAULT '{}',
      "coursePassedSkills" TEXT NOT NULL DEFAULT '{}',
      "mentorVerifiedSkills" TEXT NOT NULL DEFAULT '{}',
      "verifiedBadges" TEXT NOT NULL DEFAULT '[]',
      "careerGoals" TEXT NOT NULL DEFAULT '[]'
    )`,
    `ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "assessedSkills" TEXT NOT NULL DEFAULT '{}'`,
    `ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "coursePassedSkills" TEXT NOT NULL DEFAULT '{}'`,
    `ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "mentorVerifiedSkills" TEXT NOT NULL DEFAULT '{}'`,
    `ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "careerGoals" TEXT NOT NULL DEFAULT '[]'`,
    `CREATE TABLE IF NOT EXISTS "JobRole" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "code" TEXT NOT NULL UNIQUE,
      "system" TEXT NOT NULL DEFAULT 'AYURVEDA',
      "summary" TEXT NOT NULL,
      "careerPathway" TEXT NOT NULL,
      "eligibleDegrees" TEXT NOT NULL,
      "coreSkills" TEXT NOT NULL,
      "secondarySkills" TEXT NOT NULL,
      "typicalSalaryRange" TEXT NOT NULL,
      "demandSignal" TEXT NOT NULL DEFAULT 'HIGH',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "TargetRole" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "jobRoleId" TEXT NOT NULL,
      "targetLevel" INTEGER NOT NULL DEFAULT 85,
      "selectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "AssessmentQuestion" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "discipline" TEXT NOT NULL DEFAULT 'AYURVEDA',
      "skillCategory" TEXT NOT NULL,
      "questionType" TEXT NOT NULL DEFAULT 'MCQ',
      "difficulty" TEXT NOT NULL DEFAULT 'INTERMEDIATE',
      "weight" INTEGER NOT NULL DEFAULT 10,
      "questionText" TEXT NOT NULL,
      "options" TEXT NOT NULL,
      "correctAnswer" TEXT NOT NULL,
      "explanation" TEXT NOT NULL,
      "referenceDoc" TEXT,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "AssessmentAttempt" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "discipline" TEXT NOT NULL DEFAULT 'AYURVEDA',
      "totalScore" INTEGER NOT NULL,
      "technicalScore" INTEGER NOT NULL,
      "softSkillScore" INTEGER NOT NULL,
      "categoryBreakdown" TEXT NOT NULL,
      "answers" TEXT NOT NULL,
      "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Opportunity" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "companyName" TEXT NOT NULL,
      "companyId" TEXT NOT NULL,
      "system" TEXT NOT NULL DEFAULT 'ALL',
      "department" TEXT NOT NULL DEFAULT 'R&D / Clinical Operations',
      "skillsRequired" TEXT NOT NULL,
      "preferredSkills" TEXT NOT NULL DEFAULT '[]',
      "stipend" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "mode" TEXT NOT NULL DEFAULT 'ONSITE',
      "duration" TEXT NOT NULL,
      "openings" INTEGER NOT NULL DEFAULT 5,
      "applicationDeadline" TEXT DEFAULT '2026-10-31',
      "joiningDate" TEXT DEFAULT '2026-11-15',
      "minDegree" TEXT NOT NULL DEFAULT 'BAMS',
      "eligibleBatch" INTEGER NOT NULL DEFAULT 2025,
      "description" TEXT NOT NULL,
      "selectionStages" TEXT NOT NULL DEFAULT '["Application Review","Technical Interview","HR Fit"]',
      "knockoutQuestions" TEXT NOT NULL DEFAULT '[]',
      "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
      "companyVerified" BOOLEAN NOT NULL DEFAULT true,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Application" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "opportunityId" TEXT NOT NULL,
      "studentId" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'APPLIED',
      "matchScore" INTEGER NOT NULL DEFAULT 80,
      "matchSnapshot" TEXT NOT NULL DEFAULT '{}',
      "coverLetter" TEXT,
      "answers" TEXT NOT NULL DEFAULT '{}',
      "interviewDate" TEXT,
      "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "TimelineEvent" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "applicationId" TEXT NOT NULL,
      "actorName" TEXT NOT NULL,
      "actorRole" TEXT NOT NULL,
      "stage" TEXT NOT NULL,
      "note" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Course" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "providerName" TEXT NOT NULL,
      "companyId" TEXT NOT NULL,
      "duration" TEXT NOT NULL,
      "level" TEXT NOT NULL DEFAULT 'Intermediate',
      "deliveryMode" TEXT NOT NULL DEFAULT 'HYBRID',
      "system" TEXT NOT NULL DEFAULT 'AYURVEDA',
      "skillsAcquired" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "learningOutcomes" TEXT NOT NULL DEFAULT '[]',
      "modulesJson" TEXT NOT NULL DEFAULT '[]',
      "instructorDetails" TEXT NOT NULL DEFAULT '{}',
      "capacity" INTEGER NOT NULL DEFAULT 100,
      "registrationDeadline" TEXT DEFAULT '2026-11-30',
      "passThreshold" INTEGER NOT NULL DEFAULT 70,
      "image" TEXT,
      "price" TEXT NOT NULL DEFAULT 'Free (Ministry Sponsored)',
      "enrollmentsCount" INTEGER NOT NULL DEFAULT 0,
      "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Enrollment" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "courseId" TEXT NOT NULL,
      "studentId" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'ENROLLED',
      "progressPercent" INTEGER NOT NULL DEFAULT 0,
      "quizScore" INTEGER,
      "certificateHash" TEXT,
      "completedAt" TIMESTAMP(3),
      "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "InternshipLifecycle" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "opportunityId" TEXT NOT NULL,
      "studentId" TEXT NOT NULL,
      "mentorName" TEXT NOT NULL,
      "onboardingStatus" TEXT NOT NULL DEFAULT 'COMPLETED',
      "weeklyLogs" TEXT NOT NULL DEFAULT '[]',
      "midpointEvaluation" TEXT NOT NULL DEFAULT '{}',
      "finalEvaluation" TEXT NOT NULL DEFAULT '{}',
      "completionStatus" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
      "certificateHash" TEXT,
      "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "completedAt" TIMESTAMP(3)
    )`,
    `CREATE TABLE IF NOT EXISTS "AcademicProgram" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "academicianId" TEXT NOT NULL,
      "organizerName" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "targetAudience" TEXT NOT NULL DEFAULT 'AYUSH Faculty & Researchers',
      "status" TEXT NOT NULL DEFAULT 'OPEN',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "DocumentVault" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "fileName" TEXT NOT NULL,
      "fileCategory" TEXT NOT NULL,
      "fileUrl" TEXT NOT NULL,
      "fileSize" TEXT NOT NULL DEFAULT '1.2 MB',
      "verificationStatus" TEXT NOT NULL DEFAULT 'VERIFIED',
      "checksum" TEXT,
      "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "MentorshipRequest" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "studentId" TEXT NOT NULL,
      "mentorId" TEXT NOT NULL,
      "topic" TEXT NOT NULL,
      "notes" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "ResearchProposal" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "academicianId" TEXT NOT NULL,
      "industryOrg" TEXT NOT NULL,
      "discipline" TEXT NOT NULL DEFAULT 'AYURVEDA',
      "budget" TEXT NOT NULL DEFAULT '₹5,00,000',
      "status" TEXT NOT NULL DEFAULT 'UNDER_REVIEW',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "IntegrationLog" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "sourceSystem" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "itemsSynced" INTEGER NOT NULL DEFAULT 1,
      "status" TEXT NOT NULL DEFAULT 'SUCCESS',
      "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Message" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "senderId" TEXT NOT NULL,
      "receiverId" TEXT NOT NULL,
      "senderName" TEXT NOT NULL,
      "content" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Module" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "courseId" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 1,
      "summary" TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Lesson" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "moduleId" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 1,
      "content" TEXT NOT NULL,
      "videoUrl" TEXT,
      "duration" TEXT NOT NULL DEFAULT '15 mins',
      "isCompulsory" BOOLEAN NOT NULL DEFAULT true
    )`,
    `CREATE TABLE IF NOT EXISTS "LearningResource" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "courseId" TEXT NOT NULL,
      "lessonId" TEXT,
      "title" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'PDF',
      "fileUrl" TEXT NOT NULL,
      "fileSize" TEXT NOT NULL DEFAULT '2.4 MB',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "LessonProgress" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "enrollmentId" TEXT NOT NULL,
      "lessonId" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'LOCKED',
      "completedAt" TIMESTAMP(3),
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "CourseAssessment" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "courseId" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "passScorePercent" INTEGER NOT NULL DEFAULT 75,
      "timeLimitMinutes" INTEGER NOT NULL DEFAULT 30,
      "questionsJson" TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Certificate" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "certificateNumber" TEXT NOT NULL UNIQUE,
      "enrollmentId" TEXT NOT NULL,
      "studentId" TEXT NOT NULL,
      "courseId" TEXT NOT NULL,
      "studentName" TEXT NOT NULL,
      "courseTitle" TEXT NOT NULL,
      "providerName" TEXT NOT NULL,
      "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "score" INTEGER NOT NULL DEFAULT 85,
      "verificationQrToken" TEXT NOT NULL,
      "signatory" TEXT NOT NULL DEFAULT 'Ministry of AYUSH & AIIA Academic Cell',
      "status" TEXT NOT NULL DEFAULT 'VALID',
      "revocationReason" TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS "MentorshipSession" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "requestId" TEXT NOT NULL,
      "studentId" TEXT NOT NULL,
      "mentorId" TEXT NOT NULL,
      "scheduledAt" TEXT NOT NULL,
      "agenda" TEXT NOT NULL,
      "notes" TEXT,
      "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "AuditLog" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "actorId" TEXT NOT NULL,
      "actorRole" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "targetEntity" TEXT NOT NULL,
      "detailsJson" TEXT NOT NULL DEFAULT '{}',
      "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  try {
    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt);
    }
    console.log('✅ All AYUSH Setu PostgreSQL tables verified and created!');
    isTableCheckDone = true;
  } catch (sqlErr) {
    console.error('Failed to auto-create PostgreSQL tables:', sqlErr);
  }
}

export default prisma;
