import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Wireframe } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

export const FloatingTech = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle constant rotation
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;

      // Pulse effect on hover
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float
      speed={2} 
      rotationIntensity={1} 
      floatIntensity={2} 
      floatingRange={[-0.1, 0.1]}
    >
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial 
          color={isDark ? (hovered ? "#2dd4bf" : "#14b8a6") : (hovered ? "#0e7490" : "#155e75")} 
          wireframe={true}
          emissive={isDark ? "#14b8a6" : "#155e75"}
          emissiveIntensity={hovered ? 0.8 : 0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner glowing core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={isDark ? "#0f766e" : "#164e63"}
          emissive={isDark ? "#0f766e" : "#164e63"}
          emissiveIntensity={1}
          transparent
          opacity={isDark ? 0.9 : 0.7}
        />
      </mesh>
    </Float>
  );
};
