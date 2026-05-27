import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';
import PageTransition from '../components/PageTransition';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import FilterControls from '../components/FilterControls';
import Modal from '../components/Modal';
import SkeletonLoader from '../components/SkeletonLoader';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ month: '', category: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;
      const { data: res } = await getTransactions(params);
      setTransactions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (data) => {
    try {
      await createTransaction(data);
      setShowModal(false);
      load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to add transaction.'); }
  };

  const handleUpdate = async (data) => {
    try {
      await updateTransaction(editing.id, data);
      setEditing(null);
      load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to update transaction.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to delete.'); }
  };

  const openEdit = (txn) => {
    setEditing({ ...txn, amount: String(txn.amount), date: txn.date?.split('T')[0] || txn.date });
  };

  return (
    <PageTransition>
      <div className="page-header">
        <h1>Transactions</h1>
        <motion.button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          + Add Transaction
        </motion.button>
      </div>

      <FilterControls
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ month: '', category: '', type: '' })}
      />

      {error && <div className="error-banner">{error}</div>}

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ padding: '1.25rem' }}
      >
        {loading ? (
          <SkeletonLoader type="list" count={5} />
        ) : (
          <TransactionList transactions={transactions} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </motion.div>

      {showModal && (
        <Modal title="Add Transaction" onClose={() => setShowModal(false)}>
          <TransactionForm onSubmit={handleAdd} onCancel={() => setShowModal(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Transaction" onClose={() => setEditing(null)}>
          <TransactionForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </PageTransition>
  );
}
