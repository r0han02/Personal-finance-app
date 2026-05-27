import { useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════
   FLOATING 3D COINS — Metallic circles with:
   1) Idle float (translateY oscillation)
   2) 3D Y-axis spin (coin-flip shimmer)
   3) Scroll-driven explosion (scale + fly outward)
   4) Mouse parallax
   ═══════════════════════════════════════════════ */

const COINS = [
  { id: 0, size: 160, x: 8,  y: 18, floatDur: 5,   floatDelay: 0,   spinDur: 8,   opacity: 0.35, dir: [-1, -1] },
  { id: 1, size: 130, x: 78, y: 10, floatDur: 4.5, floatDelay: 0.8, spinDur: 10,  opacity: 0.3,  dir: [1, -1]  },
  { id: 2, size: 100, x: 38, y: 6,  floatDur: 5.5, floatDelay: 1.5, spinDur: 12,  opacity: 0.25, dir: [0, -1]  },
  { id: 3, size: 110, x: 3,  y: 55, floatDur: 4,   floatDelay: 0.5, spinDur: 9,   opacity: 0.22, dir: [-1, 1]  },
  { id: 4, size: 140, x: 82, y: 55, floatDur: 6,   floatDelay: 2,   spinDur: 7,   opacity: 0.28, dir: [1, 1]   },
  { id: 5, size: 90,  x: 55, y: 75, floatDur: 4.2, floatDelay: 1,   spinDur: 14,  opacity: 0.18, dir: [0.5, 1] },
  { id: 6, size: 80,  x: 20, y: 72, floatDur: 5.8, floatDelay: 3,   spinDur: 11,  opacity: 0.15, dir: [-1, 1]  },
  { id: 7, size: 70,  x: 90, y: 35, floatDur: 4.8, floatDelay: 1.8, spinDur: 13,  opacity: 0.12, dir: [1, 0]   },
];

/* SVG symbols for each coin */
function CoinSymbol({ index, size }) {
  const s = size * 0.35;
  const cx = size / 2;
  const cy = size / 2;

  const symbols = [
    // USD ($)
    <text key="usd" x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={s * 1.1} fontWeight="bold" fill="rgba(255,255,255,0.65)" fontFamily="system-ui, -apple-system, sans-serif">$</text>,
    // EUR (€)
    <text key="eur" x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={s * 1.1} fontWeight="bold" fill="rgba(255,255,255,0.6)" fontFamily="system-ui, -apple-system, sans-serif">€</text>,
    // GBP (£)
    <text key="gbp" x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={s * 1.1} fontWeight="bold" fill="rgba(255,255,255,0.55)" fontFamily="system-ui, -apple-system, sans-serif">£</text>,
    // INR (₹)
    <text key="inr" x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={s * 1.0} fontWeight="bold" fill="rgba(255,255,255,0.6)" fontFamily="system-ui, -apple-system, sans-serif">₹</text>,
    // JPY/CNY (¥)
    <text key="jpy" x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={s * 1.1} fontWeight="bold" fill="rgba(255,255,255,0.55)" fontFamily="system-ui, -apple-system, sans-serif">¥</text>,
  ];
  return symbols[index % symbols.length];
}

export default function FloatingCryptoCoins() {
  const containerRef = useRef(null);
  const coinsRef = useRef([]);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(null);

  const animate = useCallback(() => {
    const sy = scrollRef.current;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    coinsRef.current.forEach((el, i) => {
      if (!el) return;
      const coin = COINS[i];
      const progress = Math.min(sy / 400, 1); // 0→1 over 400px scroll

      // Scroll explosion: scale up + translate outward
      const scale = 1 + progress * 2.5;
      const tx = coin.dir[0] * progress * 600;
      const ty = coin.dir[1] * progress * 500;
      const op = coin.opacity * (1 - progress);

      // Mouse parallax
      const depth = (i % 3 + 1) * 4;
      const px = (mx - 0.5) * depth;
      const py = (my - 0.5) * depth;

      el.style.opacity = Math.max(0, op);
      el.style.transform = `translate(${tx + px}px, ${ty + py}px) scale(${scale})`;

      // Accelerate spin on scroll
      if (progress > 0) {
        const newDur = coin.spinDur * (1 - progress * 0.7);
        const inner = el.querySelector('.coin-inner');
        if (inner) inner.style.animationDuration = `${Math.max(1, newDur)}s`;
      }
    });

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    const onMouse = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <div ref={containerRef} className="coins-container" aria-hidden="true">
      {COINS.map((coin, i) => (
        <div
          key={coin.id}
          ref={(el) => (coinsRef.current[i] = el)}
          className="coin-wrapper"
          style={{
            position: 'absolute',
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            width: coin.size,
            height: coin.size,
            opacity: coin.opacity,
            willChange: 'transform, opacity',
            perspective: '600px',
          }}
        >
          {/* Float animation wrapper */}
          <div
            className="coin-float"
            style={{
              width: '100%',
              height: '100%',
              animation: `coinFloat ${coin.floatDur}s ease-in-out ${coin.floatDelay}s infinite`,
            }}
          >
            {/* 3D Y-axis spin */}
            <div
              className="coin-inner"
              style={{
                width: '100%',
                height: '100%',
                animation: `coinSpin ${coin.spinDur}s linear infinite`,
                transformStyle: 'preserve-3d',
              }}
            >
              <svg width={coin.size} height={coin.size} viewBox={`0 0 ${coin.size} ${coin.size}`} fill="none" style={{ display: 'block' }}>
                <defs>
                  <radialGradient id={`cg${coin.id}`} cx="38%" cy="32%" r="62%">
                    <stop offset="0%" stopColor="rgba(200,200,200,0.18)" />
                    <stop offset="40%" stopColor="rgba(150,150,150,0.1)" />
                    <stop offset="100%" stopColor="rgba(80,80,80,0.03)" />
                  </radialGradient>
                  <radialGradient id={`ch${coin.id}`} cx="30%" cy="22%" r="40%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* Shadow */}
                <ellipse cx={coin.size / 2} cy={coin.size * 0.92} rx={coin.size * 0.32} ry={coin.size * 0.04} fill="rgba(255,255,255,0.02)" />

                {/* Outer disc */}
                <circle cx={coin.size / 2} cy={coin.size / 2} r={coin.size / 2 - 2} fill={`url(#cg${coin.id})`} />
                <circle cx={coin.size / 2} cy={coin.size / 2} r={coin.size / 2 - 2} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />

                {/* Inner highlight */}
                <circle cx={coin.size / 2} cy={coin.size / 2} r={coin.size * 0.38} fill={`url(#ch${coin.id})`} />
                <circle cx={coin.size / 2} cy={coin.size / 2} r={coin.size * 0.38} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

                {/* Symbol */}
                <CoinSymbol index={i} size={coin.size} />

                {/* Top rim shine */}
                <ellipse cx={coin.size / 2} cy={coin.size * 0.12} rx={coin.size * 0.3} ry={coin.size * 0.035} fill="rgba(255,255,255,0.06)" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
