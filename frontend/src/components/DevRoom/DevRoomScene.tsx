import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { RoomObjects } from './RoomObjects';

export type CameraPreset = 'orbit' | 'monitor' | 'pc' | 'cozy';

interface DevRoomSceneProps {
  rgbColor: string;
  lightingMood: 'neon' | 'night' | 'sunset';
  cameraPreset: CameraPreset;
  autoRotate: boolean;
  monitorMode: number;
  onCoffeeClick: () => void;
  onPcClick: () => void;
  onMonitorClick: () => void;
  onNeonClick: () => void;
  onKeyboardClick: () => void;
  onChairClick: () => void;
}

// Camera Positions for each cinematic preset
const CAMERA_CONFIGS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  orbit: { pos: [4.4, 3.8, 5.2], target: [0, 1.2, -0.3] },
  monitor: { pos: [0, 2.15, 1.4], target: [0, 2.15, -0.4] },
  pc: { pos: [2.2, 2.4, 1.5], target: [1.6, 1.98, 0.1] },
  cozy: { pos: [-1.6, 2.2, 1.5], target: [-1.0, 1.8, -0.4] },
};

const CameraController: React.FC<{ cameraPreset: CameraPreset; autoRotate: boolean }> = ({ cameraPreset, autoRotate }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const targetConfig = CAMERA_CONFIGS[cameraPreset];

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // Smooth Lerp Camera Position
    const destPos = new THREE.Vector3(...targetConfig.pos);
    const destTarget = new THREE.Vector3(...targetConfig.target);

    camera.position.lerp(destPos, delta * 3.5);
    controlsRef.current.target.lerp(destTarget, delta * 3.5);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      autoRotate={autoRotate && cameraPreset === 'orbit'}
      autoRotateSpeed={0.8}
      enablePan={false}
      minDistance={1.8}
      maxDistance={8.5}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.05}
      minAzimuthAngle={-Math.PI / 2.5}
      maxAzimuthAngle={Math.PI / 2.5}
      target={[0, 1.2, -0.3]}
    />
  );
};

export const DevRoomScene: React.FC<DevRoomSceneProps> = ({
  rgbColor,
  lightingMood,
  cameraPreset,
  autoRotate,
  monitorMode,
  onCoffeeClick,
  onPcClick,
  onMonitorClick,
  onNeonClick,
  onKeyboardClick,
  onChairClick,
}) => {
  // Mood lighting configurations
  const moodConfig = {
    neon: {
      ambient: '#0b1329',
      ambientIntensity: 0.65,
      mainLight: '#38bdf8',
      mainIntensity: 1.8,
      secondaryLight: '#c084fc',
      secondaryIntensity: 2.0,
      sparkleColor: '#38bdf8',
    },
    night: {
      ambient: '#040714',
      ambientIntensity: 0.45,
      mainLight: '#22d3ee',
      mainIntensity: 1.2,
      secondaryLight: '#3b82f6',
      secondaryIntensity: 1.5,
      sparkleColor: '#2dd4bf',
    },
    sunset: {
      ambient: '#1c120c',
      ambientIntensity: 0.75,
      mainLight: '#fbbf24',
      mainIntensity: 2.4,
      secondaryLight: '#f43f5e',
      secondaryIntensity: 1.8,
      sparkleColor: '#fbbf24',
    },
  };

  const currentMood = moodConfig[lightingMood];

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        shadows
        camera={{ position: [4.4, 3.8, 5.2], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          {/* Ambient Lighting */}
          <ambientLight color={currentMood.ambient} intensity={currentMood.ambientIntensity} />

          {/* Key Directional Shadow Caster */}
          <directionalLight
            position={[6, 9, 5]}
            color={currentMood.mainLight}
            intensity={currentMood.mainIntensity}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={16}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
            shadow-bias={-0.0001}
          />

          {/* Secondary Fill Light */}
          <pointLight
            position={[-4.5, 4.5, 2.5]}
            color={currentMood.secondaryLight}
            intensity={currentMood.secondaryIntensity}
            distance={10}
          />

          {/* Warm Desk Spotlight */}
          <spotLight
            position={[0, 5.0, 0.2]}
            target-position={[0, 1.4, -0.2]}
            angle={0.65}
            penumbra={0.8}
            intensity={1.4}
            color={lightingMood === 'sunset' ? '#fef08a' : '#e0f2fe'}
            distance={7}
          />

          {/* Ambient Dust Sparkles */}
          <Sparkles
            count={45}
            scale={7}
            size={3.2}
            speed={0.45}
            opacity={0.65}
            color={currentMood.sparkleColor}
          />

          {/* 3D Room Meshes */}
          <RoomObjects
            rgbColor={rgbColor}
            lightingMood={lightingMood}
            monitorMode={monitorMode}
            onCoffeeClick={onCoffeeClick}
            onPcClick={onPcClick}
            onMonitorClick={onMonitorClick}
            onNeonClick={onNeonClick}
            onKeyboardClick={onKeyboardClick}
            onChairClick={onChairClick}
          />

          {/* Smooth Camera Controller */}
          <CameraController cameraPreset={cameraPreset} autoRotate={autoRotate} />
        </Suspense>
      </Canvas>
    </div>
  );
};
