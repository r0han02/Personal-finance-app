const bcrypt = require('bcryptjs');
const db = require('./database');

async function seedDemoUser() {
  console.log('--- Starting Demo User Seed ---');

  // 1. Clean up existing demo user
  const demoEmail = 'demo@financeflow.com';
  db.prepare('DELETE FROM users WHERE email = ?').run(demoEmail);

  // 2. Hash password
  const passwordHash = await bcrypt.hash('password123', 12);

  // 3. Create demo user
  const userResult = db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
  ).run('Demo User', demoEmail, passwordHash);

  const userId = userResult.lastInsertRowid;
  console.log(`✔ Created demo user with ID: ${userId}`);

  // 4. Seed categories for the user (optional, we use the default ones seeded globally too)
  // Our default categories have user_id = NULL. We can just use those names directly.

  // 5. Seed Transactions for current month (May 2026) and previous month (April 2026)
  const transactions = [
    // May 2026 (Income & Expenses)
    { type: 'income', amount: 4500, category: 'Salary', date: '2026-05-01', note: 'Monthly Salary payout' },
    { type: 'expense', amount: 1500, category: 'Rent', date: '2026-05-02', note: 'Apartment rent' },
    { type: 'income', amount: 650, category: 'Salary', date: '2026-05-15', note: 'Freelance Design Project' },
    { type: 'expense', amount: 45.50, category: 'Food', date: '2026-05-03', note: 'Groceries' },
    { type: 'expense', amount: 32.20, category: 'Food', date: '2026-05-08', note: 'Weekly supermarket run' },
    { type: 'expense', amount: 88.00, category: 'Food', date: '2026-05-14', note: 'Dinner with friends' },
    { type: 'expense', amount: 55.40, category: 'Food', date: '2026-05-22', note: 'Food delivery order' },
    { type: 'expense', amount: 25.00, category: 'Transport', date: '2026-05-04', note: 'Train card top-up' },
    { type: 'expense', amount: 35.00, category: 'Transport', date: '2026-05-18', note: 'Uber ride' },
    { type: 'expense', amount: 120.00, category: 'Entertainment', date: '2026-05-10', note: 'Concert ticket' },
    { type: 'expense', amount: 14.99, category: 'Entertainment', date: '2026-05-15', note: 'Netflix Subscription' },
    { type: 'expense', amount: 60.00, category: 'Health', date: '2026-05-12', note: 'Pharmacy meds' },

    // April 2026 (Income & Expenses)
    { type: 'income', amount: 4500, category: 'Salary', date: '2026-04-01', note: 'Monthly Salary payout' },
    { type: 'expense', amount: 1500, category: 'Rent', date: '2026-04-02', note: 'Apartment rent' },
    { type: 'income', amount: 800, category: 'Salary', date: '2026-04-18', note: 'Freelance consultation' },
    { type: 'expense', amount: 52.10, category: 'Food', date: '2026-04-04', note: 'Supermarket' },
    { type: 'expense', amount: 68.30, category: 'Food', date: '2026-04-12', note: 'Dinner out' },
    { type: 'expense', amount: 42.00, category: 'Food', date: '2026-04-25', note: 'Groceries' },
    { type: 'expense', amount: 25.00, category: 'Transport', date: '2026-04-05', note: 'Train card top-up' },
    { type: 'expense', amount: 25.00, category: 'Transport', date: '2026-04-20', note: 'Train card top-up' },
    { type: 'expense', amount: 85.00, category: 'Entertainment', date: '2026-04-15', note: 'Dinner & Cinema' },
    { type: 'expense', amount: 14.99, category: 'Entertainment', date: '2026-04-15', note: 'Netflix Subscription' },
    { type: 'expense', amount: 150.00, category: 'Health', date: '2026-04-10', note: 'Doctor checkup' }
  ];

  const insertTx = db.prepare(
    'INSERT INTO transactions (user_id, type, amount, category, date, note) VALUES (?, ?, ?, ?, ?, ?)'
  );

  db.exec('BEGIN TRANSACTION');
  try {
    for (const tx of transactions) {
      insertTx.run(userId, tx.type, tx.amount, tx.category, tx.date, tx.note);
    }
    db.exec('COMMIT');
    console.log(`✔ Seeded ${transactions.length} transactions`);
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Error seeding transactions:', err);
  }

  // 6. Seed Goals
  const goals = [
    { name: 'Emergency Fund', target_amount: 10000, current_amount: 6500, deadline: '2026-12-31' },
    { name: 'New MacBook Pro', target_amount: 2000, current_amount: 1200, deadline: '2026-09-30' },
    { name: 'Summer Holiday', target_amount: 3000, current_amount: 1500, deadline: '2026-08-15' }
  ];

  const insertGoal = db.prepare(
    'INSERT INTO goals (user_id, name, target_amount, current_amount, deadline) VALUES (?, ?, ?, ?, ?)'
  );

  db.exec('BEGIN TRANSACTION');
  try {
    for (const goal of goals) {
      insertGoal.run(userId, goal.name, goal.target_amount, goal.current_amount, goal.deadline);
    }
    db.exec('COMMIT');
    console.log(`✔ Seeded ${goals.length} financial goals`);
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Error seeding goals:', err);
  }

  console.log('--- Seed Demo User Finished ---');
}

seedDemoUser().catch(console.error);
