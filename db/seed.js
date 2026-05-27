const db = require('./database');

/**
 * Seeds default global categories (user_id = NULL) if none exist yet.
 * Runs once on first server startup.
 */
function seedCategories() {
  const count = db.prepare('SELECT COUNT(*) AS cnt FROM categories WHERE user_id IS NULL').get();

  if (count.cnt === 0) {
    const defaults = [
      { name: 'Food',          color: '#ef4444', icon: 'utensils' },
      { name: 'Rent',          color: '#f97316', icon: 'home' },
      { name: 'Transport',     color: '#3b82f6', icon: 'car' },
      { name: 'Entertainment', color: '#a855f7', icon: 'film' },
      { name: 'Health',        color: '#22c55e', icon: 'heart-pulse' },
      { name: 'Salary',        color: '#14b8a6', icon: 'wallet' },
    ];

    const insert = db.prepare(
      'INSERT INTO categories (user_id, name, color, icon) VALUES (NULL, ?, ?, ?)'
    );

    db.exec('BEGIN TRANSACTION');
    try {
      for (const cat of defaults) {
        insert.run(cat.name, cat.color, cat.icon);
      }
      db.exec('COMMIT');
      console.log('✔  Seeded default categories');
    } catch (err) {
      db.exec('ROLLBACK');
      console.error('Error seeding categories:', err);
    }
  }
}

module.exports = { seedCategories };
