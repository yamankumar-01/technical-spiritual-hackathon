import { ProblemStatement } from '../models/ProblemStatement.js';
import { Team } from '../models/Team.js';
import { RegistrationHold } from '../models/RegistrationHold.js';
import { ContactQuery } from '../models/ContactQuery.js';
import { seedDatabase } from '../config/seed.js';
import crypto from 'crypto';
import * as XLSX from 'xlsx';

// Get all registrations with filtering and comprehensive capacity statistics
export const getAllRegistrations = async (req, res) => {
  try {
    const { status, psId, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (psId) {
      query.problemStatement = psId;
    }
    if (search) {
      query.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { teamCode: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
        { 'leader.name': { $regex: search, $options: 'i' } },
        { 'leader.email': { $regex: search, $options: 'i' } },
      ];
    }

    const teams = await Team.find(query)
      .populate('problemStatement', 'title code category seatsAvailable totalSeats')
      .populate('createdBy', 'name email phone college')
      .sort({ createdAt: -1 });

    const now = new Date();
    const totalProblems = await ProblemStatement.countDocuments();
    const problems = await ProblemStatement.find().select('totalSeats');
    const totalCapacity = problems.reduce((acc, p) => acc + (p.totalSeats || 5), 0);

    const activeHolds = await RegistrationHold.countDocuments({
      status: 'active',
      expiresAt: { $gt: now },
    });
    const paymentPending = await Team.countDocuments({ status: 'payment_pending' });
    const confirmed = await Team.countDocuments({ status: { $in: ['confirmed', 'finalized'] } });
    const rejected = await Team.countDocuments({ status: 'rejected' });
    const totalOccupied = activeHolds + paymentPending + confirmed;
    const availableSlots = Math.max(0, totalCapacity - totalOccupied);

    res.status(200).json({
      success: true,
      count: teams.length,
      stats: {
        totalProblems,
        totalCapacity,
        activeHolds,
        paymentPending,
        confirmed,
        availableSlots,
        rejected,
        totalRegistrations: teams.length,
      },
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team registrations.',
    });
  }
};

// Approve registration (Generates official unique registration number SRC-HACK-2026-XXXX)
export const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team registration not found.' });
    }

    // Generate unique registration number: SRC-HACK-2026-XXXX (database-unique)
    if (!team.registrationNumber) {
      let regNumber = null;
      let attempts = 0;
      const count = await Team.countDocuments({ registrationNumber: { $ne: null } });

      while (!regNumber && attempts < 20) {
        const candidateSeq = String(count + 1 + attempts).padStart(4, '0');
        const candidate = `SRC-HACK-2026-${candidateSeq}`;
        const existingWithNumber = await Team.findOne({ registrationNumber: candidate });
        if (!existingWithNumber) {
          regNumber = candidate;
        } else {
          attempts++;
        }
      }

      if (!regNumber) {
        regNumber = `SRC-HACK-2026-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      }
      team.registrationNumber = regNumber;
    }

    team.status = 'confirmed';
    team.payment_status = 'verified';
    team.approved_at = new Date();
    if (notes) team.adminNotes = notes;
    await team.save();

    await team.populate('problemStatement', 'title code category seatsAvailable totalSeats');
    await team.populate('createdBy', 'name email phone college');

    res.status(200).json({
      success: true,
      message: `Registration approved! Team assigned official Registration Number: ${team.registrationNumber}.`,
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve registration.',
    });
  }
};

// Reject registration and release occupied slot
export const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team registration not found.' });
    }

    team.status = 'rejected';
    team.payment_status = 'rejected';
    team.rejected_at = new Date();
    team.adminNotes = notes || 'Payment rejected at SRC desk. Registration cancelled and slot released.';
    await team.save();

    await team.populate('problemStatement', 'title code category seatsAvailable totalSeats');

    res.status(200).json({
      success: true,
      message: `Registration rejected. The reserved slot has been released back to Available capacity.`,
      team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject registration.',
    });
  }
};

// Reset / Seed Problem Statements
export const resetProblemStatements = async (req, res) => {
  try {
    await seedDatabase(true);
    const problemStatements = await ProblemStatement.find().sort({ code: 1 });
    res.status(200).json({
      success: true,
      count: problemStatements.length,
      message: `All ${problemStatements.length} problem statements have been refreshed and seeded with 5 seats each.`,
      data: problemStatements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset problem statements.',
    });
  }
};

// Get Contact Queries
export const getContactQueries = async (req, res) => {
  try {
    const queries = await ContactQuery.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: queries.length,
      data: queries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact queries.',
    });
  }
};

// Get all teams registered under a specific problem statement
export const getPSTeams = async (req, res) => {
  try {
    const { id } = req.params;
    const ps = await ProblemStatement.findById(id);
    if (!ps) {
      return res.status(404).json({ success: false, message: 'Problem statement not found.' });
    }

    const teams = await Team.find({ problemStatement: id })
      .populate('createdBy', 'name email phone college')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      problemStatement: ps,
      data: teams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch teams for this problem statement.',
    });
  }
};

// Delete team registration by admin and increase PS seat count by 1
export const deleteTeamRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team registration not found.' });
    }

    const psId = team.problemStatement;
    let updatedPS = null;

    // Restore 1 seat to problem statement (max 5)
    if (psId) {
      updatedPS = await ProblemStatement.findOneAndUpdate(
        { _id: psId, seatsAvailable: { $lt: 5 } },
        { $inc: { seatsAvailable: 1 } },
        { new: true }
      );
      // Fallback if seatsAvailable was already 5 or null
      if (!updatedPS) {
        updatedPS = await ProblemStatement.findById(psId);
      }
    }

    // Permanently remove the team
    await Team.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Team "${team.teamName}" (${team.teamCode}) was deleted and seat count was increased by 1.`,
      deletedTeam: {
        _id: team._id,
        teamName: team.teamName,
        teamCode: team.teamCode,
      },
      problemStatement: updatedPS,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete team registration.',
    });
  }
};

