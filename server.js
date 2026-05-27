require('dotenv').config();

const express = require('express');
const cors = require('cors');

// ── Seed DB on first run ───────────────────────────────────────────────────────
const { seedCategories } = require('./db/seed');
seedCategories();

// ── App setup ──────────────────────────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
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
