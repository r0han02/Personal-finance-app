import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CornerMarkers from '../components/CornerMarkers';
import DebugFooter from '../components/DebugFooter';
import ScrollProgress from '../components/ScrollProgress';
import FloatingCryptoCoins from '../components/FloatingCryptoCoins';
import useLetterScramble from '../hooks/useLetterScramble';

/* ── Intersection Observer ── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── SVG Icons ── */
const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 6-10"/></svg>
);
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
);
const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const BoltIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const TrendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);
const PieIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
);

/* Logo */
const LogoSVG = ({ w = 28, h = 20 }) => (
  <svg width={w} height={h} viewBox="0 0 28 20" fill="none">
    <path d="M8 4V20L0 16V0L8 4ZM18 4V20L10 16V0L18 4ZM28 4V20L20 16V0L28 4Z" fill="white"/>
  </svg>
);

/* Inline heading icons */
const IMobile = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.2" style={{display:'inline',verticalAlign:'middle',margin:'0 4px'}}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>;
const IWeb = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.2" style={{display:'inline',verticalAlign:'middle',margin:'0 4px'}}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const IGrid = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1.2" style={{display:'inline',verticalAlign:'middle',margin:'0 4px'}}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;

/* ── Scramble button ── */
function ScrambleBtn({ to, children, secondary, scramble }) {
  return (
    <Link
      to={to}
      className={`mat-btn ${secondary ? 'secondary' : ''}`}
      data-cursor-text={children}
      onMouseEnter={(e) => {
        const span = e.currentTarget.querySelector('span[data-scramble]');
        if (span) scramble.scramble(span);
      }}
    >
      <CornerMarkers />
      <span data-scramble>{children}</span>
    </Link>
  );
}

/* ── Scramble nav link ── */
function ScrambleLink({ to, children, scramble, external }) {
  const props = external
    ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const El = external ? 'a' : Link;
  const linkProps = external ? props : { to };

  return (
    <li>
      <El
        {...linkProps}
        onMouseEnter={(e) => {
          const span = e.currentTarget.querySelector('span[data-scramble]');
          if (span) scramble.scramble(span);
        }}
      >
        <span data-scramble>{children}</span>{' '}
        <svg width="4" height="4" viewBox="0 0 4 4" fill="none"><path d="M4 0H0L4 4V0Z" fill="white"/></svg>
      </El>
    </li>
  );
}

