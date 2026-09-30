import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserById, createUser } from '../db/queries.js';
import { pgQuery } from '../config/postgres.js';

// In-memory rate limiting to prevent brute-force attacks on login
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

const checkRateLimit = (key) => {
  const record = loginAttempts.get(key);
  if (!record) return { allowed: true };

  if (Date.now() < record.lockoutUntil) {
    const minutesLeft = Math.ceil((record.lockoutUntil - Date.now()) / 60000);
    return {
      allowed: false,
      message: `Too many failed login attempts. Temporarily locked for security. Please try again in ${minutesLeft} minute(s).`,
    };
  }

  // Lockout expired, reset
  if (record.lockoutUntil && Date.now() >= record.lockoutUntil) {
    loginAttempts.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
};

const recordFailedAttempt = (key) => {
  const record = loginAttempts.get(key) || { attempts: 0, lockoutUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockoutUntil = Date.now() + LOCKOUT_PERIOD_MS;
  }
  loginAttempts.set(key, record);
};

const resetAttempts = (key) => {
  loginAttempts.delete(key);
};

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'tsh_super_secret_jwt_key_2026_zen_cyber';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user.id || user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      message,
      token,
      user: {
        id: user.id || user._id,
        _id: user.id || user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        role: user.role,
      },
    });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, college } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Prevent registering with admin email
    if (cleanEmail === 'tsh@admin' || cleanEmail.startsWith('admin@')) {
      return res.status(403).json({
        success: false,
        message: 'Registration with administrator email addresses is strictly restricted.',
      });
    }

    const existingUser = await findUserByEmail(cleanEmail);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Explicitly enforce role 'user' — users can never elevate to admin via registration
    const user = await createUser({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      phone: phone ? phone.trim() : '',
      college: college ? college.trim() : 'JECRC Foundation',
      role: 'user',
    });

    sendTokenResponse(user, 201, res, 'Account registered successfully!');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const cleanInput = (email || '').trim().toLowerCase();
    const cleanPassword = typeof password === 'string' ? password.trim() : '';

    // Rate-limiting check by client IP and account
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'ip';
    const rateLimitKey = `${clientIp}_${cleanInput}`;
    const rateLimitStatus = checkRateLimit(rateLimitKey);
    if (!rateLimitStatus.allowed) {
      return res.status(429).json({
        success: false,
        message: rateLimitStatus.message,
      });
    }

    // Only official administrator email tsh@admin has admin privileges
    const isAdminLogin = cleanInput === 'tsh@admin';
    const searchEmail = cleanInput;

    let user = await findUserByEmail(searchEmail);

    if (!user) {
      // If administrator record does not exist yet in database, seed it securely
      if (isAdminLogin) {
        const designatedAdminPass = process.env.ADMIN_PASSWORD || 'srcjecrc@123';
        if (password !== designatedAdminPass && cleanPassword !== designatedAdminPass) {
          recordFailedAttempt(rateLimitKey);
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.',
          });
        }

        const adminHash = await bcrypt.hash(designatedAdminPass, 10);
        const resInsert = await pgQuery(`
          INSERT INTO users (name, email, password_hash, role, phone, college)
          VALUES ('TSH Administrator', 'tsh@admin', $1, 'admin', '+91 9876543210', 'TSH Organizing University')
          ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
          RETURNING id, name, email, password_hash, phone, college, role, created_at;
        `, [adminHash]);
        user = { ...resInsert.rows[0], _id: resInsert.rows[0].id };
      } else {
        recordFailedAttempt(rateLimitKey);
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }
    }

    // Cryptographically secure password verification using bcrypt
    let isMatch = false;
    if (user.password_hash) {
      isMatch =
        (await bcrypt.compare(password, user.password_hash)) ||
        (cleanPassword !== password ? await bcrypt.compare(cleanPassword, user.password_hash) : false);
    }

    // Fallback sync for admin account with environment password
    if (!isMatch && isAdminLogin) {
      const designatedAdminPass = process.env.ADMIN_PASSWORD || 'srcjecrc@123';
      if (password === designatedAdminPass || cleanPassword === designatedAdminPass) {
        const newHash = await bcrypt.hash(designatedAdminPass, 10);
        await pgQuery('UPDATE users SET password_hash = $1, role = $2 WHERE LOWER(email) = $3', [newHash, 'admin', 'tsh@admin']);
        user.password_hash = newHash;
        user.role = 'admin';
        isMatch = true;
      }
    }

    if (!isMatch) {
      recordFailedAttempt(rateLimitKey);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Reset rate-limiting attempts on successful login
    resetAttempts(rateLimitKey);

    // Ensure role is admin if official administrator account
    if (isAdminLogin && user.role !== 'admin') {
      await pgQuery('UPDATE users SET role = $1 WHERE id = $2', ['admin', user.id || user._id]);
      user.role = 'admin';
    }

    sendTokenResponse(user, 200, res, 'Logged in successfully!');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User session has expired. Please login again.' });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user session.',
    });
  }
};
