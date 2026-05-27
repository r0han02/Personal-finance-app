import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
  exit: { opacity: 0, x: 16, transition: { duration: 0.2 } },
};

const IncomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const ExpenseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
    <line x1="17" y1="17" x2="7" y2="7" />
    <polyline points="17 7 17 17 7 17" />
  </svg>
);

export default function TransactionList({ transactions, onEdit, onDelete, showActions = true }) {
  const { formatCurrency } = useAuth();

  if (!transactions.length) {
    return <div className="empty-state"><p>No transactions found.</p></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence mode="popLayout">
        {transactions.map((t, i) => (
          <motion.div
            key={t.id}
            className="txn-card"
            custom={i}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            whileHover={{ scale: 1.01, borderColor: 'rgba(124, 92, 252, 0.2)' }}
          >
            <div className={`txn-icon ${t.type}`}>
              {t.type === 'income' ? <IncomeIcon /> : <ExpenseIcon />}
            </div>
            <div className="txn-info">
              <div className="txn-cat">{t.category}</div>
              <div className="txn-meta">
                <span>{new Date(t.date).toLocaleDateString()}</span>
                {t.note && <span>· {t.note}</span>}
              </div>
            </div>
            <div className={`txn-amount ${t.type}`}>
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </div>
            {showActions && (
              <div className="txn-actions" style={{ marginLeft: '1rem' }}>
                <button className="btn btn-sm btn-secondary" onClick={() => onEdit(t)} style={{ padding: '0.25rem 0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(t.id)} style={{ padding: '0.25rem 0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
