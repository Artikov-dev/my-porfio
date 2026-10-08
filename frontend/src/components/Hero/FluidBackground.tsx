import React, { useEffect, useRef } from 'react';
import webGLFluidEnhanced from 'webgl-fluid';
import { useTheme } from '@/contexts/ThemeContext';

export const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Touch devices can't hover-trigger the sim, so run it at a much lower resolution
      const isLowPower = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;

      webGLFluidEnhanced(canvas, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: isLowPower ? 64 : 128,
        DYE_RESOLUTION: isLowPower ? 256 : 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 4,
        VELOCITY_DISSIPATION: 2,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        SPLAT_RADIUS: 0.15,
        SPLAT_FORCE: 4000,
        SHADING: !isLowPower,
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

    // webgl-fluid has no destroy API and its rAF loop never stops. Release the GL
    // context on unmount / theme change so old loops stop rendering to a detached canvas.
    // Deferred + isConnected check: StrictMode re-runs effects on the same (still mounted) canvas.
    return () => {
      setTimeout(() => {
        if (!canvas || canvas.isConnected) return;
        const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
      }, 0);
    };
  }, [isDark]);

  return (
    <canvas
      key={theme}
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 opacity-80 md:opacity-100 pointer-events-none md:pointer-events-auto"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
