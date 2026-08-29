import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface RoomObjectsProps {
  rgbColor: string;
  lightingMood: 'neon' | 'night' | 'sunset';
  onCoffeeClick: () => void;
  onPcClick: () => void;
  onMonitorClick: () => void;
  onNeonClick: () => void;
}

export const RoomObjects: React.FC<RoomObjectsProps> = ({
  rgbColor,
  lightingMood,
  onCoffeeClick,
  onPcClick,
  onMonitorClick,
  onNeonClick,
}) => {
  const fanRef1 = useRef<THREE.Group>(null);
  const fanRef2 = useRef<THREE.Group>(null);
  const speakerPulseRef1 = useRef<THREE.Mesh>(null);
  const speakerPulseRef2 = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Points>(null);
  const [monitorMode, setMonitorMode] = useState<number>(0);
  const [neonActive, setNeonActive] = useState<boolean>(true);

  // Animated Code Texture on canvas
  const { codeTexture, matrixTexture } = useMemo(() => {
    // Code Canvas
    const canvas1 = document.createElement('canvas');
    canvas1.width = 512;
    canvas1.height = 256;
    const ctx1 = canvas1.getContext('2d')!;
    ctx1.fillStyle = '#0f172a';
    ctx1.fillRect(0, 0, 512, 256);
    ctx1.font = '14px monospace';
    
    // Syntax lines
    const lines = [
      { t: "import { Fastify, Redis, Postgres } from '@artikov/core';", c: "#f472b6" },
      { t: "const cluster = new DistributedSystem({ nodes: 12 });", c: "#38bdf8" },
      { t: "await cluster.connect({ ssl: true, timeout: 2000 });", c: "#4ade80" },
      { t: "export const handler = async (event: Request) => {", c: "#fbbf24" },
      { t: "  const cached = await Redis.get(event.cacheKey);", c: "#a78bfa" },
      { t: "  if (cached) return Response.json(cached);", c: "#38bdf8" },
      { t: "  const data = await Postgres.query('SELECT * FROM live');", c: "#4ade80" },
      { t: "  await Redis.set(event.cacheKey, data, { ttl: 3600 });", c: "#f472b6" },
      { t: "  return Response.json({ success: true, data });", c: "#34d399" },
      { t: "}; // 🚀 High Performance Ready", c: "#64748b" },
    ];
    lines.forEach((l, i) => {
      ctx1.fillStyle = l.c;
      ctx1.fillText(l.t, 20, 30 + i * 22);
    });
    const tex1 = new THREE.CanvasTexture(canvas1);

    // Matrix Canvas
    const canvas2 = document.createElement('canvas');
    canvas2.width = 512;
    canvas2.height = 256;
    const ctx2 = canvas2.getContext('2d')!;
    ctx2.fillStyle = '#050c08';
    ctx2.fillRect(0, 0, 512, 256);
    ctx2.font = '12px monospace';
    ctx2.fillStyle = '#22c55e';
    for (let i = 0; i < 20; i++) {
      ctx2.fillText(`[ROMA_SYS] ONLINE :: THREAD_${i} ACTIVE :: LATENCY 0.4ms :: 60FPS`, 15, 20 + i * 12);
    }
    const tex2 = new THREE.CanvasTexture(canvas2);

    return { codeTexture: tex1, matrixTexture: tex2 };
  }, []);

  // Steam particles
  const steamParticles = useMemo(() => {
    const count = 35;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.08;
      pos[i * 3 + 1] = Math.random() * 0.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    }
    return pos;
  }, []);

  // Animate fans, speakers, steam
  useFrame((state, delta) => {
    if (fanRef1.current) fanRef1.current.rotation.z += delta * 12;
    if (fanRef2.current) fanRef2.current.rotation.z += delta * 12;

    // Pulse speakers
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.05;
    if (speakerPulseRef1.current) speakerPulseRef1.current.scale.set(pulse, pulse, 1);
    if (speakerPulseRef2.current) speakerPulseRef2.current.scale.set(pulse, pulse, 1);

    // Animate steam particles
    if (steamRef.current) {
      const positions = steamRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += delta * 0.2;
        if (positions[i * 3 + 1] > 0.45) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 0.08;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
        }
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      {/* ================= FLOOR & WALLS ================= */}
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial 
          color={lightingMood === 'sunset' ? '#1c1917' : '#090d16'} 
          roughness={0.8} 
          metalness={0.2} 
        />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 3, -4]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial 
          color={lightingMood === 'sunset' ? '#1e1b18' : '#0c101d'} 
          roughness={0.9} 
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-5, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial 
          color={lightingMood === 'sunset' ? '#1a1614' : '#0a0e1a'} 
          roughness={0.9} 
        />
      </mesh>

      {/* Stylish Acoustic Wall Panels */}
      {[-2, -0.7, 0.6, 1.9].map((x, i) => (
        <mesh key={i} position={[x, 3.2, -3.95]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2.2, 0.06]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#131b2e' : '#1e293b'} 
            roughness={0.7} 
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* ================= NEON SIGN ================= */}
      <group 
        position={[0, 4.4, -3.92]} 
        onClick={() => {
          setNeonActive(!neonActive);
          onNeonClick();
        }}
      >
        {/* Glow backing */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[3.6, 0.7, 0.04]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        <Text
          fontSize={0.32}
          color={neonActive ? rgbColor : '#334155'}
          anchorX="center"
          anchorY="middle"
        >
          {"< ARTIKOV.DEV />"}
        </Text>
        {neonActive && (
          <pointLight color={rgbColor} intensity={2.5} distance={4} />
        )}
      </group>

      {/* ================= FLOATING WALL SHELF ================= */}
      <group position={[-2.8, 3.0, -3.8]}>
        {/* Shelf board */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.08, 0.4]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
        </mesh>
        
        {/* Books on shelf */}
        <group position={[-0.8, 0.35, 0]}>
          <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.12, 0.6, 0.3]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0.16, 0, 0]} rotation={[0, 0, -0.03]}>
            <boxGeometry args={[0.15, 0.55, 0.28]} />
            <meshStandardMaterial color="#10b981" roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0.34, 0, 0]}>
            <boxGeometry args={[0.14, 0.65, 0.32]} />
            <meshStandardMaterial color="#a855f7" roughness={0.3} />
          </mesh>
        </group>

        {/* Bonsai / Succulent Pot on Shelf */}
        <group position={[0.7, 0.25, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.2, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.18, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* ================= DEVELOPER WORKSPACE DESK ================= */}
      <group position={[0, 0, -1.2]}>
        {/* Desk Top */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 0.1, 2.0]} />
          <meshStandardMaterial 
            color={lightingMood === 'sunset' ? '#292524' : '#0f172a'} 
            roughness={0.3} 
            metalness={0.2} 
          />
        </mesh>

        {/* Desk Pad / Mat */}
        <mesh position={[0, 1.455, 0.1]} receiveShadow>
          <boxGeometry args={[3.2, 0.01, 1.3]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>

        {/* Desk Metal Legs */}
        {[
          [-2.0, 0.7, -0.8],
          [2.0, 0.7, -0.8],
          [-2.0, 0.7, 0.8],
          [2.0, 0.7, 0.8],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 1.4, 0.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Cable Management Beam */}
        <mesh position={[0, 1.3, -0.7]}>
          <boxGeometry args={[3.8, 0.08, 0.08]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* ================= DUAL CURVED MONITORS ================= */}
        {/* Main Center Ultra-wide Monitor */}
        <group 
          position={[0, 2.3, -0.4]} 
          onClick={() => {
            setMonitorMode((prev) => (prev + 1) % 2);
            onMonitorClick();
          }}
        >
          {/* Monitor Stand Base */}
          <mesh position={[0, -0.85, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.35, 0.03, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.45, -0.1]} castShadow>
            <boxGeometry args={[0.08, 0.8, 0.08]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
          </mesh>

          {/* Monitor Frame */}
          <mesh castShadow>
            <boxGeometry args={[2.5, 1.25, 0.08]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Active Screen Display */}
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[2.4, 1.15]} />
            <meshBasicMaterial map={monitorMode === 0 ? codeTexture : matrixTexture} />
          </mesh>

          {/* Screen Ambient Glow */}
          <pointLight color={rgbColor} intensity={0.9} distance={2.5} position={[0, 0, 0.5]} />
        </group>

        {/* Side Vertical Secondary Monitor */}
        <group position={[-1.75, 2.35, -0.2]} rotation={[0, 0.35, 0]}>
          {/* Stand */}
          <mesh position={[0, -0.85, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 0.03, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.45, -0.05]} castShadow>
            <boxGeometry args={[0.06, 0.8, 0.06]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Vertical Frame */}
          <mesh castShadow>
            <boxGeometry args={[0.9, 1.5, 0.06]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          {/* Vertical Screen */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.82, 1.42]} />
            <meshBasicMaterial map={matrixTexture} />
          </mesh>
        </group>

        {/* ================= MECHANICAL KEYBOARD & MOUSE ================= */}
        {/* Keyboard Base */}
        <group position={[0, 1.48, 0.3]}>
          <mesh castShadow>
            <boxGeometry args={[1.1, 0.035, 0.35]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Keycaps cluster */}
          <mesh position={[0, 0.025, 0]}>
            <boxGeometry args={[1.02, 0.02, 0.3]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
          {/* RGB Underglow */}
          <pointLight color={rgbColor} intensity={0.4} distance={0.6} position={[0, 0.05, 0]} />
        </group>

        {/* Ergonomic Gaming Mouse */}
        <mesh position={[0.9, 1.48, 0.3]} castShadow>
          <boxGeometry args={[0.16, 0.05, 0.26]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* ================= STUDIO AUDIO SPEAKERS ================= */}
        {/* Left Speaker */}
        <group position={[-1.6, 1.8, -0.6]} rotation={[0, 0.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.35, 0.65, 0.35]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
          {/* Pulsing Membrane */}
          <mesh ref={speakerPulseRef1} position={[0, 0.05, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.02, 24]} />
            <meshStandardMaterial color={rgbColor} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.16, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 24]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>

        {/* Right Speaker */}
        <group position={[1.6, 1.8, -0.6]} rotation={[0, -0.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.35, 0.65, 0.35]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>
          {/* Pulsing Membrane */}
          <mesh ref={speakerPulseRef2} position={[0, 0.05, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.02, 24]} />
            <meshStandardMaterial color={rgbColor} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.16, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 24]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        </group>


        {/* ================= STEAMING COFFEE MUG ================= */}
        <group 
          position={[-0.85, 1.46, 0.4]} 
          onClick={onCoffeeClick}
        >
          {/* Mug Cup */}
          <mesh castShadow position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.1, 0.08, 0.22, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          {/* Coffee liquid */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.02, 24]} />
            <meshStandardMaterial color="#3e2723" roughness={0.1} />
          </mesh>
          {/* Mug Handle */}
          <mesh position={[-0.12, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.06, 0.02, 12, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
          {/* Steam Particles */}
          <points ref={steamRef} position={[0, 0.25, 0]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[steamParticles, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.035}
              color="#ffffff"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>

        {/* ================= HIGH-END RGB CUSTOM PC TOWER ================= */}
        <group 
          position={[1.55, 1.95, 0.1]} 
          onClick={onPcClick}
        >
          {/* PC Chassis (Matte Black) */}
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.95, 0.9]} />
            <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.8} />
          </mesh>

          {/* Tempered Glass Side Panel (Transparent) */}
          <mesh position={[-0.26, 0, 0]}>
            <boxGeometry args={[0.02, 0.9, 0.85]} />
            <meshPhysicalMaterial 
              color="#020617" 
              transparent 
              opacity={0.35} 
              roughness={0.1} 
              metalness={0.1}
              transmission={0.8}
            />
          </mesh>

          {/* Glowing Graphics Card / GPU inside */}
          <mesh position={[-0.05, -0.15, 0]} castShadow>
            <boxGeometry args={[0.3, 0.12, 0.55]} />
            <meshStandardMaterial color={rgbColor} roughness={0.2} />
          </mesh>

          {/* Dual RGB Front Intake Fans */}
          <group ref={fanRef1} position={[0, 0.2, 0.46]}>
            <mesh>
              <torusGeometry args={[0.15, 0.02, 12, 32]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.26, 0.04, 0.01]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
          </group>

          <group ref={fanRef2} position={[0, -0.2, 0.46]}>
            <mesh>
              <torusGeometry args={[0.15, 0.02, 12, 32]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.26, 0.04, 0.01]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
          </group>

          {/* Internal RGB Lighting */}
          <pointLight color={rgbColor} intensity={2.8} distance={2.5} position={[-0.1, 0, 0]} />
        </group>
      </group>

      {/* ================= ERGONOMIC DEVELOPER CHAIR ================= */}
      <group position={[0, 0.9, 0.5]} rotation={[0, -0.25, 0]}>
        {/* Seat Cushion */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.85, 0.12, 0.85]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Chair Backrest */}
        <mesh position={[0, 0.65, 0.38]} rotation={[-0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.75, 1.15, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* Headrest */}
        <mesh position={[0, 1.3, 0.46]} castShadow>
          <boxGeometry args={[0.45, 0.2, 0.08]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Metal Base Cylinder */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* 5 Star Wheels Base */}
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.05, 5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
