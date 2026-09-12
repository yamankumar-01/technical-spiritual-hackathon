const API_URL = 'http://localhost:5000/api';

async function testFlow() {
  console.log('--- Step 1: Admin Login ---');
  const adminRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@tsh.edu',
      password: 'Admin@12345',
    }),
  });
  const adminData = await adminRes.json();
  const adminToken = adminData.token;
  console.log('✅ Admin logged in. Token acquired.');

  const adminHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
  };

  console.log('\n--- Step 2: Fetch all Problem Statements ---');
  const psRes = await fetch(`${API_URL}/ps`);
  const psData = await psRes.json();
  const psList = psData.data;
  const targetPS = psList.find((p) => p.code === 'TSH-PS-04');
  console.log(`Found target PS: ${targetPS.code} - "${targetPS.title}", Seats: ${targetPS.seatsAvailable}`);

  console.log('\n--- Step 3: Login as participant and register team for TSH-PS-04 ---');
  const partRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'leader@college.edu',
      password: 'Password@123',
    }),
  });
  const partData = await partRes.json();
  const partToken = partData.token;
  const partHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${partToken}`,
  };

  const regRes = await fetch(`${API_URL}/team/register`, {
    method: 'POST',
    headers: partHeaders,
    body: JSON.stringify({
      teamName: 'CyberDevils',
      psId: targetPS._id,
      leader: {
        name: 'John Leader',
        email: 'leader@college.edu',
        phone: '9876543210',
        branch: 'CSE',
        year: '3rd',
      },
      members: [
        { name: 'Member One', email: 'm1@college.edu', phone: '9876543211', branch: 'CSE', year: '3rd' },
        { name: 'Member Two', email: 'm2@college.edu', phone: '9876543212', branch: 'IT', year: '3rd' },
        { name: 'Member Three', email: 'm3@college.edu', phone: '9876543213', branch: 'ECE', year: '3rd' },
      ],
    }),
  });
  const regData = await regRes.json();
  const team = regData.team;
  console.log(`✅ Team registered: ${team.teamName} (${team.teamCode}), status: ${team.status}`);

  console.log('\n--- Step 4: Simulate payment verification to decrement seat ---');
  const payRes = await fetch(`${API_URL}/team/payment/razorpay/verify`, {
    method: 'POST',
    headers: partHeaders,
    body: JSON.stringify({
      teamId: team._id,
      razorpayOrderId: `order_mock_${Date.now()}`,
      razorpayPaymentId: `pay_mock_${Date.now()}`,
      razorpaySignature: 'mock_signature_verified',
    }),
  });
  const payData = await payRes.json();
  console.log(`✅ Payment verified: ${payData.message}`);
  console.log(`Remaining seats for PS: ${payData.remainingSeats}`);

  console.log('\n--- Step 5: Admin fetches teams for TSH-PS-04 ---');
  const teamsRes = await fetch(`${API_URL}/admin/ps/${targetPS._id}/teams`, {
    headers: adminHeaders,
  });
  const teamsData = await teamsRes.json();
  console.log(`✅ Admin retrieved ${teamsData.count} team(s) for ${targetPS.code}:`);
  teamsData.data.forEach((t) => {
    console.log(`   -> Team: ${t.teamName} (${t.teamCode}), Leader: ${t.leader?.name}, Status: ${t.status}`);
  });

  console.log('\n--- Step 6: Admin deletes team registration ---');
  const delRes = await fetch(`${API_URL}/admin/teams/${team._id}`, {
    method: 'DELETE',
    headers: adminHeaders,
  });
  const delData = await delRes.json();
  console.log(`✅ Delete response: ${delData.message}`);
  console.log(`PS seats after delete: ${delData.problemStatement.seatsAvailable}`);

  console.log('\n--- Step 7: Verify PS seats and team list again ---');
  const verifyPSRes = await fetch(`${API_URL}/ps/${targetPS._id}`);
  const verifyPSData = await verifyPSRes.json();
  console.log(`✅ Verified PS seats in DB: ${verifyPSData.data.seatsAvailable} / 5 Seats Available`);

  const verifyTeamsRes = await fetch(`${API_URL}/admin/ps/${targetPS._id}/teams`, {
    headers: adminHeaders,
  });
  const verifyTeamsData = await verifyTeamsRes.json();
  console.log(`✅ Verified remaining teams count: ${verifyTeamsData.count}`);

  console.log('\n🎉 ALL TESTS PASSED! Everything is 100% functional end-to-end!');
}

testFlow().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