/* ═══════════════════════════════════════════════ */
/* ═══ MAIN LANDING PAGE ═══ */
/* ═══════════════════════════════════════════════ */
export default function LandingPage() {
  const scramble = useLetterScramble();
  const spec = useReveal();
  const cases = useReveal();
  const cta = useReveal();

  /* ── SCROLL-DRIVEN HERO FADE + BLUR ── */
  const heroRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;

      // Hero: fade out + blur over 0→300px
      if (heroRef.current) {
        const progress = Math.min(sy / 300, 1);
        heroRef.current.style.opacity = 1 - progress;
        heroRef.current.style.filter = `blur(${progress * 14}px)`;
      }

      // Second section: fade in as hero fades out
      if (secondRef.current) {
        const fadeIn = Math.max(0, Math.min((sy - 100) / 300, 1));
        secondRef.current.style.opacity = fadeIn;
        secondRef.current.style.transform = `translateY(${(1 - fadeIn) * 40}px)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: '#0a0a0a', minHeight: '100vh', position: 'relative' }}
    >
      {/* Frame border */}
      <div className="frame-screen" aria-hidden="true">
        <CornerMarkers />
      </div>

      <ScrollProgress />

      {/* ════════════════════════════════════ */}
      {/* ═══ FIXED HEADER ═══ */}
      {/* ════════════════════════════════════ */}
      <header className="mat-header">
        <div className="mat-logo-block">
          <LogoSVG w={20} h={14} />
          <span className="mat-logo-text">FinanceFlow</span>
        </div>
        <ul className="mat-menu">
          <ScrambleLink to="/login" scramble={scramble}>sign in</ScrambleLink>
          <ScrambleLink to="/register" scramble={scramble}>register</ScrambleLink>
        </ul>
      </header>

      {/* ════════════════════════════════════ */}
      {/* ═══ HERO — fades + blurs on scroll ═══ */}
      {/* ════════════════════════════════════ */}
      <section className="mat-hero">
        {/* BG layers */}
        <div className="mat-hero-bg">
          <div className="mat-hero-gradient" />
          <div className="mat-edge-blur-top" />
          <div className="mat-edge-blur-bottom" />
        </div>

        {/* ★ FLOATING 3D COINS (explode on scroll) ★ */}
        <FloatingCryptoCoins />

        {/* Hero content — fades/blurs on scroll */}
        <div className="mat-hero-content" ref={heroRef}>
          <div className="mat-hero-logo">
            <LogoSVG w={28} h={20} />
          </div>
          <h1>
            <b>Track</b>{' '}
            <span className="icon-x"></span>{' '}
            <b>Grow</b>{' '}
            your wealth with precision and control
          </h1>
          <p className="mat-hero-desc">
            We build financial dashboards, budget analytics, and goal tracking
            systems for users where every decision shapes their financial future
          </p>
          <div className="mat-hero-btns">
            <ScrambleBtn to="/register" scramble={scramble}>GET STARTED</ScrambleBtn>
            <ScrambleBtn to="/login" scramble={scramble} secondary>SIGN IN</ScrambleBtn>
          </div>
        </div>

        {/* ── Second section: fades IN as hero fades out ── */}
        <div className="mat-hero-second" ref={secondRef} style={{ opacity: 0 }}>
          <p className="mat-avail-text">
            Currently available for new users — start tracking free today
          </p>
          <div className="mat-hero-btns">
            <ScrambleBtn to="/register" scramble={scramble}>CREATE FREE ACCOUNT</ScrambleBtn>
            <ScrambleBtn to="/login" scramble={scramble} secondary>SIGN IN TO ACCOUNT</ScrambleBtn>
          </div>
        </div>

        {/* Scroll-down hint */}
        <div className="scroll-down-hint">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="5" y="3.5" width="10" height="15" rx="3.5" stroke="white"/>
            <rect x="9.5" y="6" width="1" height="4" rx="0.5" fill="white"/>
          </svg>
          <span>Scroll down</span>
        </div>
      </section>


      <DebugFooter />

      {/* ════════════════════════════════════ */}
      {/* ═══ SPECIALIZATION ═══ */}
      {/* ════════════════════════════════════ */}
      <section className="mat-section" id="spec" ref={spec.ref}>
        <div className="container">
          <ul className={`mat-tags motion-text ${spec.visible ? 'visible' : ''}`}>
            <li>BUDGETING</li>
            <li>GOAL TRACKING</li>
            <li>ANALYTICS</li>
            <li>EXPENSE TRACKING</li>
            <li>SAVINGS</li>
          </ul>
          <h2 className={`motion-text ${spec.visible ? 'visible' : ''}`} style={{ transitionDelay: '.1s' }}>
            <b>We specialize in</b>
            <IMobile />&nbsp;real-time financial dashboards,
            <IGrid />&nbsp;transaction categorization, and complex
            <IWeb />&nbsp;budget analytics for personal finance
          </h2>
          <p className={`bio motion-text ${spec.visible ? 'visible' : ''}`} style={{ transitionDelay: '.2s' }}>
            <span>FinanceFlow gives you a complete picture of your money. Track income
            and expenses, set savings goals with animated progress, and visualize
            your spending patterns — all in one dashboard.</span>
          </p>
          <ul className={`mat-btn-group motion-text ${spec.visible ? 'visible' : ''}`} style={{ transitionDelay: '.3s' }}>
            <li><ScrambleBtn to="/register" scramble={scramble}>START TRACKING FREE</ScrambleBtn></li>
            <li><ScrambleBtn to="/login" scramble={scramble} secondary>SIGN IN</ScrambleBtn></li>
          </ul>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* ═══ FEATURES GRID ═══ */}
      {/* ════════════════════════════════════ */}
      <section className="mat-section mat-cases" id="cases" ref={cases.ref}>
        <div className="container">
          <div className={`mat-title-group motion-text ${cases.visible ? 'visible' : ''}`}>
            <h2><b>Platform features</b><br/>Built with <b>precision and security</b> in mind</h2>
          </div>
          <ul className={`mat-tags motion-text ${cases.visible ? 'visible' : ''}`} style={{ transitionDelay: '.1s' }}>
            <li>Real-time tracking, analytics, goal management, encryption...</li>
          </ul>
          <div className={`mat-cases-grid motion-text ${cases.visible ? 'visible' : ''}`} style={{ transitionDelay: '.2s' }}>
            <div className="mat-case-card">
              <div className="case-logo"><ChartIcon /></div>
              <h4>Real-Time Dashboard</h4>
              <p>Animated KPI cards, interactive donut charts, and trend lines — your complete financial picture at a glance.</p>
              <ScrambleBtn to="/register" scramble={scramble}>View project</ScrambleBtn>
            </div>
            <div className="mat-case-card">
              <div className="case-logo"><ShieldIcon /></div>
              <h4>Bank-Grade Security</h4>
              <p>AES-256 encryption, zero-knowledge architecture. Your data stays yours — always.</p>
              <ScrambleBtn to="/register" scramble={scramble}>View project</ScrambleBtn>
            </div>
            <div className="mat-case-card">
              <div className="case-logo"><TargetIcon /></div>
              <h4>Smart Savings Goals</h4>
              <p>Set targets with animated progress rings. Visual feedback when you're on track or behind.</p>
              <ScrambleBtn to="/register" scramble={scramble}>View project</ScrambleBtn>
            </div>
            <div className="mat-case-card">
              <div className="case-logo"><BoltIcon /></div>
              <h4>Instant Categorization</h4>
              <p>Smart tagging — every expense sorted into 12+ categories with visual breakdowns.</p>
              <ScrambleBtn to="/register" scramble={scramble}>View project</ScrambleBtn>
            </div>
            <div className="mat-case-card">
              <div className="case-logo"><TrendIcon /></div>
              <h4>Monthly Trend Analysis</h4>
              <p>Income vs expense trends with smooth animated charts. Spot patterns and plan ahead.</p>
              <ScrambleBtn to="/register" scramble={scramble}>View project</ScrambleBtn>
            </div>
            <div className="mat-case-card">
              <div className="case-logo"><PieIcon /></div>
              <h4>AI Budget Advisor <i className="soon">soon</i></h4>
              <p>Intelligent spending recommendations based on your patterns. Weekly insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ */}
      {/* ═══ CTA ═══ */}
      {/* ════════════════════════════════════ */}
      <section className="mat-section" ref={cta.ref}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className={`motion-text ${cta.visible ? 'visible' : ''}`}>
            <b>Ready to take control?</b><br/>Start tracking your finances today
          </h2>
          <p className={`bio motion-text ${cta.visible ? 'visible' : ''}`} style={{ transitionDelay: '.1s', margin: '0 auto 2rem', textAlign: 'center' }}>
            <span>Join thousands who track smarter, spend wiser, and grow faster. Free to start — no credit card required.</span>
          </p>
          <ul className={`mat-btn-group motion-text ${cta.visible ? 'visible' : ''}`} style={{ transitionDelay: '.2s', justifyContent: 'center' }}>
            <li><ScrambleBtn to="/register" scramble={scramble}>CREATE FREE ACCOUNT</ScrambleBtn></li>
            <li><ScrambleBtn to="/login" scramble={scramble} secondary>ALREADY HAVE AN ACCOUNT</ScrambleBtn></li>
          </ul>
        </div>
      </section>

      {/* ═══ BIG TEXT + FOOTER ═══ */}
      <div className="mat-footer-text">
        <svg viewBox="0 0 680 60" fill="none">
          <text x="0" y="52" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="60" fill="white" letterSpacing="-2">FINANCEFLOW</text>
        </svg>
      </div>
      <footer style={{ padding: '1.5rem 2rem', borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <LogoSVG w={14} h={10} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'rgba(255,255,255,.3)', letterSpacing: '1px' }}>FINANCEFLOW</span>
        </div>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'rgba(255,255,255,.15)' }}>© 2026 FinanceFlow. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'rgba(255,255,255,.2)', letterSpacing: '.5px' }}>SIGN IN</Link>
          <Link to="/register" style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'rgba(255,255,255,.2)', letterSpacing: '.5px' }}>REGISTER</Link>
        </div>
      </footer>
    </motion.div>
  );
}
