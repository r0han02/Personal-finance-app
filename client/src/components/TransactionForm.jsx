import { useState } from 'react';
import { motion } from 'framer-motion';
import CATEGORIES from '../constants/categories';

const initialState = { type: 'expense', amount: '', category: CATEGORIES[0].name, date: '', note: '' };

export default function TransactionForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || initialState);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.type) e.type = 'Required.';
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Enter a positive amount.';
    if (!form.category) e.category = 'Required.';
    if (!form.date) e.date = 'Required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-row">
        <div className="form-group">
          <label>Type</label>
          <select className="form-control" value={form.type} onChange={set('type')}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {errors.type && <div className="form-error">{errors.type}</div>}
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input className="form-control" type="number" step="0.01" min="0" placeholder="0.00" value={form.amount} onChange={set('amount')} />
          {errors.amount && <div className="form-error">{errors.amount}</div>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select className="form-control" value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input className="form-control" type="date" value={form.date} onChange={set('date')} />
          {errors.date && <div className="form-error">{errors.date}</div>}
        </div>
      </div>
      <div className="form-group">
        <label>Note (optional)</label>
        <input className="form-control" type="text" placeholder="Add a note..." value={form.note} onChange={set('note')} />
      </div>
      <div className="modal-actions">
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        <motion.button
          type="submit"
          className="btn btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {initial ? 'Update' : 'Add'} Transaction
        </motion.button>
      </div>
    </motion.form>
  );
}
