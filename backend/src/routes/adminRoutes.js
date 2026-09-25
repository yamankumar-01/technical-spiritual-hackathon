import express from 'express';
import {
  getAllRegistrations,
  approveRegistration,
  rejectRegistration,
  resetProblemStatements,
  getContactQueries,
  getPSTeams,
  deleteTeamRegistration,
  exportRegistrationsExcel,
  exportRegistrationsCSV,
  updateTeamVenue,
  getOfflineBackupRegistrations,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(requireAdmin);

router.get('/export/:filename', (req, res, next) => {
  const { filename } = req.params;
  if (filename && filename.endsWith('.csv')) {
    return exportRegistrationsCSV(req, res, next);
  }
  return exportRegistrationsExcel(req, res, next);
});
router.get('/export-excel', exportRegistrationsExcel);
router.get('/export-csv', exportRegistrationsCSV);
router.get('/registrations', getAllRegistrations);
router.post('/registrations/:id/approve', approveRegistration);
router.post('/registrations/:id/reject', rejectRegistration);
router.patch('/teams/:id/venue', updateTeamVenue);
router.patch('/registrations/:id/venue', updateTeamVenue);
router.post('/ps/reset', resetProblemStatements);
router.get('/queries', getContactQueries);
router.get('/ps/:id/teams', getPSTeams);
router.delete('/teams/:id', deleteTeamRegistration);
router.get('/offline-backups', getOfflineBackupRegistrations);

export default router;
