import {
  registerNewTeam,
  getTeamByCreator,
  getTeamsByCreator,
  updateTeamPaymentProof,
  getUserActiveHolds as getUserActiveHoldsQuery,
} from '../db/queries.js';

// 1. Register team (Leader + 3 Members + PS selection + Hold Token)
export const registerTeam = async (req, res) => {
  try {
    const { teamName, leader, members, holdToken } = req.body;
    const psId = req.body.psId || req.body.problemStatementId;
    const userId = req.user.id || req.user._id;

    if (!teamName || !psId || !leader || !members) {
      return res.status(400).json({
        success: false,
        message: 'Team name, problem statement, leader, and 3 member details are required.',
      });
    }

    if (!Array.isArray(members) || members.length !== 3) {
      return res.status(400).json({
        success: false,
        message: 'Team size is strictly fixed at 4 members (1 leader + 3 members).',
      });
    }

    // Sanitize and extract all 4 emails
    const leaderEmail = leader.email?.trim().toLowerCase();
    const memberEmails = members.map((m) => m.email?.trim().toLowerCase());
    const allSubmittedEmails = [leaderEmail, ...memberEmails];

    // Check if all emails are provided and valid
    if (allSubmittedEmails.some((email) => !email)) {
      return res.status(400).json({
        success: false,
        message: 'Valid email addresses are required for the Team Leader and all 3 members.',
      });
    }

    // Check for internal duplicate emails within the submitted roster
    const uniqueEmailSet = new Set(allSubmittedEmails);
    if (uniqueEmailSet.size !== allSubmittedEmails.length) {
      return res.status(400).json({
        success: false,
        message: 'All 4 team members must have unique email addresses. Duplicate emails found in your roster.',
      });
    }

    const result = await registerNewTeam({
      teamName,
      psId,
      userId,
      leader,
      members,
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
        'Registration submitted successfully. Your registration slot has been reserved. Payment instructions and payment timings will be shared in the official WhatsApp group. Payment Mode: Offline. Payment Location: SRC Club.',
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
    const { teamId, txnId } = req.body;
    const userId = req.user.id || req.user._id;

    if (!txnId || !txnId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Transaction Reference ID (UTR / Txn ID) is required.',
      });
    }

    let proofUrl = null;
    if (req.file) {
      proofUrl = `/uploads/${req.file.filename}`;
    }

    const team = await updateTeamPaymentProof(teamId, userId, {
      txnId: txnId.trim(),
      proofUrl,
    });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team registration not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Payment details submitted successfully! Admin will verify your UTR and finalize your seat.',
      team,
    });
  } catch (error) {
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
