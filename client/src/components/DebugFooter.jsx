import { useState, useEffect, useRef } from 'react';

export default function DebugFooter() {
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [time, setTime] = useState('0.0s');
  const startTime = useRef(Date.now());

  useEffect(() => {
    const onMove = (e) => {
      setCursorX(Math.round(e.clientX));
      setCursorY(Math.round(e.clientY));
    };

    const onScroll = () => {
      setScroll(Math.round(window.scrollY));
    };

    const timer = setInterval(() => {
      const elapsed = ((Date.now() - startTime.current) / 1000).toFixed(1);
      setTime(`${elapsed}s`);
    }, 100);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="debug-footer" aria-hidden="true">
      <div className="debug-group">
        <div>Cursor X: <span>{cursorX}</span></div>
        <div>Cursor Y: <span>{cursorY}</span></div>
      </div>
      <div className="debug-divider" />
      <div className="debug-group">
        <div>Scroll: <span>{scroll}</span></div>
        <div>Time: <span>{time}</span></div>
      </div>
    </div>
  );
}
