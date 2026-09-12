import { PGlite } from '../database/node_modules/@electric-sql/pglite/dist/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testOnly() {
  const db = new PGlite();
  const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');

  // Split schemaSql by semicolons or run statement by statement to find which statement failed
  const statements = schemaSql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} top-level statements in schema.sql`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await db.exec(stmt + ';');
      console.log(`✅ Statement ${i + 1} passed: ${stmt.substring(0, 40).replace(/\n/g, ' ')}...`);
    } catch (err) {
      console.error(`❌ Statement ${i + 1} FAILED:`);
      console.error(`   Statement: ${stmt.substring(0, 100)}...`);
      console.error(`   Error message:`, err.message);
      process.exit(1);
    }
  }
  console.log('🎉 All statements passed individually!');
}

testOnly();
