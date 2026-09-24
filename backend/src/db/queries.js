import { pgQuery, withTransaction } from '../config/postgres.js';
import crypto from 'crypto';

// ============================================================================
// FORMATTERS FOR FRONTEND JSON CONTRACT COMPATIBILITY
// ============================================================================

export const formatPS = (ps) => ({
  _id: ps.id,
  id: ps.id,
  ps_number: ps.ps_number,
  code: ps.code,
  title: ps.title,
  category: ps.category,
  background: ps.background || '',
  challenge: ps.challenge || '',
  keyRequirements: Array.isArray(ps.key_requirements)
    ? ps.key_requirements
    : typeof ps.key_requirements === 'string'
    ? JSON.parse(ps.key_requirements)
    : [],
  totalSeats: ps.total_seats || 5,
  seatsAvailable: ps.seats_available !== undefined ? ps.seats_available : 5,
  capacity: ps.total_seats || 5,
  available: ps.seats_available !== undefined ? ps.seats_available : 5,
  is_active: ps.is_active !== false,
  registration_enabled: ps.is_active !== false,
});

export const formatTeam = (t, members = []) => ({
  _id: t.id,
  id: t.id,
  teamName: t.team_name,
  teamCode: t.team_code || `TSH-${t.id.slice(0, 4).toUpperCase()}`,
  registrationNumber: t.registration_number,
  status: t.status,
  payment_status: t.payment_status,
  adminNotes: t.admin_notes || '',
  approved_at: t.approved_at,
  rejected_at: t.rejected_at,
  createdAt: t.created_at,
  createdBy: t.created_by,
  holdToken: t.hold_token,
  leader: {
    name: t.leader_name,
    email: t.leader_email,
    phone: t.leader_phone,
    college: t.leader_college,
    branch: t.leader_branch,
    year: t.leader_year,
  },
  members: (members || []).map((m) => ({
    name: m.name,
    email: m.email,
    phone: m.phone,
    college: m.college,
    branch: m.branch,
    year: m.year,
  })),
  problemStatement: t.problem_statement_id
    ? {
        _id: t.problem_statement_id,
        id: t.problem_statement_id,
        title: t.ps_title || '',
        code: t.ps_code || '',
        category: t.ps_category || '',
        seatsAvailable: t.seats_available !== undefined ? t.seats_available : 5,
        totalSeats: t.total_seats || 5,
      }
    : null,
  payment: {
    method: t.payment_method || 'src_desk',
    amount: Number(t.payment_amount || 400),
    manualTxnId: t.transaction_id,
    manualProofUrl: t.payment_screenshot_url,
    paidAt: t.approved_at || t.created_at,
  },
  venue: (t.venue_room_number || t.venue_time_slot || t.venue)
    ? {
        roomNumber: t.venue?.roomNumber || t.venue_room_number || '',
        timeSlot: t.venue?.timeSlot || t.venue_time_slot || '',
        allocatedAt: t.venue?.allocatedAt || t.venue_allocated_at || null,
      }
    : null,
});

// ============================================================================
// 1. USERS & AUTH
// ============================================================================

export const findUserById = async (id) => {
  const res = await pgQuery(
    `SELECT id, name, email, phone, college, role, created_at 
     FROM users 
     WHERE id = $1`,
    [id]
  );
  if (!res.rows[0]) return null;
  const user = res.rows[0];
  return { ...user, _id: user.id };
};

