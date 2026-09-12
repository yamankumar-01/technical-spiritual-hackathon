import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from database folder first, fallback to backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgrespassword'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'tsh_hackathon'}`;

const isProduction = process.env.NODE_ENV === 'production' || process.env.PGSSL === 'true' || connectionString.includes('sslmode=require');

export const pool = new Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL client error on idle connection:', err);
});

/**
 * Execute a parameterized query against PostgreSQL
 * @param {string} text - SQL Query
 * @param {Array} params - Array of parameters
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === 'true') {
      console.log(`Executed query (${duration}ms):`, { text: text.trim().substring(0, 100), rows: res.rowCount });
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
 * Check connectivity to the PostgreSQL server
 */
export const checkConnection = async () => {
  try {
    const res = await pool.query('SELECT current_database(), current_user, version()');
    return {
      connected: true,
      database: res.rows[0].current_database,
      user: res.rows[0].current_user,
      version: res.rows[0].version,
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message,
    };
  }
};

export default {
  pool,
  query,
  checkConnection,
};
