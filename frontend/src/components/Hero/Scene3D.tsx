import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Sparkles } from '@react-three/drei';
import { FloatingTech } from './FloatingTech';

export const Scene3D = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto opacity-50 md:opacity-100">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} color="#2dd4bf" intensity={2} />

          {/* Environment for nice reflections */}
          <Environment preset="city" />

          {/* Sparkles / Particles for Wow-effect */}
          <Sparkles 
            count={200} 
            scale={12} 
            size={3} 
            speed={0.4} 
            opacity={0.4}
            color="#2dd4bf"
            noise={1}
          />

          {/* The main 3D object */}
          <FloatingTech />

          {/* Controls to let user drag and look around slightly */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
