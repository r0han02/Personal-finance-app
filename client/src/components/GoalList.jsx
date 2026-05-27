import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
};

function CircularProgress({ pct, id }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius; // ~163.36
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="circular-progress">
      <svg viewBox="0 0 64 64" width="64" height="64">
        <defs>
          <linearGradient id={`goalGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--neon)" />
            <stop offset="100%" stopColor="var(--neon2)" />
          </linearGradient>
          <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle className="track" cx="32" cy="32" r={radius} />
        <motion.circle
          className="fill"
          cx="32"
          cy="32"
          r={radius}
          stroke={`url(#goalGrad-${id})`}
          filter={`url(#glow-${id})`}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="pct">{pct.toFixed(0)}%</div>
    </div>
  );
}

export default function GoalList({ goals, onDelete, onUpdateProgress }) {
  const { formatCurrency } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [amount, setAmount] = useState('');

  const handleUpdate = (id) => {
    if (!amount || Number(amount) < 0) return;
    onUpdateProgress(id, parseFloat(amount));
    setEditingId(null);
    setAmount('');
  };

  if (!goals.length) {
    return <div className="empty-state"><p>No goals yet. Create one to start saving!</p></div>;
  }

  return (
    <div className="goals-grid">
      <AnimatePresence mode="popLayout">
        {goals.map((g, i) => {
          const pct = g.target_amount > 0 ? Math.min((g.current_amount / g.target_amount) * 100, 100) : 0;
          return (
            <motion.div
              key={g.id}
              className="glass-card goal-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              whileHover={{
                y: -4,
                scale: 1.02,
                borderColor: 'rgba(255, 255, 255, 0.25)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              }}
              whileTap={{
                scale: 0.97,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="goal-name">{g.name}</div>
                  <div className="goal-deadline">Due: {new Date(g.deadline).toLocaleDateString()}</div>
                </div>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(g.id)} style={{ padding: '0.25rem 0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="goal-progress">
                <CircularProgress pct={pct} id={g.id} />
                <div className="goal-amounts">
                  <div className="ga-row">
                    <span>Saved</span>
                    <span>{formatCurrency(g.current_amount)}</span>
                  </div>
                  <div className="ga-row">
                    <span>Target</span>
                    <span>{formatCurrency(g.target_amount)}</span>
                  </div>
                </div>
              </div>

              {editingId === g.id ? (
                <motion.div
                  className="goal-update-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    className="form-control"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    autoFocus
                  />
                  <button className="btn btn-sm btn-success" onClick={() => handleUpdate(g.id)}>Save</button>
                  <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(null); setAmount(''); }}>✕</button>
                </motion.div>
              ) : (
                <div className="goal-actions">
                  <button
                    className="btn btn-sm btn-secondary btn-block"
                    onClick={() => { setEditingId(g.id); setAmount(g.current_amount); }}
                  >
                    Update Progress
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
