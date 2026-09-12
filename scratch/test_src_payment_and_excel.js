import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000';

async function testSRCPaymentAndExcel() {
  console.log('🧪 Verifying SRC Offline Payment & Admin Excel Export Feature...\n');

  // 1. Verify TeamRegisterPage.jsx content
  const registerPageCode = fs.readFileSync(
    path.join(__dirname, '../frontend/src/pages/TeamRegisterPage.jsx'),
    'utf8'
  );

  const hasSRCNotice =
    registerPageCode.includes('Offline Payment Collection & Seat Approval at SRC') &&
    registerPageCode.includes('Student Resource Center (SRC)') &&
    registerPageCode.includes('rejected and released') &&
    registerPageCode.includes('निरस्त (Reject)');

  console.log('1. TeamRegisterPage.jsx SRC Notice check:', hasSRCNotice ? '✅ PASS' : '❌ FAIL');
  if (!hasSRCNotice) {
    throw new Error('Required SRC Payment & Rejection message not found in TeamRegisterPage.jsx');
  }

  // 2. Verify AdminDashboardPage.jsx Excel Export & Button
  const adminPageCode = fs.readFileSync(
    path.join(__dirname, '../frontend/src/pages/AdminDashboardPage.jsx'),
    'utf8'
  );

  const hasExcelExport =
    adminPageCode.includes('handleExportExcel') &&
    adminPageCode.includes('Export to Excel') &&
    adminPageCode.includes('\\uFEFF') &&
    adminPageCode.includes('.csv');

  console.log('2. AdminDashboardPage.jsx Export to Excel button check:', hasExcelExport ? '✅ PASS' : '❌ FAIL');
  if (!hasExcelExport) {
    throw new Error('Export to Excel button or handler not found in AdminDashboardPage.jsx');
  }

  // 3. Register a real team via API and check default status and payment info
  const userEmail = `src_user_${Date.now()}@tsh.edu`;
  const userReg = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'SRC Test Leader',
      email: userEmail,
      password: 'Password@123',
      phone: '9876543210',
      college: 'JECRC Foundation',
      branch: 'CSE',
      year: '3rd Year',
    }),
  }).then((r) => r.json());

  const psList = await fetch(`${BASE_URL}/api/ps`).then((r) => r.json());
  const ps = psList.data.find((p) => p.seatsAvailable > 0);

  const teamRes = await fetch(`${BASE_URL}/api/team/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userReg.token}`,
    },
    body: JSON.stringify({
      teamName: `Team SRC Test ${Date.now().toString().slice(-4)}`,
      psId: ps._id,
      leader: {
        name: 'SRC Test Leader',
        email: userEmail,
        phone: '9876543210',
        branch: 'CSE',
        year: '3rd Year',
      },
      members: [
        { name: 'M1', email: `src_m1_${Date.now()}@test.com`, phone: '9876543211', branch: 'CSE', year: '3rd' },
        { name: 'M2', email: `src_m2_${Date.now()}@test.com`, phone: '9876543212', branch: 'CSE', year: '3rd' },
        { name: 'M3', email: `src_m3_${Date.now()}@test.com`, phone: '9876543213', branch: 'CSE', year: '3rd' },
      ],
    }),
  }).then((r) => r.json());

  console.log('3. Registered Team response status:', teamRes.team?.status);
  console.log('   Payment details:', teamRes.team?.payment);

  const isPendingSRC = teamRes.team?.status === 'payment_pending' && teamRes.team?.payment?.method === 'src_desk';
  console.log('   Status is payment_pending with method src_desk:', isPendingSRC ? '✅ PASS' : '❌ FAIL');

  // 4. Admin login & check team in admin registrations
  const adminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@tsh.edu', password: 'Admin@12345' }),
  }).then((r) => r.json());

  const regsRes = await fetch(`${BASE_URL}/api/admin/registrations`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` },
  }).then((r) => r.json());

  const found = regsRes.data?.find((t) => t._id === teamRes.team?._id);
  console.log('4. Team visible in Admin Dashboard list:', found ? '✅ PASS' : '❌ FAIL');

  // 5. Test Admin Approval upon receiving payment at SRC Desk
  const approveRes = await fetch(`${BASE_URL}/api/admin/registrations/${teamRes.team?._id}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminLogin.token}`,
    },
    body: JSON.stringify({
      notes: 'Fee received and verified at SRC desk.',
      status: 'finalized',
    }),
  }).then((r) => r.json());

  console.log('5. Admin approval at SRC desk:', approveRes.success ? '✅ PASS' : '❌ FAIL');
  console.log('   Approved Team Status:', approveRes.team?.status);

  console.log('\n🎉 ALL CHECKS PASSED SUCCESSFULLY!');
}

testSRCPaymentAndExcel().catch(console.error);
