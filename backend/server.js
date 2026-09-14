import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { initializePostgres, pgPool, pgQuery } from './src/config/postgres.js';
import { cleanupExpiredHolds } from './src/db/queries.js';
import { protect } from './src/middleware/authMiddleware.js';

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
    const teamRes = await pgQuery(
      `SELECT t.*, tm.email AS member_email
       FROM teams t
       LEFT JOIN team_members tm ON tm.team_id = t.id
       WHERE t.payment_screenshot_url = $1 OR t.payment_screenshot_url = $2`,
      [`/uploads/${filename}`, filename]
    );

    if (teamRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'File not found or not associated with any team.' });
    }

    const team = teamRes.rows[0];
    const memberEmails = teamRes.rows.map((r) => r.member_email?.toLowerCase()).filter(Boolean);
    const userEmail = req.user.email?.toLowerCase();
    const userId = req.user.id || req.user._id;

    const isLeader = team.leader_email?.toLowerCase() === userEmail;
    const isMember = memberEmails.includes(userEmail);
    const isCreator = team.created_by === userId || team.leader_id === userId;
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
app.get('/api/health', async (req, res) => {
  try {
    const dbCheck = await pgQuery('SELECT 1');
    res.status(200).json({
      status: 'online',
      version: '1.0.2',
      database: 'PostgreSQL (Connected)',
      timestamp: new Date().toISOString(),
      service: 'Techno Spiritual Hackathon (TSH) API',
    });
  } catch (err) {
    res.status(200).json({
      status: 'degraded',
      database: `PostgreSQL (Error: ${err.message})`,
      timestamp: new Date().toISOString(),
      service: 'Techno Spiritual Hackathon (TSH) API',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Periodic expired holds cleanup job (runs every 60 seconds)
const startHoldCleanupJob = () => {
  setInterval(async () => {
    try {
      const modifiedCount = await cleanupExpiredHolds();
      if (modifiedCount > 0) {
        console.log(`🧹 Cleaned up ${modifiedCount} expired registration holds.`);
      }
    } catch (err) {
      if (err.code !== 'ECONNREFUSED') {
        console.error('Error during hold cleanup job:', err.message);
      }
    }
  }, 60000);
};

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Connecting and bootstrapping PostgreSQL database...');
    await initializePostgres();

    startHoldCleanupJob();

    const server = app.listen(PORT, () => {
      console.log(`✨ TSH Server running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}] [DB: PostgreSQL]`);
    });

    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        try {
          await pgPool.end();
          console.log('🐘 PostgreSQL pool closed.');
        } catch (_) {}
        process.exit(0);
      });
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
