const BASE_URL = 'http://localhost:5000';

async function testUploadPrivacy() {
  console.log('🧪 Testing Priority 2: Payment Receipt Privacy & Authentication Gate...');

  // 1. Unauthenticated access check
  const unauthRes = await fetch(`${BASE_URL}/uploads/proof-sample.png`);
  console.log(`1. Unauthenticated fetch: HTTP ${unauthRes.status}`);
  const unauthData = await unauthRes.json();
  console.log(`   Message: "${unauthData.message}"`);

  if (unauthRes.status === 401) {
    console.log('   ✅ PASS: Unauthenticated access properly rejected with 401!');
  } else {
    console.error('   ❌ FAIL: Expected 401, got', unauthRes.status);
  }

  // 2. Login as Admin and test accessing with Admin token
  const adminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@tsh.edu', password: 'Admin@12345' }),
  }).then(r => r.json());

  // Get a registration with a slip
  const regs = await fetch(`${BASE_URL}/api/admin/registrations`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` },
  }).then(r => r.json());

  const teamWithSlip = regs.data?.find(t => t.payment?.manualProofUrl);
  if (teamWithSlip) {
    const slipUrl = `${BASE_URL}${teamWithSlip.payment.manualProofUrl}`;
    console.log('Found team with slip:', teamWithSlip.teamCode, slipUrl);

    // Unauthenticated fetch of this real slip
    const unauthSlip = await fetch(slipUrl);
    console.log(`2. Unauthenticated fetch of REAL slip: HTTP ${unauthSlip.status} (Expected: 401)`);

    // Authenticated admin fetch of this real slip
    const adminSlip = await fetch(slipUrl, {
      headers: { Authorization: `Bearer ${adminLogin.token}` },
    });
    console.log(`3. Authenticated admin fetch of REAL slip: HTTP ${adminSlip.status} (Expected: 200)`);
  } else {
    console.log('No team currently has a file slip uploaded. Let us test with another user.');
  }
}

testUploadPrivacy().catch(console.error);
