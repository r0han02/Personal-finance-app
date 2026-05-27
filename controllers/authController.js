const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const SALT_ROUNDS = 12;

/**
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        data: null,
        message: 'Email is already registered.',
      });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = db.prepare(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
    ).run(name, email, password_hash);

    const token = jwt.sign(
      { id: result.lastInsertRowid, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      data: { token, user: { id: result.lastInsertRowid, name, email } },
      message: 'Registration successful.',
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password.',
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: { token, user: { id: user.id, name: user.name, email: user.email } },
      message: 'Login successful.',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      data: null,
      message: 'Internal server error.',
    });
  }
};
