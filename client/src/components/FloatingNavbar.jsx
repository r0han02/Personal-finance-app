import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useLetterScramble from '../hooks/useLetterScramble';
import Modal from './Modal';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>` },
  { to: '/transactions', label: 'Transactions', icon: `<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>` },
  { to: '/goals', label: 'Goals', icon: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>` },
];

export default function FloatingNavbar() {
  const { user, logout, currency, changeCurrency, currencySymbols } = useAuth();
  const navigate = useNavigate();
  const scramble = useLetterScramble();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="floating-navbar top-nav-bar">
        {/* Left Brand */}
        <div className="navbar-brand">
          <svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '14px', display: 'block' }}>
            <path d="M8 4V20L0 16V0L8 4ZM18 4V20L10 16V0L18 4ZM28 4V20L20 16V0L28 4Z" fill="white"/>
          </svg>
          <span className="navbar-logo-text">FinanceFlow</span>
        </div>

        {/* Center Nav Buttons */}
        <div className="navbar-menu">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onMouseEnter={(e) => {
                const span = e.currentTarget.querySelector('span[data-scramble]');
                if (span) scramble.scramble(span);
              }}
            >
              <svg viewBox="0 0 24 24" className="nav-icon" dangerouslySetInnerHTML={{ __html: l.icon }} />
              <span data-scramble>{l.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right User Actions */}
        <div className="navbar-actions">
          <div className="navbar-user" onClick={() => setShowProfile(true)}>
            <div className="navbar-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            <span className="navbar-name">{user?.name}</span>
          </div>
          <button
            className="btn-logout"
            onClick={handleLogout}
            id="btn-logout"
            onMouseEnter={(e) => {
              const span = e.currentTarget.querySelector('span[data-scramble]');
              if (span) scramble.scramble(span);
            }}
          >
            <span data-scramble>Logout</span>
          </button>
        </div>
      </nav>

      <Modal title="User Account Details" isOpen={showProfile} onClose={() => setShowProfile(false)}>
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Name</span>
            <span className="detail-value">{user?.name || 'Demo User'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user?.email || 'demo@financeflow.com'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className="detail-value status-active">Active</span>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.6rem', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>Preferred Currency</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {Object.keys(currencySymbols).map((code) => (
              <button
                key={code}
                className={`btn ${currency === code ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.75rem',
                  borderColor: currency === code ? '#90caf9' : 'rgba(255,255,255,0.08)',
                  color: currency === code ? '#90caf9' : '#fff',
                  background: currency === code ? 'rgba(144, 202, 249, 0.05)' : 'transparent',
                }}
                onClick={() => changeCurrency(code)}
              >
                <span style={{ fontSize: '0.9rem', marginRight: '0.3rem', fontFamily: 'var(--font)' }}>{currencySymbols[code]}</span>
                <span style={{ fontFamily: 'var(--mono)' }}>{code}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '1.8rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowProfile(false)}>Close</button>
        </div>
      </Modal>
    </>
  );
}
