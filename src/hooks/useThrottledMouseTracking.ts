import { useEffect, useState, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export function useThrottledMouseTracking(isEnabled: boolean = true) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isCursorInsideHero, setIsCursorInsideHero] = useState(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (isCursorInsideHero) {
          const x = (e.clientX / window.innerWidth - 0.5) * 1.5;
          const y = (e.clientY / window.innerHeight - 0.5) * 0.7;
          setMousePosition({ x, y });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isCursorInsideHero, isEnabled]);

  const handleMouseEnter = () => setIsCursorInsideHero(true);
  const handleMouseLeave = () => {
    setIsCursorInsideHero(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return {
    mousePosition,
    isCursorInsideHero,
    handleMouseEnter,
    handleMouseLeave
  };
}