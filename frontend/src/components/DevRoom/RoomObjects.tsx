import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface RoomObjectsProps {
  rgbColor: string;
  lightingMood: 'neon' | 'night' | 'sunset';
  monitorMode: number;
  onCoffeeClick: () => void;
  onPcClick: () => void;
  onMonitorClick: () => void;
  onNeonClick: () => void;
  onKeyboardClick: () => void;
  onChairClick: () => void;
  onPhoneClick: () => void;
}

export const RoomObjects: React.FC<RoomObjectsProps> = ({
  rgbColor,
  lightingMood,
  monitorMode,
  onCoffeeClick,
  onPcClick,
  onMonitorClick,
  onNeonClick,
  onKeyboardClick,
  onChairClick,
  onPhoneClick,
}) => {
  const fanRef1 = useRef<THREE.Group>(null);
  const fanRef2 = useRef<THREE.Group>(null);
  const speakerPulseRef1 = useRef<THREE.Mesh>(null);
  const speakerPulseRef2 = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Points>(null);
  const chairRef = useRef<THREE.Group>(null);
  const keyboardGlowRef = useRef<THREE.PointLight>(null);
  const gpuGlowRef = useRef<THREE.PointLight>(null);
  const phoneGlowRef = useRef<THREE.PointLight>(null);

  const [neonActive, setNeonActive] = useState<boolean>(true);
  const [chairTargetRot, setChairTargetRot] = useState<number>(-0.25);
  const [keyboardFlash, setKeyboardFlash] = useState<number>(0);

  // Dynamic Animated Canvases
  const canvasRefs = useMemo(() => {
    // 1. VS Code Live Typer Canvas
    const c1 = document.createElement('canvas');
    c1.width = 640;
    c1.height = 360;
    const ctx1 = c1.getContext('2d')!;

    // 2. Matrix Rain Canvas
    const c2 = document.createElement('canvas');
    c2.width = 640;
    c2.height = 360;
    const ctx2 = c2.getContext('2d')!;

    // 3. System Telemetry Dashboard
    const c3 = document.createElement('canvas');
    c3.width = 640;
    c3.height = 360;
    const ctx3 = c3.getContext('2d')!;

    // 4. GitHub Terminal Canvas
    const c4 = document.createElement('canvas');
    c4.width = 640;
    c4.height = 360;
    const ctx4 = c4.getContext('2d')!;

    // 5. Smartphone OLED Screen Canvas
    const cPhone = document.createElement('canvas');
    cPhone.width = 256;
    cPhone.height = 512;
    const ctxPhone = cPhone.getContext('2d')!;

    const tex1 = new THREE.CanvasTexture(c1);
    const tex2 = new THREE.CanvasTexture(c2);
    const tex3 = new THREE.CanvasTexture(c3);
    const tex4 = new THREE.CanvasTexture(c4);
    const texPhone = new THREE.CanvasTexture(cPhone);

    return { c1, ctx1, tex1, c2, ctx2, tex2, c3, ctx3, tex3, c4, ctx4, tex4, cPhone, ctxPhone, texPhone };
  }, []);

  // Matrix column drops
  const matrixColumns = useMemo(() => {
    const cols = 40;
    return Array.from({ length: cols }, () => Math.floor(Math.random() * 30));
  }, []);

  // Code snippets for typing
  const codeLines = useMemo(() => [
    { t: "import { Fastify, Redis, Postgres } from '@artikov/core';", c: "#f472b6" },
    { t: "import { DistributedCluster, AIAgent } from '@deepmind/node';", c: "#38bdf8" },
    { t: "const cluster = new DistributedCluster({ nodes: 16, gpu: true });", c: "#4ade80" },
    { t: "await cluster.connect({ ssl: true, timeout: 3000 });", c: "#fbbf24" },
    { t: "", c: "#ffffff" },
    { t: "export const handleRequest = async (req: Request) => {", c: "#a78bfa" },
    { t: "  const cached = await Redis.get(req.cacheKey);", c: "#38bdf8" },
    { t: "  if (cached) return Response.json(cached);", c: "#34d399" },
    { t: "  const data = await Postgres.query('SELECT * FROM live_system');", c: "#4ade80" },
    { t: "  await Redis.set(req.cacheKey, data, { ttl: 3600 });", c: "#f472b6" },
    { t: "  return Response.json({ success: true, latency: '0.2ms' });", c: "#38bdf8" },
    { t: "}; // 🚀 Antigravity Core 2026 Engine Ready", c: "#64748b" },
  ], []);

  // Steam particles
  const steamParticles = useMemo(() => {
    const count = 45;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.09;
      pos[i * 3 + 1] = Math.random() * 0.45;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.09;
    }
    return pos;
  }, []);

  // City skyscrapers procedural building coordinates
  const cityBuildings = useMemo(() => {
    const list = [];
    const heights = [3.5, 4.8, 6.2, 5.0, 7.1, 4.2, 5.8, 6.5, 3.8, 5.4, 6.8, 4.5];
    for (let i = 0; i < heights.length; i++) {
      list.push({
        x: -7.5 - (i % 3) * 1.8,
        y: heights[i] / 2 - 1.0,
        z: -4.5 + (i * 0.95),
        w: 0.9 + (i % 2) * 0.4,
        h: heights[i],
        d: 0.9 + (i % 3) * 0.3,
        color: (i % 2 === 0) ? '#09101f' : '#0e172e',
        lightColor: (i % 3 === 0) ? '#38bdf8' : (i % 3 === 1) ? '#ec4899' : '#eab308'
      });
    }
    return list;
  }, []);

  // Animation Loop for Canvases & Objects
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 1. Fans rotation
    if (fanRef1.current) fanRef1.current.rotation.z += delta * 14;
    if (fanRef2.current) fanRef2.current.rotation.z += delta * 14;

    // 2. Speaker bass pulsing
    const pulse = 1 + Math.sin(time * 8) * 0.06;
    if (speakerPulseRef1.current) speakerPulseRef1.current.scale.set(pulse, pulse, 1);
    if (speakerPulseRef2.current) speakerPulseRef2.current.scale.set(pulse, pulse, 1);

    // 3. GPU breathing glow
    if (gpuGlowRef.current) {
      gpuGlowRef.current.intensity = 2.0 + Math.sin(time * 4) * 0.8;
    }

    // 4. Keyboard flash decay
    if (keyboardFlash > 0) {
      setKeyboardFlash(prev => Math.max(0, prev - delta * 4));
    }
    if (keyboardGlowRef.current) {
      keyboardGlowRef.current.intensity = 0.5 + keyboardFlash * 2.5;
    }

    // 5. Chair smooth rotation lerp
    if (chairRef.current) {
      chairRef.current.rotation.y = THREE.MathUtils.lerp(
        chairRef.current.rotation.y,
        chairTargetRot,
        0.08
      );
    }

    // 6. Steaming coffee particles
    if (steamRef.current) {
      const positions = steamRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += delta * 0.25;
        if (positions[i * 3 + 1] > 0.5) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 0.09;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.09;
        }
      }
      steamRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 7. Dynamic Canvas Rendering
    const { ctx1, c1, tex1, ctx2, c2, tex2, ctx3, c3, tex3, ctx4, c4, tex4, ctxPhone, cPhone, texPhone } = canvasRefs;

    // Screen 1 (VS Code)
    ctx1.fillStyle = '#0a0f1d';
    ctx1.fillRect(0, 0, c1.width, c1.height);
    // Editor top bar
    ctx1.fillStyle = '#1e293b';
    ctx1.fillRect(0, 0, c1.width, 28);
    ctx1.fillStyle = '#ef4444'; ctx1.beginPath(); ctx1.arc(15, 14, 5, 0, Math.PI * 2); ctx1.fill();
    ctx1.fillStyle = '#eab308'; ctx1.beginPath(); ctx1.arc(32, 14, 5, 0, Math.PI * 2); ctx1.fill();
    ctx1.fillStyle = '#22c55e'; ctx1.beginPath(); ctx1.arc(49, 14, 5, 0, Math.PI * 2); ctx1.fill();
    ctx1.fillStyle = '#94a3b8'; ctx1.font = '11px sans-serif'; ctx1.fillText('src/server/cluster.ts — Visual Studio Code', 75, 18);

    ctx1.font = '13px "JetBrains Mono", Consolas, monospace';
    const activeLinesCount = Math.min(codeLines.length, Math.floor((time * 2.5) % (codeLines.length + 6)));
    for (let i = 0; i < activeLinesCount; i++) {
      ctx1.fillStyle = '#475569';
      ctx1.fillText(`${(i + 1).toString().padStart(2, ' ')}`, 14, 56 + i * 24);
      ctx1.fillStyle = codeLines[i].c;
      ctx1.fillText(codeLines[i].t, 45, 56 + i * 24);
    }
    // Blinking cursor
    if (Math.floor(time * 3) % 2 === 0 && activeLinesCount < codeLines.length) {
      ctx1.fillStyle = rgbColor;
      ctx1.fillRect(45 + codeLines[activeLinesCount]?.t?.length * 7.8 || 45, 42 + activeLinesCount * 24, 8, 16);
    }
    tex1.needsUpdate = true;

    // Screen 2 (Matrix Rain)
    ctx2.fillStyle = 'rgba(5, 12, 8, 0.2)';
    ctx2.fillRect(0, 0, c2.width, c2.height);
    ctx2.fillStyle = rgbColor || '#22c55e';
    ctx2.font = '14px monospace';
    const chars = '01ABCDEFRA2026$#%&*<>{}[]=+/';
    for (let i = 0; i < matrixColumns.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * 16 + 8;
      const y = matrixColumns[i] * 14;
      ctx2.fillText(char, x, y);
      if (y > c2.height && Math.random() > 0.96) {
        matrixColumns[i] = 0;
      }
      matrixColumns[i]++;
    }
    tex2.needsUpdate = true;

    // Screen 3 (System Telemetry & FPS)
    ctx3.fillStyle = '#060a12';
    ctx3.fillRect(0, 0, c3.width, c3.height);
    ctx3.fillStyle = '#1e293b';
    ctx3.fillRect(0, 0, c3.width, 32);
    ctx3.fillStyle = '#38bdf8';
    ctx3.font = 'bold 12px monospace';
    ctx3.fillText('● REAL-TIME NODE TELEMETRY CLUSTER', 20, 21);

    // Performance graph wave
    ctx3.strokeStyle = rgbColor;
    ctx3.lineWidth = 2.5;
    ctx3.beginPath();
    for (let x = 20; x < c3.width - 20; x += 6) {
      const y = 140 + Math.sin((x * 0.04) + (time * 5)) * 25 + Math.cos((x * 0.08) - (time * 3)) * 12;
      if (x === 20) ctx3.moveTo(x, y);
      else ctx3.lineTo(x, y);
    }
    ctx3.stroke();

    // Stats Grid
    ctx3.fillStyle = '#e2e8f0';
    ctx3.font = '12px monospace';
    ctx3.fillText(`CPU: 32 Cores @ 4.8GHz [Load: ${(35 + Math.sin(time) * 12).toFixed(1)}%]`, 25, 220);
    ctx3.fillText(`RAM: 64GB DDR5 [Used: ${(24.5 + Math.cos(time * 0.5) * 2).toFixed(1)}GB]`, 25, 250);
    ctx3.fillText(`FRAME RATE: 60.0 FPS • LATENCY: 0.28ms • NETWORK: 10Gbps`, 25, 280);
    ctx3.fillText(`ROMA_SYS V4.2.0 • STATUS: OPTIMAL & SCALED`, 25, 315);
    tex3.needsUpdate = true;

    // Screen 4 (GitHub Live Commits)
    ctx4.fillStyle = '#0d1117';
    ctx4.fillRect(0, 0, c4.width, c4.height);
    ctx4.fillStyle = '#161b22';
    ctx4.fillRect(0, 0, c4.width, 30);
    ctx4.fillStyle = '#58a6ff';
    ctx4.font = 'bold 12px monospace';
    ctx4.fillText('🐙 Artikov-dev/portfolio-core (main) — Git Stream', 20, 20);

    const commits = [
      'commit bc27f8f — fix: optimize Express 5 route handlers',
      'commit 6487eb6 — feat: migrate database to Neon Serverless PG',
      'commit 419df02 — feat: hyper-interactive 3D dev room',
      'commit 992ac1b — perf: instant cold-start resilience & socket upgrades',
      'commit 8812ef4 — feat: multi-lingual i18n & auto-translate',
      'commit 7149a0a — feat: dynamic 2FA authenticator & JWT',
    ];
    ctx4.font = '12px monospace';
    commits.forEach((c, idx) => {
      ctx4.fillStyle = idx === 0 ? '#3fb950' : '#8b949e';
      ctx4.fillText(`* ${c}`, 20, 65 + idx * 38);
    });
    tex4.needsUpdate = true;

    // Screen 5 (OLED Smartphone with Notifications)
    ctxPhone.fillStyle = '#030712';
    ctxPhone.fillRect(0, 0, cPhone.width, cPhone.height);

    // Status bar
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    ctxPhone.fillStyle = '#94a3b8';
    ctxPhone.font = 'bold 16px sans-serif';
    ctxPhone.fillText(timeStr, 20, 32);
    ctxPhone.fillText('98% ⚡', 185, 32);

    // Dynamic notification card
    const notifs = [
      { app: '💬 Telegram', title: 'New Client Inquiry', body: 'Let\'s collaborate on a high-scale project 🚀', color: '#38bdf8' },
      { app: '⭐️ GitHub', title: 'Repo Starred', body: '@artikov-dev/wedding-platform got a ⭐️', color: '#22c55e' },
      { app: '🤖 Antigravity AI', title: 'System Status', body: 'Distributed agents deployed 100%', color: '#ec4899' },
      { app: '📈 Analytics Live', title: 'Visitor Surge', body: 'Active users online: +24% today', color: '#f59e0b' },
    ];
    const currentNotifIndex = Math.floor((time / 4) % notifs.length);
    const n = notifs[currentNotifIndex];

    // Notification box
    ctxPhone.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctxPhone.beginPath();
    ctxPhone.roundRect(14, 60, 228, 120, 18);
    ctxPhone.fill();
    ctxPhone.strokeStyle = n.color;
    ctxPhone.lineWidth = 2;
    ctxPhone.stroke();

    ctxPhone.fillStyle = n.color;
    ctxPhone.font = 'bold 15px sans-serif';
    ctxPhone.fillText(n.app, 28, 90);

    ctxPhone.fillStyle = '#ffffff';
    ctxPhone.font = 'bold 14px sans-serif';
    ctxPhone.fillText(n.title, 28, 118);

    ctxPhone.fillStyle = '#94a3b8';
    ctxPhone.font = '12px sans-serif';
    ctxPhone.fillText(n.body, 28, 142);

    // Phone wallpaper art
    ctxPhone.fillStyle = '#0f172a';
    ctxPhone.beginPath();
    ctxPhone.roundRect(14, 200, 228, 280, 20);
    ctxPhone.fill();
    ctxPhone.fillStyle = rgbColor;
    ctxPhone.font = 'bold 22px monospace';
    ctxPhone.fillText('ROMA.DEV', 60, 340);
    ctxPhone.fillStyle = '#64748b';
    ctxPhone.font = '12px monospace';
    ctxPhone.fillText('Swipe up to unlock', 58, 440);

    texPhone.needsUpdate = true;
    if (phoneGlowRef.current) {
      phoneGlowRef.current.intensity = 0.8 + Math.sin(time * 3) * 0.4;
    }
  });

  // Pick active screen texture
  const activeMonitorTexture = useMemo(() => {
    switch (monitorMode % 4) {
      case 0: return canvasRefs.tex1;
      case 1: return canvasRefs.tex2;
      case 2: return canvasRefs.tex3;
      case 3: return canvasRefs.tex4;
      default: return canvasRefs.tex1;
    }
  }, [monitorMode, canvasRefs]);

  const handleChairInteraction = () => {
    setChairTargetRot(prev => prev + Math.PI * 2);
    onChairClick();
  };

  const handleKeyboardInteraction = () => {
    setKeyboardFlash(1.0);
    onKeyboardClick();
  };

  return (
    <group position={[0, -0.6, 0]}>
      {/* ================= FLOOR & WALLS ================= */}
      {/* Dark Walnut / Concrete Hardwood Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial 
          color={lightingMood === 'sunset' ? '#1c1917' : '#070b14'} 
          roughness={0.65} 
          metalness={0.25} 
        />
      </mesh>

      {/* Modern Minimalist Designer Geometric Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0.2]} receiveShadow>
        <planeGeometry args={[5.4, 4.0]} />
        <meshStandardMaterial 
          color={lightingMood === 'sunset' ? '#26201c' : '#0f172a'} 
          roughness={0.9} 
          metalness={0.05}
        />
      </mesh>
      {/* Rug woven border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.009, 0.2]}>
        <planeGeometry args={[5.5, 4.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} wireframe />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 3.2, -4]} receiveShadow>
        <planeGeometry args={[14, 7.5]} />
        <meshStandardMaterial 
          color={lightingMood === 'sunset' ? '#1e1b18' : '#0b0f1c'} 
          roughness={0.9} 
        />
      </mesh>

      {/* Left Wall with Window Cutout Frame */}
      <group position={[-5.4, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Wall panels around window */}
        <mesh position={[-3.8, 0, 0]} receiveShadow>
          <boxGeometry args={[2.5, 7.5, 0.1]} />
          <meshStandardMaterial color={lightingMood === 'sunset' ? '#1a1614' : '#090d18'} roughness={0.9} />
        </mesh>
        <mesh position={[3.8, 0, 0]} receiveShadow>
          <boxGeometry args={[2.5, 7.5, 0.1]} />
          <meshStandardMaterial color={lightingMood === 'sunset' ? '#1a1614' : '#090d18'} roughness={0.9} />
        </mesh>
        <mesh position={[0, 2.9, 0]} receiveShadow>
          <boxGeometry args={[5.2, 1.8, 0.1]} />
          <meshStandardMaterial color={lightingMood === 'sunset' ? '#1a1614' : '#090d18'} roughness={0.9} />
        </mesh>
        <mesh position={[0, -2.9, 0]} receiveShadow>
          <boxGeometry args={[5.2, 1.8, 0.1]} />
          <meshStandardMaterial color={lightingMood === 'sunset' ? '#1a1614' : '#090d18'} roughness={0.9} />
        </mesh>

        {/* Panoramic Window Aluminum Frame */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[5.2, 4.2, 0.12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Window Cross Mullions */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.08, 4.2, 0.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[5.2, 0.08, 0.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>

        {/* Window Glass with Physical Transmission */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[5.1, 4.1]} />
          <meshPhysicalMaterial 
            color="#0f172a" 
            transparent 
            opacity={0.15} 
            roughness={0.05} 
            metalness={0.1}
            transmission={0.95} 
          />
        </mesh>
      </group>

      {/* ================= CYBER CITY SKYLINE OUTSIDE WINDOW ================= */}
      <group position={[-0.5, 0, 0]}>
        {cityBuildings.map((b, i) => (
          <group key={i} position={[b.x, b.y, b.z]}>
            <mesh>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial color={b.color} roughness={0.8} metalness={0.5} />
            </mesh>
            {/* Illuminated Windows Matrix on Building */}
            <mesh position={[0.48, 0, 0]}>
              <planeGeometry args={[b.w * 0.9, b.h * 0.85]} />
              <meshBasicMaterial color={b.lightColor} transparent opacity={0.35} />
            </mesh>
            {/* Skyscraper Beacon Light */}
            <mesh position={[0, b.h / 2 + 0.1, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          </group>
        ))}

        {/* Distant City Glow */}
        <pointLight 
          position={[-8.5, 4.0, 0]} 
          color={lightingMood === 'sunset' ? '#f59e0b' : '#38bdf8'} 
          intensity={2.8} 
          distance={12} 
        />
      </group>

      {/* Modern Acoustic Slatted Wood Wall Panels */}
      {[-2.8, -1.9, -1.0, -0.1, 0.8, 1.7, 2.6].map((x, i) => (
        <mesh key={i} position={[x, 3.2, -3.95]} castShadow receiveShadow>
          <boxGeometry args={[0.75, 2.8, 0.06]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#111827' : '#1e293b'} 
            roughness={0.6} 
            metalness={0.15}
          />
        </mesh>
      ))}

      {/* ================= CYBER NEON SIGN ================= */}
      <group 
        position={[0, 4.7, -3.92]} 
        onClick={() => {
          setNeonActive(!neonActive);
          onNeonClick();
        }}
      >
        {/* Glow backing frame */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[4.2, 0.8, 0.05]} />
          <meshStandardMaterial color="#020617" roughness={0.9} metalness={0.8} />
        </mesh>
        
        <Text
          fontSize={0.34}
          color={neonActive ? rgbColor : '#334155'}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          {"< ROMA ARTIKOV />"}
        </Text>

        {neonActive && (
          <pointLight color={rgbColor} intensity={3.2} distance={5} />
        )}
      </group>

      {/* ================= FRAMED TECH CERTIFICATE ON WALL ================= */}
      <group position={[2.8, 3.4, -3.92]}>
        {/* Frame Border */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 1.1, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Certificate Paper */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[1.38, 0.98]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <Text
          position={[0, 0.22, 0.025]}
          fontSize={0.075}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
        >
          CERTIFICATE OF EXCELLENCE
        </Text>
        <Text
          position={[0, 0.06, 0.025]}
          fontSize={0.06}
          color="#0284c7"
          anchorX="center"
          anchorY="middle"
        >
          Senior Full Stack Engineer
        </Text>
        <Text
          position={[0, -0.1, 0.025]}
          fontSize={0.045}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          Cloud Systems & AI Architecture • 2026
        </Text>
        {/* Gold Seal Badge */}
        <mesh position={[0.42, -0.28, 0.026]}>
          <cylinderGeometry args={[0.12, 0.12, 0.01, 24]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ================= FLOATING WALL SHELF ================= */}
      <group position={[-2.8, 3.2, -3.8]}>
        {/* Shelf board */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.08, 0.45]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
        </mesh>
        
        {/* Engineering Books on shelf */}
        <group position={[-0.8, 0.35, 0]}>
          <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.12, 0.62, 0.32]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0.16, 0, 0]} rotation={[0, 0, -0.03]}>
            <boxGeometry args={[0.15, 0.56, 0.29]} />
            <meshStandardMaterial color="#10b981" roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0.34, 0, 0]}>
            <boxGeometry args={[0.14, 0.68, 0.34]} />
            <meshStandardMaterial color="#a855f7" roughness={0.3} />
          </mesh>
        </group>

        {/* Minimalist Geometric Succulent Pot */}
        <group position={[0.7, 0.25, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.12, 0.22, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[0, 0.18, 0]}>
            <dodecahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial color="#16a34a" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ================= DEVELOPER WORKSPACE DESK ================= */}
      <group position={[0, 0, -1.2]}>
        {/* Desk Top */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 0.1, 2.1]} />
          <meshStandardMaterial 
            color={lightingMood === 'sunset' ? '#292524' : '#0f172a'} 
            roughness={0.25} 
            metalness={0.25} 
          />
        </mesh>

        {/* Desk Ambilight Wall-Wash LED Strip (Behind Desk) */}
        <mesh position={[0, 1.42, -1.02]}>
          <boxGeometry args={[4.2, 0.02, 0.04]} />
          <meshBasicMaterial color={rgbColor} />
        </mesh>
        <pointLight 
          position={[0, 1.6, -1.2]} 
          color={rgbColor} 
          intensity={2.2} 
          distance={3.5} 
        />

        {/* Premium Desk Mat (Felt/Leather) */}
        <mesh position={[0, 1.455, 0.1]} receiveShadow>
          <boxGeometry args={[3.4, 0.01, 1.35]} />
          <meshStandardMaterial color="#020617" roughness={0.95} />
        </mesh>

        {/* Desk Metal Legs */}
        {[
          [-2.1, 0.7, -0.85],
          [2.1, 0.7, -0.85],
          [-2.1, 0.7, 0.85],
          [2.1, 0.7, 0.85],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 1.4, 0.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* ================= DUAL MONITORS & SCREENBAR ================= */}
        {/* Main Ultra-wide Curved Monitor */}
        <group 
          position={[0, 2.35, -0.4]} 
          onClick={onMonitorClick}
        >
          {/* Monitor Stand Base & Arm */}
          <mesh position={[0, -0.88, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.38, 0.03, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.45, -0.1]} castShadow>
            <boxGeometry args={[0.08, 0.85, 0.08]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} />
          </mesh>

          {/* Ultra-wide Curved Frame */}
          <mesh castShadow>
            <boxGeometry args={[2.6, 1.3, 0.08]} />
            <meshStandardMaterial color="#0b0f19" metalness={0.85} roughness={0.25} />
          </mesh>

          {/* Active Live Animated Screen Display */}
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[2.5, 1.2]} />
            <meshBasicMaterial map={activeMonitorTexture} />
          </mesh>

          {/* BenQ ScreenBar Mounted Lightbar */}
          <group position={[0, 0.72, 0.12]}>
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.04, 0.06]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Lightbar Downward Spotlight */}
            <spotLight
              position={[0, 0, 0]}
              target-position={[0, -1.0, 0.6]}
              angle={0.7}
              penumbra={0.6}
              intensity={1.8}
              color={lightingMood === 'sunset' ? '#fef08a' : '#f8fafc'}
              distance={3.5}
            />
          </group>

          {/* Screen Ambient Glow */}
          <pointLight color={rgbColor} intensity={1.2} distance={3.0} position={[0, 0, 0.6]} />
        </group>

        {/* Side Vertical Secondary Monitor */}
        <group position={[-1.85, 2.35, -0.18]} rotation={[0, 0.38, 0]}>
          {/* Stand */}
          <mesh position={[0, -0.88, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.26, 0.03, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.45, -0.05]} castShadow>
            <boxGeometry args={[0.06, 0.85, 0.06]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          {/* Vertical Frame */}
          <mesh castShadow>
            <boxGeometry args={[0.92, 1.55, 0.06]} />
            <meshStandardMaterial color="#0b0f19" metalness={0.85} />
          </mesh>
          {/* Vertical Screen */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.84, 1.47]} />
            <meshBasicMaterial map={canvasRefs.tex2} />
          </mesh>
        </group>

        {/* ================= MECHANICAL KEYBOARD & MOUSE ================= */}
        {/* Custom 75% Mechanical Keyboard */}
        <group 
          position={[0, 1.48, 0.35]} 
          onClick={handleKeyboardInteraction}
        >
          {/* CNC Anodized Aluminum Keyboard Case */}
          <mesh castShadow>
            <boxGeometry args={[1.15, 0.04, 0.38]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Custom Gradient Keycaps Cluster */}
          <mesh position={[0, 0.028, 0]}>
            <boxGeometry args={[1.06, 0.022, 0.32]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          {/* RGB Dynamic Underglow */}
          <pointLight 
            ref={keyboardGlowRef} 
            color={rgbColor} 
            intensity={0.6} 
            distance={0.8} 
            position={[0, 0.05, 0]} 
          />
        </group>

        {/* Ergonomic Wireless Mouse & Charging Dock */}
        <group position={[0.95, 1.48, 0.35]}>
          <mesh castShadow>
            <boxGeometry args={[0.17, 0.05, 0.28]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>

        {/* ================= INTERACTIVE OLED SMARTPHONE ================= */}
        <group 
          position={[0.55, 1.465, 0.45]} 
          rotation={[-Math.PI / 2, 0, 0.18]}
          onClick={onPhoneClick}
        >
          {/* Phone Aluminum Chassis */}
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.42, 0.018]} />
            <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* OLED Active Screen */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.20, 0.40]} />
            <meshBasicMaterial map={canvasRefs.texPhone} />
          </mesh>
          {/* Phone Notification Glow */}
          <pointLight 
            ref={phoneGlowRef}
            position={[0, 0, 0.05]} 
            color={rgbColor} 
            intensity={0.8} 
            distance={0.7} 
          />
        </group>

        {/* ================= STUDIO HEADPHONES ON STAND ================= */}
        <group position={[-1.25, 1.46, -0.3]}>
          {/* Wooden / Aluminum Headphone Stand */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh castShadow position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.04, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Top curved hanger */}
          <mesh castShadow position={[0, 0.7, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          {/* Headphones Headband */}
          <mesh castShadow position={[0, 0.65, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.16, 0.02, 12, 24, Math.PI]} />
            <meshStandardMaterial color="#020617" roughness={0.4} />
          </mesh>
          {/* Earcups */}
          <mesh castShadow position={[-0.15, 0.5, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh castShadow position={[0.15, 0.5, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>

        {/* ================= STUDIO AUDIO SPEAKERS ================= */}
        {/* Left Studio Monitor Speaker */}
        <group position={[-1.6, 1.85, -0.6]} rotation={[0, 0.32, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.7, 0.38]} />
            <meshStandardMaterial color="#0a0f19" roughness={0.5} />
          </mesh>
          {/* Pulsing Bass Cone */}
          <mesh ref={speakerPulseRef1} position={[0, 0.06, 0.195]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 24]} />
            <meshStandardMaterial color={rgbColor} roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.18, 0.195]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>

        {/* Right Studio Monitor Speaker */}
        <group position={[1.6, 1.85, -0.6]} rotation={[0, -0.32, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.7, 0.38]} />
            <meshStandardMaterial color="#0a0f19" roughness={0.5} />
          </mesh>
          {/* Pulsing Bass Cone */}
          <mesh ref={speakerPulseRef2} position={[0, 0.06, 0.195]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 24]} />
            <meshStandardMaterial color={rgbColor} roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.18, 0.195]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>

        {/* ================= STEAMING ESPRESSO MUG ================= */}
        <group 
          position={[-0.85, 1.46, 0.45]} 
          onClick={onCoffeeClick}
        >
          {/* Ceramic Mug Cup */}
          <mesh castShadow position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.11, 0.09, 0.24, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.15} />
          </mesh>
          {/* Rich Espresso liquid */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 24]} />
            <meshStandardMaterial color="#2d1a12" roughness={0.1} />
          </mesh>
          {/* Mug Handle */}
          <mesh position={[-0.13, 0.13, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.07, 0.02, 12, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.15} />
          </mesh>
          {/* Volumetric Animated Steam Particles */}
          <points ref={steamRef} position={[0, 0.28, 0]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[steamParticles, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.04}
              color="#ffffff"
              transparent
              opacity={0.45}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>

        {/* ================= HIGH-END RGB CUSTOM PC TOWER ================= */}
        <group 
          position={[1.6, 1.98, 0.1]} 
          onClick={onPcClick}
        >
          {/* PC Chassis (Anodized Aluminum) */}
          <mesh castShadow>
            <boxGeometry args={[0.54, 1.0, 0.95]} />
            <meshStandardMaterial color="#080c14" roughness={0.3} metalness={0.85} />
          </mesh>

          {/* Tempered Glass Side Panel (Transparent Reflection) */}
          <mesh position={[-0.28, 0, 0]}>
            <boxGeometry args={[0.02, 0.94, 0.9]} />
            <meshPhysicalMaterial 
              color="#020617" 
              transparent 
              opacity={0.3} 
              roughness={0.08} 
              metalness={0.2}
              transmission={0.85}
            />
          </mesh>

          {/* Glowing RTX Graphics Card / GPU inside */}
          <mesh position={[-0.05, -0.15, 0]} castShadow>
            <boxGeometry args={[0.32, 0.14, 0.6]} />
            <meshStandardMaterial color={rgbColor} roughness={0.15} metalness={0.6} />
          </mesh>

          {/* Dual RGB Front Intake Fans */}
          <group ref={fanRef1} position={[0, 0.22, 0.48]}>
            <mesh>
              <torusGeometry args={[0.16, 0.02, 12, 32]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.28, 0.04, 0.01]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
          </group>

          <group ref={fanRef2} position={[0, -0.22, 0.48]}>
            <mesh>
              <torusGeometry args={[0.16, 0.02, 12, 32]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.28, 0.04, 0.01]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
          </group>

          {/* Internal Volumetric PC Lighting */}
          <pointLight 
            ref={gpuGlowRef} 
            color={rgbColor} 
            intensity={3.0} 
            distance={3.0} 
            position={[-0.1, 0, 0]} 
          />
        </group>
      </group>

      {/* ================= INTERACTIVE SWIVEL ERGONOMIC CHAIR ================= */}
      <group 
        ref={chairRef} 
        position={[0, 0.92, 0.6]} 
        rotation={[0, -0.25, 0]}
        onClick={handleChairInteraction}
      >
        {/* Seat Cushion */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.14, 0.9]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Chair Backrest with Lumbar Support */}
        <mesh position={[0, 0.7, 0.4]} rotation={[-0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 1.2, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        {/* Headrest */}
        <mesh position={[0, 1.38, 0.48]} castShadow>
          <boxGeometry args={[0.48, 0.22, 0.1]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        {/* Ergonomic Armrests */}
        <mesh position={[-0.48, 0.4, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0.48, 0.4, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        {/* Metal Hydraulic Cylinder */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.8, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* 5-Star Wheel Base */}
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.06, 5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
