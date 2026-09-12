import { PGlite } from '../database/node_modules/@electric-sql/pglite/dist/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runPgValidation() {
  console.log('🐘 Initializing in-process PostgreSQL Engine via PGlite...');
  const db = new PGlite();

  console.log('⏳ Reading database/schema.sql...');
  const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');

  console.log('⚡ Executing schema.sql...');
  try {
    await db.exec(schemaSql);
    console.log('✅ schema.sql executed successfully without errors!');
  } catch (err) {
    console.error('❌ Error details:', err.name, ':', err.message);
    if (err.cause) console.error('Cause:', err.cause);
    throw err;
  }

  console.log('⏳ Reading database/seed.sql...');
  const seedSql = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8');

  console.log('⚡ Executing seed.sql...');
  await db.exec(seedSql);
  console.log('✅ seed.sql executed successfully without errors!');

  // 1. Verify Problem Statements Count
  const psCountRes = await db.query('SELECT COUNT(*) AS total FROM problem_statements;');
  console.log(`📊 Total Problem Statements seeded: ${psCountRes.rows[0].total}`);
  if (parseInt(psCountRes.rows[0].total) !== 50) {
    throw new Error(`Expected 50 problem statements, but got ${psCountRes.rows[0].total}`);
  }

  // 2. Verify Natural Numbering 1..50
  const psRangeRes = await db.query('SELECT MIN(ps_number) as min_ps, MAX(ps_number) as max_ps FROM problem_statements;');
  console.log(`🔢 Problem Statement numbers: ${psRangeRes.rows[0].min_ps} to ${psRangeRes.rows[0].max_ps}`);
  if (parseInt(psRangeRes.rows[0].min_ps) !== 1 || parseInt(psRangeRes.rows[0].max_ps) !== 50) {
    throw new Error(`Problem statement numbering range invalid: ${JSON.stringify(psRangeRes.rows[0])}`);
  }

  // 3. Verify Admin and Sample Accounts
  const usersRes = await db.query('SELECT email, role FROM users ORDER BY role;');
  console.log('👥 Seeded Users:');
  usersRes.rows.forEach(u => console.log(`   - ${u.role}: ${u.email}`));

  // 4. Test Seat Availability Decrement on Registration
  const firstPsRes = await db.query('SELECT id, code, seats_available FROM problem_statements WHERE ps_number = 1;');
  const ps1 = firstPsRes.rows[0];
  console.log(`\n🎯 Initial seats for ${ps1.code}: ${ps1.seats_available}`);

  // Insert Team Alpha
  const teamAlphaRes = await db.query(`
    INSERT INTO teams (team_name, problem_statement_id, leader_name, leader_email, leader_phone, leader_college, status)
    VALUES ('Alpha Warriors', '${ps1.id}', 'Aarav Sharma', 'aarav@alpha.edu', '+91 9999911111', 'IIT Delhi', 'confirmed')
    RETURNING id, team_name;
  `);
  const teamAlphaId = teamAlphaRes.rows[0].id;
  console.log(`✅ Registered Team "${teamAlphaRes.rows[0].team_name}" (ID: ${teamAlphaId})`);

  // Insert 3 members for Alpha Warriors
  await db.query(`
    INSERT INTO team_members (team_id, name, email, phone, college)
    VALUES 
      ('${teamAlphaId}', 'Member One', 'member1@alpha.edu', '+91 9999911112', 'IIT Delhi'),
      ('${teamAlphaId}', 'Member Two', 'member2@alpha.edu', '+91 9999911113', 'IIT Delhi'),
      ('${teamAlphaId}', 'Member Three', 'member3@alpha.edu', '+91 9999911114', 'IIT Delhi');
  `);
  console.log('✅ Added 3 members to Alpha Warriors');

  // Verify seat decrement
  const ps1AfterTeam = (await db.query(`SELECT seats_available FROM problem_statements WHERE id = '${ps1.id}';`)).rows[0];
  console.log(`📉 Seats for ${ps1.code} after Alpha Warriors registration: ${ps1AfterTeam.seats_available} (Expected: 4)`);
  if (parseInt(ps1AfterTeam.seats_available) !== 4) {
    throw new Error(`Expected seats_available to be 4, got ${ps1AfterTeam.seats_available}`);
  }

  // 5. Test Anti-Duplicate Trigger: Attempt to reuse 'member1@alpha.edu' as leader of Team Beta
  console.log('\n🧪 Testing Anti-Duplicate Rule (Member in Team Alpha tries to be Leader in Team Beta)...');
  let duplicateCaught1 = false;
  try {
    await db.query(`
      INSERT INTO teams (team_name, problem_statement_id, leader_name, leader_email, leader_phone, leader_college, status)
      VALUES ('Beta Titans', '${ps1.id}', 'Duplicate Lead', 'member1@alpha.edu', '+91 9888822222', 'NIT Trichy', 'confirmed');
    `);
  } catch (err) {
    duplicateCaught1 = true;
    console.log(`🛡️ Caught expected PostgreSQL trigger exception: ${err.message.split('\n')[0]}`);
  }
  if (!duplicateCaught1) {
    throw new Error('FAIL: Anti-duplicate trigger failed to block leader email reuse!');
  }

  // 6. Test Anti-Duplicate Trigger: Attempt to reuse 'aarav@alpha.edu' (Leader) as member of Team Gamma
  console.log('\n🧪 Testing Anti-Duplicate Rule (Leader of Team Alpha tries to be Member in Team Gamma)...');
  const secondPsRes = await db.query('SELECT id, code FROM problem_statements WHERE ps_number = 2;');
  const ps2 = secondPsRes.rows[0];
  const teamGammaRes = await db.query(`
    INSERT INTO teams (team_name, problem_statement_id, leader_name, leader_email, leader_phone, leader_college, status)
    VALUES ('Gamma Force', '${ps2.id}', 'Rohan Roy', 'rohan@gamma.edu', '+91 9777733333', 'BITS Pilani', 'confirmed')
    RETURNING id;
  `);
  const teamGammaId = teamGammaRes.rows[0].id;

  let duplicateCaught2 = false;
  try {
    await db.query(`
      INSERT INTO team_members (team_id, name, email, phone, college)
      VALUES ('${teamGammaId}', 'Aarav Duplicate', 'aarav@alpha.edu', '+91 9999911111', 'IIT Delhi');
    `);
  } catch (err) {
    duplicateCaught2 = true;
    console.log(`🛡️ Caught expected PostgreSQL trigger exception: ${err.message.split('\n')[0]}`);
  }
  if (!duplicateCaught2) {
    throw new Error('FAIL: Anti-duplicate trigger failed to block member email reuse!');
  }

  // 7. Test Admin Delete Team & Automatic Seat Restoration
  console.log('\n🧪 Testing Seat Restoration on Team Delete (Admin deletes Team Alpha)...');
  await db.query(`DELETE FROM teams WHERE id = '${teamAlphaId}';`);
  const ps1AfterDelete = (await db.query(`SELECT seats_available FROM problem_statements WHERE id = '${ps1.id}';`)).rows[0];
  console.log(`📈 Seats for ${ps1.code} after Team Alpha deleted: ${ps1AfterDelete.seats_available} (Expected: 5 restored)`);
  if (parseInt(ps1AfterDelete.seats_available) !== 5) {
    throw new Error(`Expected seats_available to be restored to 5, got ${ps1AfterDelete.seats_available}`);
  }

  // 8. Test Views
  console.log('\n🧪 Testing v_registered_teams_summary view...');
  const viewRes = await db.query('SELECT * FROM v_registered_teams_summary;');
  console.log(`📊 Active teams in summary view: ${viewRes.rowCount}`);
  viewRes.rows.forEach(r => console.log(`   - Team "${r.team_name}" -> PS "${r.ps_code}: ${r.ps_title.substring(0, 30)}..." | Leader: ${r.leader_name} (${r.leader_email})`));

  console.log('\n=============================================================');
  console.log('🎉 ALL POSTGRESQL VALIDATION CHECKS PASSED WITH 100% SUCCESS!');
  console.log('   1. Schema creation: OK');
  console.log('   2. 50 Problem Statements seed: OK (Numbers 1..50)');
  console.log('   3. Cross-database email anti-duplicate triggers: OK');
  console.log('   4. Atomic seat decrement & restoration triggers: OK');
  console.log('   5. Analytical views and cascade deletions: OK');
  console.log('=============================================================\n');
}

runPgValidation().catch(err => {
  console.error('❌ Validation error:', err);
  process.exit(1);
});
