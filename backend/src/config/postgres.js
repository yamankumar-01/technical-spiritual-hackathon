import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgrespassword'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'tsh_hackathon'}`;

const isProduction = process.env.NODE_ENV === 'production' || process.env.PGSSL === 'true' || connectionString.includes('sslmode=require');

export const pgPool = new Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pgPool.on('error', (err) => {
  console.error('❌ PostgreSQL idle client error in backend:', err.message);
});

export const pgQuery = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pgPool.query(text, params);
    return res;
  } catch (err) {
    console.error('❌ PostgreSQL Query Error:', {
      query: text.trim().substring(0, 100),
      message: err.message,
    });
    throw err;
  }
};

export const testPgConnection = async () => {
  try {
    const res = await pgPool.query('SELECT current_database(), current_user, version()');
    console.log(`🐘 PostgreSQL connected: ${res.rows[0].current_database} as ${res.rows[0].current_user}`);
    return true;
  } catch (err) {
    console.warn(`⚠️ PostgreSQL connection not available (${err.message}). Using persistent MongoDB storage.`);
    return false;
  }
};

export default {
  pgPool,
  pgQuery,
  testPgConnection,
};