export const findUserByEmail = async (email) => {
  const res = await pgQuery(
    `SELECT id, name, email, password_hash, phone, college, role, created_at 
     FROM users 
     WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  if (!res.rows[0]) return null;
  const user = res.rows[0];
  return { ...user, _id: user.id };
};

export const createUser = async ({ name, email, passwordHash, phone, college, role = 'user' }) => {
  const res = await pgQuery(
    `INSERT INTO users (name, email, password_hash, phone, college, role)
     VALUES ($1, LOWER($2), $3, $4, $5, $6)
     RETURNING id, name, email, phone, college, role, created_at`,
    [name, email, passwordHash, phone, college, role]
  );
  const user = res.rows[0];
  return { ...user, _id: user.id };
};

// ============================================================================
// 2. PROBLEM STATEMENTS
// ============================================================================

export const getAllProblemStatements = async () => {
  const res = await pgQuery(`
    SELECT * 
    FROM problem_statements 
    ORDER BY ps_number ASC
  `);
  return res.rows.map(formatPS);
};

export const getProblemStatementById = async (idOrCode) => {
  // Support querying by UUID or by code (e.g. TSH-PS-01)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrCode);
  const sql = isUuid
    ? `SELECT * FROM problem_statements WHERE id = $1`
    : `SELECT * FROM problem_statements WHERE code = $1`;
  const res = await pgQuery(sql, [idOrCode]);
  return res.rows[0] ? formatPS(res.rows[0]) : null;
};

// ============================================================================
// 3. GLOBAL SETTINGS
// ============================================================================

export const getGlobalSettings = async () => {
  const res = await pgQuery(`
    SELECT registration_enabled, registration_start_date, registration_end_date, hold_duration_seconds
    FROM global_settings
    ORDER BY id ASC
    LIMIT 1
  `);
  if (res.rows[0]) {
    const s = res.rows[0];
    return {
      registrationEnabled: s.registration_enabled,
      registrationStartDate: s.registration_start_date,
      registrationEndDate: s.registration_end_date,
      holdDurationSeconds: s.hold_duration_seconds || 900,
    };
  }
  return {
    registrationEnabled: true,
    registrationStartDate: new Date('2026-01-01T00:00:00Z'),
    registrationEndDate: new Date('2026-12-31T23:59:59Z'),
    holdDurationSeconds: 900,
  };
};

// ============================================================================
// 4. REGISTRATION HOLDS
// ============================================================================

export const cleanupExpiredHolds = async () => {
  const res = await pgQuery(`
    UPDATE registration_holds
    SET status = 'expired'
    WHERE status = 'active' AND expires_at <= CURRENT_TIMESTAMP
    RETURNING id
  `);
  return res.rowCount;
};

export const findActiveHold = async (problemId, userId) => {
  const res = await pgQuery(
    `SELECT h.*, ps.code AS ps_code, ps.title AS ps_title, ps.category AS ps_category
     FROM registration_holds h
     JOIN problem_statements ps ON ps.id = h.problem_statement_id
     WHERE h.problem_statement_id = $1 
       AND h.user_id = $2 
       AND h.status = 'active' 
       AND h.expires_at > CURRENT_TIMESTAMP
     LIMIT 1`,
    [problemId, userId]
  );
  return res.rows[0] || null;
};

export const getUserActiveHolds = async (userId) => {
  const res = await pgQuery(
    `SELECT h.*, ps.id AS ps_id, ps.code AS ps_code, ps.title AS ps_title, ps.category AS ps_category
     FROM registration_holds h
     JOIN problem_statements ps ON ps.id = h.problem_statement_id
     WHERE h.user_id = $1 
       AND h.status = 'active' 
       AND h.expires_at > CURRENT_TIMESTAMP
     ORDER BY h.created_at DESC`,
    [userId]
  );
  return res.rows.map((h) => ({
    holdToken: h.hold_token,
    problem: {
      _id: h.ps_id,
      id: h.ps_id,
      code: h.ps_code,
      title: h.ps_title,
      category: h.ps_category,
    },
    expiresAt: h.expires_at,
    remainingSeconds: Math.max(
      0,
      Math.floor((new Date(h.expires_at).getTime() - Date.now()) / 1000)
    ),
  }));
};

export const acquireProblemHold = async ({ problemId, userId }) => {
  return await withTransaction(async (client) => {
    // 1. Lock problem statement row for concurrency safety
    const psRes = await client.query(
      `SELECT * FROM problem_statements WHERE id = $1 FOR UPDATE`,
      [problemId]
    );
    if (!psRes.rows[0]) {
      return { status: 404, body: { success: false, code: 'PROBLEM_NOT_FOUND', message: 'Problem statement not found.' } };
    }
    const ps = psRes.rows[0];

    // 2. Verify global settings
    const setRes = await client.query(`SELECT * FROM global_settings LIMIT 1`);
    const settings = setRes.rows[0] || {
      registration_enabled: true,
      registration_start_date: new Date('2026-01-01'),
      registration_end_date: new Date('2026-12-31'),
      hold_duration_seconds: 900,
    };

    const now = new Date();
    if (!settings.registration_enabled) {
      return { status: 400, body: { success: false, code: 'REGISTRATION_DISABLED', message: 'Registration is currently disabled.' } };
    }
    if (now < new Date(settings.registration_start_date)) {
      return { status: 400, body: { success: false, code: 'REGISTRATION_NOT_STARTED', message: 'Registration has not started yet.' } };
    }
    if (now > new Date(settings.registration_end_date)) {
      return { status: 400, body: { success: false, code: 'REGISTRATION_CLOSED', message: 'Registration is closed.' } };
    }

    // 3. Check if user already submitted registration for this problem
    const teamCheck = await client.query(
      `SELECT id, team_name, status FROM teams 
       WHERE (created_by = $1 OR leader_id = $1)
         AND problem_statement_id = $2
         AND status IN ('payment_pending', 'confirmed', 'registered', 'finalized')
       LIMIT 1`,
      [userId, problemId]
    );
    if (teamCheck.rows[0]) {
      return {
        status: 400,
        body: {
          success: false,
          code: 'ALREADY_REGISTERED',
          message: `You have already registered team "${teamCheck.rows[0].team_name}" for this problem statement (Status: ${teamCheck.rows[0].status.toUpperCase()}).`,
        },
      };
    }

    // 4. Check if user already has an active, valid hold
    const existingHold = await client.query(
      `SELECT * FROM registration_holds 
       WHERE problem_statement_id = $1 AND user_id = $2 AND status = 'active' AND expires_at > CURRENT_TIMESTAMP
       LIMIT 1`,
      [problemId, userId]
    );
    if (existingHold.rows[0]) {
      const h = existingHold.rows[0];
      const remainingSeconds = Math.max(0, Math.floor((new Date(h.expires_at).getTime() - Date.now()) / 1000));
      return {
        status: 200,
        body: {
          success: true,
          isExisting: true,
          holdToken: h.hold_token,
          expiresAt: h.expires_at,
          duration: remainingSeconds,
          problemId,
        },
      };
    }

    // 5. Expire stale holds
    await client.query(
      `UPDATE registration_holds SET status = 'expired' WHERE problem_statement_id = $1 AND status = 'active' AND expires_at <= CURRENT_TIMESTAMP`,
      [problemId]
    );

    // 6. Calculate occupied seats
    const holdsCountRes = await client.query(
      `SELECT COUNT(*) AS total FROM registration_holds WHERE problem_statement_id = $1 AND status = 'active' AND expires_at > CURRENT_TIMESTAMP`,
      [problemId]
    );
    const activeHolds = parseInt(holdsCountRes.rows[0].total, 10);

    const pendingTeamsRes = await client.query(
      `SELECT COUNT(*) AS total FROM teams WHERE problem_statement_id = $1 AND status = 'payment_pending'`,
      [problemId]
    );
    const paymentPending = parseInt(pendingTeamsRes.rows[0].total, 10);

    const confirmedTeamsRes = await client.query(
      `SELECT COUNT(*) AS total FROM teams WHERE problem_statement_id = $1 AND status IN ('confirmed', 'finalized')`,
      [problemId]
    );
    const confirmed = parseInt(confirmedTeamsRes.rows[0].total, 10);

    const totalSeats = ps.total_seats || 5;
    const occupied = activeHolds + paymentPending + confirmed;
    const available = Math.max(0, totalSeats - occupied);

    if (available <= 0) {
      return {
        status: 409,
        body: {
          success: false,
          code: 'TEMPORARILY_UNAVAILABLE',
          message:
            'Temporarily unavailable. All available slots are currently occupied. Another participant may currently be filling the last available slot. Please try again after a few minutes.',
          capacity: totalSeats,
          occupied,
          available: 0,
        },
      };
    }

    // 7. Insert new hold
    const durationSeconds = settings.hold_duration_seconds || 900;
    const expiresAt = new Date(Date.now() + durationSeconds * 1000);
    const holdToken = crypto.randomUUID();

    const insertHold = await client.query(
      `INSERT INTO registration_holds (problem_statement_id, user_id, hold_token, expires_at, duration_seconds, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
      [problemId, userId, holdToken, expiresAt, durationSeconds]
    );

    const newHold = insertHold.rows[0];
    return {
      status: 201,
      body: {
        success: true,
        isExisting: false,
        holdToken: newHold.hold_token,
        expiresAt: newHold.expires_at,
        duration: durationSeconds,
        problemId,
      },
    };
  });
};

