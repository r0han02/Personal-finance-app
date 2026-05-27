import { motion } from 'framer-motion';
import CATEGORIES from '../constants/categories';

export default function FilterControls({ filters, onChange, onClear }) {
  const set = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <motion.div
      className="filter-bar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <input className="form-control" type="month" value={filters.month || ''} onChange={set('month')} />
      <select className="form-control" value={filters.category || ''} onChange={set('category')}>
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
      </select>
      <select className="form-control" value={filters.type || ''} onChange={set('type')}>
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <motion.button className="btn btn-secondary btn-sm" onClick={onClear} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Clear
      </motion.button>
    </motion.div>
  );
}
