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

export default prisma;