export const getAllPSCapacity = async () => {
  const problemsRes = await pgQuery(`SELECT * FROM problem_statements ORDER BY ps_number ASC`);
  const settings = await getGlobalSettings();
  const now = new Date();

  // Aggregate active holds
  const holdsRes = await pgQuery(`
    SELECT problem_statement_id, COUNT(*) AS count 
    FROM registration_holds 
    WHERE status = 'active' AND expires_at > CURRENT_TIMESTAMP 
    GROUP BY problem_statement_id
  `);
  const holdMap = new Map(holdsRes.rows.map((r) => [r.problem_statement_id, parseInt(r.count, 10)]));

  // Aggregate pending teams
  const pendingRes = await pgQuery(`
    SELECT problem_statement_id, COUNT(*) AS count 
    FROM teams 
    WHERE status = 'payment_pending' 
    GROUP BY problem_statement_id
  `);
  const pendingMap = new Map(pendingRes.rows.map((r) => [r.problem_statement_id, parseInt(r.count, 10)]));

  // Aggregate confirmed teams
  const confirmedRes = await pgQuery(`
    SELECT problem_statement_id, COUNT(*) AS count 
    FROM teams 
    WHERE status IN ('confirmed', 'finalized') 
    GROUP BY problem_statement_id
  `);
  const confirmedMap = new Map(confirmedRes.rows.map((r) => [r.problem_statement_id, parseInt(r.count, 10)]));

  const data = problemsRes.rows.map((ps) => {
    const capacity = ps.total_seats || 5;
    const holds = holdMap.get(ps.id) || 0;
    const pending = pendingMap.get(ps.id) || 0;
    const conf = confirmedMap.get(ps.id) || 0;
    const occupied = holds + pending + conf;
    const available = Math.max(0, capacity - occupied);

    let registrationState = 'AVAILABLE';
    if (!settings.registrationEnabled) registrationState = 'DISABLED';
    else if (now < new Date(settings.registrationStartDate)) registrationState = 'NOT_STARTED';
    else if (now > new Date(settings.registrationEndDate)) registrationState = 'CLOSED';
    else if (ps.is_active === false) registrationState = 'DISABLED';
    else if (available <= 0) registrationState = 'TEMPORARILY_UNAVAILABLE';

    return {
      _id: ps.id,
      id: ps.id,
      code: ps.code,
      title: ps.title,
      category: ps.category,
      background: ps.background || '',
      challenge: ps.challenge || '',
      keyRequirements: Array.isArray(ps.key_requirements) ? ps.key_requirements : [],
      totalSeats: capacity,
      seatsAvailable: available,
      capacity,
      activeHolds: holds,
      paymentPending: pending,
      confirmed: conf,
      occupied,
      available,
      registrationState,
      registration_enabled: ps.is_active !== false,
    };
  });

  return {
    settings,
    data,
  };
};

