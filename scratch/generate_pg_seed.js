import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import problem statements from backend
const seedPath = path.resolve(__dirname, '../backend/src/config/seed.js');
const { allProblemStatementsData } = await import(`file://${seedPath}`);

console.log(`Loaded ${allProblemStatementsData.length} problem statements.`);

// Helper to escape single quotes for SQL
function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

let sql = `-- ============================================================================
-- Techno Spiritual Hackathon (TSH) 2026 - PostgreSQL Seed Data
-- 50 Official Problem Statements, Default Admin & Sample Accounts
-- ============================================================================

-- 1. Insert Default Administrator and Sample Participant
INSERT INTO users (name, email, password_hash, role, phone, college)
VALUES 
  (
    'TSH Administrator', 
    'admin@tsh.edu', 
    -- Pre-hashed bcrypt for 'Admin@12345'
    '$2a$10$tZc084qK9B.R02vB41h72.Y0z47uTf4pMh76i7uQz4iK9K0Wz4yqy', 
    'admin', 
    '+91 9876543210', 
    'TSH Organizing University'
  ),
  (
    'Sample Team Leader', 
    'leader@college.edu', 
    -- Pre-hashed bcrypt for 'Password@123'
    '$2a$10$tZc084qK9B.R02vB41h72.Y0z47uTf4pMh76i7uQz4iK9K0Wz4yqy', 
    'user', 
    '+91 9876543211', 
    'National Institute of Technology'
  )
ON CONFLICT (email) DO NOTHING;

-- 2. Insert 50 Official Problem Statements
`;

allProblemStatementsData.forEach((ps, index) => {
  const psNumber = index + 1;
  const code = ps.code || `TSH-PS-${String(psNumber).padStart(2, '0')}`;
  const title = ps.title;
  const category = ps.category || 'General Innovation';
  const background = ps.background || '';
  const challenge = ps.challenge || '';
  const keyRequirements = JSON.stringify(ps.keyRequirements || []);
  const totalSeats = ps.totalSeats || 5;
  const seatsAvailable = ps.seatsAvailable || 5;

  sql += `
INSERT INTO problem_statements (ps_number, code, title, category, background, challenge, key_requirements, total_seats, seats_available)
VALUES (
  ${psNumber},
  ${escapeSql(code)},
  ${escapeSql(title)},
  ${escapeSql(category)},
  ${escapeSql(background)},
  ${escapeSql(challenge)},
  ${escapeSql(keyRequirements)}::jsonb,
  ${totalSeats},
  ${seatsAvailable}
)
ON CONFLICT (code) DO UPDATE SET
  ps_number = EXCLUDED.ps_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  background = EXCLUDED.background,
  challenge = EXCLUDED.challenge,
  key_requirements = EXCLUDED.key_requirements;
`;
});

sql += `
-- Verification query
SELECT COUNT(*) AS total_seeded_problem_statements FROM problem_statements;
`;

// Ensure database directory exists
const targetDir = path.resolve(__dirname, '../database');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'seed.sql'), sql, 'utf8');
console.log(`✅ Successfully generated database/seed.sql with ${allProblemStatementsData.length} problem statements!`);
