import express from 'express';
import {
  registerTeam,
  submitManualPayment,
  getMyTeamStatus,
  getMyRegistrations,
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', protect, registerTeam);
router.post('/payment/manual', protect, upload.single('proof'), submitManualPayment);
router.get('/my-status', protect, getMyTeamStatus);
router.get('/my-registrations', protect, getMyRegistrations);

export default router;
