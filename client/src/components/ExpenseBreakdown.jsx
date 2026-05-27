import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#7c5cfc', '#00d4ff', '#a855f7', '#14b8a6', '#f43f5e', '#f59e0b', '#22c55e', '#3b82f6'];

export default function ExpenseBreakdown({ data = [] }) {
  const { formatCurrency } = useAuth();
  const max = Math.max(...data.map((d) => d.total), 1);

  if (!data.length) {
    return (
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card-title">Expense Breakdown</div>
        <div className="empty-state"><p>No expenses this month.</p></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      id="expense-breakdown"
    >
      <div className="card-title">Expense Breakdown</div>

      <div style={{ width: '100%', height: 200, marginBottom: '1rem' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              animationBegin={200}
              animationDuration={800}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 15, 15, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '2px',
                fontSize: 12,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                fontFamily: 'var(--mono)',
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: 'rgba(255, 255, 255, 0.5)' }}
              formatter={(value) => formatCurrency(value)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="breakdown-list">
        {data.map((item, i) => (
          <motion.li
            key={item.category}
            className="breakdown-item"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
          >
            <span className="breakdown-dot" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="breakdown-category">{item.category}</span>
            <div className="breakdown-bar">
              <motion.div
                className="breakdown-bar-fill"
                style={{ background: COLORS[i % COLORS.length] }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.total / max) * 100}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }}
              />
            </div>
            <span className="breakdown-amount">{formatCurrency(item.total)}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
