import jwt from 'jsonwebtoken';
import { findUserById } from '../db/queries.js';

const DEFAULT_DEV_SECRET = 'tsh_super_secret_jwt_key_2026_zen_cyber';

export const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check httpOnly cookies first (preferred for web clients)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Check Authorization: Bearer <token> header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.slice(7).trim();
    }

    // NOTE: Tokens in URL query parameters are strictly forbidden to prevent
    // credential leakage through browser history, referrers, and server access logs.

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource.',
      });
    }

    const secret = process.env.JWT_SECRET || DEFAULT_DEV_SECRET;
    if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEFAULT_DEV_SECRET)) {
      console.warn('⚠️ SECURITY WARNING: Production server is running with default/fallback JWT secret. Set JWT_SECRET in production environment variables.');
    }

    const decoded = jwt.verify(token, secret);

    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session has expired. Please login again.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token verification failed.',
    });
  }
};
