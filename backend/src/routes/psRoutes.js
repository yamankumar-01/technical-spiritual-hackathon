import express from 'express';
import { getAllPS, getPSById } from '../controllers/psController.js';
import {
  acquireHold,
  getActiveHold,
  getUserActiveHolds,
  getAllPSCapacity,
} from '../controllers/holdController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPS);
router.get('/capacity/all', getAllPSCapacity);
router.get('/user/holds', protect, getUserActiveHolds);
router.get('/:id', getPSById);
router.post('/:id/hold', protect, acquireHold);
router.get('/:id/hold', protect, getActiveHold);

export default router;
