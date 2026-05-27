import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSummary } from '../services/summaryService';
import { getTransactions } from '../services/transactionService';
import PageTransition from '../components/PageTransition';
import SummaryCards from '../components/SummaryCards';
import ExpenseBreakdown from '../components/ExpenseBreakdown';
import TransactionList from '../components/TransactionList';
import SkeletonLoader from '../components/SkeletonLoader';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [sumRes, txnRes] = await Promise.all([getSummary(), getTransactions({})]);
        setSummary(sumRes.data.data);
        setRecent(txnRes.data.data.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <PageTransition>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <>
          <SkeletonLoader type="cards" count={3} />
          <div className="dashboard-grid" style={{ marginTop: '1.25rem' }}>
            <SkeletonLoader type="card" />
            <SkeletonLoader type="list" count={4} />
          </div>
        </>
      ) : (
        <>
          {summary && <SummaryCards data={summary} />}

          <div className="dashboard-grid">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h2 className="section-title">Expense Breakdown</h2>
              {summary && <ExpenseBreakdown data={summary.expensesByCategory} />}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <h2 className="section-title">Recent Transactions</h2>
              <div className="glass-card" style={{ maxHeight: 400, overflowY: 'auto' }}>
                <TransactionList transactions={recent} showActions={false} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </PageTransition>
  );
}
