const BASE_URL = 'http://localhost:5000/api';

async function run() {
  const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@tsh.edu', password: 'Admin@12345' }),
  });
  const adminCookie = adminLogin.headers.get('set-cookie');
  console.log('Admin login status:', adminLogin.status, 'Cookie:', !!adminCookie);

  // Find a team in payment_pending
  const teamsRes = await fetch(`${BASE_URL}/admin/registrations?status=payment_pending`, {
    headers: { Cookie: adminCookie },
  }).then((r) => r.json());

  console.log('Pending teams found:', teamsRes.count);
  if (teamsRes.count > 0) {
    const teamToApprove = teamsRes.data[0];
    console.log('Attempting to approve team:', teamToApprove._id, teamToApprove.teamName);
    const approveRes = await fetch(`${BASE_URL}/admin/registrations/${teamToApprove._id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify({ notes: 'Verified at SRC desk' }),
    });
    const approveData = await approveRes.json();
    console.log('Approve response status:', approveRes.status, approveData);

    // Now test reject on another pending team
    if (teamsRes.count > 1) {
      const teamToReject = teamsRes.data[1];
      console.log('Attempting to reject team:', teamToReject._id, teamToReject.teamName);
      const rejectRes = await fetch(`${BASE_URL}/admin/registrations/${teamToReject._id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
        body: JSON.stringify({ notes: 'Fees not paid within deadline' }),
      });
      const rejectData = await rejectRes.json();
      console.log('Reject response status:', rejectRes.status, rejectData);
    }
  }
}

run().catch(console.error);
