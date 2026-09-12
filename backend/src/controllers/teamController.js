import { ProblemStatement } from '../models/ProblemStatement.js';
import { Team } from '../models/Team.js';
import { RegistrationHold } from '../models/RegistrationHold.js';
import { problemMutex } from '../utils/holdMutex.js';

// 1. Register team (Leader + 3 Members + PS selection + Hold Token)
export const registerTeam = async (req, res) => {
  try {
    const { teamName, leader, members, holdToken } = req.body;
    const psId = req.body.psId || req.body.problemStatementId;

    if (!teamName || !psId || !leader || !members) {
      return res.status(400).json({
        success: false,
        message: 'Team name, problem statement, leader, and 3 member details are required.',
      });
    }

    // Verify holdToken if provided or enforce hold requirement
    let hold = null;
    if (holdToken) {
      hold = await RegistrationHold.findOne({
        holdToken,
        userId: req.user._id,
        problemId: psId,
      });

      if (!hold) {
        return res.status(400).json({
          success: false,
          code: 'HOLD_EXPIRED',
          message: 'This registration session is no longer valid. Please select the problem again.',
        });
      }

      // Idempotency check: if already consumed, check if team exists and return it without duplicate creation
      if (hold.status === 'consumed') {
        const existingSubmittedTeam = await Team.findOne({ holdToken });
        if (existingSubmittedTeam) {
          await existingSubmittedTeam.populate('problemStatement', 'title code category seatsAvailable totalSeats');
          return res.status(200).json({
            success: true,
            isDuplicateSubmission: true,
            isExisting: true,
            message: 'Registration already submitted successfully.',
            team: existingSubmittedTeam,
            data: existingSubmittedTeam,
          });
        }
      }

      const now = new Date();
      if (hold.status !== 'active' || now >= new Date(hold.expiresAt)) {
        hold.status = 'expired';
        await hold.save();
        return res.status(400).json({
          success: false,
          code: 'HOLD_EXPIRED',
          message: 'Your 15-minute registration window has expired. Please select the problem again and start a new registration.',
        });
      }
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

    // A. Check for internal duplicate emails within the submitted roster
    const uniqueEmailSet = new Set(allSubmittedEmails);
    if (uniqueEmailSet.size !== allSubmittedEmails.length) {
      return res.status(400).json({
        success: false,
        message: 'All 4 team members must have unique email addresses. Duplicate emails found in your roster.',
      });
    }

    // Check if user already registered a finalized/pending team for this problem
    const existingTeam = await Team.findOne({
      createdBy: req.user._id,
      problemStatement: psId,
      status: { $in: ['payment_pending', 'confirmed', 'finalized'] },
    });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        code: 'ALREADY_REGISTERED',
        message: `You have already registered team "${existingTeam.teamName}" for this problem statement (Status: ${existingTeam.status.toUpperCase()}).`,
        team: existingTeam,
      });
    }

    // B. Check across entire database: An email can only belong to ONE Problem Statement / team
    const conflictingTeam = await Team.findOne({
      status: { $in: ['payment_pending', 'confirmed', 'registered', 'finalized'] },
      $or: [
        { 'leader.email': { $in: allSubmittedEmails } },
        { 'members.email': { $in: allSubmittedEmails } },
      ],
    }).populate('problemStatement', 'title code');

    if (conflictingTeam) {
      const clashingEmail = allSubmittedEmails.find((email) => {
        if (conflictingTeam.leader?.email?.toLowerCase() === email) return true;
        return conflictingTeam.members?.some((m) => m.email?.toLowerCase() === email);
      });

      const psDetails = conflictingTeam.problemStatement
        ? `${conflictingTeam.problemStatement.code} (${conflictingTeam.problemStatement.title})`
        : 'another problem statement';

      return res.status(400).json({
        success: false,
        message: `The email "${clashingEmail}" is already registered with team "${conflictingTeam.teamName}" for Problem Statement ${psDetails}. An email can only be assigned to one Problem Statement.`,
      });
    }

    // Verify problem statement exists
    const ps = await ProblemStatement.findById(psId);
    if (!ps) {
      return res.status(404).json({
        success: false,
        message: 'Selected problem statement does not exist.',
      });
    }

    // Atomically create team and consume hold
    const team = await Team.create({
      teamName: teamName.trim(),
      createdBy: req.user._id,
      problemStatement: psId,
      leader: {
        ...leader,
        email: leaderEmail,
      },
      members: members.map((m) => ({
        ...m,
        email: m.email.trim().toLowerCase(),
      })),
      participantEmails: allSubmittedEmails,
      holdToken: hold?.holdToken || null,
      status: 'payment_pending',
      payment_status: 'pending',
      payment: {
        method: 'src_desk',
        amount: 400,
        manualTxnId: 'OFFLINE_SRC_DESK',
        manualProofUrl: null,
      },
    });

    if (hold) {
      hold.status = 'consumed';
      await hold.save();
    }

    await team.populate('problemStatement', 'title code category seatsAvailable totalSeats');

    res.status(201).json({
      success: true,
      status: 'PAYMENT PENDING',
      message:
        'Registration submitted successfully. Your registration slot has been reserved. Payment instructions and payment timings will be shared in the official WhatsApp group. Payment Mode: Offline. Payment Location: SRC Club.',
      team,
      data: team,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'One or more of these emails is already registered with another team. An email can only be assigned to one Problem Statement.',
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

    if (!txnId || !txnId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Transaction Reference ID (UTR / Txn ID) is required.',
      });
    }

    const team = await Team.findOne({ _id: teamId, createdBy: req.user._id });
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team registration not found.' });
    }

    let proofUrl = null;
    if (req.file) {
      proofUrl = `/uploads/${req.file.filename}`;
    }

    team.payment = {
      method: 'manual',
      amount: 400,
      manualTxnId: txnId.trim(),
      manualProofUrl: proofUrl || team.payment?.manualProofUrl || null,
      paidAt: new Date(),
    };
    team.status = 'payment_pending';
    await team.save();

    await team.populate('problemStatement', 'title code category seatsAvailable totalSeats');

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
    const team = await Team.findOne({ createdBy: req.user._id }).populate(
      'problemStatement',
      'title code category seatsAvailable totalSeats'
    );

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
    const teams = await Team.find({ createdBy: req.user._id })
      .populate('problemStatement', 'title code category totalSeats seatsAvailable')
      .sort({ createdAt: -1 });

    const now = new Date();
    const activeHolds = await RegistrationHold.find({
      userId: req.user._id,
      status: 'active',
      expiresAt: { $gt: now },
    }).populate('problemId', 'title code category totalSeats seatsAvailable');

    res.status(200).json({
      success: true,
      teams,
      activeHolds: activeHolds.map((h) => ({
        holdToken: h.holdToken,
        problem: h.problemId,
        expiresAt: h.expiresAt,
        remainingSeconds: Math.max(
          0,
          Math.floor((new Date(h.expiresAt).getTime() - now.getTime()) / 1000)
        ),
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user registrations.',
    });
  }
};

