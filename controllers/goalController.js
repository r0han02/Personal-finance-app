const db = require('../db/database');

/**
 * GET /api/goals
 */
exports.getAll = (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM goals WHERE user_id = ? ORDER BY deadline ASC').all(req.user.id);

    return res.json({
      success: true,
      data: rows,
      message: `Found ${rows.length} goal(s).`,
    });
  } catch (err) {
    console.error('getAll goals error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
  }
};

/**
 * POST /api/goals
 */
exports.create = (req, res) => {
  try {
    const { name, target_amount, deadline } = req.body;

    const result = db.prepare(
      'INSERT INTO goals (user_id, name, target_amount, current_amount, deadline) VALUES (?, ?, ?, 0, ?)'
    ).run(req.user.id, name, target_amount, deadline);

    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      data: goal,
      message: 'Goal created.',
    });
  } catch (err) {
    console.error('create goal error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
  }
};

/**
 * PATCH /api/goals/:id  — update current_amount
 */
exports.updateAmount = (req, res) => {
  try {
    const { id } = req.params;
    const { current_amount } = req.body;

    const existing = db.prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Goal not found or access denied.',
      });
    }

    db.prepare('UPDATE goals SET current_amount = ? WHERE id = ? AND user_id = ?')
      .run(current_amount, id, req.user.id);

    const updated = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);

    return res.json({
      success: true,
      data: updated,
      message: 'Goal progress updated.',
    });
  } catch (err) {
    console.error('updateAmount goal error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
  }
};

/**
 * DELETE /api/goals/:id
 */
exports.remove = (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Goal not found or access denied.',
      });
    }

    db.prepare('DELETE FROM goals WHERE id = ? AND user_id = ?').run(id, req.user.id);

    return res.json({
      success: true,
      data: null,
      message: 'Goal deleted.',
    });
  } catch (err) {
    console.error('delete goal error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
  }
};
