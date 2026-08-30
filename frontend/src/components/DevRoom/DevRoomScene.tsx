import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { RoomObjects } from './RoomObjects';

export type CameraPreset = 'orbit' | 'monitor' | 'pc' | 'cat' | 'lamp' | 'cozy' | 'window';

interface DevRoomSceneProps {
  rgbColor: string;
  lightingMood: 'neon' | 'night' | 'sunset' | 'matrix';
  cameraPreset: CameraPreset;
  autoRotate: boolean;
  monitorMode: number;
  hologramIndex: number;
  lampOn: boolean;
  keyboardFlashTrigger: number;
  onCoffeeClick: () => void;
  onPcClick: () => void;
  onMonitorClick: () => void;
  onNeonClick: () => void;
  onKeyboardClick: () => void;
  onChairClick: () => void;
  onPhoneClick: () => void;
  onHologramClick: () => void;
  onCatClick: () => void;
  onLampClick: () => void;
}

// Camera Positions for each cinematic preset
const CAMERA_CONFIGS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  orbit: { pos: [4.4, 3.8, 5.2], target: [0, 1.2, -0.3] },
  monitor: { pos: [0, 2.15, 1.35], target: [0, 2.15, -0.4] },
  pc: { pos: [2.2, 2.3, 1.4], target: [1.58, 1.95, 0.08] },
  cat: { pos: [-2.1, 0.95, 1.45], target: [-1.75, 0.25, 0.45] },
  lamp: { pos: [0, 2.5, 1.45], target: [0, 1.6, -0.1] },
  cozy: { pos: [-1.6, 2.2, 1.5], target: [-1.0, 1.8, -0.4] },
  window: { pos: [-3.2, 2.8, 3.2], target: [-5.4, 3.2, 0] },
};

const CameraController: React.FC<{ cameraPreset: CameraPreset; autoRotate: boolean }> = ({ cameraPreset, autoRotate }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const targetConfig = CAMERA_CONFIGS[cameraPreset] || CAMERA_CONFIGS.orbit;

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
      minDistance={1.6}
      maxDistance={8.8}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.05}
      minAzimuthAngle={-Math.PI / 2.2}
      maxAzimuthAngle={Math.PI / 2.2}
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
  hologramIndex,
  lampOn,
  keyboardFlashTrigger,
  onCoffeeClick,
  onPcClick,
  onMonitorClick,
  onNeonClick,
  onKeyboardClick,
  onChairClick,
  onPhoneClick,
  onHologramClick,
  onCatClick,
  onLampClick,
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
      windowLight: '#38bdf8',
      sparkleColor: '#38bdf8',
    },
    night: {
      ambient: '#040714',
      ambientIntensity: 0.45,
      mainLight: '#22d3ee',
      mainIntensity: 1.2,
      secondaryLight: '#3b82f6',
      secondaryIntensity: 1.5,
      windowLight: '#60a5fa',
      sparkleColor: '#2dd4bf',
    },
    sunset: {
      ambient: '#1c120c',
      ambientIntensity: 0.8,
      mainLight: '#fbbf24',
      mainIntensity: 2.6,
      secondaryLight: '#f43f5e',
      secondaryIntensity: 1.8,
      windowLight: '#f97316',
      sparkleColor: '#fbbf24',
    },
    matrix: {
      ambient: '#021208',
      ambientIntensity: 0.75,
      mainLight: '#22c55e',
      mainIntensity: 2.2,
      secondaryLight: '#10b981',
      secondaryIntensity: 2.4,
      windowLight: '#22c55e',
      sparkleColor: '#4ade80',
    },
  };

  const currentMood = moodConfig[lightingMood] || moodConfig.neon;

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

          {/* Window Light Influx (Golden Sunbeam / Cyber Moonbeam) */}
          <directionalLight
            position={[-8, 4.5, 1]}
            color={currentMood.windowLight}
            intensity={lightingMood === 'sunset' ? 3.0 : 1.8}
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />

          {/* Secondary Fill Light */}
          <pointLight
            position={[-4.5, 4.5, 2.5]}
            color={currentMood.secondaryLight}
            intensity={currentMood.secondaryIntensity}
            distance={10}
          />

          {/* Warm Desk Spotlight (Linked with lampOn) */}
          {lampOn && (
            <spotLight
              position={[0, 5.0, 0.2]}
              target-position={[0, 1.4, -0.2]}
              angle={0.65}
              penumbra={0.8}
              intensity={1.5}
              color={lightingMood === 'sunset' ? '#fef08a' : (lightingMood === 'matrix' ? '#86efac' : '#e0f2fe')}
              distance={7}
            />
          )}

          {/* Ambient Dust Sparkles / Golden Sun Motes / Matrix Particles */}
          <Sparkles
            count={lightingMood === 'sunset' ? 70 : (lightingMood === 'matrix' ? 80 : 50)}
            scale={8.5}
            size={lightingMood === 'sunset' ? 3.8 : 3.2}
            speed={lightingMood === 'sunset' ? 0.35 : 0.6}
            opacity={0.7}
            color={currentMood.sparkleColor}
          />

          {/* Photorealistic Soft Contact Shadows */}
          <ContactShadows
            position={[0, -0.59, 0]}
            opacity={0.82}
            scale={12}
            blur={2.2}
            far={4.5}
            color={lightingMood === 'matrix' ? '#021808' : '#020617'}
          />

          {/* 3D Room Meshes */}
          <RoomObjects
            rgbColor={rgbColor}
            lightingMood={lightingMood}
            monitorMode={monitorMode}
            hologramIndex={hologramIndex}
            lampOn={lampOn}
            keyboardFlashTrigger={keyboardFlashTrigger}
            onCoffeeClick={onCoffeeClick}
            onPcClick={onPcClick}
            onMonitorClick={onMonitorClick}
            onNeonClick={onNeonClick}
            onKeyboardClick={onKeyboardClick}
            onChairClick={onChairClick}
            onPhoneClick={onPhoneClick}
            onHologramClick={onHologramClick}
            onCatClick={onCatClick}
            onLampClick={onLampClick}
          />

          {/* Smooth Camera Controller */}
          <CameraController cameraPreset={cameraPreset} autoRotate={autoRotate} />
        </Suspense>
      </Canvas>
    </div>
  );
};

