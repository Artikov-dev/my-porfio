import React from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { Scene3D } from './Scene3D';

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D WebGL Background Scene */}
      <Scene3D />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid pattern (optional, for aesthetics) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <motion.div 
        className="relative z-10 text-center px-4"
        animate={{ x: -xOffset * 0.5, y: -yOffset * 0.5 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-6 leading-tight">
            {t('hero_title1')} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-300">{t('hero_title2')}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/projects">
              <Button variant="solid" className="w-full sm:w-auto px-8 py-3 text-lg">
                {t('explore_projects')}
              </Button>
            </Link>
            <Link to="/resume">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-3 text-lg">
                {t('view_resume')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
};
