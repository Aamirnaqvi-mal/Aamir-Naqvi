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

      // capture clientX/clientY right away
      const { clientX, clientY } = e;

      rafRef.current = requestAnimationFrame(() => {
        if (isCursorInsideHero) {
          const x = (clientX / window.innerWidth - 0.5) * 1.5;
          const baseY = (clientY / window.innerHeight - 0.7) * 0.2;

          // 👇 Add downward offset when moving horizontally
          const horizontalDownBias = Math.abs(x) * 0; // always pushes down
          // If you want right=down & left=up, replace with: const horizontalDownBias = x * 0.4;

          const y = baseY + horizontalDownBias;

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
    handleMouseLeave,
  };
}
