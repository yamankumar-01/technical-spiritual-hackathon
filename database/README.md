# 🐘 Techno Spiritual Hackathon (TSH) 2026 - PostgreSQL Database System

> [!IMPORTANT]
> **Architectural Notice (Option A — Reference & Alternative Relational Architecture)**:
> The active, live production web application runs on **MongoDB (with WiredTiger persistent disk storage in `backend/.db_data/`)**. 
> 
> This dedicated `database/` PostgreSQL module is a production-grade **reference / alternative implementation** showcasing relational schemas, PL/pgSQL triggers, and foreign keys. The running backend controllers (`backend/src/controllers/*`) do **NOT** query PostgreSQL at runtime, and there is no hidden `DB_ENGINE` switch. Any live registration data is stored and validated directly in MongoDB.

> **Hindi**: TSH 2026 Hackathon ke liye complete PostgreSQL database setup. Isme official 50 Problem Statements, strict anti-duplicate email triggers, atomic seat management, aur Docker/Cloud automation included hai.  
> **English**: Complete PostgreSQL database setup for TSH 2026 Hackathon featuring official 50 Problem Statements, strict anti-duplicate email triggers, atomic seat management, and Docker/Cloud automation.

---

## 📁 Folder Structure

```
full-web/
├── frontend/             # React + Vite + Tailwind CSS User Interface
├── backend/              # Node.js + Express REST API Server
└── database/             # 🐘 Dedicated PostgreSQL Database Folder
    ├── schema.sql        # Tables, triggers, indexes, and analytical views
    ├── seed.sql          # 50 Problem Statements, default admin & sample accounts
    ├── docker-compose.yml# 1-command PostgreSQL 16 container setup
    ├── client.js         # Node.js pg connection pool & query helper
    ├── migrate.js        # Automated migration runner for schema.sql
    ├── seed.js           # Automated seed data runner for seed.sql
    ├── test-connection.js# Comprehensive health check & verification script
    ├── package.json      # Scripts & dependencies (pg, dotenv)
    ├── .env.example      # Sample connection credentials
    └── README.md         # Complete guide & documentation
```

---

## 🚀 Quick Start (तुरंत शुरू करें)

### Option 1: Docker (सबसे आसान / Recommended)
Agar aapke system me Docker installed hai, to bas 1 command se pura PostgreSQL database with tables & 50 Problem Statements ready ho jayega:

```bash
# Navigate to database folder
cd database

# Start PostgreSQL 16 container with automatic schema & seed loading
docker compose up -d
```

Check status:
```bash
docker compose ps
docker compose logs -f
```

---

### Option 2: Local PostgreSQL / pgAdmin (अगर आपके पास PostgreSQL पहले से है)

1. Open **pgAdmin** or **psql** terminal.
2. Create the database:
   ```sql
   CREATE DATABASE tsh_hackathon;
   ```
3. Run the schema and seed files:
   ```bash
   # Using psql
   psql -U postgres -d tsh_hackathon -f schema.sql
   psql -U postgres -d tsh_hackathon -f seed.sql
   ```

Or run via Node.js script:
```bash
cd database
npm install
npm run migrate
npm run seed
```

---

### Option 3: Free Cloud PostgreSQL (Neon / Supabase / Railway / Render)

1. Create a free PostgreSQL instance on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Copy your connection URL:
   `postgresql://username:password@ep-xyz.aws.neon.tech/tsh_hackathon?sslmode=require`
3. Create `database/.env` and paste your URL:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xyz.aws.neon.tech/tsh_hackathon?sslmode=require
   ```
4. Run migrations & seed data:
   ```bash
   npm run migrate
   npm run seed
   ```

---

## 🛡️ Key Features & Business Rules

### 1. Strict Anti-Duplicate Email Rule (एक Email = सिर्फ एक ही Problem Statement)
> **Requirement**: *"ek email ek hi ps ko assign ho taki duplicate na ho ske"*

PostgreSQL database engine level par PL/pgSQL triggers enforce karte hain:
- **`trg_check_team_leader_email`**: Agar koi email kisi bhi doosri team me leader ya member ke roop me maujood hai, to PostgreSQL `DUPLICATE_EMAIL_VIOLATION` exception fekega aur transaction rollback kar dega.
- **`trg_check_team_member_email`**: Team ke kisi bhi member ka email kisi doosri team me ya same team ke leader ke sath match nahi ho sakta.

### 2. Atomic Seat Availability Tracking (सीट काउंटिंग ऑटोमेशन)
- **`trg_manage_ps_seats`**:
  - Jab koi team **confirm** hoti hai, to `seats_available` automatic **-1** ho jata hai.
  - Agar admin panel se koi team **delete** ki jaati hai, to `seats_available` automatic **+1** badh jaata hai (capped at `total_seats = 5`).
  - Agar koi Problem Statement full ho chuka hai (`seats_available = 0`), to database transaction block ho jata hai (`SEAT_LIMIT_EXCEEDED`).

### 3. Complete Razorpay Removal
- Payment directly **UPI QR Code**, **Bank Transfer (SBI)**, aur **UTR / Transaction ID Reference** ke zariye process hoti hai.
- `payment_method` values: `'upi'`, `'bank_transfer'`, `'manual'`, `'cash'`.

### 4. 50 Official Problem Statements (Natural Numbers 1..50)
- `ps_number`: `1` se `50` tak sequential natural numbers.
- `code`: `TSH-PS-01` se `TSH-PS-50`.
- Har ek Problem Statement me domain, background, challenge, aur JSONB key requirements configured hain.

---

## 📊 Database Schema Overview

| Table Name | Description | Key Columns |
|------------|-------------|-------------|
| `users` | Admin, Evaluator, aur Team Leads | `id`, `name`, `email`, `role`, `password_hash`, `college` |
| `problem_statements` | 50 official problem statements | `id`, `ps_number`, `code`, `title`, `category`, `total_seats`, `seats_available` |
| `teams` | Registered hackathon teams | `id`, `team_name`, `problem_statement_id`, `leader_name`, `leader_email`, `status`, `payment_method`, `transaction_id` |
| `team_members` | 3 additional members per team | `id`, `team_id`, `name`, `email`, `phone`, `college` |
| `contact_queries` | Public queries from Contact page | `id`, `name`, `email`, `subject`, `message`, `status` |

---

## 🔍 Useful SQL Queries

### 1. View all active teams with their Problem Statement:
```sql
SELECT * FROM v_registered_teams_summary;
```

### 2. Check live seat status of all 50 Problem Statements:
```sql
SELECT code, title, seats_available, total_seats, occupancy_percentage 
FROM v_ps_seat_occupancy;
```

### 3. Verify an email availability across the entire database:
```sql
SELECT 'leader' AS role, team_name, leader_email AS email FROM teams WHERE LOWER(leader_email) = LOWER('student@college.edu')
UNION ALL
SELECT 'member' AS role, t.team_name, tm.email FROM team_members tm JOIN teams t ON t.id = tm.team_id WHERE LOWER(tm.email) = LOWER('student@college.edu');
```

---

## 🤝 Connecting Backend to PostgreSQL

Backend me agar aap direct PostgreSQL connect karna chahte hain:
1. Open `backend/.env`.
2. Add your PostgreSQL connection:
   ```env
   DATABASE_URL=postgresql://postgres:postgrespassword@localhost:5432/tsh_hackathon
   DB_ENGINE=postgres
   ```
3. Backend can query using `backend/src/config/postgres.js`.
