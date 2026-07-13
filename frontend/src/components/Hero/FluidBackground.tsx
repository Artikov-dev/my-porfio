import React, { useEffect, useRef } from 'react';
import webGLFluidEnhanced from 'webgl-fluid';
import { useTheme } from '@/contexts/ThemeContext';

export const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (canvasRef.current) {
      webGLFluidEnhanced(canvasRef.current, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 4,
        VELOCITY_DISSIPATION: 2,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.15,
        SPLAT_FORCE: 4000,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: !isDark,
        BLOOM: false, // Turned off bloom to prevent white blowout
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.1,
        BLOOM_THRESHOLD: 0.9,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: false, // Turned off sunrays to stop the screen from lighting up
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 0.3,
      });
    }
  }, [isDark]);

  return (
    <canvas
      key={theme}
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 opacity-80 md:opacity-100"
      style={{ width: '100vw', height: '100vh', pointerEvents: 'auto' }}
    />
  );
};
