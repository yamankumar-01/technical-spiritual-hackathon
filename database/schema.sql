-- ============================================================================
-- Techno Spiritual Hackathon (TSH) 2026 - PostgreSQL Database Schema
-- Production Relational Architecture with Strict Anti-Duplicate Email Enforcement
-- ============================================================================

-- Modern PostgreSQL (13+) includes gen_random_uuid() natively in core.
-- No external extensions are required.

-- ============================================================================
-- 1. USERS TABLE
-- Stores hackathon administrators, evaluators, and registered team leaders
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'evaluator')),
    phone VARCHAR(50),
    college VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for rapid email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- 2. PROBLEM STATEMENTS TABLE
-- Stores all 50 official hackathon problem statements with real-time seat tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS problem_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ps_number INTEGER NOT NULL UNIQUE CHECK (ps_number >= 1),
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(300) NOT NULL,
    category VARCHAR(150) NOT NULL,
    background TEXT NOT NULL,
    challenge TEXT NOT NULL,
    key_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_seats INTEGER NOT NULL DEFAULT 5 CHECK (total_seats > 0),
    seats_available INTEGER NOT NULL DEFAULT 5 CHECK (seats_available >= 0 AND seats_available <= total_seats),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for problem statements
CREATE INDEX IF NOT EXISTS idx_ps_code ON problem_statements(code);
CREATE INDEX IF NOT EXISTS idx_ps_number ON problem_statements(ps_number);
CREATE INDEX IF NOT EXISTS idx_ps_category ON problem_statements(category);
CREATE INDEX IF NOT EXISTS idx_ps_seats ON problem_statements(seats_available);

