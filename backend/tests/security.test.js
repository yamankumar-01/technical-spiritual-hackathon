import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import http from 'http';
import app from '../server.js';
import { initializePostgres, closeDatabase, pgQuery } from '../src/config/postgres.js';
import { findUserById } from '../src/db/queries.js';
import { exportTicketManager } from '../src/utils/exportTicket.js';

let server;
let baseUrl;
const JWT_SECRET = process.env.JWT_SECRET || 'tsh_super_secret_jwt_key_2026_zen_cyber';

let testAdminId;
let testAdminToken;
let testUserId;
let testUserToken;
let testUser2Id;
let testUser2Token;
let testUser1TeamId;

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.DISABLE_RATE_LIMIT = 'true';
  process.env.ALLOWED_ORIGINS = 'https://tsh2026.com,https://www.tsh2026.com';
  process.env.CLIENT_URL = 'http://localhost:5173';

  await initializePostgres();

  // Create or verify test admin user in DB
  const adminEmail = `security-admin-${Date.now()}@example.com`;
  const adminRes = await pgQuery(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('Security Test Admin', $1, 'hashedpass', 'admin')
     RETURNING id`,
    [adminEmail]
  );
  testAdminId = adminRes.rows[0].id;
  testAdminToken = jwt.sign({ id: testAdminId, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

  // Create test regular user 1 in DB
  const userEmail = `security-user1-${Date.now()}@example.com`;
  const userRes = await pgQuery(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('Security Test User 1', $1, 'hashedpass', 'user')
     RETURNING id`,
    [userEmail]
  );
  testUserId = userRes.rows[0].id;
  testUserToken = jwt.sign({ id: testUserId, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });

  // Create test regular user 2 in DB (for IDOR / data isolation testing)
  const user2Email = `security-user2-${Date.now()}@example.com`;
  const user2Res = await pgQuery(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('Security Test User 2', $1, 'hashedpass', 'user')
     RETURNING id`,
    [user2Email]
  );
  testUser2Id = user2Res.rows[0].id;
  testUser2Token = jwt.sign({ id: testUser2Id, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });

  // Create a problem statement and a test team owned by User 1
  const psRes = await pgQuery('SELECT id FROM problem_statements LIMIT 1');
  const samplePsId = psRes.rows[0].id;

  const teamRes = await pgQuery(
    `INSERT INTO teams (
       team_name, team_code, problem_statement_id, created_by, leader_id, leader_name, leader_email, leader_phone, leader_college, status, payment_status
     ) VALUES (
       'User 1 Private Team', 'TEAM-PRIV-1', $1, $2, $2, 'Security Test User 1', $3, '9999999991', 'Test College', 'registered', 'pending'
     ) RETURNING id`,
    [samplePsId, testUserId, userEmail]
  );
  testUser1TeamId = teamRes.rows[0].id;

  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await closeDatabase();
  setTimeout(() => process.exit(0), 500).unref();
});

describe('1. CORS Security & Origin Validation', () => {
  test('Exact trusted development origin (localhost:5173) is allowed with credentials', async () => {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: {
        Origin: 'http://localhost:5173',
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    assert.equal(res.headers.get('access-control-allow-credentials'), 'true');
  });

  test('Configured trusted production origin (https://tsh2026.com) is allowed with credentials', async () => {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: {
        Origin: 'https://tsh2026.com',
      },
    });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('access-control-allow-origin'), 'https://tsh2026.com');
    assert.equal(res.headers.get('access-control-allow-credentials'), 'true');
  });

  test('Untrusted arbitrary origin (https://evil-attacker.com) is rejected and not reflected', async () => {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: {
        Origin: 'https://evil-attacker.com',
      },
    });
    assert.notEqual(res.headers.get('access-control-allow-origin'), 'https://evil-attacker.com');
  });

  test('Arbitrary third-party vercel domain (https://untrusted-site.vercel.app) is rejected', async () => {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: {
        Origin: 'https://untrusted-site.vercel.app',
      },
    });
    assert.notEqual(res.headers.get('access-control-allow-origin'), 'https://untrusted-site.vercel.app');
  });

  test('Request without Origin header (curl / server-to-server) passes cleanly', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.service.includes('Techno Spiritual Hackathon'));
  });
});

describe('2. Browser Security Headers', () => {
  test('Sets Content-Security-Policy with frame-ancestors none and restrictive directives', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const csp = res.headers.get('content-security-policy');
    assert.ok(csp, 'CSP header should be present');
    assert.ok(csp.includes("default-src 'self'"), 'CSP should restrict default-src');
    assert.ok(csp.includes("frame-ancestors 'none'"), 'CSP should restrict frame-ancestors to none');
    assert.ok(csp.includes("object-src 'none'"), 'CSP should disable object-src');
  });

  test('Sets X-Frame-Options to DENY', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
  });

  test('Sets X-Content-Type-Options to nosniff', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  });

  test('Sets Referrer-Policy to strict-origin-when-cross-origin', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  });

  test('Sets restrictive Permissions-Policy for browser hardware APIs', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const pp = res.headers.get('permissions-policy');
    assert.ok(pp, 'Permissions-Policy should be present');
    assert.ok(pp.includes('camera=()'));
    assert.ok(pp.includes('microphone=()'));
    assert.ok(pp.includes('geolocation=()'));
  });

  test('Strips X-Powered-By framework header', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.headers.get('x-powered-by'), null);
  });
});

describe('3. Authentication, Authorization & Route Boundaries', () => {
  test('Unauthenticated access to protected admin route is rejected with 401', async () => {
    const res = await fetch(`${baseUrl}/api/admin/registrations`);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  test('Unauthenticated access to team registration is rejected with 401', async () => {
    const res = await fetch(`${baseUrl}/api/team/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamName: 'Test Team' }),
    });
    assert.equal(res.status, 401);
  });

  test('Unauthenticated access to team status is rejected with 401', async () => {
    const res = await fetch(`${baseUrl}/api/team/my-status`);
    assert.equal(res.status, 401);
  });

  test('Regular user cannot access admin routes (role-based authorization)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/registrations`, {
      headers: {
        Authorization: `Bearer ${testUserToken}`,
      },
    });
    assert.equal(res.status, 403);
    const body = await res.json();
    assert.ok(body.message.includes('Admin privileges required'));
  });

  test('Cross-user data isolation: User 2 cannot view User 1 team in my-status (IDOR protection)', async () => {
    const res = await fetch(`${baseUrl}/api/team/my-status`, {
      headers: {
        Authorization: `Bearer ${testUser2Token}`,
      },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    // User 2 should NOT see User 1's team
    if (body.hasTeam && body.team) {
      assert.notEqual(body.team.id, testUser1TeamId, "User 2 should never see User 1's team");
    } else {
      assert.equal(body.hasTeam, false);
      assert.equal(body.team, null);
    }
  });

  test('Object-level authorization: User 2 cannot modify User 1 team payment proof (IDOR prevention)', async () => {
    const res = await fetch(`${baseUrl}/api/team/payment/manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUser2Token}`,
      },
      body: JSON.stringify({
        teamId: testUser1TeamId,
        txnId: 'HACKED-TXN-12345678',
      }),
    });
    // Should be rejected because team does not belong to User 2 (object-level auth check)
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.ok(body.message.includes('not found'));
  });
});

