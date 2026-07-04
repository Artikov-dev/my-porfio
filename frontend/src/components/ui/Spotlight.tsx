import React from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';

export const Spotlight = () => {
  const { x, y } = useMousePosition();

  // Only render on desktop to avoid weird mobile touch behaviors
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      animate={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(170, 59, 255, 0.1), transparent 80%)`,
        opacity: x === 0 && y === 0 ? 0 : 1
      }}
      transition={{ type: 'tween', ease: 'linear', duration: 0 }}
    />
  );
};
