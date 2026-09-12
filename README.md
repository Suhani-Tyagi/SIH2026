# 🌿 AYUSH Setu (Academia-Industry Collaboration & Skill Mapping Portal)

> **Tagline:** *"Bridging AYUSH Academia, Industry & Careers"*  
> **Problem Statement:** SIH 2026 PS 26044  
> **Conceptually Sponsored By:** Ministry of AYUSH / All India Institute of Ayurveda (AIIA)  

---

## 🌟 Overview

**AYUSH Setu** is a production-grade full-stack platform built for the AYUSH (Ayurveda, Yoga & Naturopathy, Unani, Siddha, Homoeopathy) sector to bridge the gap between academic education (*BAMS, BHMS, BUMS, BSMS, BNYS*) and industrial workforce needs (*Pharma companies, Panchakarma centers, hospitals, research institutes, export houses*).

---

## 🛠 Database Architecture & Production Migration (PostgreSQL)

### Background & Serverless Compatibility Fix
- **Previous Issue**: The platform previously used file-based SQLite (`dev.db`). On serverless platforms like Vercel, the local filesystem is read-only in production functions (except `/tmp`), causing `PrismaClient` initialization to fail with `Error code 14: Unable to open the database file` on authentication attempts.
- **Hosted PostgreSQL Solution**: Migrated `backend/prisma/schema.prisma` datasource provider from `"sqlite"` to `"postgresql"`.
- **Serverless Connection Pooling**: Implemented a global Prisma Client singleton (`backend/src/prisma.ts`) to prevent connection pool exhaustion across Vercel serverless function invocations.

---

## 🎨 Official Government Logos & Brand Assets

1. **Top Header Bar**:
   - Replaced plain-text labels with official high-resolution emblems:
     - **Government of India Emblem & Wordmark**: `public/assets/emblem-gov-india.png`
     - **Ministry of AYUSH Emblem & Wordmark**: `public/assets/emblem-ministry-ayush.png`
   - Rendered with responsive sizing, alt text, and proper alignment for both mobile and desktop screens.
2. **Site Logo & Branding**:
   - Updated product icon to the circular Academia logo mark (`public/assets/logo-academia.png`) featuring the graduation cap, briefcase, and gear elements.
   - Maintained **AYUSH Setu** as the main brand title in header and navbar.
   - Updated favicons and apple-touch-icons.

---

## 🚀 Key Features Implemented (Backed by PostgreSQL DB)

- **A. Skill Assessment (Student)**: Multi-question technical + soft skills assessment persisting student skill profiles and rendering dynamic radar/bar gap charts.
- **B. Skill Mapping & Recommendations**: Algorithmic match scoring comparing student skill profiles against opportunity requirements.
- **C. Industry Opportunities & Applications**: Industry partners post job/internship listings; students apply with live match %; industry manages applicant pipeline status (`APPLIED` → `SHORTLISTED` → `INTERVIEW` → `SELECTED` / `REJECTED`).
- **D. Industry Learning Programs**: Courses published by industry partners; student enrollments and completion update verified skill badges.
- **E. Academician Portal**: Central feed for FDPs, joint research, consultancy, and faculty mentorship availability postings.
- **F. Institution & AIIA Analytics**: Real-time SQL aggregations driving institutional dashboards for student readiness, placement rates, and skill gap metrics.
- **G. Digital Portfolio**: Auto-generated student portfolio accessible via public read-only route (`/portfolio/public/:userId`).
- **H. Collaboration & Messaging**: DB-backed internal messaging and automated event notifications.
- **I. Server-Side RBAC**: JWT authorization middleware (`authenticateToken` and `authorizeRoles`) guarding all backend endpoints.

---

## 🔒 Role-Based Access Control (RBAC) Endpoints

- `POST /api/opportunities` — Restricted to `INDUSTRY`
- `PUT /api/applications/:id/status` — Restricted to `INDUSTRY`
- `POST /api/courses` — Restricted to `INDUSTRY`
- `POST /api/academician/programs` — Restricted to `ACADEMICIAN`
- `POST /api/skills/assessment` — Restricted to `STUDENT`
- `GET /api/analytics/institution` — Restricted to `INSTITUTION_ADMIN` & `SUPER_ADMIN`

---

## ⚡ Environment & Setup Instructions

### Environment Variables
Configure the following in `backend/.env` and in Vercel Project Settings:

```env
# Database Connections (Hosted PostgreSQL, e.g., Neon / Supabase / Vercel Postgres)
DATABASE_URL="postgresql://user:password@host:5432/ayush_setu?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/ayush_setu?sslmode=require"

> ⚠️ **Required in production**: without a real `DATABASE_URL` set in your hosting provider's environment variables, user accounts will silently fail to persist across requests due to how serverless functions isolate memory. This is the most common cause of 'my account disappeared' bugs after deployment.

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret
JWT_SECRET="ayush_setu_jwt_secret_sih_2026_production"
```

### 1. Backend Setup & Migrations
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```
*Backend API runs on `http://localhost:5000`.*

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend application runs on `http://localhost:5173`.*

---

## 🌐 Public Shareable Digital Portfolio

Share verified student credentials using the public URL:
```
http://localhost:5173/portfolio/public/:userId
```