describe('4. Export Authentication & Query Token Mitigation', () => {
  test('Raw bearer token in query parameter (?token=...) is strictly rejected with 401', async () => {
    const res = await fetch(`${baseUrl}/api/admin/export/teams.xlsx?token=${encodeURIComponent(testAdminToken)}`);
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  test('Header-based Authorization (Bearer <token>) is accepted on export routes', async () => {
    const res = await fetch(`${baseUrl}/api/admin/export/teams.csv`, {
      headers: {
        Authorization: `Bearer ${testAdminToken}`,
      },
    });
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-type')?.includes('text/csv'));
  });

  test('Single-use export ticket works once and is immediately burned upon second request', async () => {
    const ticket = exportTicketManager.createTicket(testAdminId);
    assert.ok(ticket, 'Ticket should be generated');

    // 1st request with single-use ticket: MUST succeed
    const res1 = await fetch(`${baseUrl}/api/admin/export/teams.csv?ticket=${ticket}`);
    assert.equal(res1.status, 200);

    // 2nd request with the same ticket: MUST be rejected with 401 (single-use guarantee)
    const res2 = await fetch(`${baseUrl}/api/admin/export/teams.csv?ticket=${ticket}`);
    assert.equal(res2.status, 401);
  });

  test('Random or forged ticket is rejected with 401', async () => {
    const res = await fetch(`${baseUrl}/api/admin/export/teams.csv?ticket=fake-ticket-123456789`);
    assert.equal(res.status, 401);
  });
});

describe('5. Input Validation & Sanitization', () => {
  test('Registration rejects password shorter than 8 characters', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Short Pass User',
        email: `shortpass-${Date.now()}@example.com`,
        password: '123',
      }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes('at least 8 characters'));
  });

  test('Registration rejects invalid email format', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Bad Email User',
        email: 'invalid-email-without-domain',
        password: 'ValidPassword123!',
      }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes('valid email address'));
  });

  test('Contact form rejects submission missing required fields', async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alice',
        email: 'alice@example.com',
      }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes('Message content is required'));
  });

  test('Team registration rejects duplicate emails in submitted roster', async () => {
    const res = await fetch(`${baseUrl}/api/team/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        teamName: 'Duplicate Test Team',
        psId: 'ps-test-id',
        leader: { name: 'Leader', email: 'duplicate@example.com', phone: '9999999999' },
        members: [
          { name: 'M1', email: 'duplicate@example.com', phone: '9999999998' }, // duplicate of leader
          { name: 'M2', email: 'm2@example.com', phone: '9999999997' },
          { name: 'M3', email: 'm3@example.com', phone: '9999999996' },
        ],
      }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes('unique email addresses'));
  });
});

describe('6. Upload Security & Path Traversal Mitigation', () => {
  test('Path traversal in /uploads/:filename is rejected', async () => {
    const res = await fetch(`${baseUrl}/uploads/..%2f..%2fpackage.json`, {
      headers: {
        Authorization: `Bearer ${testAdminToken}`,
      },
    });
    assert.notEqual(res.status, 200);
  });

  test('Direct request for non-existent file returns 404', async () => {
    const res = await fetch(`${baseUrl}/uploads/nonexistent-receipt.png`, {
      headers: {
        Authorization: `Bearer ${testAdminToken}`,
      },
    });
    assert.equal(res.status, 404);
  });
});
