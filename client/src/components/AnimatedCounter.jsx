import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AnimatedCounter({ value, duration = 1200 }) {
  const { currencySymbol } = useAuth();
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const startRef = useRef(null);
  const prevVal = useRef(0);

  useEffect(() => {
    const start = prevVal.current;
    const end = Number(value) || 0;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);

      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      } else {
        prevVal.current = end;
      }
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return (
    <span>
      {currencySymbol}{display.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}
