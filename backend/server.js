import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { connectDB, closeDB } from './src/config/db.js';
import { seedDatabase } from './src/config/seed.js';
import { protect } from './src/middleware/authMiddleware.js';
import { Team } from './src/models/Team.js';

import authRoutes from './src/routes/authRoutes.js';
import psRoutes from './src/routes/psRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration allowing cookies from frontend
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman, or server-to-server)
      if (!origin) return callback(null, true);
      // Allow specified origins, localhost, or any vercel.app deployment
      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback
    },
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Protected route for uploaded manual payment screenshots (Admin or Team Member only)
const uploadsPath = path.resolve('uploads');
app.get('/uploads/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;
    const team = await Team.findOne({
      $or: [
        { 'payment.manualProofUrl': `/uploads/${filename}` },
        { 'payment.manualProofUrl': filename },
      ],
    });

    if (!team) {
      return res.status(404).json({ success: false, message: 'File not found or not associated with any team.' });
    }

    const isLeader = team.leader?.email?.toLowerCase() === req.user.email?.toLowerCase();
    const isMember = team.members?.some((m) => m.email?.toLowerCase() === req.user.email?.toLowerCase());
    const isCreator = team.createdBy?.toString() === req.user._id?.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isLeader && !isMember && !isCreator && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied: You are not authorized to view this payment receipt.' });
    }

    res.sendFile(path.join(uploadsPath, filename));
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to access upload file.' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ps', psRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Techno Spiritual Hackathon (TSH) API',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

import { RegistrationHold } from './src/models/RegistrationHold.js';
import { GlobalSettings } from './src/models/GlobalSettings.js';

// Periodic expired holds cleanup job (runs every 60 seconds)
const startHoldCleanupJob = () => {
  setInterval(async () => {
    try {
      const now = new Date();
      const result = await RegistrationHold.updateMany(
        { status: 'active', expiresAt: { $lte: now } },
        { $set: { status: 'expired' } }
      );
      if (result.modifiedCount > 0) {
        console.log(`🧹 Cleaned up ${result.modifiedCount} expired registration holds.`);
      }
    } catch (err) {
      console.error('Error during hold cleanup job:', err);
    }
  }, 60000);
};

// Initialize database and start server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    await Team.syncIndexes();
    await RegistrationHold.syncIndexes();
    await GlobalSettings.getSettings();
    console.log('🛡️ Database multikey and hold unique indexes synchronized successfully.');

    startHoldCleanupJob();

    const server = app.listen(PORT, () => {
      console.log(`✨ TSH Server running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
    });

    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await closeDB();
        process.exit(0);
      });
      // Force exit after 5s if still hanging
      setTimeout(() => process.exit(1), 5000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
