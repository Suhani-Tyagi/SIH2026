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

  // Strip surrounding quotes and whitespace
  let clean = rawUrl.trim().replace(/^["']|["']$/g, '');

  // Check for dummy placeholders or invalid protocols
  if (
    clean.includes('dummy') ||
    clean.includes('placeholder') ||
    clean.includes('ep-placeholder') ||
    (!clean.startsWith('postgres://') && !clean.startsWith('postgresql://'))
  ) {
    return null;
  }

  return clean;
}

const activeUrl = getCleanDatabaseUrl();
export const isDatabaseConfigured = Boolean(activeUrl);

// Safe, syntactically valid fallback URL for Prisma Client constructor
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
  try {
    // Test if User table exists
    await prisma.user.count();
    isTableCheckDone = true;
  } catch (err: any) {
    if (err.message && (err.message.includes('does not exist') || err.message.includes('P2021') || err.message.includes('table'))) {
      console.log('⚡ Auto-creating missing PostgreSQL tables on target database...');
      try {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "role" TEXT NOT NULL,
            "system" TEXT NOT NULL DEFAULT 'AYURVEDA',
            "avatar" TEXT,
            "institutionName" TEXT,
            "companyName" TEXT,
            "designation" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "User_pkey" PRIMARY KEY ("id")
          );

          CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

          CREATE TABLE IF NOT EXISTS "StudentProfile" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "degree" TEXT NOT NULL DEFAULT 'BAMS',
            "passoutYear" INTEGER NOT NULL DEFAULT 2025,
            "readinessScore" INTEGER NOT NULL DEFAULT 75,
            "bio" TEXT,
            "phone" TEXT,
            "location" TEXT DEFAULT 'New Delhi, India',
            "skillScores" TEXT NOT NULL DEFAULT '{}',
            "verifiedBadges" TEXT NOT NULL DEFAULT '[]',
            CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
          );

          CREATE UNIQUE INDEX IF NOT EXISTS "StudentProfile_userId_key" ON "StudentProfile"("userId");

          CREATE TABLE IF NOT EXISTS "SkillAssessment" (
            "id" TEXT NOT NULL,
            "studentId" TEXT NOT NULL,
            "technicalScore" INTEGER NOT NULL,
            "softSkillScore" INTEGER NOT NULL,
            "answers" TEXT NOT NULL,
            "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "SkillAssessment_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "Opportunity" (
            "id" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "companyName" TEXT NOT NULL,
            "companyId" TEXT NOT NULL,
            "system" TEXT NOT NULL DEFAULT 'ALL',
            "skillsRequired" TEXT NOT NULL,
            "stipend" TEXT NOT NULL,
            "location" TEXT NOT NULL,
            "mode" TEXT NOT NULL DEFAULT 'ONSITE',
            "duration" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "active" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "Application" (
            "id" TEXT NOT NULL,
            "opportunityId" TEXT NOT NULL,
            "studentId" TEXT NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'APPLIED',
            "matchScore" INTEGER NOT NULL DEFAULT 80,
            "coverLetter" TEXT,
            "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "Course" (
            "id" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "providerName" TEXT NOT NULL,
            "companyId" TEXT NOT NULL,
            "duration" TEXT NOT NULL,
            "level" TEXT NOT NULL DEFAULT 'Intermediate',
            "skillsAcquired" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "image" TEXT,
            "price" TEXT NOT NULL DEFAULT 'Free (Ministry Sponsored)',
            "enrollmentsCount" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "Enrollment" (
            "id" TEXT NOT NULL,
            "courseId" TEXT NOT NULL,
            "studentId" TEXT NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'ENROLLED',
            "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "completedAt" TIMESTAMP(3),
            CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "AcademicProgram" (
            "id" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "academicianId" TEXT NOT NULL,
            "organizerName" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "targetAudience" TEXT NOT NULL DEFAULT 'AYUSH Faculty & Researchers',
            "status" TEXT NOT NULL DEFAULT 'OPEN',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "AcademicProgram_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "Message" (
            "id" TEXT NOT NULL,
            "senderId" TEXT NOT NULL,
            "receiverId" TEXT NOT NULL,
            "senderName" TEXT NOT NULL,
            "content" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
          );

          CREATE TABLE IF NOT EXISTS "Notification" (
            "id" TEXT NOT NULL,
            "userId" TEXT NOT NULL,
            "title" TEXT NOT NULL,
            "message" TEXT NOT NULL,
            "type" TEXT NOT NULL DEFAULT 'INFO',
            "read" BOOLEAN NOT NULL DEFAULT false,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
          );
        `);
        console.log('✅ PostgreSQL tables created automatically!');
        isTableCheckDone = true;
      } catch (sqlErr) {
        console.error('Failed to auto-create PostgreSQL tables:', sqlErr);
      }
    }
  }
}

export default prisma;
