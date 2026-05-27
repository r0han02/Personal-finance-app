import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    let raf;
    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
      }
      if (textRef.current) {
        textRef.current.style.left = `${pos.current.x}px`;
        textRef.current.style.top = `${pos.current.y + 35}px`;
      }
      raf = requestAnimationFrame(animate);
    };

    const onOver = (e) => {
      const el = e.target.closest('a, button, [data-cursor-text], input, select, textarea');
      if (el) {
        setHovering(true);
        const text = el.getAttribute('data-cursor-text') || '';
        setCursorText(text);
      }
    };

    const onOut = (e) => {
      const el = e.target.closest('a, button, [data-cursor-text], input, select, textarea');
      if (el) {
        setHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${hovering ? 'hovering' : ''}`}
      />
      <div
        ref={textRef}
        className={`custom-cursor-text ${cursorText ? 'visible' : ''}`}
      >
        {cursorText}
      </div>
    </>
  );
}
