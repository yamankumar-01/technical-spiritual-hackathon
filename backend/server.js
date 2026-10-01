import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { initializePostgres, pgPool, pgQuery, closeDatabase, getActiveEngine } from './src/config/postgres.js';
import { protect } from './src/middleware/authMiddleware.js';
import { corsOptions } from './src/config/corsConfig.js';
import { securityHeadersMiddleware } from './src/middleware/securityHeadersMiddleware.js';
import { generalLimiter, authLimiter, contactLimiter } from './src/middleware/rateLimitMiddleware.js';

import authRoutes from './src/routes/authRoutes.js';
import psRoutes from './src/routes/psRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Disable Express signature banner
app.disable('x-powered-by');

// Security: Browser headers (CSP, nosniff, frame-ancestors, referrer, permissions)
app.use(securityHeadersMiddleware);

// Security: Exact allowlist CORS (rejects arbitrary origins, credentials restricted to allowlist)
app.use(cors(corsOptions));

// Security: General request rate limiting
app.use(generalLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Protected route for uploaded manual payment screenshots (Admin or Team Member only)
const uploadsPath = path.resolve('uploads');
app.get('/uploads/:filename', protect, async (req, res) => {
  try {
    const rawFilename = req.params.filename;
    const safeFilename = path.basename(rawFilename);
    const filePath = path.resolve(uploadsPath, safeFilename);

    // Prevent path traversal outside uploads directory
    if (!filePath.startsWith(uploadsPath)) {
      return res.status(403).json({ success: false, message: 'Access denied: Invalid file path.' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    const teamRes = await pgQuery(
      `SELECT t.*, tm.email AS member_email
       FROM teams t
       LEFT JOIN team_members tm ON tm.team_id = t.id
       WHERE t.payment_screenshot_url = $1 OR t.payment_screenshot_url = $2`,
      [`/uploads/${safeFilename}`, safeFilename]
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

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to access upload file.' });
  }
});

// API Routes with targeted rate limits
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/ps', psRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbCheck = await pgQuery('SELECT 1');
    const engine = getActiveEngine();
    res.status(200).json({
      status: 'online',
      version: '1.0.2',
      database: engine === 'pglite' ? 'PostgreSQL (Embedded PGlite - Online)' : 'PostgreSQL (Connected)',
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
  if (err && err.message && err.message.startsWith('CORS policy violation')) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  console.error('API Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Connecting and bootstrapping PostgreSQL database...');
    await initializePostgres();

    const server = app.listen(PORT, () => {
      const engine = getActiveEngine();
      console.log(`✨ TSH Server running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}] [DB: ${engine === 'pglite' ? 'Embedded PGlite' : 'PostgreSQL'}]`);
    });

    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        try {
          await closeDatabase();
          console.log('🐘 Database connection closed.');
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

const isTestRunner = process.env.NODE_ENV === 'test' || process.argv.some((arg) => arg.includes('test'));

if (!isTestRunner) {
  startServer();
}

export default app;
