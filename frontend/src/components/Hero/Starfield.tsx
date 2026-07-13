import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';

export const Starfield = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80 md:opacity-100 hidden dark:block">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: true, antialias: false }} // antialias false for performance since they are just stars
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          {/* Base tiny stars */}
          <Stars 
            radius={100} 
            depth={50} 
            count={3000} 
            factor={6} 
            saturation={0} 
            fade 
            speed={1.5} 
          />
          {/* Brighter glowing sparkles (yulduzlar) */}
          <Sparkles 
            count={150} 
            scale={15} 
            size={5} 
            speed={0.8} 
            opacity={0.8}
            color="#fff" // Bright white
            noise={1}
          />
          <Sparkles 
            count={50} 
            scale={10} 
            size={10} 
            speed={1} 
            opacity={1}
            color="#2dd4bf" // Teal glowing stars
            noise={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
