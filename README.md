# Techno Spiritual Hackathon (TSH) 2026 — Full-Stack Platform

A full-stack, production-ready web application for the **Techno Spiritual Hackathon (TSH)**. The platform combines an immersive public marketing site with authenticated team registrations, an admin-controlled problem-statement seat system with atomic race-condition prevention, strict anti-duplicate email verification, official UPI QR / Bank Transfer payment verification, and 100% universal multi-device responsiveness.

---

## 🌟 Key Features

### 1. Public Marketing Site
- **Dynamic Hero Section**: Blends futuristic circuit lines with tranquil lotus and spiritual elements. Features rotating philosophical quotes bridging technology and conscious mindfulness. Fully responsive typography and layout across mobile phones, tablets, and laptops.
- **Dynamic Hero State Swap**: Upon completing registration and payment, the Hero section dynamically swaps out the registration CTA for a **"Registration Confirmed ✅"** banner showing the team code, selected Problem Statement, and real-time status.
- **Problem Statements (PS) Page**: Displays concise cards with remaining seat gauges (`e.g., 3/5 seats left`). Clicking **"View Details"** opens an interactive modal revealing Background, Core Challenge, and Key Requirements. Problem Statements with 0 seats remaining are automatically marked as **FULL** and disabled. Features touch-friendly swipeable domain filters.
- **Contact Us Page**: Provides university helpline contacts, JECRC Foundation Sitapura Jaipur campus location details, downloadable event documents (Pitch Deck Template PPTX), and an interactive inquiry box storing queries in the backend.

### 2. Authenticated Registration Flow (Gated)
- **Account Creation & JWT Auth**: User accounts are stored securely in MongoDB with bcrypt password hashing and JWT authentication delivered via `httpOnly` cookies (with Bearer token fallback).
- **Gated Access**: Unauthenticated visits to `/register-team` automatically redirect to `/login` with an informative banner.
- **3-Step Registration Wizard**:
  1. **Step 1 — Choose Problem Statement**: Only tracks with available seats (`seatsAvailable > 0`) can be selected.
  2. **Step 2 — Fixed 4-Member Roster & Anti-Duplicate Rule**:
     - 1 Team Leader (prefilled) + exactly 3 Team Members with validation (Name, Email, Phone, Branch, Year).
     - **Strict Email Uniqueness**: Enforced both client-side and database-wide. An email can only be registered to **one Problem Statement / team nationwide**, preventing duplicate participation.
  3. **Step 3 — Payment & Seat Confirmation**:
     - **Official UPI / Bank Transfer**: Displays official UPI ID (`tsh2026@sbi` with 1-tap copy), SBI Account & IFSC details, and QR code. Allows entering the UTR transaction ID and uploading payment screenshots. Status transitions to `payment_pending` for admin verification.

### 3. Core Concurrency & Seat Decrement Engine
- **Single Source of Truth**: Handled strictly on the backend via MongoDB atomic operations.
- **Atomic Decrement Query**:
  ```javascript
  const ps = await ProblemStatement.findOneAndUpdate(
    { _id: psId, seatsAvailable: { $gt: 0 } },
    { $inc: { seatsAvailable: -1 } },
    { new: true }
  );
  ```
- **Zero Premature Locking**: Seats are held only upon confirmed payment or admin approval so abandoned forms never lock seats.
- **Safe Seat Release**: If an admin rejects or deletes a registration, the seat is safely incremented back.

### 4. Administrator Control Hub
- Protected with role-based access (`role: "admin"`).
- Overview metrics: Total Teams, Confirmed Registrations, and Pending Manual Verifications.
- Filterable registrations table with search across teams, codes, and leader emails (with responsive touch scrolling).
- One-click **Approve** (atomically decrements seat and sets status to `finalized`) and **Reject** (releases seat).
- Live Problem Statement Seat Manager: Click any Problem Statement to inspect registered teams or delete registrations with automatic +1 seat restoration.
- Inquiries view to review submissions from the Contact Us page.

### 5. Universal Responsiveness
- 100% fluid layouts, touch targets, and typography optimized for:
  - **Mobile Phones** (320px — 480px)
  - **Tablets** (768px — 1024px)
  - **Laptops & Desktops** (1280px+)

---

## 📁 Project Architecture (3 Separate Modules)

The platform is structured into three clean, independent, enterprise-grade folders:

```
full-web/
├── frontend/             # 🌐 React 19 + Vite + Tailwind CSS User Interface
├── backend/              # ⚙️ Node.js + Express REST API Server
└── database/             # 🐘 Dedicated PostgreSQL Database System
    ├── schema.sql        # PostgreSQL DDL, triggers, and analytical views
    ├── seed.sql          # 50 official Problem Statements + admin seed data
    ├── docker-compose.yml# 1-command containerized PostgreSQL 16
    ├── client.js         # Node.js pg connection pool & query helper
    ├── migrate.js        # Automated migration runner
    ├── seed.js           # Automated seed data runner
    └── README.md         # Database documentation (English & Hindi)
```

---

## 🛠 Tech Stack

- **Frontend**: React 19, Tailwind CSS v4, Vite, React Router 7, Axios, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Mongoose (persistent WiredTiger) + PostgreSQL (`pg`), Cookie-Parser, Multer, Bcryptjs, JsonWebToken.
- **Database (PostgreSQL)**: Dedicated PostgreSQL 16 architecture with PL/pgSQL anti-duplicate email triggers, atomic seat management triggers, and analytical views.

---

## 🚀 Quick Start Guide

### 1. Database Setup (PostgreSQL)
```bash
# Navigate to database folder
cd database

# Option A: Start PostgreSQL 16 via Docker (Auto-loads schema & 50 Problem Statements)
docker compose up -d

# Option B: Run migrations against your local or cloud PostgreSQL (Neon / Supabase)
npm run migrate
npm run seed
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
*The server will run on `http://localhost:5000` with 50 seeded Problem Statements and Admin account.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The client will launch on `http://localhost:5173`.*

---

## 📡 API Endpoint Reference

### Authentication
- `POST /api/auth/register` — Create user account
- `POST /api/auth/login` — Sign in and set httpOnly cookie
- `POST /api/auth/logout` — Sign out and clear cookie
- `GET /api/auth/me` — Get current user profile

### Problem Statements
- `GET /api/ps` — List all problem statements with live `seatsAvailable`
- `GET /api/ps/:id` — Full details (background, challenge, key requirements)

### Team Registration & Payment
- `POST /api/team/register` — Create/update team draft with strict email deduplication
- `POST /api/team/payment/manual` — Submit UTR transaction ID & payment screenshot
- `GET /api/team/my-status` — Fetch logged-in user's team registration status

### Administrator Routes (Protected)
- `GET /api/admin/registrations` — View all teams with status filters
- `POST /api/admin/registrations/:id/approve` — Approve manual payment, decrement seat & finalize
- `POST /api/admin/registrations/:id/reject` — Reject registration & release seat
- `GET /api/admin/ps/:id/teams` — View registered teams for a specific Problem Statement
- `DELETE /api/admin/teams/:id` — Delete a team and restore +1 seat to the PS
- `POST /api/admin/ps/reset` — Reset all PS to 5 seats
- `GET /api/admin/queries` — View Contact Us inquiries

### Contact
- `POST /api/contact` — Submit inquiry from contact page