// ============================================================================
// 5. TEAMS & REGISTRATION
// ============================================================================

export const registerNewTeam = async ({ teamName, psId, userId, leader, members, holdToken }) => {
  const leaderEmail = leader.email.trim().toLowerCase();
  const memberEmails = members.map((m) => m.email.trim().toLowerCase());
  const allEmails = [leaderEmail, ...memberEmails];

  return await withTransaction(async (client) => {
    // 1. Check holdToken if provided
    let holdId = null;
    if (holdToken) {
      const holdRes = await client.query(
        `SELECT * FROM registration_holds WHERE hold_token = $1 AND user_id = $2 AND problem_statement_id = $3`,
        [holdToken, userId, psId]
      );
      const hold = holdRes.rows[0];
      if (!hold) {
        throw new Error('This registration session is no longer valid. Please select the problem again.');
      }
      if (hold.status === 'consumed') {
        // Idempotency: return existing team if already consumed
        const existingTeamRes = await client.query(
          `SELECT t.*, ps.code AS ps_code, ps.title AS ps_title, ps.category AS ps_category, ps.seats_available, ps.total_seats
           FROM teams t
           JOIN problem_statements ps ON ps.id = t.problem_statement_id
           WHERE t.hold_token = $1 LIMIT 1`,
          [holdToken]
        );
        if (existingTeamRes.rows[0]) {
          const t = existingTeamRes.rows[0];
          const memRes = await client.query(`SELECT * FROM team_members WHERE team_id = $1 ORDER BY created_at ASC`, [t.id]);
          return { isDuplicate: true, team: formatTeam(t, memRes.rows) };
        }
      }
      if (hold.status !== 'active' || new Date() >= new Date(hold.expires_at)) {
        await client.query(`UPDATE registration_holds SET status = 'expired' WHERE id = $1`, [hold.id]);
        throw new Error('Your registration window has expired. Please select the problem again.');
      }
      holdId = hold.id;
    }

    // 2. Check for email conflicts in other teams
    const conflictQuery = `
      SELECT t.team_name, ps.code AS ps_code, ps.title AS ps_title, LOWER(t.leader_email) AS clashing_email
      FROM teams t
      JOIN problem_statements ps ON ps.id = t.problem_statement_id
      WHERE LOWER(t.leader_email) = ANY($1)
        AND t.status IN ('payment_pending', 'confirmed', 'registered', 'finalized')
      UNION
      SELECT t.team_name, ps.code AS ps_code, ps.title AS ps_title, LOWER(tm.email) AS clashing_email
      FROM team_members tm
      JOIN teams t ON t.id = tm.team_id
      JOIN problem_statements ps ON ps.id = t.problem_statement_id
      WHERE LOWER(tm.email) = ANY($1)
        AND t.status IN ('payment_pending', 'confirmed', 'registered', 'finalized')
      LIMIT 1;
    `;
    const conflictRes = await client.query(conflictQuery, [allEmails]);
    if (conflictRes.rows[0]) {
      const c = conflictRes.rows[0];
      throw new Error(
        `The email "${c.clashing_email}" is already registered with team "${c.team_name}" for Problem Statement ${c.ps_code} (${c.ps_title}). An email can only be assigned to one Problem Statement.`
      );
    }

    // 3. Generate random teamCode
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const teamCode = `TSH-${randomSuffix}`;

    // 4. Insert into teams table
    const teamInsertRes = await client.query(
      `INSERT INTO teams (
        team_name, team_code, problem_statement_id, leader_id, created_by,
        leader_name, leader_email, leader_phone, leader_college, leader_branch, leader_year,
        hold_token, status, payment_status, payment_method, payment_amount
       ) VALUES (
        $1, $2, $3, $4, $4,
        $5, $6, $7, $8, $9, $10,
        $11, 'payment_pending', 'pending', 'src_desk', 400
       ) RETURNING *`,
      [
        teamName.trim(),
        teamCode,
        psId,
        userId,
        leader.name.trim(),
        leaderEmail,
        leader.phone.trim(),
        leader.college ? leader.college.trim() : 'JECRC Foundation',
        leader.branch || '',
        leader.year || '',
        holdToken || null,
      ]
    );

    const team = teamInsertRes.rows[0];

    // 5. Insert team members
    const insertedMembers = [];
    for (const m of members) {
      const mRes = await client.query(
        `INSERT INTO team_members (team_id, name, email, phone, college, branch, year, role)
         VALUES ($1, $2, LOWER($3), $4, $5, $6, $7, 'member')
         RETURNING *`,
        [
          team.id,
          m.name.trim(),
          m.email.trim(),
          m.phone.trim(),
          m.college ? m.college.trim() : (leader.college || 'JECRC Foundation'),
          m.branch || '',
          m.year || '',
        ]
      );
      insertedMembers.push(mRes.rows[0]);
    }

    // 6. Mark hold consumed
    if (holdId) {
      await client.query(`UPDATE registration_holds SET status = 'consumed' WHERE id = $1`, [holdId]);
    }

    // 7. Fetch problem statement metadata for response
    const psRes = await client.query(`SELECT * FROM problem_statements WHERE id = $1`, [psId]);
    const ps = psRes.rows[0];

    const teamWithPs = {
      ...team,
      ps_code: ps.code,
      ps_title: ps.title,
      ps_category: ps.category,
      seats_available: ps.seats_available,
      total_seats: ps.total_seats,
    };

    return {
      isDuplicate: false,
      team: formatTeam(teamWithPs, insertedMembers),
    };
  });
};

