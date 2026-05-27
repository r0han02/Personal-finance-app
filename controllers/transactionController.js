const db = require('../db/database');

/**
 * GET /api/transactions
 * Query params: ?month=YYYY-MM  &category=Food  &type=income|expense
 */
exports.getAll = (req, res) => {
  try {
    const userId = req.user.id;
    const { month, category, type } = req.query;

    let sql = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    if (month) {
      // month format expected: YYYY-MM
      sql += " AND strftime('%Y-%m', date) = ?";
      params.push(month);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY date DESC';

    const rows = db.prepare(sql).all(...params);

    return res.json({
      success: true,
      data: rows,
      message: `Found ${rows.length} transaction(s).`,
    });
  } catch (err) {
    console.error('getAll transactions error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
  }
};

/**
 * POST /api/transactions
 */
exports.create = (req, res) => {
  try {
    const userId = req.user.id;
    const { type, amount, category, date, note } = req.body;

    const result = db.prepare(
      'INSERT INTO transactions (user_id, type, amount, category, date, note) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(userId, type, amount, category, date, note || '');

    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created.',
    });
  } catch (err) {
    console.error('create transaction error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
  }
};

/**
 * PUT /api/transactions/:id
 */
exports.update = (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { type, amount, category, date, note } = req.body;

    // Ownership check
    const existing = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Transaction not found or access denied.',
      });
    }

    db.prepare(
      'UPDATE transactions SET type = ?, amount = ?, category = ?, date = ?, note = ? WHERE id = ? AND user_id = ?'
    ).run(type, amount, category, date, note || '', id, userId);

    const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);

    return res.json({
      success: true,
      data: updated,
      message: 'Transaction updated.',
    });
  } catch (err) {
    console.error('update transaction error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
  }
};

/**
 * DELETE /api/transactions/:id
 */
exports.remove = (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Transaction not found or access denied.',
      });
    }

    db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(id, userId);

    return res.json({
      success: true,
      data: null,
      message: 'Transaction deleted.',
    });
  } catch (err) {
    console.error('delete transaction error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
  }
};
