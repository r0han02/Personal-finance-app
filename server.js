require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// ── Seed DB on first run ───────────────────────────────────────────────────────
const { seedCategories } = require('./db/seed');
seedCategories();

// ── App setup ──────────────────────────────────────────────────────────────────
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(xss());

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, data: null, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', globalLimiter);

// Auth Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { success: false, data: null, message: 'Too many login attempts, please try again after 15 minutes.' }
});

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/summary', require('./routes/summary'));
app.use('/api/goals', require('./routes/goals'));

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ success: true, data: null, message: 'Personal Finance API is running 🚀' });
});

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, message: 'Route not found.' });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
});

// ── Start server ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀  Server running on http://localhost:${PORT}\n`);
});