export const getTeamByCreator = async (userId) => {
  const teamRes = await pgQuery(
    `SELECT t.*, ps.code AS ps_code, ps.title AS ps_title, ps.category AS ps_category, ps.seats_available, ps.total_seats
     FROM teams t
     LEFT JOIN problem_statements ps ON ps.id = t.problem_statement_id
     WHERE t.created_by = $1 OR t.leader_id = $1
     ORDER BY t.created_at DESC
     LIMIT 1`,
    [userId]
  );
  if (!teamRes.rows[0]) return null;
  const t = teamRes.rows[0];
  const memRes = await pgQuery(`SELECT * FROM team_members WHERE team_id = $1 ORDER BY created_at ASC`, [t.id]);
  return formatTeam(t, memRes.rows);
};

export const getTeamsByCreator = async (userId) => {
  const teamsRes = await pgQuery(
    `SELECT t.*, ps.code AS ps_code, ps.title AS ps_title, ps.category AS ps_category, ps.seats_available, ps.total_seats
     FROM teams t
     LEFT JOIN problem_statements ps ON ps.id = t.problem_statement_id
     WHERE t.created_by = $1 OR t.leader_id = $1
     ORDER BY t.created_at DESC`,
    [userId]
  );

  const results = [];
  for (const t of teamsRes.rows) {
    const memRes = await pgQuery(`SELECT * FROM team_members WHERE team_id = $1 ORDER BY created_at ASC`, [t.id]);
    results.push(formatTeam(t, memRes.rows));
  }
  return results;
};

