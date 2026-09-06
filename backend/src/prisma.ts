import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Ensure DATABASE_URL is defined to prevent Prisma initialization crashes
const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:dummy@ep-placeholder.us-east-2.aws.neon.tech/neondb?sslmode=require';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

export const isDatabaseConfigured = Boolean(
  process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes('dummy') &&
    !process.env.DATABASE_URL.includes('placeholder')
);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
