import { useState, useEffect, useRef } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    startRef.current = performance.now();
    const duration = 2200;

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          document.documentElement.classList.remove('boot-loading');
          setTimeout(() => {
            setHidden(true);
            onComplete?.();
          }, 900);
        }, 300);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div className={`loader-root ${done ? 'done' : ''}`}>
      <div className="loader-split-top" />
      <div className="loader-split-bottom" />
      <div className="loader-content">
        {/* Logo - three chevron bars like matveyan */}
        <div className="loader-logo">
          <svg width="49" height="35" viewBox="0 0 49 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 7V35L0 28V0L14 7ZM31.5 7V35L17.5 28V0L31.5 7ZM49 7V35L35 28V0L49 7Z" fill="white"/>
          </svg>
        </div>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="loader-percent">{progress}%</span>
      </div>
    </div>
  );
}
