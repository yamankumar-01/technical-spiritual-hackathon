import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, checkConnection } from './client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🚀 Checking PostgreSQL connection...');
  const conn = await checkConnection();
  if (!conn.connected) {
    console.error('❌ Could not connect to PostgreSQL database:');
    console.error(conn.error);
    console.log('\n💡 Tip: Make sure PostgreSQL is running. If using Docker, run:');
    console.log('   docker compose -f database/docker-compose.yml up -d\n');
    process.exit(1);
  }

  console.log(`✅ Connected to database "${conn.database}" as user "${conn.user}".`);
  console.log('⏳ Running database migration from database/schema.sql...');

  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('🎉 Migration completed successfully!');

    // Fetch created tables summary
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('📋 Public Tables currently in database:');
    res.rows.forEach((r, idx) => {
      console.log(`   ${idx + 1}. ${r.table_name}`);
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
