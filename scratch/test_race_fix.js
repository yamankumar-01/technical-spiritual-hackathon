const BASE_URL = 'http://localhost:5000';

async function testRaceCondition() {
  console.log('🧪 Testing Priority 1: Duplicate Email Parallel Race Condition Fix...');

  const sharedClashEmail = `race_fix_clash_${Date.now()}@test.com`;

  // Create two distinct users
  const [userA, userB] = await Promise.all([
    fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Race User A', email: `race_user_a_${Date.now()}@test.com`, password: 'Password@123' }),
    }).then(r => r.json()),
    fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Race User B', email: `race_user_b_${Date.now()}@test.com`, password: 'Password@123' }),
    }).then(r => r.json()),
  ]);

  // Fetch available PS
  const psList = (await fetch(`${BASE_URL}/api/ps`).then(r => r.json())).data;
  const ps1 = psList[10]._id;
  const ps2 = psList[11]._id;

  // Prepare two team payloads sharing the EXACT SAME member email
  const payloadA = {
    teamName: `Team Race Alpha ${Date.now()}`,
    psId: ps1,
    leader: { name: 'Lead A', email: `lead_a_${Date.now()}@test.com`, phone: '9876543201', branch: 'CSE', year: '3rd' },
    members: [
      { name: 'Shared Member', email: sharedClashEmail, phone: '9876543202', branch: 'CSE', year: '3rd' },
      { name: 'M2', email: `m2_a_${Date.now()}@test.com`, phone: '9876543203', branch: 'CSE', year: '3rd' },
      { name: 'M3', email: `m3_a_${Date.now()}@test.com`, phone: '9876543204', branch: 'CSE', year: '3rd' },
    ],
  };

  const payloadB = {
    teamName: `Team Race Beta ${Date.now()}`,
    psId: ps2,
    leader: { name: 'Lead B', email: `lead_b_${Date.now()}@test.com`, phone: '9876543205', branch: 'IT', year: '3rd' },
    members: [
      { name: 'Shared Member', email: sharedClashEmail, phone: '9876543206', branch: 'IT', year: '3rd' }, // EXACT SAME SHARED EMAIL!
      { name: 'M2', email: `m2_b_${Date.now()}@test.com`, phone: '9876543207', branch: 'IT', year: '3rd' },
      { name: 'M3', email: `m3_b_${Date.now()}@test.com`, phone: '9876543208', branch: 'IT', year: '3rd' },
    ],
  };

  // Fire both in TRUE parallel with Promise.all
  console.log('⚡ Firing parallel team registrations with shared email:', sharedClashEmail);
  const [resA, resB] = await Promise.all([
    fetch(`${BASE_URL}/api/team/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userA.token}`,
      },
      body: JSON.stringify(payloadA),
    }),
    fetch(`${BASE_URL}/api/team/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userB.token}`,
      },
      body: JSON.stringify(payloadB),
    }),
  ]);

  const dataA = await resA.json();
  const dataB = await resB.json();

  console.log(`Response A: HTTP ${resA.status} -> ${dataA.message}`);
  console.log(`Response B: HTTP ${resB.status} -> ${dataB.message}`);

  const oneSuccess = (resA.status === 201 && resB.status === 400) || (resB.status === 201 && resA.status === 400);
  if (oneSuccess) {
    console.log('\n🎉 SUCCESS: Exactly ONE registration succeeded (201), and the second was atomically rejected with HTTP 400!');
  } else {
    console.error('\n❌ FAILURE: Both succeeded or unexpected status code!');
  }
}

testRaceCondition().catch(console.error);
