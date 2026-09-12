import { ProblemStatement } from '../models/ProblemStatement.js';

export const getAllPS = async (req, res) => {
  try {
    const problemStatements = await ProblemStatement.find().sort({ code: 1 });
    res.status(200).json({
      success: true,
      count: problemStatements.length,
      data: problemStatements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve problem statements.',
    });
  }
};

export const getPSById = async (req, res) => {
  try {
    const ps = await ProblemStatement.findById(req.params.id);
    if (!ps) {
      return res.status(404).json({
        success: false,
        message: 'Problem statement not found.',
      });
    }
    res.status(200).json({
      success: true,
      data: ps,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve problem statement details.',
    });
  }
};
