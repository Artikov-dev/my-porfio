import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type TransitionMode = 'black-hole' | 'big-bang' | null;

interface GodModeTransitionProps {
  mode: TransitionMode;
  onAnimationHalfway: () => void;
  onAnimationComplete: () => void;
}

export const GodModeTransition: React.FC<GodModeTransitionProps> = ({ 
  mode, 
  onAnimationHalfway, 
  onAnimationComplete 
}) => {
  const [stars, setStars] = useState<{ x: number, y: number, size: number, delay: number }[]>([]);

  useEffect(() => {
    if (mode === 'black-hole') {
      const newStars = Array.from({ length: 150 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 1,
      }));
      setStars(newStars);
    }
  }, [mode]);

  useEffect(() => {
    if (mode) {
      // At this point (1000ms), the screen is completely covered by the animation.
      // We change the actual theme underneath.
      const halfwayTimer = setTimeout(() => {
        onAnimationHalfway();
      }, 1000);

      // The animation finishes after 2500ms
      const completeTimer = setTimeout(() => {
        onAnimationComplete();
      }, 2500);

      return () => {
        clearTimeout(halfwayTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [mode, onAnimationHalfway, onAnimationComplete]);

  if (!mode) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden">
      <AnimatePresence>
        {/* BLACK HOLE EFFECT (Light to Dark) */}
        {mode === 'black-hole' && (
          <motion.div
            key="black-hole-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            {/* Twinkling Stars */}
            {stars.map((star, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, Math.random() * 0.5 + 0.5, 0.8, 0], 
                  scale: 1 
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: star.delay + 0.8,
                  ease: "easeInOut"
                }}
                className="absolute bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                }}
              />
            ))}
          </motion.div>
        )}

        {mode === 'black-hole' && (
          <motion.div
            key="black-hole-core"
            initial={{ scale: 0, opacity: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1, 1, 100], 
              opacity: [0, 1, 1, 1],
              rotate: [0, 180, 360, 720]
            }}
            transition={{ 
              duration: 1.2, 
              times: [0, 0.4, 0.7, 1], 
              ease: "anticipate" 
            }}
            className="absolute bg-black rounded-full w-[100px] h-[100px] flex items-center justify-center"
            style={{
              boxShadow: '0 0 100px 30px rgba(0, 0, 0, 1), 0 0 150px 80px rgba(139, 92, 246, 0.5), inset 0 0 20px 5px rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Accretion Disk */}
            <motion.div 
              className="absolute w-[150%] h-[150%] rounded-full border-t-4 border-r-4 border-purple-500/80"
              style={{ filter: 'blur(4px)' }}
            />
          </motion.div>
        )}

        {/* BIG BANG EFFECT (Dark to Light) */}
        {mode === 'big-bang' && (
          <motion.div
            key="big-bang-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute inset-0 bg-white"
          />
        )}

        {mode === 'big-bang' && (
          <motion.div
            key="big-bang-core"
            initial={{ scale: 0, opacity: 0, filter: 'blur(20px)' }}
            animate={{ 
              scale: [0, 0.3, 0.1, 150], 
              opacity: [0, 1, 1, 1], 
              filter: ['blur(20px)', 'blur(5px)', 'blur(2px)', 'blur(0px)'] 
            }}
            transition={{ 
              duration: 1.2, 
              times: [0, 0.3, 0.7, 1], 
              ease: "circIn" 
            }}
            className="absolute bg-white rounded-full w-[50px] h-[50px]"
            style={{
              boxShadow: '0 0 150px 80px rgba(255, 255, 255, 1), 0 0 200px 150px rgba(252, 211, 77, 0.8)'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
