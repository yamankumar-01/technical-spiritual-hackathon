import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgrespassword'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'tsh_hackathon'}`;

const isRemoteOrSsl =
  process.env.NODE_ENV === 'production' ||
  process.env.PGSSL === 'true' ||
  connectionString.includes('sslmode=require') ||
  connectionString.includes('neon.tech') ||
  connectionString.includes('supabase.co') ||
  connectionString.includes('render.com') ||
  connectionString.includes('railway.app') ||
  connectionString.includes('aws.') ||
  connectionString.includes('pooler.supabase');

export const pgPool = new Pool({
  connectionString,
  ssl: isRemoteOrSsl ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2500, // Fast connection test
});

pgPool.on('error', (err) => {
  if (activeEngine !== 'pglite') {
    console.error('❌ Unexpected PostgreSQL client error on idle connection:', err.message);
  }
});

let activeEngine = 'none'; // 'pg' | 'pglite' | 'none'
let pgliteInstance = null;

export const getActiveEngine = () => activeEngine;

/**
 * Execute parameterized query against PostgreSQL or PGlite fallback
 */
export const pgQuery = async (text, params = []) => {
  const start = Date.now();
  try {
    let res;
    if (activeEngine === 'pglite' && pgliteInstance) {
      res = await pgliteInstance.query(text, params);
    } else {
      res = await pgPool.query(text, params);
    }
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === 'true') {
      console.log(`Executed query (${duration}ms):`, {
        text: text.trim().substring(0, 100),
        rows: res.rowCount,
      });
    }
    return res;
  } catch (err) {
    if (err.code !== 'ECONNREFUSED') {
      console.error('❌ PostgreSQL Query Error:', {
        query: text.trim().substring(0, 150),
        message: err.message,
        code: err.code,
      });
    }
    throw err;
  }
};

/**
 * Helper to run operations within a managed transaction
 */
export const withTransaction = async (callback) => {
  if (activeEngine === 'pglite' && pgliteInstance) {
    return await pgliteInstance.transaction(async (tx) => {
      return await callback(tx);
    });
  }

  const client = await pgPool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Test connectivity to PostgreSQL, falling back to embedded PGlite if needed
 */
export const testPgConnection = async () => {
  try {
    const res = await pgPool.query('SELECT current_database(), current_user, version()');
    activeEngine = 'pg';
    console.log(
      `🐘 PostgreSQL connected: ${res.rows[0].current_database} as user "${res.rows[0].current_user}"`
    );
    return true;
  } catch (err) {
    console.warn(`⚠️ External PostgreSQL unavailable (${err.message}). Activating embedded PGlite engine...`);
    try {
      const { PGlite } = await import('@electric-sql/pglite');
      const pgliteDataDir = path.resolve(__dirname, '../../.db_data/pglite_db');
      pgliteInstance = new PGlite(pgliteDataDir);
      await pgliteInstance.waitReady;
      activeEngine = 'pglite';
      console.log(`⚡ Embedded PostgreSQL (PGlite) activated with persistent storage at: ${pgliteDataDir}`);
      return true;
    } catch (pglErr) {
      console.error('❌ Failed to initialize embedded PGlite:', pglErr.message);
      activeEngine = 'none';
      return false;
    }
  }
};

/**
 * Initialize database schema and seeds automatically if not yet provisioned
 */
export const initializePostgres = async () => {
  try {
    const connected = await testPgConnection();
    if (!connected) {
      console.warn('⚠️ Skipping automatic PostgreSQL migration: database unreachable.');
      return false;
    }

    // Check if tables already exist
    const checkTable = await pgQuery(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'problem_statements'
      );
    `);

    const tablesExist = checkTable.rows[0].exists;

    if (!tablesExist) {
      console.log('⏳ Provisioning PostgreSQL tables from schema.sql...');
      const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        if (activeEngine === 'pglite' && pgliteInstance) {
          await pgliteInstance.exec(schemaSql);
        } else {
          await pgPool.query(schemaSql);
        }
        console.log('✅ PostgreSQL schema created successfully.');
      } else {
        console.warn(`⚠️ Schema file not found at ${schemaPath}`);
      }
    }

    // Check if problem statements are populated
    const countRes = await pgQuery('SELECT COUNT(*) AS total FROM problem_statements;');
    const psCount = parseInt(countRes.rows[0].total, 10);

    if (psCount === 0) {
      console.log('⏳ Seeding 50 problem statements and admin accounts from seed.sql...');
      const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        if (activeEngine === 'pglite' && pgliteInstance) {
          await pgliteInstance.exec(seedSql);
        } else {
          await pgPool.query(seedSql);
        }
        console.log('✅ PostgreSQL seeded with official 50 problem statements.');
      }
    } else {
      console.log(`📊 PostgreSQL ready: ${psCount} Problem Statements registered.`);
    }

    // Auto-migrate venue allocation columns on teams table if not present
    await pgQuery(`ALTER TABLE teams ADD COLUMN IF NOT EXISTS venue_room_number VARCHAR(100);`);
    await pgQuery(`ALTER TABLE teams ADD COLUMN IF NOT EXISTS venue_time_slot VARCHAR(150);`);
    await pgQuery(`ALTER TABLE teams ADD COLUMN IF NOT EXISTS venue_allocated_at TIMESTAMPTZ;`);

    // Ensure global settings row exists
    await pgQuery(`
      CREATE TABLE IF NOT EXISTS global_settings (
        id SERIAL PRIMARY KEY,
        registration_enabled BOOLEAN NOT NULL DEFAULT true,
        registration_start_date TIMESTAMPTZ NOT NULL DEFAULT '2026-01-01 00:00:00+00',
        registration_end_date TIMESTAMPTZ NOT NULL DEFAULT '2026-12-31 23:59:59+00',
        hold_duration_seconds INTEGER NOT NULL DEFAULT 900,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pgQuery(`
      INSERT INTO global_settings (id, registration_enabled, registration_start_date, registration_end_date, hold_duration_seconds)
      VALUES (1, true, '2026-01-01 00:00:00+00', '2026-12-31 23:59:59+00', 900)
      ON CONFLICT (id) DO NOTHING;
    `);

    // Ensure default admin user and sample leader have accurate, verified bcrypt password hashes
    const adminHash = '$2b$10$OpF/fubidMhL68fMBIvsE.X4pAL6biaX1vYAMq8CLnNeGV0EtVI6W'; // Admin@12345
    const leaderHash = '$2b$10$D2XfTmt1k2VUAxuRG6HL0uD4ljkmm6z3UhC1aAj42YBwcWajmpTGK'; // Password@123

    await pgQuery(`
      INSERT INTO users (name, email, password_hash, role, phone, college)
      VALUES 
        ('TSH Administrator', 'admin@tsh.edu', $1, 'admin', '+91 9876543210', 'TSH Organizing University'),
        ('Sample Team Leader', 'leader@college.edu', $2, 'user', '+91 9876543211', 'National Institute of Technology')
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role;
    `, [adminHash, leaderHash]);
    console.log('👑 Verified administrator credentials in PostgreSQL.');

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize PostgreSQL:', error.message);
    return false;
  }
};

export const closeDatabase = async () => {
  if (pgliteInstance) {
    try {
      await pgliteInstance.close();
      console.log('⚡ PGlite closed.');
    } catch (_) {}
  }
  try {
    await pgPool.end();
  } catch (_) {}
};

export default {
  pgPool,
  pgQuery,
  withTransaction,
  testPgConnection,
  initializePostgres,
  closeDatabase,
  getActiveEngine,
};