-- ============================================================================
-- 3. TEAMS TABLE
-- Stores registered hackathon teams (1 team per Problem Statement)
-- Zero Razorpay dependencies: payment is directly processed via UPI QR / UTR
-- ============================================================================
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name VARCHAR(150) NOT NULL,
    team_code VARCHAR(50) UNIQUE,
    problem_statement_id UUID NOT NULL REFERENCES problem_statements(id) ON DELETE RESTRICT,
    leader_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    leader_name VARCHAR(150) NOT NULL,
    leader_email VARCHAR(255) NOT NULL,
    leader_phone VARCHAR(50) NOT NULL,
    leader_college VARCHAR(255) NOT NULL,
    leader_branch VARCHAR(100),
    leader_year VARCHAR(50),
    registration_number VARCHAR(80) UNIQUE,
    hold_token VARCHAR(120),
    status VARCHAR(50) NOT NULL DEFAULT 'payment_pending' CHECK (status IN ('draft', 'pending', 'payment_pending', 'confirmed', 'rejected', 'shortlisted', 'registered', 'finalized')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'confirmed', 'rejected', 'failed', 'refunded')),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'src_desk' CHECK (payment_method IN ('src_desk', 'upi', 'bank_transfer', 'manual', 'cash')),
    payment_amount NUMERIC NOT NULL DEFAULT 400,
    transaction_id VARCHAR(120),
    payment_screenshot_url TEXT,
    admin_notes TEXT,
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    registration_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_ps_id ON teams(problem_statement_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_by ON teams(created_by);
CREATE INDEX IF NOT EXISTS idx_teams_leader_email ON teams(LOWER(leader_email));
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_payment_status ON teams(payment_status);
CREATE INDEX IF NOT EXISTS idx_teams_registration_number ON teams(registration_number);
CREATE INDEX IF NOT EXISTS idx_teams_team_code ON teams(team_code);

-- ============================================================================
-- 3.1 REGISTRATION HOLDS TABLE (15-Minute Temporary Slot Reservations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS registration_holds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_statement_id UUID NOT NULL REFERENCES problem_statements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hold_token VARCHAR(120) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 900,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'consumed', 'expired', 'released')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_holds_ps_user_status ON registration_holds(problem_statement_id, user_id, status);
CREATE INDEX IF NOT EXISTS idx_holds_expires_at ON registration_holds(expires_at);
CREATE INDEX IF NOT EXISTS idx_holds_token ON registration_holds(hold_token);

-- ============================================================================
-- 4. TEAM MEMBERS TABLE
-- Stores 3 additional members per team (total 4 members per team including leader)
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    college VARCHAR(255),
    branch VARCHAR(100),
    year VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for team members
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(LOWER(email));

-- ============================================================================
-- 5. CONTACT QUERIES TABLE
-- Stores public inquiries from the Contact Us page
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_queries(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_queries(status);

-- ============================================================================
-- 5.1 GLOBAL SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS global_settings (
    id SERIAL PRIMARY KEY,
    registration_enabled BOOLEAN NOT NULL DEFAULT true,
    registration_start_date TIMESTAMPTZ NOT NULL DEFAULT '2026-01-01 00:00:00+00',
    registration_end_date TIMESTAMPTZ NOT NULL DEFAULT '2026-12-31 23:59:59+00',
    hold_duration_seconds INTEGER NOT NULL DEFAULT 900,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ensure a default row exists
INSERT INTO global_settings (id, registration_enabled, registration_start_date, registration_end_date, hold_duration_seconds)
VALUES (1, true, '2026-01-01 00:00:00+00', '2026-12-31 23:59:59+00', 900)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. STRICT ANTI-DUPLICATE EMAIL ENGINE (Database-Level Enforcement)
-- RULE: 1 participant email can only belong to at most ONE team / Problem Statement
-- nationwide, across both Team Leaders and Team Members.
-- ============================================================================

-- Function to validate that leader email is not used anywhere else
CREATE OR REPLACE FUNCTION check_team_leader_email_uniqueness()
RETURNS TRIGGER AS $$
DECLARE
    conflict_team VARCHAR(150);
    conflict_ps VARCHAR(100);
BEGIN
    -- 1. Check if leader email is used as a leader in any other team
    SELECT t.team_name, ps.code INTO conflict_team, conflict_ps
    FROM teams t
    JOIN problem_statements ps ON ps.id = t.problem_statement_id
    WHERE LOWER(t.leader_email) = LOWER(NEW.leader_email)
      AND t.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    LIMIT 1;

    IF FOUND THEN
        RAISE EXCEPTION 'DUPLICATE_EMAIL_VIOLATION: The email "%" is already registered as leader of team "%" for Problem Statement %', 
            NEW.leader_email, conflict_team, conflict_ps;
    END IF;

    -- 2. Check if leader email is used as a member in any team
    SELECT t.team_name, ps.code INTO conflict_team, conflict_ps
    FROM team_members tm
    JOIN teams t ON t.id = tm.team_id
    JOIN problem_statements ps ON ps.id = t.problem_statement_id
    WHERE LOWER(tm.email) = LOWER(NEW.leader_email)
      AND tm.team_id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    LIMIT 1;

    IF FOUND THEN
        RAISE EXCEPTION 'DUPLICATE_EMAIL_VIOLATION: The email "%" is already registered as a member in team "%" for Problem Statement %', 
            NEW.leader_email, conflict_team, conflict_ps;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on teams table before insert or update of leader_email
DROP TRIGGER IF EXISTS trg_check_team_leader_email ON teams;
CREATE TRIGGER trg_check_team_leader_email
    BEFORE INSERT OR UPDATE OF leader_email
    ON teams
    FOR EACH ROW
    EXECUTE FUNCTION check_team_leader_email_uniqueness();

-- Function to validate that member email is not used anywhere else
CREATE OR REPLACE FUNCTION check_team_member_email_uniqueness()
RETURNS TRIGGER AS $$
DECLARE
    conflict_team VARCHAR(150);
    conflict_ps VARCHAR(100);
BEGIN
    -- 1. Check if member email matches the leader of its own team
    IF EXISTS (
        SELECT 1 FROM teams 
        WHERE id = NEW.team_id 
          AND LOWER(leader_email) = LOWER(NEW.email)
    ) THEN
        RAISE EXCEPTION 'DUPLICATE_EMAIL_VIOLATION: Member email "%" is already registered as the leader of this team.', NEW.email;
    END IF;

    -- 2. Check if member email is used as leader in any team
    SELECT t.team_name, ps.code INTO conflict_team, conflict_ps
    FROM teams t
    JOIN problem_statements ps ON ps.id = t.problem_statement_id
    WHERE LOWER(t.leader_email) = LOWER(NEW.email)
    LIMIT 1;

    IF FOUND THEN
        RAISE EXCEPTION 'DUPLICATE_EMAIL_VIOLATION: The email "%" is already registered as leader of team "%" for Problem Statement %', 
            NEW.email, conflict_team, conflict_ps;
    END IF;

    -- 3. Check if member email is used as a member in any other team or duplicated within this team
    SELECT t.team_name, ps.code INTO conflict_team, conflict_ps
    FROM team_members tm
    JOIN teams t ON t.id = tm.team_id
    JOIN problem_statements ps ON ps.id = t.problem_statement_id
    WHERE LOWER(tm.email) = LOWER(NEW.email)
      AND tm.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    LIMIT 1;

    IF FOUND THEN
        RAISE EXCEPTION 'DUPLICATE_EMAIL_VIOLATION: The email "%" is already registered in team "%" for Problem Statement %', 
            NEW.email, conflict_team, conflict_ps;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on team_members table before insert or update of email
DROP TRIGGER IF EXISTS trg_check_team_member_email ON team_members;
CREATE TRIGGER trg_check_team_member_email
    BEFORE INSERT OR UPDATE OF email
    ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION check_team_member_email_uniqueness();

-- ============================================================================
-- 7. ATOMIC SEAT MANAGEMENT TRIGGER
-- Automatically updates problem_statements.seats_available when teams are
-- registered, deleted (e.g. by admin), or when status changes.
-- ============================================================================
CREATE OR REPLACE FUNCTION manage_ps_seat_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Handling team deletion (Admin deletes team)
    IF (TG_OP = 'DELETE') THEN
        IF OLD.status = 'confirmed' THEN
            UPDATE problem_statements
            SET seats_available = LEAST(total_seats, seats_available + 1),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = OLD.problem_statement_id;
        END IF;
        RETURN OLD;
    END IF;

    -- Handling team insertion (New confirmed registration)
    IF (TG_OP = 'INSERT') THEN
        IF NEW.status = 'confirmed' THEN
            UPDATE problem_statements
            SET seats_available = seats_available - 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.problem_statement_id
              AND seats_available > 0;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'SEAT_LIMIT_EXCEEDED: No seats available for this Problem Statement.';
            END IF;
        END IF;
        RETURN NEW;
    END IF;

    -- Handling team update
    IF (TG_OP = 'UPDATE') THEN
        -- If problem statement changed
        IF OLD.problem_statement_id != NEW.problem_statement_id THEN
            IF OLD.status = 'confirmed' THEN
                UPDATE problem_statements
                SET seats_available = LEAST(total_seats, seats_available + 1)
                WHERE id = OLD.problem_statement_id;
            END IF;
            IF NEW.status = 'confirmed' THEN
                UPDATE problem_statements
                SET seats_available = seats_available - 1
                WHERE id = NEW.problem_statement_id
                  AND seats_available > 0;
                IF NOT FOUND THEN
                    RAISE EXCEPTION 'SEAT_LIMIT_EXCEEDED: No seats available for selected Problem Statement.';
                END IF;
            END IF;
        -- If status changed
        ELSIF OLD.status != NEW.status THEN
            IF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
                UPDATE problem_statements
                SET seats_available = LEAST(total_seats, seats_available + 1)
                WHERE id = NEW.problem_statement_id;
            ELSIF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
                UPDATE problem_statements
                SET seats_available = seats_available - 1
                WHERE id = NEW.problem_statement_id
                  AND seats_available > 0;
                IF NOT FOUND THEN
                    RAISE EXCEPTION 'SEAT_LIMIT_EXCEEDED: No seats available for this Problem Statement.';
                END IF;
            END IF;
        END IF;
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_manage_ps_seats ON teams;
CREATE TRIGGER trg_manage_ps_seats
    AFTER INSERT OR UPDATE OR DELETE
    ON teams
    FOR EACH ROW
    EXECUTE FUNCTION manage_ps_seat_availability();

-- ============================================================================
-- 8. HELPFUL VIEWS FOR ADMIN REPORTING & PUBLIC DASHBOARD
-- ============================================================================

-- Detailed view of all registered teams with problem statement metadata and member counts
CREATE OR REPLACE VIEW v_registered_teams_summary AS
SELECT 
    t.id AS team_id,
    t.team_name,
    t.status AS team_status,
    t.payment_status,
    t.payment_method,
    t.transaction_id,
    t.registration_date,
    ps.id AS ps_id,
    ps.ps_number,
    ps.code AS ps_code,
    ps.title AS ps_title,
    ps.category AS ps_category,
    ps.seats_available,
    t.leader_name,
    t.leader_email,
    t.leader_phone,
    t.leader_college,
    t.leader_branch,
    t.leader_year,
    COUNT(tm.id) AS additional_members_count,
    COUNT(tm.id) + 1 AS total_team_size
FROM teams t
JOIN problem_statements ps ON ps.id = t.problem_statement_id
LEFT JOIN team_members tm ON tm.team_id = t.id
GROUP BY t.id, ps.id;

-- Problem Statement occupancy overview
CREATE OR REPLACE VIEW v_ps_seat_occupancy AS
SELECT 
    ps.id,
    ps.ps_number,
    ps.code,
    ps.title,
    ps.category,
    ps.total_seats,
    ps.seats_available,
    (ps.total_seats - ps.seats_available) AS booked_seats,
    ROUND(((ps.total_seats - ps.seats_available)::numeric / ps.total_seats::numeric) * 100, 1) AS occupancy_percentage
FROM problem_statements ps
ORDER BY ps.ps_number ASC;

-- Schema initialization verification message
DO $$
BEGIN
    RAISE NOTICE '✅ TSH 2026 PostgreSQL Database Schema initialized successfully with strict anti-duplicate triggers and atomic seat tracking.';
END $$;
