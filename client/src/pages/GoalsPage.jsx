import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getGoals, createGoal, updateGoalProgress, deleteGoal } from '../services/goalService';
import PageTransition from '../components/PageTransition';
import GoalList from '../components/GoalList';
import GoalForm from '../components/GoalForm';
import Modal from '../components/Modal';
import SkeletonLoader from '../components/SkeletonLoader';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data: res } = await getGoals();
      setGoals(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load goals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data) => {
    try {
      await createGoal(data);
      setShowModal(false);
      load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create goal.'); }
  };

  const handleUpdateProgress = async (id, amount) => {
    try {
      await updateGoalProgress(id, amount);
      load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to update goal.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await deleteGoal(id);
      load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to delete goal.'); }
  };

  return (
    <PageTransition>
      <div className="page-header">
        <h1>Savings Goals</h1>
        <motion.button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          + New Goal
        </motion.button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="goals-grid">
          {[...Array(3)].map((_, i) => <SkeletonLoader key={i} type="card" />)}
        </div>
      ) : (
        <GoalList goals={goals} onDelete={handleDelete} onUpdateProgress={handleUpdateProgress} />
      )}

      {showModal && (
        <Modal title="Create Goal" onClose={() => setShowModal(false)}>
          <GoalForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </PageTransition>
  );
}
