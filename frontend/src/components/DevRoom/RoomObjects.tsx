import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface RoomObjectsProps {
  rgbColor: string;
  lightingMood: 'neon' | 'night' | 'sunset' | 'matrix';
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

export const RoomObjects: React.FC<RoomObjectsProps> = ({
  rgbColor,
  lightingMood,
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
  const fanRef1 = useRef<THREE.Group>(null);
  const fanRef2 = useRef<THREE.Group>(null);
  const fanRef3 = useRef<THREE.Group>(null);
  const fanTop1Ref = useRef<THREE.Group>(null);
  const fanTop2Ref = useRef<THREE.Group>(null);
  const fanTop3Ref = useRef<THREE.Group>(null);
  const fanBot1Ref = useRef<THREE.Group>(null);
  const fanBot2Ref = useRef<THREE.Group>(null);
  const fanBot3Ref = useRef<THREE.Group>(null);
  const fanRearRef = useRef<THREE.Group>(null);
  const flowWheelRef = useRef<THREE.Group>(null);
  const skycar1Ref = useRef<THREE.Group>(null);
  const skycar2Ref = useRef<THREE.Group>(null);
  const speakerPulseRef1 = useRef<THREE.Mesh>(null);
  const speakerPulseRef2 = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Points>(null);
  const chairRef = useRef<THREE.Group>(null);
  const keyboardGlowRef = useRef<THREE.PointLight>(null);
  const gpuGlowRef = useRef<THREE.PointLight>(null);
  const phoneGlowRef = useRef<THREE.PointLight>(null);
  const hologramGroupRef = useRef<THREE.Group>(null);
  const holoOrbit1Ref = useRef<THREE.Group>(null);
  const holoOrbit2Ref = useRef<THREE.Group>(null);
  const holoOrbit3Ref = useRef<THREE.Group>(null);
  const laserGridRef = useRef<THREE.Group>(null);
  const catBodyRef = useRef<THREE.Group>(null);
  const catTailRef = useRef<THREE.Mesh>(null);
  const catZzzRef = useRef<THREE.Points>(null);

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

    // 6. CPU Liquid Cooler Round LCD Canvas
    const cCooler = document.createElement('canvas');
    cCooler.width = 256;
    cCooler.height = 256;
    const ctxCooler = cCooler.getContext('2d')!;

    // 7. Elgato Stream Deck 15-Key Canvas
    const cStreamDeck = document.createElement('canvas');
    cStreamDeck.width = 320;
    cStreamDeck.height = 192;
    const ctxStreamDeck = cStreamDeck.getContext('2d')!;

    const tex1 = new THREE.CanvasTexture(c1);
    const tex2 = new THREE.CanvasTexture(c2);
    const tex3 = new THREE.CanvasTexture(c3);
    const tex4 = new THREE.CanvasTexture(c4);
    const texPhone = new THREE.CanvasTexture(cPhone);
    const texCooler = new THREE.CanvasTexture(cCooler);
    const texStreamDeck = new THREE.CanvasTexture(cStreamDeck);

    return { 
      c1, ctx1, tex1, 
      c2, ctx2, tex2, 
      c3, ctx3, tex3, 
      c4, ctx4, tex4, 
      cPhone, ctxPhone, texPhone,
      cCooler, ctxCooler, texCooler,
      cStreamDeck, ctxStreamDeck, texStreamDeck
    };
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

  // Cat Zzz floating particles
  const catZzzParticles = useMemo(() => {
    const count = 15;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.16;
      pos[i * 3 + 1] = Math.random() * 0.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.16;
    }
    return pos;
  }, []);

  // Animation Loop for Canvases & Objects
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 1. Fans rotation (10x Fans Setup)
    if (fanRef1.current) fanRef1.current.rotation.z += delta * 16;
    if (fanRef2.current) fanRef2.current.rotation.z += delta * 16;
    if (fanRef3.current) fanRef3.current.rotation.z += delta * 16;
    if (fanTop1Ref.current) fanTop1Ref.current.rotation.z += delta * 16;
    if (fanTop2Ref.current) fanTop2Ref.current.rotation.z += delta * 16;
    if (fanTop3Ref.current) fanTop3Ref.current.rotation.z += delta * 16;
    if (fanBot1Ref.current) fanBot1Ref.current.rotation.z += delta * 16;
    if (fanBot2Ref.current) fanBot2Ref.current.rotation.z += delta * 16;
    if (fanBot3Ref.current) fanBot3Ref.current.rotation.z += delta * 16;
    if (fanRearRef.current) fanRearRef.current.rotation.x += delta * 16;
    if (flowWheelRef.current) flowWheelRef.current.rotation.z += delta * 24;

    // Skycars moving through the city skyline
    if (skycar1Ref.current) {
      skycar1Ref.current.position.z = ((time * 3.2) % 18) - 9;
    }
    if (skycar2Ref.current) {
      skycar2Ref.current.position.z = 9 - ((time * 2.5) % 18);
    }

    // 2. Speaker bass pulsing
    const pulse = 1 + Math.sin(time * 8) * 0.06;
    if (speakerPulseRef1.current) speakerPulseRef1.current.scale.set(pulse, pulse, 1);
    if (speakerPulseRef2.current) speakerPulseRef2.current.scale.set(pulse, pulse, 1);

    // 3. GPU breathing glow
    if (gpuGlowRef.current) {
      gpuGlowRef.current.intensity = 2.0 + Math.sin(time * 4) * 0.8;
    }

    // 4. Keyboard flash decay & physical typing sync
    if (keyboardFlashTrigger > 0 && keyboardFlash < 0.5) {
      setKeyboardFlash(1.0);
    }
    if (keyboardFlash > 0) {
      setKeyboardFlash(prev => Math.max(0, prev - delta * 4));
    }
    if (keyboardGlowRef.current) {
      keyboardGlowRef.current.intensity = 0.5 + keyboardFlash * 3.2;
    }

    // 5. Chair smooth rotation lerp
    if (chairRef.current) {
      chairRef.current.rotation.y = THREE.MathUtils.lerp(
        chairRef.current.rotation.y,
        chairTargetRot,
        0.08
      );
    }

    // 6. Hologram Rotation & Orbits
    if (hologramGroupRef.current) {
      hologramGroupRef.current.rotation.y += delta * 1.5;
      hologramGroupRef.current.position.y = 0.36 + Math.sin(time * 2.5) * 0.025;
    }
    if (holoOrbit1Ref.current) holoOrbit1Ref.current.rotation.z += delta * 3.0;
    if (holoOrbit2Ref.current) holoOrbit2Ref.current.rotation.x += delta * 2.5;
    if (holoOrbit3Ref.current) holoOrbit3Ref.current.rotation.y += delta * 2.8;

    // 7. Matrix Laser Grid Wave
    if (laserGridRef.current && lightingMood === 'matrix') {
      laserGridRef.current.position.y = Math.sin(time * 2) * 0.2;
    }

    // 8. Cyber Cat Breathing, Tail Wag & Zzz particles
    if (catBodyRef.current) {
      catBodyRef.current.scale.y = 1 + Math.sin(time * 2.5) * 0.04;
      catBodyRef.current.scale.x = 1 + Math.cos(time * 2.5) * 0.02;
    }
    if (catTailRef.current) {
      catTailRef.current.rotation.z = Math.sin(time * 3.5) * 0.15;
    }
    if (catZzzRef.current) {
      const positions = catZzzRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3 + 1] += delta * 0.12;
        if (positions[i * 3 + 1] > 0.45) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 0.16;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.16;
        }
      }
      catZzzRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 9. Steaming coffee particles
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

    // 10. Dynamic Canvas Rendering
    const { 
      ctx1, c1, tex1, 
      ctx2, c2, tex2, 
      ctx3, c3, tex3, 
      ctx4, c4, tex4, 
      ctxPhone, cPhone, texPhone,
      ctxCooler, cCooler, texCooler,
      ctxStreamDeck, cStreamDeck, texStreamDeck
    } = canvasRefs;

    // CPU Cooler Digital Round LCD Screen
    ctxCooler.fillStyle = '#020617';
    ctxCooler.fillRect(0, 0, cCooler.width, cCooler.height);
    ctxCooler.strokeStyle = rgbColor;
    ctxCooler.lineWidth = 8;
    ctxCooler.beginPath();
    ctxCooler.arc(128, 128, 110, 0, Math.PI * 2);
    ctxCooler.stroke();

    ctxCooler.strokeStyle = '#38bdf8';
    ctxCooler.lineWidth = 10;
    ctxCooler.beginPath();
    ctxCooler.arc(128, 128, 110, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 1.4) + Math.sin(time * 2) * 0.2);
    ctxCooler.stroke();

    ctxCooler.fillStyle = '#ffffff';
    ctxCooler.font = 'bold 44px monospace';
    ctxCooler.textAlign = 'center';
    ctxCooler.fillText(`${(38 + Math.sin(time) * 3).toFixed(0)}°C`, 128, 120);

    ctxCooler.fillStyle = rgbColor;
    ctxCooler.font = 'bold 16px sans-serif';
    ctxCooler.fillText('LIQUID LOOP', 128, 152);

    ctxCooler.fillStyle = '#64748b';
    ctxCooler.font = '13px monospace';
    ctxCooler.fillText('2850 RPM • PUMP OK', 128, 178);
    texCooler.needsUpdate = true;

    // Elgato Stream Deck 15-Key Canvas
    ctxStreamDeck.fillStyle = '#090d16';
    ctxStreamDeck.fillRect(0, 0, cStreamDeck.width, cStreamDeck.height);
    const icons = ['🎙️', '📹', '⚡', '💻', '🐙', '🎵', '💡', '🚀', '🔥', '⚙️', '🤖', '💬', '☕', '📈', '✨'];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const idx = row * 5 + col;
        const kx = 10 + col * 62;
        const ky = 10 + row * 58;
        ctxStreamDeck.fillStyle = '#1e293b';
        ctxStreamDeck.beginPath();
        ctxStreamDeck.roundRect(kx, ky, 52, 48, 8);
        ctxStreamDeck.fill();
        ctxStreamDeck.strokeStyle = (idx % 2 === 0) ? rgbColor : '#38bdf8';
        ctxStreamDeck.lineWidth = 1.5;
        ctxStreamDeck.stroke();

        ctxStreamDeck.font = '20px sans-serif';
        ctxStreamDeck.textAlign = 'center';
        ctxStreamDeck.fillText(icons[idx], kx + 26, ky + 32);
      }
    }
    texStreamDeck.needsUpdate = true;


    // Screen 1 (VS Code)
    ctx1.fillStyle = '#0a0f1d';
    ctx1.fillRect(0, 0, c1.width, c1.height);
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
      ctx1.fillRect(45 + (codeLines[activeLinesCount]?.t?.length || 0) * 7.8, 42 + activeLinesCount * 24, 8, 16);
    }
    tex1.needsUpdate = true;

    // Screen 2 (Matrix Rain)
    ctx2.fillStyle = 'rgba(5, 12, 8, 0.2)';
    ctx2.fillRect(0, 0, c2.width, c2.height);
    ctx2.fillStyle = (lightingMood === 'matrix') ? '#22c55e' : (rgbColor || '#22c55e');
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

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    ctxPhone.fillStyle = '#94a3b8';
    ctxPhone.font = 'bold 16px sans-serif';
    ctxPhone.fillText(timeStr, 20, 32);
    ctxPhone.fillText('98% ⚡', 185, 32);

    const notifs = [
      { app: '💬 Telegram', title: 'New Client Inquiry', body: 'Let\'s collaborate on a high-scale project 🚀', color: '#38bdf8' },
      { app: '⭐️ GitHub', title: 'Repo Starred', body: '@artikov-dev/wedding-platform got a ⭐️', color: '#22c55e' },
      { app: '🤖 Antigravity AI', title: 'System Status', body: 'Distributed agents deployed 100%', color: '#ec4899' },
      { app: '📈 Analytics Live', title: 'Visitor Surge', body: 'Active users online: +24% today', color: '#f59e0b' },
    ];
    const currentNotifIndex = Math.floor((time / 4) % notifs.length);
    const n = notifs[currentNotifIndex];

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
          color={lightingMood === 'sunset' ? '#1c1917' : (lightingMood === 'matrix' ? '#040b06' : '#070b14')} 
          roughness={0.65} 
          metalness={0.25} 
        />
      </mesh>

      {/* Modern Minimalist Designer Geometric Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0.2]} receiveShadow>
        <planeGeometry args={[5.4, 4.0]} />
        <meshStandardMaterial 
          color={lightingMood === 'sunset' ? '#26201c' : (lightingMood === 'matrix' ? '#07160d' : '#0f172a')} 
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
          color={lightingMood === 'sunset' ? '#1e1b18' : (lightingMood === 'matrix' ? '#050f09' : '#0b0f1c')} 
          roughness={0.9} 
        />
      </mesh>

      {/* Left Wall with Window Cutout Frame */}
      <group position={[-5.4, 3.2, 0]} rotation={[0, Math.PI / 2, 0]}>
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
              <meshStandardMaterial 
                color={lightingMood === 'matrix' ? '#041a0b' : b.color} 
                roughness={0.8} 
                metalness={0.5} 
              />
            </mesh>
            {/* Illuminated Windows Matrix on Building */}
            <mesh position={[0.48, 0, 0]}>
              <planeGeometry args={[b.w * 0.9, b.h * 0.85]} />
              <meshBasicMaterial 
                color={lightingMood === 'matrix' ? '#22c55e' : (lightingMood === 'sunset' ? '#f59e0b' : b.lightColor)} 
                transparent 
                opacity={0.4} 
              />
            </mesh>
            {/* Skyscraper Beacon Light */}
            <mesh position={[0, b.h / 2 + 0.1, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color={lightingMood === 'matrix' ? '#22c55e' : '#ef4444'} />
            </mesh>
          </group>
        ))}

        {/* Laser Grid Lines in Sky for Matrix Mode */}
        {lightingMood === 'matrix' && (
          <group ref={laserGridRef} position={[-8.0, 4.5, 0]}>
            {[-2, 0, 2, 4].map((z, idx) => (
              <mesh key={idx} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.015, 0.015, 8, 8]} />
                <meshBasicMaterial color="#22c55e" transparent opacity={0.6} />
              </mesh>
            ))}
          </group>
        )}

        {/* Animated Cyber Skycars flying in the city skyline */}
        <group ref={skycar1Ref} position={[-7.2, 3.8, 0]}>
          <mesh>
            <boxGeometry args={[0.22, 0.08, 0.6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          {/* Headlights */}
          <mesh position={[0, 0, 0.32]}>
            <boxGeometry args={[0.18, 0.02, 0.04]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Taillights */}
          <mesh position={[0, 0, -0.32]}>
            <boxGeometry args={[0.18, 0.02, 0.04]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <pointLight color="#38bdf8" intensity={1.5} distance={2.5} />
        </group>

        <group ref={skycar2Ref} position={[-8.4, 4.6, 0]}>
          <mesh>
            <boxGeometry args={[0.18, 0.06, 0.5]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, -0.28]}>
            <boxGeometry args={[0.14, 0.02, 0.04]} />
            <meshBasicMaterial color="#a855f7" />
          </mesh>
          <mesh position={[0, 0, 0.28]}>
            <boxGeometry args={[0.14, 0.02, 0.04]} />
            <meshBasicMaterial color="#ec4899" />
          </mesh>
        </group>

        {/* Distant City Sky Glow */}
        <pointLight 
          position={[-8.5, 4.0, 0]} 
          color={lightingMood === 'sunset' ? '#f59e0b' : (lightingMood === 'matrix' ? '#22c55e' : '#38bdf8')} 
          intensity={3.2} 
          distance={14} 
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
        <mesh castShadow>
          <boxGeometry args={[1.5, 1.1, 0.04]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
        </mesh>
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
        <mesh position={[0.42, -0.28, 0.026]}>
          <cylinderGeometry args={[0.12, 0.12, 0.01, 24]} />
          <meshStandardMaterial color="#eab308" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ================= FLOATING WALL SHELF ================= */}
      <group position={[-2.8, 3.2, -3.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.08, 0.45]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
        </mesh>
        
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
        {/* Desk Top Board */}
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 0.1, 2.1]} />
          <meshStandardMaterial 
            color={lightingMood === 'sunset' ? '#292524' : '#0f172a'} 
            roughness={0.25} 
            metalness={0.25} 
          />
        </mesh>

        {/* ================= 360° DYNAMIC RGB PERIMETER EDGE GLOW ================= */}
        {/* Front Edge Light Strip */}
        <mesh position={[0, 1.395, 1.055]}>
          <boxGeometry args={[4.62, 0.02, 0.02]} />
          <meshBasicMaterial color={rgbColor} />
        </mesh>
        {/* Back Edge Light Strip */}
        <mesh position={[0, 1.395, -1.055]}>
          <boxGeometry args={[4.62, 0.02, 0.02]} />
          <meshBasicMaterial color={rgbColor} />
        </mesh>
        {/* Left Edge Light Strip */}
        <mesh position={[-2.305, 1.395, 0]}>
          <boxGeometry args={[0.02, 0.02, 2.12]} />
          <meshBasicMaterial color={rgbColor} />
        </mesh>
        {/* Right Edge Light Strip */}
        <mesh position={[2.305, 1.395, 0]}>
          <boxGeometry args={[0.02, 0.02, 2.12]} />
          <meshBasicMaterial color={rgbColor} />
        </mesh>

        {/* 360° Underglow Desk Lights */}
        <pointLight 
          position={[0, 1.25, 0]} 
          color={rgbColor} 
          intensity={3.5} 
          distance={3.8} 
        />
        <pointLight 
          position={[0, 1.5, -1.1]} 
          color={rgbColor} 
          intensity={2.8} 
          distance={3.2} 
        />

        {/* ================= RGB CHROMA EXTENDED DESK MAT (KOVRIK) ================= */}
        <group position={[0, 1.455, 0.1]}>
          {/* Base Premium Micro-Woven Cloth Mat */}
          <mesh receiveShadow>
            <boxGeometry args={[3.4, 0.012, 1.35]} />
            <meshStandardMaterial color="#020617" roughness={0.95} metalness={0.05} />
          </mesh>

          {/* 360° Fiber-Optic RGB Neon Piping Border */}
          {/* Front */}
          <mesh position={[0, 0.008, 0.675]}>
            <boxGeometry args={[3.42, 0.016, 0.018]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>
          {/* Back */}
          <mesh position={[0, 0.008, -0.675]}>
            <boxGeometry args={[3.42, 0.016, 0.018]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>
          {/* Left */}
          <mesh position={[-1.7, 0.008, 0]}>
            <boxGeometry args={[0.018, 0.016, 1.35]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>
          {/* Right */}
          <mesh position={[1.7, 0.008, 0]}>
            <boxGeometry args={[0.018, 0.016, 1.35]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>

          {/* Mat Surface RGB Ambient Glow */}
          <pointLight color={rgbColor} intensity={0.7} distance={1.2} position={[0, 0.05, 0]} />
        </group>

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

        {/* ================= 🛸 3D FLOATING TECH HOLOGRAM PROJECTOR ================= */}
        <group 
          position={[-1.25, 1.46, 0.2]} 
          onClick={onHologramClick}
        >
          {/* Futuristic Circular Projector Base */}
          <mesh castShadow position={[0, 0.015, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 0.03, 32]} />
            <meshStandardMaterial color="#0b1120" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glowing Concentric Neon Emitter Ring */}
          <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.13, 0.008, 16, 32]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>
          {/* Emitter Core Lens */}
          <mesh position={[0, 0.032, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.005, 32]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Subtle Vertical Ethereal Light Column */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.14, 0.08, 0.32, 32, 1, true]} />
            <meshBasicMaterial 
              color={rgbColor} 
              transparent 
              opacity={0.12} 
              side={THREE.DoubleSide} 
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Floating Rotating 3D Holographic Geometry (Floats right above base!) */}
          <group ref={hologramGroupRef} position={[0, 0.36, 0]}>
            {/* Hologram Mode 0: React Atom */}
            {hologramIndex % 4 === 0 && (
              <group scale={0.85}>
                <mesh>
                  <sphereGeometry args={[0.07, 16, 16]} />
                  <meshBasicMaterial color="#38bdf8" wireframe />
                </mesh>
                <group ref={holoOrbit1Ref}>
                  <mesh rotation={[Math.PI / 3, 0, 0]}>
                    <torusGeometry args={[0.2, 0.01, 12, 36]} />
                    <meshBasicMaterial color="#38bdf8" />
                  </mesh>
                  <mesh position={[0.2, 0, 0]}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                    <meshBasicMaterial color="#38bdf8" />
                  </mesh>
                </group>
                <group ref={holoOrbit2Ref}>
                  <mesh rotation={[-Math.PI / 3, 0, 0]}>
                    <torusGeometry args={[0.2, 0.01, 12, 36]} />
                    <meshBasicMaterial color="#38bdf8" />
                  </mesh>
                  <mesh position={[-0.2, 0, 0]}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                    <meshBasicMaterial color="#38bdf8" />
                  </mesh>
                </group>
                <group ref={holoOrbit3Ref}>
                  <mesh rotation={[0, 0, Math.PI / 2]}>
                    <torusGeometry args={[0.2, 0.01, 12, 36]} />
                    <meshBasicMaterial color="#38bdf8" />
                  </mesh>
                  <mesh position={[0, 0.2, 0]}>
                    <sphereGeometry args={[0.025, 8, 8]} />
                    <meshBasicMaterial color="#38bdf8" />
                  </mesh>
                </group>
              </group>
            )}

            {/* Hologram Mode 1: TypeScript Hypercube */}
            {hologramIndex % 4 === 1 && (
              <group scale={0.85}>
                <mesh>
                  <boxGeometry args={[0.24, 0.24, 0.24]} />
                  <meshBasicMaterial color="#3b82f6" wireframe />
                </mesh>
                <mesh>
                  <sphereGeometry args={[0.06, 16, 16]} />
                  <meshBasicMaterial color="#60a5fa" />
                </mesh>
              </group>
            )}

            {/* Hologram Mode 2: Node.js Hexagon Prism */}
            {hologramIndex % 4 === 2 && (
              <group scale={0.85}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.18, 0.18, 0.12, 6]} />
                  <meshBasicMaterial color="#22c55e" wireframe />
                </mesh>
                <mesh>
                  <octahedronGeometry args={[0.07, 0]} />
                  <meshBasicMaterial color="#4ade80" />
                </mesh>
              </group>
            )}

            {/* Hologram Mode 3: AI Neural Network Cluster */}
            {hologramIndex % 4 === 3 && (
              <group scale={0.85}>
                <mesh>
                  <icosahedronGeometry args={[0.18, 1]} />
                  <meshBasicMaterial color="#ec4899" wireframe />
                </mesh>
                <mesh>
                  <dodecahedronGeometry args={[0.08, 0]} />
                  <meshBasicMaterial color="#f472b6" />
                </mesh>
              </group>
            )}

            {/* Hologram Focused Upward Glow */}
            <pointLight color={rgbColor} intensity={2.0} distance={1.2} />
          </group>
        </group>

        {/* ================= DUAL MONITORS & SCREENBAR ================= */}
        {/* Main Ultra-wide Curved Monitor */}
        <group 
          position={[0, 2.35, -0.4]} 
          onClick={onMonitorClick}
        >
          <mesh position={[0, -0.88, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.38, 0.03, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.45, -0.1]} castShadow>
            <boxGeometry args={[0.08, 0.85, 0.08]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} />
          </mesh>

          <mesh castShadow>
            <boxGeometry args={[2.6, 1.3, 0.08]} />
            <meshStandardMaterial color="#0b0f19" metalness={0.85} roughness={0.25} />
          </mesh>

          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[2.5, 1.2]} />
            <meshBasicMaterial map={activeMonitorTexture} />
          </mesh>

          {/* BenQ ScreenBar Mounted Lightbar */}
          <group 
            position={[0, 0.72, 0.12]}
            onClick={(e) => {
              e.stopPropagation();
              onLampClick();
            }}
          >
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.04, 0.06]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* LED Diffuser Tube */}
            <mesh position={[0, -0.02, 0.02]}>
              <boxGeometry args={[1.16, 0.012, 0.02]} />
              <meshBasicMaterial color={lampOn ? (lightingMood === 'sunset' ? '#fef08a' : '#f8fafc') : '#1e293b'} />
            </mesh>
            {lampOn && (
              <spotLight
                position={[0, 0, 0]}
                target-position={[0, -1.2, 0.6]}
                angle={0.78}
                penumbra={0.7}
                intensity={2.8}
                color={lightingMood === 'sunset' ? '#fef08a' : (lightingMood === 'matrix' ? '#86efac' : '#f8fafc')}
                distance={4.2}
              />
            )}
          </group>

          <pointLight color={rgbColor} intensity={1.2} distance={3.0} position={[0, 0, 0.6]} />
        </group>

        {/* Side Vertical Secondary Monitor */}
        <group position={[-1.85, 2.35, -0.18]} rotation={[0, 0.38, 0]}>
          <mesh position={[0, -0.88, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.26, 0.03, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.45, -0.05]} castShadow>
            <boxGeometry args={[0.06, 0.85, 0.06]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh castShadow>
            <boxGeometry args={[0.92, 1.55, 0.06]} />
            <meshStandardMaterial color="#0b0f19" metalness={0.85} />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[0.84, 1.47]} />
            <meshBasicMaterial map={canvasRefs.tex2} />
          </mesh>
        </group>

        {/* Modern Stitched Felt & Leather Studio Deskmat */}
        <mesh position={[0.2, 1.455, 0.35]} receiveShadow>
          <boxGeometry args={[2.2, 0.008, 0.82]} />
          <meshStandardMaterial color="#0c1220" roughness={0.92} metalness={0.08} />
        </mesh>
        {/* Deskmat Stitched Border */}
        <mesh position={[0.2, 1.457, 0.35]}>
          <boxGeometry args={[2.22, 0.006, 0.84]} />
          <meshStandardMaterial color="#1e293b" wireframe />
        </mesh>

        {/* ================= HIGH-END 75% CUSTOM MECHANICAL KEYBOARD ================= */}
        <group 
          position={[0, 1.47, 0.35]} 
          onClick={handleKeyboardInteraction}
        >
          {/* CNC Anodized Aluminum Keyboard Case with Chamfers */}
          <mesh castShadow position={[0, 0.02, 0]}>
            <boxGeometry args={[1.08, 0.045, 0.36]} />
            <meshStandardMaterial color="#090d16" roughness={0.25} metalness={0.88} />
          </mesh>

          {/* Polycarbonate Translucent Switch Plate & RGB Underglow Diffuser */}
          <mesh position={[0, 0.042, 0]}>
            <boxGeometry args={[1.02, 0.01, 0.32]} />
            <meshStandardMaterial 
              color={rgbColor} 
              roughness={0.15} 
              transparent 
              opacity={0.85} 
              emissive={rgbColor}
              emissiveIntensity={0.6 + keyboardFlash * 2.0}
            />
          </mesh>

          {/* Brass Accent Weight Badge */}
          <mesh position={[0, 0.002, 0.175]}>
            <boxGeometry args={[0.35, 0.015, 0.008]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* --- KEYCAPS CLUSTERS --- */}
          {/* 1. Function Row (F1 - F12 + Delete) */}
          <mesh position={[-0.04, 0.058, -0.125]}>
            <boxGeometry args={[0.88, 0.02, 0.04]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          {/* Accent Escape Key */}
          <mesh position={[-0.46, 0.06, -0.125]}>
            <boxGeometry args={[0.06, 0.024, 0.045]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
          {/* Metallic Knurled Rotary Volume Knob (Top Right) */}
          <mesh position={[0.46, 0.065, -0.125]}>
            <cylinderGeometry args={[0.028, 0.028, 0.03, 24]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* 2. Number Row */}
          <mesh position={[0, 0.058, -0.065]}>
            <boxGeometry args={[0.98, 0.02, 0.045]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>

          {/* 3. Alpha Key Cluster (QWERTY / ASDF) */}
          <mesh position={[-0.08, 0.058, 0.0]}>
            <boxGeometry args={[0.78, 0.02, 0.095]} />
            <meshStandardMaterial color="#0b1120" roughness={0.6} />
          </mesh>

          {/* Accent Enter Key */}
          <mesh position={[0.36, 0.058, 0.005]}>
            <boxGeometry args={[0.09, 0.022, 0.042]} />
            <meshStandardMaterial color={rgbColor} roughness={0.4} />
          </mesh>

          {/* 4. Bottom Row & 6.25u Spacebar */}
          <mesh position={[-0.08, 0.058, 0.085]}>
            <boxGeometry args={[0.42, 0.022, 0.048]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>
          <mesh position={[-0.38, 0.058, 0.085]}>
            <boxGeometry args={[0.18, 0.02, 0.045]} />
            <meshStandardMaterial color="#0f172a" roughness={0.6} />
          </mesh>

          {/* Dedicated Arrow Keys Cluster */}
          <mesh position={[0.40, 0.058, 0.085]}>
            <boxGeometry args={[0.16, 0.02, 0.045]} />
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </mesh>

          {/* Keyboard RGB Volumetric Glow */}
          <pointLight 
            ref={keyboardGlowRef} 
            color={rgbColor} 
            intensity={1.2} 
            distance={1.1} 
            position={[0, 0.12, 0]} 
          />
        </group>

        {/* ================= ERGONOMIC WIRELESS GAMING MOUSE ================= */}
        <group position={[0.92, 1.47, 0.35]}>
          {/* Sculpted Mouse Body */}
          <mesh castShadow position={[0, 0.025, 0]}>
            <boxGeometry args={[0.14, 0.045, 0.24]} />
            <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Mouse Wheel & DPI Switch */}
          <mesh position={[0, 0.048, -0.04]}>
            <boxGeometry args={[0.018, 0.012, 0.04]} />
            <meshStandardMaterial color={rgbColor} />
          </mesh>
          {/* Subtle RGB Logo Glow */}
          <mesh position={[0, 0.046, 0.05]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>
        </group>

        {/* ================= ELEGANT ANGLED SMARTPHONE DOCK & OLED PHONE ================= */}
        <group 
          position={[-0.82, 1.46, 0.42]} 
          rotation={[0, 0.35, 0]}
          onClick={onPhoneClick}
        >
          {/* Aluminum Charging Dock Base */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.26, 0.035, 0.24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Angled Backrest Support Arm (45-degree angle) */}
          <mesh position={[0, 0.12, -0.04]} rotation={[-0.45, 0, 0]} castShadow>
            <boxGeometry args={[0.18, 0.22, 0.02]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* OLED Smartphone naturally resting on the dock */}
          <group position={[0, 0.16, 0.01]} rotation={[-0.45, 0, 0]}>
            {/* Phone Body with Polished Titanium Rim */}
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.44, 0.018]} />
              <meshStandardMaterial color="#050811" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Front OLED Screen */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.20, 0.42]} />
              <meshBasicMaterial map={canvasRefs.texPhone} />
            </mesh>
            {/* Camera Bump on Back */}
            <mesh position={[0.05, 0.14, -0.012]}>
              <boxGeometry args={[0.08, 0.08, 0.008]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            {/* Ambient Screen Light */}
            <pointLight 
              ref={phoneGlowRef}
              position={[0, 0, 0.12]} 
              color={rgbColor} 
              intensity={1.1} 
              distance={0.9} 
            />
          </group>
        </group>

        {/* ================= STUDIO HEADPHONES ON STAND ================= */}
        <group position={[-1.25, 1.46, -0.3]}>
          <mesh castShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh castShadow position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.04, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh castShadow position={[0, 0.7, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.5} />
          </mesh>
          <mesh castShadow position={[0, 0.65, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.16, 0.02, 12, 24, Math.PI]} />
            <meshStandardMaterial color="#020617" roughness={0.4} />
          </mesh>
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
        <group position={[-1.6, 1.85, -0.6]} rotation={[0, 0.32, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.7, 0.38]} />
            <meshStandardMaterial color="#0a0f19" roughness={0.5} />
          </mesh>
          <mesh ref={speakerPulseRef1} position={[0, 0.06, 0.195]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 24]} />
            <meshStandardMaterial color={rgbColor} roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.18, 0.195]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 24]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>

        <group position={[1.6, 1.85, -0.6]} rotation={[0, -0.32, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.7, 0.38]} />
            <meshStandardMaterial color="#0a0f19" roughness={0.5} />
          </mesh>
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
          position={[-0.95, 1.46, 0.12]} 
          onClick={onCoffeeClick}
        >
          <mesh castShadow position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.11, 0.09, 0.24, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 24]} />
            <meshStandardMaterial color="#2d1a12" roughness={0.1} />
          </mesh>
          <mesh position={[-0.13, 0.13, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.07, 0.02, 12, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.15} />
          </mesh>
          <points ref={steamRef} position={[0, 0.28, 0]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[steamParticles, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.04}
              color={lightingMood === 'sunset' ? '#fed7aa' : '#ffffff'}
              transparent
              opacity={0.45}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>

        {/* ================= ELGATO STREAM DECK 15-KEY ================= */}
        <group position={[-0.58, 1.48, 0.12]} rotation={[-Math.PI / 8, 0, 0.15]}>
          <mesh castShadow>
            <boxGeometry args={[0.32, 0.04, 0.22]} />
            <meshStandardMaterial color="#0b0f19" roughness={0.4} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.022, 0]}>
            <planeGeometry args={[0.30, 0.20]} />
            <meshBasicMaterial map={canvasRefs.texStreamDeck} />
          </mesh>
        </group>

        {/* ================= STUDIO BROADCAST BOOM ARM & SHURE SM7B MIC ================= */}
        <group position={[-1.9, 1.45, -0.65]}>
          {/* Desk Clamp Base */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          {/* Lower Arm Segment */}
          <mesh position={[0.2, 0.45, 0.3]} rotation={[0.4, 0.3, -0.5]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          {/* Upper Arm Segment */}
          <mesh position={[0.45, 0.8, 0.6]} rotation={[-0.3, 0.2, 0.5]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.7, 12]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          {/* Microphone Body */}
          <group position={[0.68, 0.68, 0.75]} rotation={[0.4, -0.6, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.045, 0.24, 24]} />
              <meshStandardMaterial color="#090d16" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Metal Grille Capsule */}
            <mesh position={[0, 0.14, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.08, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Pop Filter / Shockmount Ring */}
            <mesh position={[0, 0, 0]}>
              <torusGeometry args={[0.065, 0.008, 12, 24]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
          </group>
        </group>

        {/* ================= COILED AVIATOR KEYBOARD CABLE ================= */}
        <group position={[-0.35, 1.46, 0.08]} rotation={[0, 0.25, 0]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.45, 16]} />
            <meshStandardMaterial color={rgbColor} roughness={0.4} />
          </mesh>
          <mesh position={[0.26, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.038, 0.038, 0.08, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* ================= FLAGSHIP OPEN-AIR / CRYSTAL-CLEAR RGB PC RIG ================= */}
        <group 
          position={[1.58, 1.95, 0.08]} 
          onClick={onPcClick}
        >
          {/* Main Dual-Chamber Aluminum Frame with Open Venting */}
          <mesh castShadow>
            <boxGeometry args={[0.66, 1.08, 1.02]} />
            <meshStandardMaterial color="#050811" roughness={0.15} metalness={0.95} />
          </mesh>

          {/* Interior Component Bay Cavity with Ultra-Reflective Backplate */}
          <mesh position={[-0.04, 0, 0]}>
            <boxGeometry args={[0.56, 0.98, 0.94]} />
            <meshStandardMaterial color="#0a0f1d" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Top & Bottom Internal ARGB Neon Glow Strips */}
          <mesh position={[-0.04, 0.45, 0.46]}>
            <boxGeometry args={[0.52, 0.015, 0.015]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>
          <mesh position={[-0.04, -0.45, 0.46]}>
            <boxGeometry args={[0.52, 0.015, 0.015]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>
          <mesh position={[-0.28, 0.45, 0]}>
            <boxGeometry args={[0.015, 0.015, 0.88]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>
          <mesh position={[-0.28, -0.45, 0]}>
            <boxGeometry args={[0.015, 0.015, 0.88]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>

          {/* Front Open-Air Glass Corner / Beveled Crystal Glass */}
          <mesh position={[-0.04, 0, 0.51]}>
            <boxGeometry args={[0.58, 1.0, 0.008]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.06} 
              roughness={0.0} 
              metalness={0.0}
              transmission={0.98} 
            />
          </mesh>

          {/* Left Side Open-Air Panoramic Crystal Glass */}
          <mesh position={[-0.33, 0, 0]}>
            <boxGeometry args={[0.008, 1.0, 0.98]} />
            <meshPhysicalMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.06} 
              roughness={0.0} 
              metalness={0.0}
              transmission={0.98} 
            />
          </mesh>

          {/* Front I/O Diamond-Cut Power Button with Glowing Halo */}
          <group position={[0.26, 0.48, 0.51]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.01, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.006]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.025, 0.004, 8, 24]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            {/* Front USB-C and USB 3.0 Ports */}
            <mesh position={[0, -0.06, 0]}>
              <boxGeometry args={[0.012, 0.03, 0.008]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, -0.11, 0]}>
              <boxGeometry args={[0.02, 0.01, 0.008]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>

          {/* ================= MOTHERBOARD & HIGH-END VRM HEATSINKS ================= */}
          <mesh position={[0.21, 0.08, 0]} castShadow>
            <boxGeometry args={[0.02, 0.74, 0.68]} />
            <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Brushed Aluminum Armor Plates */}
          <mesh position={[0.19, 0.32, -0.15]}>
            <boxGeometry args={[0.025, 0.16, 0.28]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.19, -0.06, 0.06]}>
            <boxGeometry args={[0.025, 0.06, 0.24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Quad RGB DDR5 RAM Sticks with Frosted Lightbars (Super Vivid) */}
          <group position={[0.19, 0.22, 0.10]}>
            {[-0.045, -0.015, 0.015, 0.045].map((offsetZ, idx) => (
              <group key={idx} position={[0, 0, offsetZ]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.016, 0.14, 0.022]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0.065, 0]}>
                  <boxGeometry args={[0.018, 0.018, 0.024]} />
                  <meshBasicMaterial color={rgbColor} />
                </mesh>
              </group>
            ))}
          </group>

          {/* ================= CPU BLOCK WITH REAL ROUND DIGITAL LCD DISPLAY ================= */}
          <group position={[0.19, 0.18, -0.06]}>
            {/* Black Anodized Outer Ring */}
            <mesh rotation={[0, -Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.025, 32]} />
              <meshStandardMaterial color="#060911" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* Chrome Accent Bezel */}
            <mesh position={[-0.013, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <torusGeometry args={[0.088, 0.008, 12, 32]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.98} roughness={0.1} />
            </mesh>
            {/* Active Digital Round LCD Screen */}
            <mesh position={[-0.014, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[0.082, 32]} />
              <meshBasicMaterial map={canvasRefs.texCooler} />
            </mesh>
          </group>

          {/* ================= CYLINDRICAL ACRYLIC RESERVOIR & FLOW INDICATOR ================= */}
          <group position={[-0.14, 0.05, 0.32]}>
            {/* Black Aluminum Mounting Base and Cap */}
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.04, 32]} />
              <meshStandardMaterial color="#090d16" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.32, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.04, 32]} />
              <meshStandardMaterial color="#090d16" metalness={0.9} />
            </mesh>
            {/* Ultra-Clear Acrylic Outer Glass Chamber */}
            <mesh>
              <cylinderGeometry args={[0.07, 0.07, 0.60, 32]} />
              <meshPhysicalMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.15} 
                roughness={0.0} 
                transmission={0.98} 
              />
            </mesh>
            {/* Glowing Vivid Coolant Liquid Cylinder Inside */}
            <mesh>
              <cylinderGeometry args={[0.062, 0.062, 0.54, 32]} />
              <meshStandardMaterial 
                color={rgbColor} 
                roughness={0.1} 
                transparent 
                opacity={0.88} 
                emissive={rgbColor}
                emissiveIntensity={0.5}
              />
            </mesh>
            {/* Spinning Turbine Flow Indicator Wheel */}
            <group ref={flowWheelRef} position={[0, 0.1, 0]}>
              <mesh>
                <cylinderGeometry args={[0.035, 0.035, 0.02, 6]} />
                <meshStandardMaterial color="#ffffff" metalness={0.95} />
              </mesh>
            </group>
          </group>

          {/* ================= HARDLINE RIGID ACRYLIC COOLING TUBES & METALLIC FITTINGS ================= */}
          {/* Tube 1: CPU Block to Top Radiator */}
          <group position={[0.14, 0.34, -0.06]}>
            <mesh>
              <cylinderGeometry args={[0.012, 0.012, 0.28, 16]} />
              <meshPhysicalMaterial color={rgbColor} transparent opacity={0.8} transmission={0.7} emissive={rgbColor} emissiveIntensity={0.4} />
            </mesh>
            {/* Compression Fittings (Chrome Rings) */}
            <mesh position={[0, -0.13, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.025, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
            </mesh>
            <mesh position={[0, 0.13, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.025, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
            </mesh>
          </group>

          {/* Tube 2: Top Radiator to Reservoir */}
          <group position={[0.0, 0.42, 0.18]} rotation={[0, 0, Math.PI / 3.5]}>
            <mesh>
              <cylinderGeometry args={[0.012, 0.012, 0.34, 16]} />
              <meshPhysicalMaterial color={rgbColor} transparent opacity={0.8} transmission={0.7} emissive={rgbColor} emissiveIntensity={0.4} />
            </mesh>
          </group>

          {/* Tube 3: Reservoir to GPU Waterblock */}
          <group position={[-0.08, -0.22, 0.2]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.012, 0.012, 0.22, 16]} />
              <meshPhysicalMaterial color={rgbColor} transparent opacity={0.8} transmission={0.7} emissive={rgbColor} emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[-0.10, 0, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.025, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.98} />
            </mesh>
          </group>

          {/* ================= VERTICAL RTX 4090 CUSTOM WATERBLOCK GPU ================= */}
          <group position={[-0.04, -0.16, 0]}>
            {/* Black Brushed Backplate */}
            <mesh position={[0.08, 0, 0]} castShadow>
              <boxGeometry args={[0.015, 0.20, 0.72]} />
              <meshStandardMaterial color="#090d16" roughness={0.2} metalness={0.9} />
            </mesh>
            {/* Transparent Acrylic Front Waterblock with Micro-Fin Coldplate */}
            <mesh position={[-0.06, 0, 0]}>
              <boxGeometry args={[0.02, 0.18, 0.68]} />
              <meshPhysicalMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.15} 
                roughness={0.02} 
                transmission={0.98} 
              />
            </mesh>
            {/* Internal Nickel-Plated Copper Micro-Fin Channel Glowing with Coolant */}
            <mesh position={[-0.05, 0, 0]}>
              <boxGeometry args={[0.008, 0.14, 0.44]} />
              <meshStandardMaterial color={rgbColor} roughness={0.1} emissive={rgbColor} emissiveIntensity={0.6} />
            </mesh>
            {/* GPU Anti-Sag Column Stand */}
            <mesh position={[-0.18, -0.12, 0.30]}>
              <cylinderGeometry args={[0.015, 0.018, 0.16, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
            </mesh>
            {/* 12VHPWR Custom Braided Sleeved GPU Cable */}
            <mesh position={[0.04, 0.11, 0.14]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.06, 0.08, 0.04]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
          </group>

          {/* ================= 24-PIN ATX MAINBOARD BRAIDED SLEEVED CABLES ================= */}
          <group position={[0.18, 0.06, 0.32]} rotation={[0, -0.3, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.04, 0.16, 0.08]} />
              <meshStandardMaterial color="#1e293b" roughness={0.9} />
            </mesh>
            {/* Transparent Acrylic Cable Comb */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.045, 0.015, 0.085]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
            </mesh>
          </group>

          {/* ================= TRIPLE TOP RADIATOR EXHAUST FANS ================= */}
          <group position={[-0.04, 0.48, 0]}>
            {/* Top 360mm Radiator Chassis */}
            <mesh>
              <boxGeometry args={[0.52, 0.05, 0.88]} />
              <meshStandardMaterial color="#020617" roughness={0.4} metalness={0.9} />
            </mesh>
            {/* Fan 1 (Top Front) */}
            <group ref={fanTop1Ref} position={[0, -0.04, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <torusGeometry args={[0.12, 0.014, 12, 24]} />
                <meshBasicMaterial color={rgbColor} />
              </mesh>
              <mesh>
                <boxGeometry args={[0.20, 0.03, 0.008]} />
                <meshBasicMaterial color={rgbColor} />
              </mesh>
            </group>
            {/* Fan 2 (Top Center) */}
            <group ref={fanTop2Ref} position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <torusGeometry args={[0.12, 0.014, 12, 24]} />
                <meshBasicMaterial color={rgbColor} />
              </mesh>
              <mesh>
                <boxGeometry args={[0.20, 0.03, 0.008]} />
                <meshBasicMaterial color={rgbColor} />
              </mesh>
            </group>
            {/* Fan 3 (Top Rear) */}
            <group ref={fanTop3Ref} position={[0, -0.04, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <torusGeometry args={[0.12, 0.014, 12, 24]} />
                <meshBasicMaterial color={rgbColor} />
              </mesh>
              <mesh>
                <boxGeometry args={[0.20, 0.03, 0.008]} />
                <meshBasicMaterial color={rgbColor} />
              </mesh>
            </group>
          </group>

          {/* ================= TRIPLE SIDE INTAKE INFINITY FANS ================= */}
          {/* Fan 1 (Top Front) */}
          <group ref={fanRef1} position={[0.20, 0.28, 0.44]}>
            <mesh>
              <torusGeometry args={[0.12, 0.014, 12, 24]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.20, 0.03, 0.008]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.20, 0.03, 0.008]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
          </group>

          {/* Fan 2 (Middle Front) */}
          <group ref={fanRef2} position={[0.20, 0.0, 0.44]}>
            <mesh>
              <torusGeometry args={[0.12, 0.014, 12, 24]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.20, 0.03, 0.008]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.20, 0.03, 0.008]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
          </group>

          {/* Fan 3 (Bottom Front) */}
          <group ref={fanRef3} position={[0.20, -0.28, 0.44]}>
            <mesh>
              <torusGeometry args={[0.12, 0.014, 12, 24]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.20, 0.03, 0.008]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.20, 0.03, 0.008]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
          </group>

          {/* ================= REAR EXHAUST FAN ================= */}
          <group ref={fanRearRef} position={[0.08, 0.22, -0.46]} rotation={[0, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.12, 0.014, 12, 24]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.20, 0.03, 0.008]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>
          </group>

          {/* Internal Vivid Volumetric Case RGB Illumination */}
          <pointLight 
            ref={gpuGlowRef} 
            color={rgbColor} 
            intensity={5.5} 
            distance={4.5} 
            position={[-0.05, 0.1, 0.1]} 
          />
          <pointLight 
            color={rgbColor} 
            intensity={3.5} 
            distance={3.0} 
            position={[0.1, -0.2, 0.2]} 
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
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.14, 0.9]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.7, 0.4]} rotation={[-0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 1.2, 0.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.38, 0.48]} castShadow>
          <boxGeometry args={[0.48, 0.22, 0.1]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        <mesh position={[-0.48, 0.4, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0.48, 0.4, 0.05]} castShadow>
          <boxGeometry args={[0.1, 0.06, 0.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.45, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.8, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.06, 5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
      </group>

      {/* ================= COZY SLEEPING CYBER CAT (DEV PET) ================= */}
      <group 
        position={[-1.75, 0.0, 0.45]} 
        onClick={(e) => {
          e.stopPropagation();
          onCatClick();
        }}
      >
        {/* Plush Velvet Bed Cushion */}
        <mesh position={[0, 0.04, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.34, 0.38, 0.08, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.09, 0]} receiveShadow>
          <cylinderGeometry args={[0.31, 0.33, 0.04, 32]} />
          <meshStandardMaterial color="#334155" roughness={0.95} />
        </mesh>

        {/* Cat Main Body with breathing animation */}
        <group ref={catBodyRef} position={[0, 0.18, 0]}>
          {/* Curled Body Torso */}
          <mesh castShadow>
            <sphereGeometry args={[0.19, 24, 24]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>

          {/* Cat Head */}
          <group position={[0.13, 0.04, 0.07]} rotation={[0, -0.3, -0.1]}>
            <mesh castShadow>
              <sphereGeometry args={[0.12, 24, 24]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>

            {/* Left Ear */}
            <mesh position={[-0.04, 0.1, -0.04]} rotation={[-0.2, 0.1, 0.2]}>
              <coneGeometry args={[0.045, 0.08, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>

            {/* Right Ear */}
            <mesh position={[0.06, 0.1, -0.02]} rotation={[-0.2, -0.1, -0.2]}>
              <coneGeometry args={[0.045, 0.08, 4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.7} />
            </mesh>

            {/* Cyber Visor Closed Eyes Line */}
            <mesh position={[0.04, 0.01, 0.1]}>
              <boxGeometry args={[0.09, 0.012, 0.02]} />
              <meshBasicMaterial color={rgbColor} />
            </mesh>

            {/* Cute Pink Nose */}
            <mesh position={[0.04, -0.03, 0.11]}>
              <sphereGeometry args={[0.016, 12, 12]} />
              <meshStandardMaterial color="#f472b6" roughness={0.4} />
            </mesh>
          </group>

          {/* Cyber Collar with Pulsing Holographic Tag */}
          <mesh position={[0.08, 0.08, 0.05]} rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[0.10, 0.014, 12, 24]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.12, 0.01, 0.12]}>
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshBasicMaterial color={rgbColor} />
          </mesh>

          {/* Curled Wagging Tail */}
          <mesh 
            ref={catTailRef} 
            position={[-0.14, 0.02, -0.08]} 
            rotation={[0.3, 0.8, -0.4]}
          >
            <torusGeometry args={[0.12, 0.03, 12, 24, Math.PI * 1.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
        </group>

        {/* Floating "Zzz" Sleep Energy Particles */}
        <points ref={catZzzRef} position={[0.15, 0.35, 0.1]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[catZzzParticles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            color={rgbColor}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Soft Ambient Cat Glow */}
        <pointLight color={rgbColor} intensity={0.5} distance={1.4} position={[0, 0.3, 0]} />
      </group>
    </group>
  );
};
