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
  connectionTimeoutMillis: 10000,
});

pgPool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL client error on idle connection:', err.message);
});

/**
 * Execute parameterized query against PostgreSQL
 */
export const pgQuery = async (text, params = []) => {
  const start = Date.now();
  try {
    const res = await pgPool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === 'true') {
      console.log(`Executed query (${duration}ms):`, {
        text: text.trim().substring(0, 100),
        rows: res.rowCount,
      });
    }
    return res;
  } catch (err) {
    console.error('❌ PostgreSQL Query Error:', {
      query: text.trim().substring(0, 150),
      message: err.message,
      code: err.code,
    });
    throw err;
  }
};

/**
 * Helper to run operations within a managed transaction
 */
export const withTransaction = async (callback) => {
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
 * Test connectivity to PostgreSQL
 */
export const testPgConnection = async () => {
  try {
    const res = await pgPool.query('SELECT current_database(), current_user, version()');
    console.log(
      `🐘 PostgreSQL connected: ${res.rows[0].current_database} as user "${res.rows[0].current_user}"`
    );
    return true;
  } catch (err) {
    console.warn(`⚠️ PostgreSQL connection not available (${err.message}).`);
    return false;
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
        await pgPool.query(schemaSql);
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
        await pgPool.query(seedSql);
        console.log('✅ PostgreSQL seeded with official 50 problem statements.');
      }
    } else {
      console.log(`📊 PostgreSQL ready: ${psCount} Problem Statements registered.`);
    }

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
      INSERT INTO global_settings (id, registration_enabled, registration_start_date, registration_end_date, hold_duration_seconds)
      VALUES (1, true, '2026-01-01 00:00:00+00', '2026-12-31 23:59:59+00', 900)
      ON CONFLICT (id) DO NOTHING;
    `);

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize PostgreSQL:', error.message);
    return false;
  }
};

export default {
  pgPool,
  pgQuery,
  withTransaction,
  testPgConnection,
  initializePostgres,
};
