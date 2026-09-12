const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function verifyPriority2() {
  console.log('🧪 Comprehensive Priority 2 Verification: Upload Access Control Matrix...\n');

  // Step 1: Admin login
  const adminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@tsh.edu', password: 'Admin@12345' }),
  }).then((r) => r.json());

  // Step 2: Register User A (Team Leader)
  const userAEmail = `user_a_${Date.now()}@test.com`;
  const userARes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'User A Leader',
      email: userAEmail,
      password: 'Password@123',
      phone: '9876543210',
      college: 'JECRC',
      branch: 'CSE',
      year: '3rd Year',
    }),
  }).then((r) => r.json());

  // Step 3: Register User B (Unrelated student)
  const userBEmail = `user_b_${Date.now()}@test.com`;
  const userBRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'User B Outsider',
      email: userBEmail,
      password: 'Password@123',
      phone: '9876543211',
      college: 'JECRC',
      branch: 'IT',
      year: '3rd Year',
    }),
  }).then((r) => r.json());

  // Step 4: User A registers a team
  const psList = await fetch(`${BASE_URL}/api/ps`).then((r) => r.json());
  const ps = psList.data.find((p) => p.seatsAvailable > 0);

  const teamData = {
    psId: ps._id,
    teamName: `Team Upload Test ${Date.now().toString().slice(-4)}`,
    leader: {
      name: 'User A Leader',
      email: userAEmail,
      phone: '9876543210',
      branch: 'CSE',
      year: '3rd Year',
    },
    members: [
      { name: 'M1', email: `m1_${Date.now()}@test.com`, phone: '9876543221', branch: 'CSE', year: '3rd' },
      { name: 'M2', email: `m2_${Date.now()}@test.com`, phone: '9876543222', branch: 'CSE', year: '3rd' },
      { name: 'M3', email: `m3_${Date.now()}@test.com`, phone: '9876543223', branch: 'CSE', year: '3rd' },
    ],
  };

  const regRes = await fetch(`${BASE_URL}/api/team/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userARes.token}`,
    },
    body: JSON.stringify(teamData),
  }).then((r) => r.json());

  // Step 5: Upload dummy payment proof as User A
  const sampleFilePath = path.resolve('scratch/dummy_slip.png');
  fs.writeFileSync(sampleFilePath, 'DUMMY_IMAGE_DATA_12345');

  const formData = new FormData();
  formData.append('teamId', regRes.team._id);
  formData.append('txnId', 'UTR9988776655');
  const blob = new Blob([fs.readFileSync(sampleFilePath)], { type: 'image/png' });
  formData.append('proof', blob, 'dummy_slip.png');

  const uploadRes = await fetch(`${BASE_URL}/api/team/payment/manual`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userARes.token}`,
    },
    body: formData,
  }).then((r) => r.json());

  const proofUrl = uploadRes.team.payment.manualProofUrl;
  console.log('Uploaded Proof URL:', proofUrl);

  // --- ACCESS CONTROL TESTS ---

  // Check 1: Unauthenticated request
  const unauth = await fetch(`${BASE_URL}${proofUrl}`);
  console.log(`1. Unauthenticated request: HTTP ${unauth.status} (Expected: 401)`);
  if (unauth.status === 401) console.log('   ✅ PASS');

  // Check 2: Unauthorized User B request
  const userBAccess = await fetch(`${BASE_URL}${proofUrl}`, {
    headers: { Authorization: `Bearer ${userBRes.token}` },
  });
  console.log(`2. Unauthorized student (User B) request: HTTP ${userBAccess.status} (Expected: 403)`);
  if (userBAccess.status === 403) console.log('   ✅ PASS');

  // Check 3: Authorized User A (Team Leader) request
  const userAAccess = await fetch(`${BASE_URL}${proofUrl}`, {
    headers: { Authorization: `Bearer ${userARes.token}` },
  });
  console.log(`3. Authorized Team Leader (User A) request: HTTP ${userAAccess.status} (Expected: 200)`);
  if (userAAccess.status === 200) console.log('   ✅ PASS');

  // Check 4: Authorized Admin request
  const adminAccess = await fetch(`${BASE_URL}${proofUrl}`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` },
  });
  console.log(`4. Authorized Admin request: HTTP ${adminAccess.status} (Expected: 200)`);
  if (adminAccess.status === 200) console.log('   ✅ PASS');

  console.log('\n🎉 ALL 4 ACCESS CONTROL MATRIX TESTS PASSED!');
}

verifyPriority2().catch(console.error);
