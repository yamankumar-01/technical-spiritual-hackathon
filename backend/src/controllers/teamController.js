import fs from 'fs';
import {
  registerNewTeam,
  getTeamByCreator,
  getTeamsByCreator,
  updateTeamPaymentProof,
  getUserActiveHolds as getUserActiveHoldsQuery,
} from '../db/queries.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. Register team (Leader + 3 Members + PS selection + Hold Token)
export const registerTeam = async (req, res) => {
  try {
    const { teamName, leader, members, holdToken } = req.body || {};
    const psId = req.body?.psId || req.body?.problemStatementId;
    const userId = req.user.id || req.user._id;

    if (!teamName || typeof teamName !== 'string' || !teamName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid team name is required.',
      });
    }

    if (!psId || typeof psId !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Problem statement selection is required.',
      });
    }

    if (!leader || typeof leader !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Team leader details are required.',
      });
    }

    if (!Array.isArray(members) || members.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Team size is strictly fixed at 4 members (1 leader + 3 members).',
      });
    }

    // Validate leader fields
    if (!leader.name || typeof leader.name !== 'string' || !leader.name.trim()) {
      return res.status(400).json({ success: false, message: 'Leader name is required.' });
    }
    if (!leader.email || typeof leader.email !== 'string' || !EMAIL_REGEX.test(leader.email.trim())) {
      return res.status(400).json({ success: false, message: 'Valid leader email is required.' });
    }
    if (!leader.phone || typeof leader.phone !== 'string' || !leader.phone.trim()) {
      return res.status(400).json({ success: false, message: 'Leader contact phone number is required.' });
    }

    // Validate member fields
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m || typeof m !== 'object') {
        return res.status(400).json({ success: false, message: `Details for Member ${i + 1} are required.` });
      }
      if (!m.name || typeof m.name !== 'string' || !m.name.trim()) {
        return res.status(400).json({ success: false, message: `Name for Member ${i + 1} is required.` });
      }
      if (!m.email || typeof m.email !== 'string' || !EMAIL_REGEX.test(m.email.trim())) {
        return res.status(400).json({ success: false, message: `Valid email for Member ${i + 1} is required.` });
      }
      if (!m.phone || typeof m.phone !== 'string' || !m.phone.trim()) {
        return res.status(400).json({ success: false, message: `Phone number for Member ${i + 1} is required.` });
      }
    }

    // Sanitize and extract all 4 emails
    const leaderEmail = leader.email.trim().toLowerCase();
    const memberEmails = members.map((m) => m.email.trim().toLowerCase());
    const allSubmittedEmails = [leaderEmail, ...memberEmails];

    // Check for internal duplicate emails within the submitted roster
    const uniqueEmailSet = new Set(allSubmittedEmails);
    if (uniqueEmailSet.size !== allSubmittedEmails.length) {
      return res.status(400).json({
        success: false,
        message: 'All 4 team members must have unique email addresses. Duplicate emails found in your roster.',
      });
    }

    const result = await registerNewTeam({
      teamName: teamName.trim().slice(0, 100),
      psId,
      userId,
      leader: {
        ...leader,
        name: leader.name.trim().slice(0, 100),
        email: leaderEmail.slice(0, 150),
        phone: leader.phone.trim().slice(0, 25),
        college: (leader.college || 'JECRC Foundation').slice(0, 150),
        branch: (leader.branch || '').slice(0, 100),
        year: (leader.year || '').slice(0, 50),
      },
      members: members.map((m) => ({
        ...m,
        name: m.name.trim().slice(0, 100),
        email: m.email.trim().toLowerCase().slice(0, 150),
        phone: m.phone.trim().slice(0, 25),
        college: (m.college || leader.college || 'JECRC Foundation').slice(0, 150),
        branch: (m.branch || '').slice(0, 100),
        year: (m.year || '').slice(0, 50),
      })),
      holdToken,
    });

    if (result.isDuplicate) {
      return res.status(200).json({
        success: true,
        isDuplicateSubmission: true,
        isExisting: true,
        message: 'Registration already submitted successfully.',
        team: result.team,
        data: result.team,
      });
    }

    res.status(201).json({
      success: true,
      status: 'PAYMENT PENDING',
      message:
        'Registration submitted successfully. Your registration slot has been reserved under PAYMENT PENDING.',
      team: result.team,
      data: result.team,
    });
  } catch (error) {
    if (error.code === 'SLOTS_EXHAUSTED' || error.message.includes('All slots are booked')) {
      return res.status(409).json({
        success: false,
        code: 'SLOTS_EXHAUSTED',
        message: 'All slots are booked. Please proceed with the remaining Problem Statements.',
      });
    }
    if (error.code === 'DUPLICATE_EMAIL_VIOLATION' || error.message.includes('already registered')) {
      return res.status(400).json({
        success: false,
        code: 'DUPLICATE_EMAIL_VIOLATION',
        message: error.message,
      });
    }
    if (error.code === 'ALREADY_REGISTERED') {
      return res.status(400).json({
        success: false,
        code: 'ALREADY_REGISTERED',
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering team.',
    });
  }
};

// 2. Submit Manual Payment Proof (UPI / Bank transfer with UTR ID)
export const submitManualPayment = async (req, res) => {
  try {
    const { teamId, txnId } = req.body || {};
    const userId = req.user.id || req.user._id;

    if (!teamId || typeof teamId !== 'string' || !teamId.trim()) {
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        success: false,
        message: 'Valid Team ID is required.',
      });
    }

    if (!txnId || typeof txnId !== 'string' || !txnId.trim()) {
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        success: false,
        message: 'Transaction Reference ID (UTR / Txn ID) is required.',
      });
    }

    let proofUrl = null;
    if (req.file) {
      proofUrl = `/uploads/${req.file.filename}`;
    }

    const team = await updateTeamPaymentProof(teamId.trim(), userId, {
      txnId: txnId.trim().slice(0, 100),
      proofUrl,
    });

    if (!team) {
      // Clean up orphaned upload file if object-level authorization failed or team was not found
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(404).json({ success: false, message: 'Team registration not found or not owned by your account.' });
    }

    res.status(200).json({
      success: true,
      message: 'Payment details submitted successfully! Admin will verify your UTR and finalize your seat.',
      team,
    });
  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit payment proof.',
    });
  }
};

// 3. Get current logged-in user's team status
export const getMyTeamStatus = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const team = await getTeamByCreator(userId);

    if (!team) {
      return res.status(200).json({
        success: true,
        hasTeam: false,
        team: null,
      });
    }

    res.status(200).json({
      success: true,
      hasTeam: true,
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve team status.',
    });
  }
};

// 4. Get all registrations and active holds for the logged-in user
export const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const teams = await getTeamsByCreator(userId);
    const activeHolds = await getUserActiveHoldsQuery(userId);

    res.status(200).json({
      success: true,
      teams,
      activeHolds,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user registrations.',
    });
  }
};
