import crypto from 'crypto';
import { ProblemStatement } from '../models/ProblemStatement.js';
import { Team } from '../models/Team.js';
import { RegistrationHold } from '../models/RegistrationHold.js';
import { GlobalSettings } from '../models/GlobalSettings.js';
import { problemMutex } from '../utils/holdMutex.js';

// Calculate live occupied count and breakdown for a problem statement
export const calculateProblemCapacity = async (problemId, totalSeats = 5) => {
  const now = new Date();

  // Active holds where expiration is in the future
  const activeHolds = await RegistrationHold.countDocuments({
    problemId,
    status: 'active',
    expiresAt: { $gt: now },
  });

  // Submitted teams waiting for SRC offline payment
  const paymentPending = await Team.countDocuments({
    problemStatement: problemId,
    status: 'payment_pending',
  });

  // Confirmed registrations approved by admin
  const confirmed = await Team.countDocuments({
    problemStatement: problemId,
    status: { $in: ['confirmed', 'finalized'] },
  });

  const occupied = activeHolds + paymentPending + confirmed;
  const available = Math.max(0, totalSeats - occupied);

  return {
    capacity: totalSeats,
    activeHolds,
    paymentPending,
    confirmed,
    occupied,
    available,
  };
};

// 1. Acquire temporary 15-minute slot hold with atomic concurrency mutex
export const acquireHold = async (req, res) => {
  try {
    const problemId = req.params.id || req.params.problemId;
    const userId = req.user._id;

    const problem = await ProblemStatement.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        code: 'PROBLEM_NOT_FOUND',
        message: 'Selected problem statement does not exist.',
      });
    }

    const settings = await GlobalSettings.getSettings();
    const now = new Date();

    if (!settings.registrationEnabled) {
      return res.status(400).json({
        success: false,
        code: 'REGISTRATION_DISABLED',
        message: 'Registration for this hackathon is currently disabled.',
      });
    }

    if (now < new Date(settings.registrationStartDate)) {
      return res.status(400).json({
        success: false,
        code: 'REGISTRATION_NOT_STARTED',
        message: 'Registration has not started yet.',
      });
    }

    if (now > new Date(settings.registrationEndDate)) {
      return res.status(400).json({
        success: false,
        code: 'REGISTRATION_CLOSED',
        message: 'Registration for this hackathon is currently closed.',
      });
    }

    if (problem.registration_enabled === false) {
      return res.status(400).json({
        success: false,
        code: 'PROBLEM_REGISTRATION_DISABLED',
        message: 'Registration for this specific problem statement is disabled.',
      });
    }

    // Check whether user/team already has an active or submitted registration for this problem
    const existingRegistration = await Team.findOne({
      createdBy: userId,
      problemStatement: problemId,
      status: { $in: ['payment_pending', 'confirmed', 'finalized'] },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        code: 'ALREADY_REGISTERED',
        message: `You have already submitted a registration for this problem statement (Status: ${existingRegistration.status.toUpperCase()}).`,
      });
    }

    // Execute atomic capacity check and hold creation inside per-problem mutex
    const result = await problemMutex.runExclusive(problemId, async () => {
      const currentTime = new Date();

      // Check if user already has an active, unexpired hold for this problem
      const existingHold = await RegistrationHold.findOne({
        problemId,
        userId,
        status: 'active',
        expiresAt: { $gt: currentTime },
      });

      if (existingHold) {
        const remainingSeconds = Math.max(
          0,
          Math.floor((new Date(existingHold.expiresAt).getTime() - currentTime.getTime()) / 1000)
        );
        return {
          status: 200,
          body: {
            success: true,
            isExisting: true,
            holdToken: existingHold.holdToken,
            expiresAt: existingHold.expiresAt,
            duration: remainingSeconds,
            problemId,
          },
        };
      }

      // Mark any stale expired holds for this problem as 'expired'
      await RegistrationHold.updateMany(
        {
          problemId,
          status: 'active',
          expiresAt: { $lte: currentTime },
        },
        { $set: { status: 'expired' } }
      );

      // Re-calculate live occupied capacity
      const capacityStats = await calculateProblemCapacity(problemId, problem.totalSeats || 5);

      if (capacityStats.available <= 0) {
        return {
          status: 409,
          body: {
            success: false,
            code: 'TEMPORARILY_UNAVAILABLE',
            message:
              'Temporarily unavailable. All available slots are currently occupied. Another participant may currently be filling the last available slot. Please try again after a few minutes.',
            capacity: capacityStats.capacity,
            occupied: capacityStats.occupied,
            available: 0,
          },
        };
      }

      // Atomically create 15-minute hold
      const duration = settings.holdDurationSeconds || 900;
      const expiresAt = new Date(currentTime.getTime() + duration * 1000);
      const holdToken = crypto.randomUUID();

      const newHold = await RegistrationHold.create({
        problemId,
        userId,
        holdToken,
        expiresAt,
        duration,
        status: 'active',
      });

      return {
        status: 201,
        body: {
          success: true,
          isExisting: false,
          holdToken: newHold.holdToken,
          expiresAt: newHold.expiresAt,
          duration,
          problemId,
        },
      };
    });

    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Error acquiring registration hold:', error);
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: 'Failed to reserve temporary registration slot. Please try again.',
    });
  }
};