// Export all registrations to genuine Microsoft Excel (.xlsx) file stream
export const exportRegistrationsExcel = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('problemStatement', 'title code category')
      .populate('createdBy', 'name email phone college')
      .sort({ createdAt: -1 });

    const problems = await ProblemStatement.find().sort({ code: 1 });

    const wb = XLSX.utils.book_new();

    // Sheet 1: Teams Master Roster
    const headers = [
      'Registration Number',
      'Team Code',
      'Team Name',
      'Problem Statement Code',
      'Problem Statement Title',
      'Category',
      'Registration Status',
      'Payment Status',
      'Registration Fee (INR)',
      'Leader Name',
      'Leader Email',
      'Leader Phone',
      'Leader College',
      'Leader Branch',
      'Leader Year',
      'Member 1 Name',
      'Member 1 Email',
      'Member 1 Phone',
      'Member 1 Branch',
      'Member 1 Year',
      'Member 2 Name',
      'Member 2 Email',
      'Member 2 Phone',
      'Member 2 Branch',
      'Member 2 Year',
      'Member 3 Name',
      'Member 3 Email',
      'Member 3 Phone',
      'Member 3 Branch',
      'Member 3 Year',
      'Registration Date & Time',
    ];

    const rows = teams.map((t) => {
      const ps = t.problemStatement || {};
      const leader = t.leader || {};
      const m1 = (t.members && t.members[0]) || {};
      const m2 = (t.members && t.members[1]) || {};
      const m3 = (t.members && t.members[2]) || {};

      let paymentDesc = 'Pending Collection at SRC Desk';
      if (['finalized', 'confirmed'].includes(t.status)) {
        paymentDesc = 'Paid & Verified at SRC Desk';
      } else if (t.status === 'rejected') {
        paymentDesc = 'Registration Rejected (Slot Released)';
      }

      return [
        t.registrationNumber || 'PENDING APPROVAL',
        t.teamCode || 'N/A',
        t.teamName || 'N/A',
        ps.code || 'N/A',
        ps.title || 'N/A',
        ps.category || 'N/A',
        (t.status || 'pending').toUpperCase(),
        paymentDesc,
        t.payment?.amount || 400,
        leader.name || 'N/A',
        leader.email || 'N/A',
        leader.phone || 'N/A',
        leader.college || 'JECRC Foundation',
        leader.branch || 'N/A',
        leader.year || 'N/A',
        m1.name || '',
        m1.email || '',
        m1.phone || '',
        m1.branch || '',
        m1.year || '',
        m2.name || '',
        m2.email || '',
        m2.phone || '',
        m2.branch || '',
        m2.year || '',
        m3.name || '',
        m3.email || '',
        m3.phone || '',
        m3.branch || '',
        m3.year || '',
        t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN') : 'N/A',
      ];
    });

    const wsMaster = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    wsMaster['!cols'] = [
      { wch: 24 }, { wch: 15 }, { wch: 28 }, { wch: 15 }, { wch: 42 },
      { wch: 30 }, { wch: 20 }, { wch: 32 }, { wch: 15 }, { wch: 22 },
      { wch: 28 }, { wch: 16 }, { wch: 26 }, { wch: 16 }, { wch: 14 },
      { wch: 20 }, { wch: 26 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
      { wch: 20 }, { wch: 26 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
      { wch: 20 }, { wch: 26 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
      { wch: 24 },
    ];
    XLSX.utils.book_append_sheet(wb, wsMaster, 'Teams Master Roster');

    // Sheet 2: Problem Statement Capacity Matrix
    const capHeaders = [
      'PS Code', 'Problem Statement Title', 'Category Track',
      'Total Capacity', 'Seats Available', 'Seats Occupied', 'Status'
    ];
    const capRows = problems.map((p) => {
      const avail = p.seatsAvailable !== undefined ? p.seatsAvailable : 5;
      const total = p.totalSeats || 5;
      const occ = total - avail;
      return [
        p.code,
        p.title,
        p.category,
        total,
        avail,
        occ,
        avail > 0 ? 'AVAILABLE' : 'TEMPORARILY UNAVAILABLE'
      ];
    });
    const wsCap = XLSX.utils.aoa_to_sheet([capHeaders, ...capRows]);
    wsCap['!cols'] = [
      { wch: 14 }, { wch: 45 }, { wch: 30 }, { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 24 }
    ];
    XLSX.utils.book_append_sheet(wb, wsCap, 'Track Capacity Matrix');

    // Sheet 3: Executive Summary
    const summaryData = [
      ['Metric / KPI', 'Value', 'Description'],
      ['Total Problem Statements', problems.length, 'Active problem statement tracks in TSH 2026'],
      ['Total Registrations', teams.length, 'Total registered teams in system'],
      ['Export Date & Time', new Date().toLocaleString('en-IN'), 'Official TSH Administrator Export'],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = req.params?.filename || `TSH_2026_Teams_Master_${dateStr}.xlsx`;

    res.attachment(fileName);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Length', buffer.length);
    return res.end(buffer);
  } catch (error) {
    console.error('Export Excel error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate Excel export.' });
  }
};

// Export all registrations to CSV (.csv) file stream
export const exportRegistrationsCSV = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('problemStatement', 'title code category')
      .populate('createdBy', 'name email phone college')
      .sort({ createdAt: -1 });

    const headers = [
      'Registration Number',
      'Team Code',
      'Team Name',
      'Problem Statement Code',
      'Problem Statement Title',
      'Category',
      'Registration Status',
      'Payment Status',
      'Registration Fee (INR)',
      'Leader Name',
      'Leader Email',
      'Leader Phone',
      'Leader College',
      'Leader Branch',
      'Leader Year',
      'Member 1 Name',
      'Member 1 Email',
      'Member 1 Phone',
      'Member 1 Branch',
      'Member 1 Year',
      'Member 2 Name',
      'Member 2 Email',
      'Member 2 Phone',
      'Member 2 Branch',
      'Member 2 Year',
      'Member 3 Name',
      'Member 3 Email',
      'Member 3 Phone',
      'Member 3 Branch',
      'Member 3 Year',
      'Registration Date & Time',
    ];

    const rows = teams.map((t) => {
      const ps = t.problemStatement || {};
      const leader = t.leader || {};
      const m1 = (t.members && t.members[0]) || {};
      const m2 = (t.members && t.members[1]) || {};
      const m3 = (t.members && t.members[2]) || {};

      let paymentDesc = 'Pending Collection at SRC Desk';
      if (['finalized', 'confirmed'].includes(t.status)) {
        paymentDesc = 'Paid & Verified at SRC Desk';
      } else if (t.status === 'rejected') {
        paymentDesc = 'Registration Rejected (Slot Released)';
      }

      return [
        t.registrationNumber || 'PENDING APPROVAL',
        t.teamCode || 'N/A',
        t.teamName || 'N/A',
        ps.code || 'N/A',
        ps.title || 'N/A',
        ps.category || 'N/A',
        (t.status || 'pending').toUpperCase(),
        paymentDesc,
        t.payment?.amount || 400,
        leader.name || 'N/A',
        leader.email || 'N/A',
        leader.phone || 'N/A',
        leader.college || 'JECRC Foundation',
        leader.branch || 'N/A',
        leader.year || 'N/A',
        m1.name || '',
        m1.email || '',
        m1.phone || '',
        m1.branch || '',
        m1.year || '',
        m2.name || '',
        m2.email || '',
        m2.phone || '',
        m2.branch || '',
        m2.year || '',
        m3.name || '',
        m3.email || '',
        m3.phone || '',
        m3.branch || '',
        m3.year || '',
        t.createdAt ? new Date(t.createdAt).toLocaleString('en-IN') : 'N/A',
      ];
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const csvStr = XLSX.utils.sheet_to_csv(ws);
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = req.params?.filename || `TSH_2026_Teams_Master_${dateStr}.csv`;

    res.attachment(fileName);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    return res.end('\ufeff' + csvStr);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate CSV export.' });
  }
};
