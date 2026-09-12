const BASE_URL = 'http://localhost:5000/api';

async function run() {
  const capRes = await fetch(`${BASE_URL}/ps/capacity/all`).then((r) => r.json());
  const availablePS = capRes.data.find((p) => p.code === 'TSH-PS-03');

  const ts = Date.now();
  const email = `leader_${ts}@tsh.edu`;
  const regUser = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Leader One',
      email,
      password: 'Password@123',
      phone: '9876543210',
      college: 'JECRC',
    }),
  });
  const cookie = regUser.headers.get('set-cookie');

  // 1. Acquire hold
  const holdRes = await fetch(`${BASE_URL}/ps/${availablePS._id}/hold`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
  }).then((r) => r.json());
  console.log('1. Hold Acquired:', holdRes.success, 'holdToken:', holdRes.holdToken);

  // Check capacity with active hold
  let capCheck = await fetch(`${BASE_URL}/ps/capacity/all`).then((r) => r.json());
  let psInfo = capCheck.data.find((p) => p.code === 'TSH-PS-03');
  console.log('Capacity during Active Hold:', {
    activeHolds: psInfo.activeHolds,
    paymentPending: psInfo.paymentPending,
    occupied: psInfo.occupied,
    available: psInfo.available,
  });

  // 2. Submit form with holdToken
  const teamRes = await fetch(`${BASE_URL}/team/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      teamName: `Team Hold Test ${ts}`,
      psId: availablePS._id,
      holdToken: holdRes.holdToken,
      leader: {
        name: 'Leader One',
        email,
        phone: '9876543210',
        branch: 'CSE',
        year: '3rd',
      },
      members: [
        { name: 'M1', email: `m1_${ts}@tsh.edu`, phone: '9876543211', branch: 'CSE', year: '3rd' },
        { name: 'M2', email: `m2_${ts}@tsh.edu`, phone: '9876543212', branch: 'CSE', year: '3rd' },
        { name: 'M3', email: `m3_${ts}@tsh.edu`, phone: '9876543213', branch: 'CSE', year: '3rd' },
      ],
    }),
  }).then((r) => r.json());

  console.log('2. Submission Result:', {
    success: teamRes.success,
    status: teamRes.status,
    message: teamRes.message,
    teamId: teamRes.team?._id,
  });

  // Check capacity after submission (must be: activeHolds = 0, paymentPending = 1, occupied = 1, available = 4)
  capCheck = await fetch(`${BASE_URL}/ps/capacity/all`).then((r) => r.json());
  psInfo = capCheck.data.find((p) => p.code === 'TSH-PS-03');
  console.log('Capacity after submission (Active Hold -> Payment Pending):', {
    activeHolds: psInfo.activeHolds,
    paymentPending: psInfo.paymentPending,
    occupied: psInfo.occupied,
    available: psInfo.available,
  });

  // 3. Admin Approve
  const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@tsh.edu', password: 'Admin@123' }),
  });
  const adminCookie = adminLogin.headers.get('set-cookie');

  const approveRes = await fetch(`${BASE_URL}/admin/registrations/${teamRes.team._id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({}),
  }).then((r) => r.json());

  console.log('3. Admin Approve Result:', {
    success: approveRes.success,
    status: approveRes.team?.status,
    registrationNumber: approveRes.team?.registrationNumber,
  });

  // Check capacity after approval (paymentPending = 0, confirmed = 1, occupied = 1, available = 4)
  capCheck = await fetch(`${BASE_URL}/ps/capacity/all`).then((r) => r.json());
  psInfo = capCheck.data.find((p) => p.code === 'TSH-PS-03');
  console.log('Capacity after Admin Approval:', {
    activeHolds: psInfo.activeHolds,
    paymentPending: psInfo.paymentPending,
    confirmed: psInfo.confirmed,
    occupied: psInfo.occupied,
    available: psInfo.available,
  });

  // 4. Admin Reject test
  const rejectRes = await fetch(`${BASE_URL}/admin/registrations/${teamRes.team._id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ notes: 'Testing slot release' }),
  }).then((r) => r.json());

  console.log('4. Admin Reject Result:', {
    success: rejectRes.success,
    status: rejectRes.team?.status,
  });

  // Check capacity after rejection (occupied should decrease to 0, available increases to 5!)
  capCheck = await fetch(`${BASE_URL}/ps/capacity/all`).then((r) => r.json());
  psInfo = capCheck.data.find((p) => p.code === 'TSH-PS-03');
  console.log('Capacity after Admin Reject (Slot Released):', {
    activeHolds: psInfo.activeHolds,
    paymentPending: psInfo.paymentPending,
    confirmed: psInfo.confirmed,
    occupied: psInfo.occupied,
    available: psInfo.available,
  });
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
