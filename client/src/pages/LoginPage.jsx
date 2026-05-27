import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import CornerMarkers from '../components/CornerMarkers';
import FloatingCryptoCoins from '../components/FloatingCryptoCoins';
import useLetterScramble from '../hooks/useLetterScramble';

const LogoSVG = ({ w = 28, h = 20 }) => (
  <svg width={w} height={h} viewBox="0 0 28 20" fill="none">
    <path d="M8 4V20L0 16V0L8 4ZM18 4V20L10 16V0L18 4ZM28 4V20L20 16V0L28 4Z" fill="white"/>
  </svg>
);

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const scramble = useLetterScramble();

  const validate = () => {
    if (!form.email) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email.';
    if (!form.password) return 'Password is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);
    try {
      const { data: res } = await login(form);
      if (res.success) {
        loginUser(res.data.user, res.data.token);
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <motion.div
      className="auth-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background layers */}
      <div className="mat-hero-bg" style={{ opacity: 0.8 }}>
        <div className="mat-hero-gradient" />
        <div className="mat-edge-blur-top" />
        <div className="mat-edge-blur-bottom" />
      </div>

      <FloatingCryptoCoins />

      <div className="auth-bg-grid" />
      <motion.div
        className="auth-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      >
        <CornerMarkers />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <LogoSVG w={24} h={17} />
        </div>
        <h1 style={{ textAlign: 'center' }}>Welcome back</h1>
        <p className="subtitle" style={{ textAlign: 'center' }}>Sign in to your FinanceFlow account</p>
        {error && (
          <motion.div className="error-banner" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit}>
          <motion.div className="form-group" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label>Email</label>
            <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
          </motion.div>
          <motion.div className="form-group" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label>Password</label>
            <input className="form-control" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
          </motion.div>
          <motion.button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ marginTop: '0.5rem' }}
            onMouseEnter={(e) => {
              const span = e.currentTarget.querySelector('span[data-scramble]');
              if (span) scramble.scramble(span);
            }}
          >
            <span data-scramble>{loading ? 'Signing in…' : 'SIGN IN'}</span>
          </motion.button>
        </form>



        <p className="auth-footer">
          Don't have an account?{' '}
          <Link
            to="/register"
            onMouseEnter={(e) => {
              const span = e.currentTarget.querySelector('span[data-scramble]');
              if (span) scramble.scramble(span);
            }}
          >
            <span data-scramble>Create one</span>
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
