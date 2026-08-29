import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { RoomObjects } from './RoomObjects';

interface DevRoomSceneProps {
  rgbColor: string;
  lightingMood: 'neon' | 'night' | 'sunset';
  autoRotate: boolean;
  onCoffeeClick: () => void;
  onPcClick: () => void;
  onMonitorClick: () => void;
  onNeonClick: () => void;
}

export const DevRoomScene: React.FC<DevRoomSceneProps> = ({
  rgbColor,
  lightingMood,
  autoRotate,
  onCoffeeClick,
  onPcClick,
  onMonitorClick,
  onNeonClick,
}) => {
  // Mood lighting configurations
  const moodConfig = {
    neon: {
      ambient: '#0e1726',
      ambientIntensity: 0.6,
      mainLight: '#38bdf8',
      mainIntensity: 1.5,
      secondaryLight: '#c084fc',
      secondaryIntensity: 1.8,
      sparkleColor: '#38bdf8',
    },
    night: {
      ambient: '#050811',
      ambientIntensity: 0.4,
      mainLight: '#22d3ee',
      mainIntensity: 1.0,
      secondaryLight: '#3b82f6',
      secondaryIntensity: 1.2,
      sparkleColor: '#2dd4bf',
    },
    sunset: {
      ambient: '#1c130d',
      ambientIntensity: 0.7,
      mainLight: '#fbbf24',
      mainIntensity: 2.2,
      secondaryLight: '#f43f5e',
      secondaryIntensity: 1.5,
      sparkleColor: '#fbbf24',
    },
  };

  const currentMood = moodConfig[lightingMood];

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        shadows
        camera={{ position: [4.2, 3.8, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Ambient light based on mood */}
          <ambientLight color={currentMood.ambient} intensity={currentMood.ambientIntensity} />

          {/* Key Directional Shadow Caster */}
          <directionalLight
            position={[5, 8, 4]}
            color={currentMood.mainLight}
            intensity={currentMood.mainIntensity}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={15}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
            shadow-bias={-0.0001}
          />

          {/* Secondary Fill Colored Light */}
          <pointLight
            position={[-4, 4, 2]}
            color={currentMood.secondaryLight}
            intensity={currentMood.secondaryIntensity}
            distance={8}
          />

          {/* Desk Warm Spotlight */}
          <spotLight
            position={[0, 4.5, 0]}
            target-position={[0, 1.4, -0.2]}
            angle={0.6}
            penumbra={0.8}
            intensity={1.2}
            color={lightingMood === 'sunset' ? '#fef08a' : '#e0f2fe'}
            distance={6}
          />

          {/* Subtle Ambient Dust Sparkles */}
          <Sparkles
            count={40}
            scale={6}
            size={3}
            speed={0.4}
            opacity={0.6}
            color={currentMood.sparkleColor}
          />

          {/* The 3D Room Objects */}
          <RoomObjects
            rgbColor={rgbColor}
            lightingMood={lightingMood}
            onCoffeeClick={onCoffeeClick}
            onPcClick={onPcClick}
            onMonitorClick={onMonitorClick}
            onNeonClick={onNeonClick}
          />

          {/* Constrained Camera Orbit Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            enablePan={false}
            minDistance={3.5}
            maxDistance={8.0}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.05}
            minAzimuthAngle={-Math.PI / 3}
            maxAzimuthAngle={Math.PI / 3}
            target={[0, 1.2, -0.3]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
