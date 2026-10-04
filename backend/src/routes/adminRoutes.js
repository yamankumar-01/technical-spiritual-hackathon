import express from 'express';
import {
  getAllRegistrations,
  approveRegistration,
  rejectRegistration,
  resetProblemStatements,
  fixProblemStatementsSeats,
  updateProblemStatementSeats,
  getContactQueries,
  getPSTeams,
  deleteTeamRegistration,
  exportRegistrationsExcel,
  exportRegistrationsCSV,
  updateTeamVenue,
  updateTeamMentor,
  getOfflineBackupRegistrations,
  createExportTicket,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { exportTicketManager } from '../utils/exportTicket.js';
import { findUserById } from '../db/queries.js';

const router = express.Router();

/**
 * Custom authentication for exports:
 * - Requires Authorization: Bearer <admin_token> or admin session cookie
 * - OR a short-lived, single-use ticket in ?ticket=... (consumed immediately upon use)
 * - Raw bearer tokens in query parameters are strictly forbidden.
 */
const exportAuth = async (req, res, next) => {
  // 1. Single-use ticket authentication
  if (req.query && req.query.ticket) {
    const adminUserId = exportTicketManager.consumeTicket(req.query.ticket);
    if (!adminUserId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid, already-used, or expired export ticket. Please request a new export link.',
      });
    }

    const adminUser = await findUserById(adminUserId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required.',
      });
    }

    req.user = adminUser;
    return next();
  }

  // 2. Standard Header or Cookie authentication
  return protect(req, res, () => {
    return requireAdmin(req, res, next);
  });
};

// Export routes supporting header authorization or short-lived single-use tickets
router.get('/export/:filename', exportAuth, (req, res, next) => {
  const { filename } = req.params;
  if (filename && filename.endsWith('.csv')) {
    return exportRegistrationsCSV(req, res, next);
  }
  return exportRegistrationsExcel(req, res, next);
});
router.get('/export-excel', exportAuth, exportRegistrationsExcel);
router.get('/export-csv', exportAuth, exportRegistrationsCSV);

// Standard protected admin routes (Authorization header or cookie)
router.use(protect);
router.use(requireAdmin);

router.post('/export-ticket', createExportTicket);
router.get('/registrations', getAllRegistrations);
router.post('/registrations/:id/approve', approveRegistration);
router.post('/registrations/:id/reject', rejectRegistration);
router.patch('/teams/:id/venue', updateTeamVenue);
router.patch('/registrations/:id/venue', updateTeamVenue);
router.patch('/teams/:id/mentor', updateTeamMentor);
router.patch('/registrations/:id/mentor', updateTeamMentor);
router.post('/ps/reset', resetProblemStatements);
router.post('/ps/fix-seats', fixProblemStatementsSeats);
router.patch('/ps/:id/seats', updateProblemStatementSeats);
router.put('/ps/:id/seats', updateProblemStatementSeats);
router.post('/ps/:id/seats', updateProblemStatementSeats);
router.get('/queries', getContactQueries);
router.get('/ps/:id/teams', getPSTeams);
router.delete('/teams/:id', deleteTeamRegistration);
router.get('/offline-backups', getOfflineBackupRegistrations);

export default router;
