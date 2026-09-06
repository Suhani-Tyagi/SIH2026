# 🌿 AYUSH Setu (AYUSH Setu Portal)

> **Tagline:** *"Bridging AYUSH Academia, Industry & Careers"*  
> **Conceptually Sponsored By:** Ministry of AYUSH / All India Institute of Ayurveda (AIIA)  
> **Platform Purpose:** Full-stack Academia–Industry Collaboration Portal for Skill Mapping, Internships, and Placements purpose-built for the AYUSH (Ayurveda, Yoga, Unani, Siddha, Homoeopathy) education and industry ecosystem.

---

## 🌟 Overview & Problem Solved

There is a critical gap between skills taught in AYUSH colleges (*BAMS, BHMS, BUMS, BSMS, BNYS*) and what the modern AYUSH industry (*pharma giants like Dabur, Himalaya, Kerala Ayurveda, Patanjali, Kottakkal, Charak, wellness centers, research institutes, export houses*) actually needs.

**AYUSH Setu** bridges all stakeholders into a single unified platform:
1. **Students**: Assess technical AYUSH skills (*Panchakarma, Dravyaguna, Nadi Pariksha, Yoga Therapy*), receive a visual Radar Skill Profile benchmarked against 5 career tracks, apply to matched internships with calculated match %, complete industry courses, and build verified digital portfolios.
2. **Industry Partners**: Post jobs/internships with required skill tags, view candidate applications ranked by skill-match %, manage recruitment pipelines, and publish industry training programs.
3. **Academicians**: Discover Faculty Development Programs (FDPs), joint industry research grants, consultancies, and manage student mentorship requests.
4. **Institution Admins**: Track college-wide skill gap trends across batches, placement readiness %, and missing industrial competencies.
5. **Super Admin (AIIA)**: Platform-wide national analytics aggregating student supply vs industry skill demand, regional distribution maps, and partner approvals.

---

## 🚀 Tech Stack

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS + Lucide Icons + Recharts + React Router v6
- **Backend**: Node.js + Express (REST API) + Prisma ORM + JWT Auth + bcryptjs
- **Database**: SQLite (`prisma/dev.db`) — zero-config, instant seeding out of the box
- **Theme Palette**: Deep Herbal Green (`#1B5E20`), Warm Saffron/Amber (`#E8A33D`), Off-white Background (`#FBFBF7`), with subtle tricolor government header accents.

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Install & Seed Backend
```bash
cd backend
npm install
npx prisma db push
npm run db:seed
npm run dev
```
*Backend API will run on `http://localhost:5000`.*

### 2. Install & Start Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend application will run on `http://localhost:5173`.*

---

## 🔑 Demo Login Credentials (1-Click Quick Demo)

The login page contains a **"1-Click Quick Demo Switcher"** and top navbar role switcher allowing instant access without typing passwords:

| Persona | Role | Email | Password |
|---|---|---|---|
| **Student** | `STUDENT` | `aarav.sharma@student.aiia.ac.in` | `password123` |
| **Industry Partner** | `INDUSTRY` | `careers@daburayush.com` | `password123` |
| **Academician** | `ACADEMICIAN` | `dr.sharma@aiia-delhi.ac.in` | `password123` |
| **Institution Admin** | `INSTITUTION_ADMIN` | `admin@aiia-delhi.ac.in` | `password123` |
| **Super Admin (AIIA)** | `SUPER_ADMIN` | `admin@aiia.gov.in` | `password123` |

---

## 🗺️ Key Routes & Module Breakdown

- `/` — Landing Page (Ecosystem overview, statistics counters, top skill ticker, quick role entry)
- `/login` & `/register` — Role selection auth flows & 1-click quick demo buttons
- `/student/dashboard` — Student readiness KPI, active applications, top matched jobs
- `/student/skill-assessment` — 5-step questionnaire covering technical & soft skills
- `/student/skill-profile` — Recharts Radar & Bar Chart comparing student skills vs 5 career tracks
- `/student/opportunities` — Search & filter internships/jobs with calculated match % and reasoning
- `/student/applications` — Kanban pipeline status tracker (Applied → Shortlisted → Interview → Selected)
- `/student/learning` — Industry certified courses with "Simulate Complete Course" action
- `/student/portfolio` — Shareable verified digital portfolio with copyable public URL
- `/student/messages` — Direct mentorship & industry inquiry inbox
- `/industry/dashboard` — Hiring metrics & applicant review table
- `/industry/post-opportunity` — Form to publish new AYUSH internships/jobs
- `/industry/applicants` — Candidate pipeline manager with status updater
- `/industry/learning-programs` — Publish new industry courses / FDPs
- `/academician/dashboard` & `/academician/opportunities` — FDPs, joint research grants, mentorship
- `/institution/dashboard` & `/institution/analytics` — College skill gap trends & placement charts
- `/admin/dashboard` — AIIA Super Admin national platform oversight & partner queue