export const updateTeamPaymentProof = async (teamId, userId, { txnId, proofUrl }) => {
  const res = await pgQuery(
    `UPDATE teams
     SET transaction_id = $1,
         payment_screenshot_url = COALESCE($2, payment_screenshot_url),
         payment_method = 'manual',
         payment_status = 'pending'
     WHERE id = $3 AND (created_by = $4 OR leader_id = $4)
     RETURNING *`,
    [txnId, proofUrl, teamId, userId]
  );
  if (!res.rows[0]) return null;
  const t = res.rows[0];
  const psRes = await pgQuery(`SELECT * FROM problem_statements WHERE id = $1`, [t.problem_statement_id]);
  const memRes = await pgQuery(`SELECT * FROM team_members WHERE team_id = $1 ORDER BY created_at ASC`, [t.id]);
  const teamWithPs = { ...t, ...(psRes.rows[0] ? { ps_code: psRes.rows[0].code, ps_title: psRes.rows[0].title } : {}) };
  return formatTeam(teamWithPs, memRes.rows);
};

// ============================================================================
// 6. ADMIN OPERATIONS
// ============================================================================

export const getAllRegistrationsAdmin = async ({ status, psId, search }) => {
  let whereClauses = [];
  let params = [];
  let paramIdx = 1;

  if (status) {
    whereClauses.push(`t.status = $${paramIdx++}`);
    params.push(status);
  }
  if (psId) {
    whereClauses.push(`t.problem_statement_id = $${paramIdx++}`);
    params.push(psId);
  }
  if (search) {
    whereClauses.push(`(
      t.team_name ILIKE $${paramIdx} OR
      t.team_code ILIKE $${paramIdx} OR
      t.registration_number ILIKE $${paramIdx} OR
      t.leader_name ILIKE $${paramIdx} OR
      t.leader_email ILIKE $${paramIdx}
    )`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT t.*, 
           ps.code AS ps_code, ps.title AS ps_title, ps.category AS ps_category, ps.seats_available, ps.total_seats
    FROM teams t
    LEFT JOIN problem_statements ps ON ps.id = t.problem_statement_id
    ${whereSql}
    ORDER BY t.created_at DESC
  `;

  const teamsRes = await pgQuery(sql, params);

  // Fetch all members for these teams
  const teamIds = teamsRes.rows.map((t) => t.id);
  let memberMap = new Map();
  if (teamIds.length > 0) {
    const memRes = await pgQuery(
      `SELECT * FROM team_members WHERE team_id = ANY($1) ORDER BY created_at ASC`,
      [teamIds]
    );
    for (const m of memRes.rows) {
      if (!memberMap.has(m.team_id)) memberMap.set(m.team_id, []);
      memberMap.get(m.team_id).push(m);
    }
  }

  const formattedTeams = teamsRes.rows.map((t) => formatTeam(t, memberMap.get(t.id) || []));

  // Compute overall stats
  const totalProblemsRes = await pgQuery(`SELECT COUNT(*) AS total, SUM(total_seats) AS total_cap FROM problem_statements`);
  const totalProblems = parseInt(totalProblemsRes.rows[0].total, 10);
  const totalCapacity = parseInt(totalProblemsRes.rows[0].total_cap, 10) || totalProblems * 5;

  const activeHoldsRes = await pgQuery(`SELECT COUNT(*) AS total FROM registration_holds WHERE status = 'active' AND expires_at > CURRENT_TIMESTAMP`);
  const activeHolds = parseInt(activeHoldsRes.rows[0].total, 10);

  const pendingTeamsRes = await pgQuery(`SELECT COUNT(*) AS total FROM teams WHERE status = 'payment_pending'`);
  const paymentPending = parseInt(pendingTeamsRes.rows[0].total, 10);

  const confirmedTeamsRes = await pgQuery(`SELECT COUNT(*) AS total FROM teams WHERE status IN ('confirmed', 'finalized')`);
  const confirmed = parseInt(confirmedTeamsRes.rows[0].total, 10);

  const rejectedTeamsRes = await pgQuery(`SELECT COUNT(*) AS total FROM teams WHERE status = 'rejected'`);
  const rejected = parseInt(rejectedTeamsRes.rows[0].total, 10);

  const totalOccupied = activeHolds + paymentPending + confirmed;
  const availableSlots = Math.max(0, totalCapacity - totalOccupied);

  return {
    count: formattedTeams.length,
    stats: {
      totalProblems,
      totalCapacity,
      activeHolds,
      paymentPending,
      confirmed,
      availableSlots,
      rejected,
      totalRegistrations: formattedTeams.length,
    },
    teams: formattedTeams,
  };
};

export const approveTeamAdmin = async (teamId, notes) => {
  return await withTransaction(async (client) => {
    const teamRes = await client.query(`SELECT * FROM teams WHERE id = $1 FOR UPDATE`, [teamId]);
    if (!teamRes.rows[0]) return null;
    const team = teamRes.rows[0];

    // Generate registration number if missing
    let regNumber = team.registration_number;
    if (!regNumber) {
      const countRes = await client.query(`SELECT COUNT(*) AS total FROM teams WHERE registration_number IS NOT NULL`);
      const count = parseInt(countRes.rows[0].total, 10);
      regNumber = `SRC-HACK-2026-${String(count + 1).padStart(4, '0')}`;
    }

    const updateRes = await client.query(
      `UPDATE teams
       SET status = 'confirmed',
           payment_status = 'verified',
           registration_number = $1,
           approved_at = CURRENT_TIMESTAMP,
           admin_notes = COALESCE($2, admin_notes)
       WHERE id = $3
       RETURNING *`,
      [regNumber, notes, teamId]
    );

    const updatedTeam = updateRes.rows[0];
    const psRes = await client.query(`SELECT * FROM problem_statements WHERE id = $1`, [updatedTeam.problem_statement_id]);
    const memRes = await client.query(`SELECT * FROM team_members WHERE team_id = $1 ORDER BY created_at ASC`, [teamId]);

    const ps = psRes.rows[0];
    const teamWithPs = { ...updatedTeam, ps_code: ps.code, ps_title: ps.title, ps_category: ps.category, seats_available: ps.seats_available, total_seats: ps.total_seats };
    return formatTeam(teamWithPs, memRes.rows);
  });
};

export const rejectTeamAdmin = async (teamId, notes) => {
  return await withTransaction(async (client) => {
    const updateRes = await client.query(
      `UPDATE teams
       SET status = 'rejected',
           payment_status = 'rejected',
           rejected_at = CURRENT_TIMESTAMP,
           admin_notes = COALESCE($1, 'Payment rejected at SRC desk. Registration cancelled and slot released.')
       WHERE id = $2
       RETURNING *`,
      [notes, teamId]
    );
    if (!updateRes.rows[0]) return null;
    const updatedTeam = updateRes.rows[0];
    const psRes = await client.query(`SELECT * FROM problem_statements WHERE id = $1`, [updatedTeam.problem_statement_id]);
    const memRes = await client.query(`SELECT * FROM team_members WHERE team_id = $1 ORDER BY created_at ASC`, [teamId]);

    const ps = psRes.rows[0];
    const teamWithPs = { ...updatedTeam, ps_code: ps.code, ps_title: ps.title, ps_category: ps.category, seats_available: ps.seats_available, total_seats: ps.total_seats };
    return formatTeam(teamWithPs, memRes.rows);
  });
};

export const deleteTeamAdmin = async (teamId) => {
  return await withTransaction(async (client) => {
    const teamRes = await client.query(`SELECT * FROM teams WHERE id = $1`, [teamId]);
    if (!teamRes.rows[0]) return null;
    const team = teamRes.rows[0];

    // Delete team (PostgreSQL foreign key cascade deletes team_members)
    await client.query(`DELETE FROM teams WHERE id = $1`, [teamId]);

    // Restore problem statement seat
    const psRes = await client.query(
      `UPDATE problem_statements 
       SET seats_available = LEAST(total_seats, seats_available + 1)
       WHERE id = $1
       RETURNING *`,
      [team.problem_statement_id]
    );

    return {
      deletedTeam: {
        _id: team.id,
        id: team.id,
        teamName: team.team_name,
        teamCode: team.team_code,
      },
      problemStatement: psRes.rows[0] ? formatPS(psRes.rows[0]) : null,
    };
  });
};

export const updateTeamVenueAdmin = async (teamId, { roomNumber, timeSlot }) => {
  return await withTransaction(async (client) => {
    const teamRes = await client.query(`SELECT * FROM teams WHERE id = $1 FOR UPDATE`, [teamId]);
    if (!teamRes.rows[0]) {
      return { status: 404, message: 'Team registration not found.' };
    }
    const team = teamRes.rows[0];

    // Only allow update if team's status is approved ('confirmed', 'finalized', or 'approved')
    const allowedStatuses = ['approved', 'confirmed', 'finalized'];
    if (!allowedStatuses.includes(team.status?.toLowerCase())) {
      return {
        status: 400,
        message: `Venue can only be allocated to approved teams. Current team status is "${team.status.toUpperCase()}".`,
      };
    }

    const updateRes = await client.query(
      `UPDATE teams
       SET venue_room_number = $1,
           venue_time_slot = $2,
           venue_allocated_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [roomNumber ? roomNumber.trim() : null, timeSlot ? timeSlot.trim() : null, teamId]
    );

    const updatedTeam = updateRes.rows[0];
    const psRes = await client.query(`SELECT * FROM problem_statements WHERE id = $1`, [updatedTeam.problem_statement_id]);
    const memRes = await client.query(`SELECT * FROM team_members WHERE team_id = $1 ORDER BY created_at ASC`, [teamId]);

    const ps = psRes.rows[0];
    const teamWithPs = {
      ...updatedTeam,
      ps_code: ps ? ps.code : '',
      ps_title: ps ? ps.title : '',
      ps_category: ps ? ps.category : '',
      seats_available: ps ? ps.seats_available : 5,
      total_seats: ps ? ps.total_seats : 5,
    };

    return {
      status: 200,
      team: formatTeam(teamWithPs, memRes.rows),
    };
  });
};

