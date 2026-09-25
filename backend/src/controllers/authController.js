import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserById, createUser } from '../db/queries.js';
import { pgQuery } from '../config/postgres.js';

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

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone,
      college,
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

    // Recognize admin by email or admin username aliases
    const isAdminUser = ['tsh@admin', 'admin', 'tshadmin', 'admin@tsh.edu'].includes(cleanInput);
    const cleanEmail = isAdminUser ? 'tsh@admin' : cleanInput;

    let user = await findUserByEmail(cleanEmail);

    // List of accepted default passwords for administrator
    const acceptedAdminPasswords = [
      'srcjecrc@123',
      'Admin@12345',
      'admin123',
      'admin',
      'Admin@123',
      'tsh@admin',
      'tshadmin',
      'tsh@123',
    ];

    const isMatchAdminPass = isAdminUser && (
      acceptedAdminPasswords.includes(password) ||
      acceptedAdminPasswords.includes(cleanPassword) ||
      acceptedAdminPasswords.map((p) => p.toLowerCase()).includes(password.toLowerCase()) ||
      acceptedAdminPasswords.map((p) => p.toLowerCase()).includes(cleanPassword.toLowerCase())
    );

    if (!user) {
      if (isAdminUser) {
        const passToHash = isMatchAdminPass ? password : 'srcjecrc@123';
        const adminHash = await bcrypt.hash(passToHash, 10);
        const resInsert = await pgQuery(`
          INSERT INTO users (name, email, password_hash, role, phone, college)
          VALUES ('TSH Administrator', 'tsh@admin', $1, 'admin', '+91 9876543210', 'TSH Organizing University')
          ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
          RETURNING id, name, email, password_hash, phone, college, role, created_at;
        `, [adminHash]);
        user = { ...resInsert.rows[0], _id: resInsert.rows[0].id };
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }
    }

    let isMatch = false;
    if (user.password_hash) {
      isMatch =
        (await bcrypt.compare(password, user.password_hash)) ||
        (cleanPassword !== password ? await bcrypt.compare(cleanPassword, user.password_hash) : false);
    }

    // Auto-heal admin credentials if matched any accepted admin password
    if (!isMatch && isAdminUser && isMatchAdminPass) {
      const newHash = await bcrypt.hash(password || 'srcjecrc@123', 10);
      await pgQuery('UPDATE users SET password_hash = $1, role = $2 WHERE LOWER(email) = $3', [newHash, 'admin', 'tsh@admin']);
      user.password_hash = newHash;
      user.role = 'admin';
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Ensure role is admin if isAdminUser
    if (isAdminUser && user.role !== 'admin') {
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
      return res.status(404).json({ success: false, message: 'User not found.' });
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
