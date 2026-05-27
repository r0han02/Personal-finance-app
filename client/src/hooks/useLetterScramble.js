import { useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

/**
 * Letter scramble effect — on mouseenter, each character
 * cycles through random characters then resolves back.
 * Returns a ref callback to attach to any element.
 */
export default function useLetterScramble() {
  const activeRef = useRef(new Set());

  const scramble = useCallback((el) => {
    if (!el || activeRef.current.has(el)) return;
    activeRef.current.add(el);

    const original = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', original);

    const chars = original.split('');
    const resolved = new Array(chars.length).fill(false);
    const duration = 600;
    const interval = 40;
    const steps = duration / interval;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const display = chars.map((ch, i) => {
        if (ch === ' ') return ' ';
        // Each char resolves at a staggered time
        const resolveAt = steps * (0.4 + (i / chars.length) * 0.6);
        if (step >= resolveAt) {
          resolved[i] = true;
          return ch;
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });
      el.textContent = display.join('');

      if (step >= steps) {
        clearInterval(timer);
        el.textContent = original;
        activeRef.current.delete(el);
      }
    }, interval);
  }, []);

  const onMouseEnter = useCallback((e) => {
    const target = e.currentTarget.querySelector('[data-scramble]') || e.currentTarget;
    scramble(target);
  }, [scramble]);

  return { onMouseEnter, scramble };
}
