import {
  acquireProblemHold,
  findActiveHold,
  getUserActiveHolds as getUserActiveHoldsQuery,
  getAllPSCapacity as getAllPSCapacityQuery,
} from '../db/queries.js';

// 1. Acquire temporary 15-minute slot hold with atomic concurrency in PostgreSQL
export const acquireHold = async (req, res) => {
  try {
    const problemId = req.params.id || req.params.problemId;
    const userId = req.user.id || req.user._id;

    const result = await acquireProblemHold({ problemId, userId });
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Error acquiring registration hold:', error);
    return res.status(500).json({
      success: false,
      code: 'SERVER_ERROR',
      message: error.message || 'Failed to reserve temporary registration slot. Please try again.',
    });
  }
};

// 2. Get current user's active hold for a specific problem statement
export const getActiveHold = async (req, res) => {
  try {
    const problemId = req.params.id || req.params.problemId;
    const userId = req.user.id || req.user._id;

    const activeHold = await findActiveHold(problemId, userId);

    if (!activeHold) {
      return res.status(200).json({
        success: true,
        hasActiveHold: false,
        hold: null,
      });
    }

    const remainingSeconds = Math.max(
      0,
      Math.floor((new Date(activeHold.expires_at).getTime() - Date.now()) / 1000)
    );

    return res.status(200).json({
      success: true,
      hasActiveHold: true,
      hold: {
        holdToken: activeHold.hold_token,
        expiresAt: activeHold.expires_at,
        duration: remainingSeconds,
        problemId: activeHold.problem_statement_id,
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
    const userId = req.user.id || req.user._id;
    const formattedHolds = await getUserActiveHoldsQuery(userId);

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
    const { settings, data } = await getAllPSCapacityQuery();

    return res.status(200).json({
      success: true,
      count: data.length,
      settings,
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
