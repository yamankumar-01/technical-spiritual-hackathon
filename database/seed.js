import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, checkConnection } from './client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  console.log('🚀 Checking PostgreSQL connection...');
  const conn = await checkConnection();
  if (!conn.connected) {
    console.error('❌ Could not connect to PostgreSQL database:');
    console.error(conn.error);
    process.exit(1);
  }

  console.log(`✅ Connected to database "${conn.database}".`);
  console.log('⏳ Running seed data from database/seed.sql...');

  const seedPath = path.join(__dirname, 'seed.sql');
  const sql = fs.readFileSync(seedPath, 'utf8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('🎉 Seeding completed successfully!');

    // Fetch problem statements count
    const psCount = await client.query('SELECT COUNT(*) AS total FROM problem_statements;');
    const usersCount = await client.query('SELECT COUNT(*) AS total FROM users;');

    console.log('📊 Current Database Status:');
    console.log(`   - Problem Statements: ${psCount.rows[0].total}`);
    console.log(`   - Users: ${usersCount.rows[0].total}`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed();
