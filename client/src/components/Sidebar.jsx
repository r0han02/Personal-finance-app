import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>` },
  { to: '/transactions', label: 'Transactions', icon: `<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>` },
  { to: '/goals', label: 'Goals', icon: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>` },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      initial={false}
      animate={{ width: collapsed ? 60 : 220 }}
      transition={{ duration: 0.3, ease: [.4,0,.2,1] }}
    >
      <div className="sidebar-brand">
        <div className="brand-icon">
          <svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4V20L0 16V0L8 4ZM18 4V20L10 16V0L18 4ZM28 4V20L20 16V0L28 4Z" fill="white"/>
          </svg>
        </div>
        {!collapsed && <motion.span className="brand-text" style={{fontWeight:600,fontSize:'.75rem',whiteSpace:'nowrap',fontFamily:'var(--mono)',letterSpacing:'1.5px',textTransform:'uppercase'}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.15}}>FinanceFlow</motion.span>}
      </div>

      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => `sidebar-link ${isActive?'active':''}`}>
            <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{__html:l.icon}} />
            {!collapsed && <motion.span className="link-text" initial={{opacity:0,x:-4}} animate={{opacity:1,x:0}} transition={{delay:.1}}>{l.label}</motion.span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-toggle" onClick={onToggle}>
          <svg viewBox="0 0 24 24"><path d={collapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'} /></svg>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
