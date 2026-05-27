import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

const cards = [
  {
    key: 'income',
    label: 'Total Income',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    ),
    field: 'totalIncome',
  },
  {
    key: 'expense',
    label: 'Total Expenses',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="17" y1="17" x2="7" y2="7" />
        <polyline points="17 7 17 17 7 17" />
      </svg>
    ),
    field: 'totalExpenses',
  },
  {
    key: 'balance',
    label: 'Net Balance',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 22 22 22" />
      </svg>
    ),
    field: 'netBalance',
  },
];

const glowColors = {
  income: {
    hoverBorder: 'rgba(101, 160, 73, 0.4)',
    activeBorder: 'rgba(101, 160, 73, 0.8)',
    hoverShadow: '0 0 20px rgba(101, 160, 73, 0.15)',
    activeShadow: '0 0 30px rgba(101, 160, 73, 0.3)',
  },
  expense: {
    hoverBorder: 'rgba(160, 73, 75, 0.4)',
    activeBorder: 'rgba(160, 73, 75, 0.8)',
    hoverShadow: '0 0 20px rgba(160, 73, 75, 0.15)',
    activeShadow: '0 0 30px rgba(160, 73, 75, 0.3)',
  },
  balance: {
    hoverBorder: 'rgba(255, 255, 255, 0.25)',
    activeBorder: 'rgba(255, 255, 255, 0.8)',
    hoverShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
    activeShadow: '0 0 30px rgba(255, 255, 255, 0.25)',
  },
};

export default function SummaryCards({ data }) {
  return (
    <div className="summary-grid">
      {cards.map((card, i) => {
        const theme = glowColors[card.key];
        return (
          <motion.div
            key={card.key}
            className="summary-card"
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.02,
              borderColor: theme.hoverBorder,
              boxShadow: theme.hoverShadow,
            }}
            whileTap={{
              scale: 0.96,
              borderColor: theme.activeBorder,
              boxShadow: theme.activeShadow,
            }}
            style={{
              cursor: 'pointer',
            }}
          >
            <div className={`s-icon ${card.key}`}>{card.icon}</div>
            <div className="s-label">{card.label}</div>
            <div className="s-value">
              <AnimatedCounter value={data[card.field]} />
            </div>
            <div className="s-label">{data.month || 'Current Month'}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
