import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const COIN_SVGS = [
  // Dollar ($)
  `<circle cx="24" cy="24" r="22" stroke-width="1.5" fill="none"/><text x="24" y="30.5" text-anchor="middle" font-size="19" font-weight="bold" fill="currentColor">$</text>`,
  // Euro (€)
  `<circle cx="24" cy="24" r="22" stroke-width="1.5" fill="none"/><text x="24" y="30.5" text-anchor="middle" font-size="19" font-weight="bold" fill="currentColor">€</text>`,
  // Pound (£)
  `<circle cx="24" cy="24" r="22" stroke-width="1.5" fill="none"/><text x="24" y="30" text-anchor="middle" font-size="19" font-weight="bold" fill="currentColor">£</text>`,
  // Rupee (₹)
  `<circle cx="24" cy="24" r="22" stroke-width="1.5" fill="none"/><text x="24" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="currentColor">₹</text>`,
  // Yen (¥)
  `<circle cx="24" cy="24" r="22" stroke-width="1.5" fill="none"/><text x="24" y="30" text-anchor="middle" font-size="19" font-weight="bold" fill="currentColor">¥</text>`,
];

const coins = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  svg: COIN_SVGS[i % COIN_SVGS.length],
  size: 40 + Math.random() * 50,
  x: 5 + Math.random() * 90,
  y: 10 + Math.random() * 80,
  duration: 4 + Math.random() * 4,
  delay: Math.random() * 3,
  rotDur: 3 + Math.random() * 4,
  opacity: 0.08 + Math.random() * 0.12,
}));

export default function FloatingCoins({ opacity = 1 }) {
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouse({ x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy });
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div className="coins-container" ref={containerRef} style={{ opacity }}>
      {coins.map((c) => (
        <motion.div
          key={c.id}
          style={{
            position: 'absolute',
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.size,
            height: c.size,
            opacity: c.opacity,
            color: c.id % 2 === 0 ? 'var(--neon)' : 'var(--neon2)',
            filter: `drop-shadow(0 0 8px currentColor)`,
            x: mouse.x * (10 + c.id * 3),
            y: mouse.y * (10 + c.id * 3),
          }}
          animate={{ y: [0, -20, 0], rotateY: [0, 360] }}
          transition={{
            y: { duration: c.duration, repeat: Infinity, ease: 'easeInOut', delay: c.delay },
            rotateY: { duration: c.rotDur, repeat: Infinity, ease: 'linear', delay: c.delay },
          }}
        >
          <svg viewBox="0 0 48 48" stroke="currentColor" fill="none" style={{ width: '100%', height: '100%' }}>
            <defs>
              <radialGradient id={`cg${c.id}`}><stop offset="0%" stopColor="currentColor" stopOpacity=".15"/><stop offset="100%" stopColor="transparent"/></radialGradient>
            </defs>
            <circle cx="24" cy="24" r="23" fill={`url(#cg${c.id})`} />
            <g dangerouslySetInnerHTML={{ __html: c.svg }} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
