import React from 'react';
import { motion } from 'framer-motion';

export const PageWrapper = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
      
      {/* Slide Out Curtain (When leaving page) */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-background z-[100] origin-bottom pointer-events-none border-t border-primary/20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Slide In Curtain (When entering page) */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen bg-background z-[100] origin-top pointer-events-none border-b border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
};
