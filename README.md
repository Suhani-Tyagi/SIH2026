# 🌿 AYUSH Setu (Academia-Industry Collaboration & Skill Mapping Portal)

> **Tagline:** *"Bridging AYUSH Academia, Industry & Careers"*  
> **Problem Statement:** SIH 2026 PS 26044  
> **Conceptually Sponsored By:** Ministry of AYUSH / All India Institute of Ayurveda (AIIA)  

---

## 🌟 Overview

**AYUSH Setu** is a production-grade full-stack platform built for the AYUSH (Ayurveda, Yoga & Naturopathy, Unani, Siddha, Homoeopathy) sector to bridge the gap between academic education (*BAMS, BHMS, BUMS, BSMS, BNYS*) and industrial workforce needs (*Pharma companies, Panchakarma centers, hospitals, research institutes, export houses*).

---

## 🐛 Root-Cause Diagnosis & Fix: Registration & Login Bug

### The Issue
Users registering on the platform encountered the generic error: `"Registration failed. Email might already be registered."` even on the very first attempt with a brand-new email address.

### Root Cause Analysis
1. **Generic Exception Swallowing**: The frontend `AuthContext` was returning a simple `boolean` (`false`) for any failed request or server response, and `RegisterPage` unconditionally printed `"Registration failed. Email might already be registered."` regardless of the actual server error.
2. **Serverless Ephemeral Storage / Unhandled Field Errors**: On serverless environments (Vercel), writing to ephemeral local files without connection pooling or proper exception logging caused database write locks or unhandled field validation errors that were silently caught and mapped to generic failure responses.

### Solution Applied
1. **Explicit Server-Side Error Handling**: `authController.ts` now performs strict input validation (valid email format, password min 8 characters, role-specific required fields like `companyName` for Industry and `institutionName` for Academician/Institution).
2. **Specific HTTP Statuses & Error Messages**:
   - Duplicate email -> HTTP 409 Conflict: `"An account with the email 'x@y.com' already exists. Please sign in instead."`
   - Validation failure -> HTTP 400 Bad Request with field-specific messages.
   - User not found on login -> HTTP 404 Not Found: `"No account found with the email address 'x@y.com'."`
   - Password mismatch -> HTTP 401 Unauthorized: `"Incorrect password. Please double-check your credentials."`
3. **Database Persistence**: Registered user records are stored directly in the database (`User` and `StudentProfile` tables) and persist across browser sessions and server restarts.

---

## 🔒 Role-Based Access Control (RBAC)

All backend endpoints are strictly protected server-side using JWT middleware (`authenticateToken` and `authorizeRoles`):
- `POST /api/opportunities` — Restricted to `INDUSTRY` partners.
- `PUT /api/applications/:id/status` — Restricted to `INDUSTRY` partners.
- `POST /api/courses` — Restricted to `INDUSTRY` partners.
- `POST /api/academician/programs` — Restricted to `ACADEMICIAN` faculty.
- `POST /api/skills/assessment` — Restricted to `STUDENT` learners.
- `GET /api/analytics/institution` — Restricted to `INSTITUTION_ADMIN` and `SUPER_ADMIN`.
- `GET /api/analytics/superadmin` — Restricted to `SUPER_ADMIN`.

---

## ⚡ Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Database Environment Configuration
By default, the platform uses SQLite stored at `backend/prisma/dev.db` for local development. For production/Vercel serverless deployment with PostgreSQL (Neon / Supabase / Vercel Postgres), set the `DATABASE_URL` environment variable in `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/ayush_setu?sslmode=require"
```

### 1. Backend Setup & DB Migration
```bash
cd backend
npm install
npx prisma db push
npm run db:seed
npm run dev
```
*Backend API server runs on `http://localhost:5000`.*

### 2. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend web application runs on `http://localhost:5173`.*

---

## 🌐 Public Shareable Digital Portfolio

Students can share their verified credentials using the public read-only route:
```
http://localhost:5173/portfolio/public/:userId
```
This endpoint (`GET /api/skills/portfolio/public/:userId`) requires no authentication and allows recruiters and external employers to inspect verified degree credentials, completed industry courses, and skill radar scores.
