import React from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { FluidBackground } from './FluidBackground';
import { Starfield } from './Starfield';
import { TextReveal } from '@/components/ui/TextReveal';
import { Magnetic } from '@/components/ui/Magnetic';
import { Typewriter } from '@/components/ui/Typewriter';

export const ParallaxHero = () => {
  const { x, y } = useMousePosition();
  const { t } = useI18n();

  // Safe checks for SSR or initial load
  const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const winHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;

  // Calculate parallax offsets
  const xOffset = (x - winWidth / 2) / 40;
  const yOffset = (y - winHeight / 2) / 40;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-300">
      {/* 3D WebGL Fluid Background Scene */}
      <FluidBackground />
      
      {/* Brilliant Stars Overlay */}
      <Starfield />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern (optional, for aesthetics) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Test: Floating Tech Badges (can be removed if requested) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        animate={{ x: -xOffset * 0.8, y: -yOffset * 0.8 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <motion.div
          className="absolute top-1/4 left-[10%] md:left-[20%] px-4 py-2 rounded-xl dark:bg-white/5 bg-slate-900/5 border dark:border-white/10 border-slate-900/10 backdrop-blur-md text-cyan-500 dark:text-cyan-400 font-mono text-sm md:text-base font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          [ React ]
        </motion.div>
        
        <motion.div
          className="absolute top-[12%] right-[5%] md:top-[30%] md:right-[20%] px-4 py-2 rounded-xl dark:bg-white/5 bg-slate-900/5 border dark:border-white/10 border-slate-900/10 backdrop-blur-md text-green-600 dark:text-green-500 font-mono text-sm md:text-base font-bold shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          [ Node.js ]
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-[15%] md:left-[25%] px-4 py-2 rounded-xl dark:bg-white/5 bg-slate-900/5 border dark:border-white/10 border-slate-900/10 backdrop-blur-md text-blue-600 dark:text-blue-500 font-mono text-sm md:text-base font-bold shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          [ TypeScript ]
        </motion.div>
      </motion.div>

      <motion.div 
        className="relative z-10 text-center px-4 pointer-events-none"
        animate={{ x: -xOffset * 0.5, y: -yOffset * 0.5 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-4 md:mb-6 leading-tight flex flex-col items-center gap-2">
            <TextReveal text={t('hero_title1')} />
            <TextReveal text={t('hero_title2')} className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-primary" delay={0.5} />
          </h1>
          <div className="max-w-2xl mx-auto text-base md:text-xl text-slate-600 dark:text-slate-300 mb-8 md:mb-10 font-medium h-[60px] flex items-center justify-center">
            <Typewriter 
              words={[
                t('hero_subtitle'), 
                'I build high-performance Web Systems',
                'I specialize in React & Node.js',
                'Let\'s build something amazing'
              ]} 
              typingSpeed={80}
              deletingSpeed={40}
              delayBetweenWords={2500}
              className="text-primary font-bold"
            />
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <Link to="/projects">
              <Magnetic>
                <Button variant="solid" className="w-full sm:w-auto px-8 py-3 text-lg backdrop-blur-md bg-primary/80 hover:bg-primary pointer-events-auto">
                  {t('explore_projects')}
                </Button>
              </Magnetic>
            </Link>
            <Link to="/resume">
              <Magnetic>
                <Button variant="outline" className="w-full sm:w-auto px-8 py-3 text-lg backdrop-blur-md dark:border-white/20 border-slate-900/20 text-slate-900 dark:text-white dark:hover:bg-white/10 hover:bg-slate-900/10 pointer-events-auto">
                  {t('view_resume')}
                </Button>
              </Magnetic>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

    </div>
  );
};
