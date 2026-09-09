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
          color={isDark ? (hovered ? "#7ba6dc" : "#5e8ecb") : (hovered ? "#2b4c7e" : "#1a365d")} 
          wireframe={true}
          emissive={isDark ? "#5e8ecb" : "#1a365d"}
          emissiveIntensity={hovered ? 0.8 : 0.25}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner glowing core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={isDark ? "#4a78b5" : "#10233d"}
          emissive={isDark ? "#4a78b5" : "#10233d"}
          emissiveIntensity={1}
          transparent
          opacity={isDark ? 0.9 : 0.75}
        />
      </mesh>
    </Float>
  );
};