// 2. Get current user's active hold for a specific problem statement
export const getActiveHold = async (req, res) => {
  try {
    const problemId = req.params.id || req.params.problemId;
    const userId = req.user._id;
    const now = new Date();

    const activeHold = await RegistrationHold.findOne({
      problemId,
      userId,
      status: 'active',
      expiresAt: { $gt: now },
    });

    if (!activeHold) {
      return res.status(200).json({
        success: true,
        hasActiveHold: false,
        hold: null,
      });
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor((new Date(activeHold.expiresAt).getTime() - now.getTime()) / 1000)
    );

    return res.status(200).json({
      success: true,
      hasActiveHold: true,
      hold: {
        holdToken: activeHold.holdToken,
        expiresAt: activeHold.expiresAt,
        duration: remainingSeconds,
        problemId: activeHold.problemId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active registration hold.',
    });
  }
};

// 3. Get all active holds for the logged-in user across all problems
export const getUserActiveHolds = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const holds = await RegistrationHold.find({
      userId,
      status: 'active',
      expiresAt: { $gt: now },
    }).populate('problemId', 'title code category');

    const formattedHolds = holds.map((h) => ({
      holdToken: h.holdToken,
      problem: h.problemId,
      expiresAt: h.expiresAt,
      remainingSeconds: Math.max(0, Math.floor((new Date(h.expiresAt).getTime() - now.getTime()) / 1000)),
    }));

    return res.status(200).json({
      success: true,
      count: formattedHolds.length,
      holds: formattedHolds,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user active holds.',
    });
  }
};

// 4. Get live real-time capacity and occupancy breakdown for all problem statements
export const getAllPSCapacity = async (req, res) => {
  try {
    const problems = await ProblemStatement.find().sort({ code: 1 });
    const now = new Date();
    const settings = await GlobalSettings.getSettings();

    // Batch query counts for efficiency
    const activeHolds = await RegistrationHold.aggregate([
      { $match: { status: 'active', expiresAt: { $gt: now } } },
      { $group: { _id: '$problemId', count: { $sum: 1 } } },
    ]);

    const pendingTeams = await Team.aggregate([
      { $match: { status: 'payment_pending' } },
      { $group: { _id: '$problemStatement', count: { $sum: 1 } } },
    ]);

    const confirmedTeams = await Team.aggregate([
      { $match: { status: { $in: ['confirmed', 'finalized'] } } },
      { $group: { _id: '$problemStatement', count: { $sum: 1 } } },
    ]);

    const holdMap = new Map(activeHolds.map((h) => [String(h._id), h.count]));
    const pendingMap = new Map(pendingTeams.map((p) => [String(p._id), p.count]));
    const confirmedMap = new Map(confirmedTeams.map((c) => [String(c._id), c.count]));

    const data = problems.map((ps) => {
      const psId = String(ps._id);
      const capacity = ps.totalSeats || 5;
      const holds = holdMap.get(psId) || 0;
      const pending = pendingMap.get(psId) || 0;
      const conf = confirmedMap.get(psId) || 0;
      const occupied = holds + pending + conf;
      const available = Math.max(0, capacity - occupied);

      let registrationState = 'AVAILABLE';
      if (!settings.registrationEnabled) registrationState = 'DISABLED';
      else if (now < new Date(settings.registrationStartDate)) registrationState = 'NOT_STARTED';
      else if (now > new Date(settings.registrationEndDate)) registrationState = 'CLOSED';
      else if (ps.registration_enabled === false) registrationState = 'DISABLED';
      else if (available <= 0) registrationState = 'TEMPORARILY_UNAVAILABLE';

      return {
        _id: ps._id,
        code: ps.code,
        title: ps.title,
        category: ps.category,
        background: ps.background || '',
        challenge: ps.challenge || '',
        keyRequirements: ps.keyRequirements || [],
        totalSeats: capacity,
        seatsAvailable: available,
        capacity,
        activeHolds: holds,
        paymentPending: pending,
        confirmed: conf,
        occupied,
        available,
        registrationState,
        registration_enabled: ps.registration_enabled,
      };
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      settings: {
        registrationEnabled: settings.registrationEnabled,
        registrationStartDate: settings.registrationStartDate,
        registrationEndDate: settings.registrationEndDate,
      },
      data,
    });
  } catch (error) {
    console.error('Error fetching PS capacity breakdown:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate problem statements capacity.',
    });
  }
};
