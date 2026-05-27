const db = require('../db/database');

/**
 * GET /api/summary
 * Returns total income, total expenses, net balance, and expense breakdown
 * by category for the current month.
 */
exports.getSummary = (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Total income for current month
    const incomeRow = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM transactions
      WHERE user_id = ? AND type = 'income' AND strftime('%Y-%m', date) = ?
    `).get(userId, currentMonth);

    // Total expenses for current month
    const expenseRow = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM transactions
      WHERE user_id = ? AND type = 'expense' AND strftime('%Y-%m', date) = ?
    `).get(userId, currentMonth);

    // Expense breakdown by category
    const breakdown = db.prepare(`
      SELECT category, SUM(amount) AS total
      FROM transactions
      WHERE user_id = ? AND type = 'expense' AND strftime('%Y-%m', date) = ?
      GROUP BY category
      ORDER BY total DESC
    `).all(userId, currentMonth);

    const totalIncome = incomeRow.total;
    const totalExpenses = expenseRow.total;

    return res.json({
      success: true,
      data: {
        month: currentMonth,
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        expensesByCategory: breakdown,
      },
      message: 'Monthly summary retrieved.',
    });
  } catch (err) {
    console.error('getSummary error:', err);
    return res.status(500).json({ success: false, data: null, message: 'Internal server error.' });
  }
};