export const getPSTeamsAdmin = async (psId) => {
  const ps = await getProblemStatementById(psId);
  if (!ps) return null;

  const teamsRes = await pgQuery(
    `SELECT t.*, ps.code AS ps_code, ps.title AS ps_title, ps.category AS ps_category, ps.seats_available, ps.total_seats
     FROM teams t
     LEFT JOIN problem_statements ps ON ps.id = t.problem_statement_id
     WHERE t.problem_statement_id = $1
     ORDER BY t.created_at DESC`,
    [ps.id]
  );

  const results = [];
  for (const t of teamsRes.rows) {
    const memRes = await pgQuery(`SELECT * FROM team_members WHERE team_id = $1 ORDER BY created_at ASC`, [t.id]);
    results.push(formatTeam(t, memRes.rows));
  }

  return {
    problemStatement: ps,
    teams: results,
  };
};

export const getContactQueriesAdmin = async () => {
  const res = await pgQuery(`SELECT * FROM contact_queries ORDER BY created_at DESC`);
  return res.rows.map((q) => ({
    _id: q.id,
    id: q.id,
    name: q.name,
    email: q.email,
    phone: q.phone,
    subject: q.subject,
    message: q.message,
    status: q.status,
    createdAt: q.created_at,
  }));
};

export const createContactQuery = async ({ name, email, subject, message }) => {
  const res = await pgQuery(
    `INSERT INTO contact_queries (name, email, subject, message, status)
     VALUES ($1, LOWER($2), $3, $4, 'open')
     RETURNING *`,
    [name, email, subject || 'General Query', message]
  );
  const q = res.rows[0];
  return {
    _id: q.id,
    id: q.id,
    name: q.name,
    email: q.email,
    subject: q.subject,
    message: q.message,
    status: q.status,
    createdAt: q.created_at,
  };
};

export const resetAllProblemStatements = async () => {
  await pgQuery(`UPDATE problem_statements SET seats_available = total_seats`);
  return await getAllProblemStatements();
};
