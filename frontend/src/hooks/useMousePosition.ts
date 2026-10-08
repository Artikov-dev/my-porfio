import { useEffect } from 'react';
import { useMotionValue } from 'framer-motion';

// Returns framer-motion MotionValues instead of React state, so mouse movement
// updates styles directly without re-rendering the component tree on every frame.
export const useMousePosition = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      x.set(ev.clientX);
      y.set(ev.clientY);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [x, y]);

  return { x, y };
};
