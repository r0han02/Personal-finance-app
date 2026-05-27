import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, pct));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-fill" style={{ height: `${progress}%` }} />
      <div className="scroll-progress-sections">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`scroll-sec ${progress >= i * 25 ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
