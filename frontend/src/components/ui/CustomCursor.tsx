import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

export const CustomCursor = () => {
  const { x, y } = useMousePosition();
  const [isHovering, setIsHovering] = useState(false);

  const dotX = useSpring(useTransform(x, (v) => v - 8), { stiffness: 1000, damping: 50 });
  const dotY = useSpring(useTransform(y, (v) => v - 8), { stiffness: 1000, damping: 50 });
  const ringX = useSpring(useTransform(x, (v) => v - 16), { stiffness: 150, damping: 15, mass: 0.5 });
  const ringY = useSpring(useTransform(y, (v) => v - 16), { stiffness: 150, damping: 15, mass: 0.5 });
  const opacity = useTransform(() => (x.get() === 0 && y.get() === 0 ? 0 : 1));

  useEffect(() => {
    // Hide default cursor on body
    document.body.style.cursor = 'none';

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.tagName) {
        setIsHovering(false);
        return;
      }
      const tag = target.tagName.toLowerCase();
      if (tag === 'button' || tag === 'a' || target.closest?.('button') || target.closest?.('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mouseover', handleMouseOver);
    }
  }, []);

  // Hide on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ x: dotX, y: dotY, opacity }}
        animate={{ scale: isHovering ? 3 : 1 }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary/50 rounded-full pointer-events-none z-[9998] hidden md:block"
        style={{ x: ringX, y: ringY, opacity }}
        animate={{ scale: isHovering ? 1.5 : 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
      />
    </>
  );
};
