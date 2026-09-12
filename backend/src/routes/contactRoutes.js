import express from 'express';
import { submitContactQuery } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', submitContactQuery);

export default router;
