import { useState } from 'react';
import { motion } from 'framer-motion';

export default function GoalForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', target_amount: '', deadline: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Goal name is required.';
    if (!form.target_amount || Number(form.target_amount) <= 0) e.target_amount = 'Enter a positive target.';
    if (!form.deadline) e.deadline = 'Deadline is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, target_amount: parseFloat(form.target_amount) });
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-group">
        <label>Goal Name</label>
        <input className="form-control" type="text" placeholder="e.g., Emergency Fund" value={form.name} onChange={set('name')} />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Target Amount</label>
          <input className="form-control" type="number" step="0.01" min="0" placeholder="0.00" value={form.target_amount} onChange={set('target_amount')} />
          {errors.target_amount && <div className="form-error">{errors.target_amount}</div>}
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <input className="form-control" type="date" value={form.deadline} onChange={set('deadline')} />
          {errors.deadline && <div className="form-error">{errors.deadline}</div>}
        </div>
      </div>
      <div className="modal-actions">
        {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
        <motion.button type="submit" className="btn btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          Create Goal
        </motion.button>
      </div>
    </motion.form>
  );
}
