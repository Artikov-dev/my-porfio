import React, { useState, useEffect } from 'react';
import { DevRoomScene, CameraPreset } from '../DevRoom/DevRoomScene';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';
import { useSound } from '@/hooks/useSound';
import { 
  Sparkles, 
  RotateCw, 
  Sun, 
  Moon, 
  Coffee, 
  Monitor, 
  Cpu, 
  Keyboard, 
  Compass, 
  Code2, 
  Terminal, 
  Activity, 
  GitBranch, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Building2,
  Atom,
  Binary,
  Lightbulb,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

const RGB_PALETTE = [
  { name: 'Teal Emerald', color: '#14b8a6' },
  { name: 'Cyber Magenta', color: '#ec4899' },
  { name: 'Matrix Green', color: '#22c55e' },
  { name: 'Electric Blue', color: '#3b82f6' },
  { name: 'Vibrant Purple', color: '#a855f7' },
  { name: 'Neon Amber', color: '#f59e0b' },
];

const MONITOR_MODES = [
  { id: 0, name: 'VS Code Typer', icon: Code2, desc: 'Real-time Live TypeScript Editor' },
  { id: 1, name: 'Matrix Rain', icon: Terminal, desc: 'Cyber Cascading Code Stream' },
  { id: 2, name: 'System Telemetry', icon: Activity, desc: 'Live CPU, RAM & 60 FPS Monitor' },
  { id: 3, name: 'GitHub Stream', icon: GitBranch, desc: 'Streaming Recent Commit Log' },
];

const HOLOGRAM_NAMES = [
  { name: 'React 3D Atom', color: '#38bdf8' },
  { name: 'TypeScript Hypercube', color: '#3b82f6' },
  { name: 'Node.js Hexagon Prism', color: '#22c55e' },
  { name: 'AI Neural Network Cluster', color: '#ec4899' },
];

export const DevRoomSection: React.FC = () => {
  const { t } = useI18n();
  const { 
    playClick, 
    playHover, 
    playMechanicalClick, 
    playSip, 
    playCyberSwitch, 
    playWhoosh, 
    playGlitch,
    playNotification
  } = useSound();

  const [rgbIndex, setRgbIndex] = useState(0);
  const [lightingMood, setLightingMood] = useState<'neon' | 'night' | 'sunset' | 'matrix'>('neon');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('orbit');
  const [autoRotate, setAutoRotate] = useState(true);
  const [monitorMode, setMonitorMode] = useState<number>(0);
  const [hologramIndex, setHologramIndex] = useState<number>(0);
  const [lampOn, setLampOn] = useState<boolean>(true);
  const [keyboardFlashTrigger, setKeyboardFlashTrigger] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const activeRgb = RGB_PALETTE[rgbIndex].color;

  // ⌨️ Physical Keyboard Live Typing Sync
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively writing in input or textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (soundEnabled) playMechanicalClick();
      setKeyboardFlashTrigger(Date.now());
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [soundEnabled, playMechanicalClick]);

  const cycleRgb = () => {
    if (soundEnabled) playCyberSwitch();
    const next = (rgbIndex + 1) % RGB_PALETTE.length;
    setRgbIndex(next);
    toast.success(`360° RGB Desk Theme: ${RGB_PALETTE[next].name}`, {
      icon: '🌈',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: `1px solid ${RGB_PALETTE[next].color}`,
      },
    });
  };

  const handleCoffeeSip = () => {
    if (soundEnabled) playSip();
    toast.success('Fresh Espresso Sip! Focus +100% ☕', {
      icon: '☕',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: '1px solid #f59e0b',
      },
    });
  };

  const handleMonitorSwitch = () => {
    if (soundEnabled) playCyberSwitch();
    const nextMode = (monitorMode + 1) % MONITOR_MODES.length;
    setMonitorMode(nextMode);
    toast(`Switched Display: ${MONITOR_MODES[nextMode].name}`, {
      icon: '🖥️',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: '1px solid #38bdf8',
      },
    });
  };

  const handleHologramClick = () => {
    if (soundEnabled) playCyberSwitch();
    const nextHolo = (hologramIndex + 1) % HOLOGRAM_NAMES.length;
    setHologramIndex(nextHolo);
    toast.success(`Hologram: ${HOLOGRAM_NAMES[nextHolo].name} 🛸`, {
      icon: '✨',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: `1px solid ${HOLOGRAM_NAMES[nextHolo].color}`,
      },
    });
  };

  const handleLampToggle = () => {
    if (soundEnabled) playMechanicalClick();
    setLampOn(prev => !prev);
    toast(!lampOn ? '💡 ScreenBar Lamp: ON (Eye-Care Glow)' : '💡 ScreenBar Lamp: OFF', {
      icon: '💡',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: '1px solid #eab308',
      },
    });
  };

  const handleCatClick = () => {
    if (soundEnabled) playWhoosh();
    toast.success('😸 Cyber Kitty: Purr... (Focus Aura +100%) 🐾', {
      icon: '🐱',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: '1px solid #f472b6',
      },
    });
  };

  const handleKeyboardClick = () => {
    if (soundEnabled) playMechanicalClick();
    setKeyboardFlashTrigger(Date.now());
    toast('Custom 75% Mechanical Click ⌨️ (Type any key on your keyboard!)', {
      icon: '⌨️',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: `1px solid ${activeRgb}`,
      },
    });
  };

  const handleChairClick = () => {
    if (soundEnabled) playWhoosh();
    toast('Ergonomic Chair 360° Swivel 🪑', {
      icon: '✨',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: '1px solid #6366f1',
      },
    });
  };

  const handleNeonClick = () => {
    if (soundEnabled) playGlitch();
    toast('Cyber Neon Glitch Toggled ⚡', {
      icon: '💡',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: `1px solid ${activeRgb}`,
      },
    });
  };

  const handlePhoneClick = () => {
    if (soundEnabled) playNotification();
    toast.success('Telegram: "Client inquiry for High-Scale Web Architecture!" 💬', {
      icon: '📱',
      style: {
        borderRadius: '12px',
        background: '#0a0f1d',
        color: '#fff',
        border: '1px solid #38bdf8',
      },
    });
  };

  const switchCamera = (preset: CameraPreset) => {
    if (soundEnabled) playWhoosh();
    setCameraPreset(preset);
    if (preset !== 'orbit') setAutoRotate(false);
  };

  return (
    <section id="workspace" className="py-20 md:py-32 px-4 md:px-6 relative max-w-7xl mx-auto">
      {/* Background Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] md:w-[1000px] h-[550px] blur-[160px] rounded-full pointer-events-none opacity-20 transition-colors duration-700 -z-10"
        style={{ backgroundColor: lightingMood === 'matrix' ? '#22c55e' : (lightingMood === 'sunset' ? '#f59e0b' : activeRgb) }}
      />

      {/* Section Header */}
      <ScrollReveal>
        <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 border border-primary/20 backdrop-blur-md">
            <Sparkles size={16} className="animate-spin-slow" />
            <span>{t('workspace_badge') || 'Hyper-Interactive 3D Studio'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {t('workspace_title') || 'Virtual Developer Workspace'}
          </h2>
          <p className="text-foreground/60 max-w-2xl text-base md:text-lg">
            {t('workspace_desc') || 'Explore my 3D developer studio. Enjoy the sunset sunbeams, project 3D floating holograms, pet the sleeping cyber cat, and type on your physical keyboard to sync with the 3D setup!'}
          </p>
        </div>
      </ScrollReveal>

      {/* 3D Canvas Stage Container */}
      <ScrollReveal delay={0.2}>
        <div className="relative w-full h-[580px] sm:h-[660px] md:h-[760px] rounded-3xl glass border border-white/10 overflow-hidden shadow-2xl bg-gradient-to-b from-background/40 to-background/95 group">
          {/* 3D Scene */}
          <DevRoomScene
            rgbColor={activeRgb}
            lightingMood={lightingMood}
            cameraPreset={cameraPreset}
            autoRotate={autoRotate}
            monitorMode={monitorMode}
            hologramIndex={hologramIndex}
            lampOn={lampOn}
            keyboardFlashTrigger={keyboardFlashTrigger}
            onCoffeeClick={handleCoffeeSip}
            onPcClick={cycleRgb}
            onMonitorClick={handleMonitorSwitch}
            onNeonClick={handleNeonClick}
            onKeyboardClick={handleKeyboardClick}
            onChairClick={handleChairClick}
            onPhoneClick={handlePhoneClick}
            onHologramClick={handleHologramClick}
            onCatClick={handleCatClick}
            onLampClick={handleLampToggle}
          />

          {/* Top Control Bar (HUD) */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none z-20">
            {/* Cinematic Camera Angle Presets */}
            <div className="flex items-center gap-1 p-1 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg pointer-events-auto overflow-x-auto max-w-full">
              <button
                onClick={() => switchCamera('orbit')}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  cameraPreset === 'orbit' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                title="Full 3D Overview"
              >
                <Compass size={14} /> <span className="hidden sm:inline">Overview</span>
              </button>
              <button
                onClick={() => switchCamera('monitor')}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  cameraPreset === 'monitor' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                title="Ultra-wide Monitor Focus"
              >
                <Monitor size={14} /> <span className="hidden sm:inline">Monitor</span>
              </button>
              <button
                onClick={() => switchCamera('pc')}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  cameraPreset === 'pc' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                title="PC Rig Showcase"
              >
                <Cpu size={14} /> <span className="hidden sm:inline">PC Rig</span>
              </button>
              <button
                onClick={() => switchCamera('cat')}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  cameraPreset === 'cat' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                title="Cozy Sleeping Cyber Cat"
              >
                <Heart size={14} className="text-pink-400" /> <span className="hidden sm:inline">Cyber Cat</span>
              </button>
              <button
                onClick={() => switchCamera('lamp')}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  cameraPreset === 'lamp' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                title="Desk ScreenBar & Lamp"
              >
                <Lightbulb size={14} className="text-amber-400" /> <span className="hidden sm:inline">Lamp</span>
              </button>
              <button
                onClick={() => switchCamera('window')}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  cameraPreset === 'window' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                title="Cyber City Skyline Window"
              >
                <Building2 size={14} /> <span className="hidden sm:inline">City View</span>
              </button>
              <button
                onClick={() => switchCamera('cozy')}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  cameraPreset === 'cozy' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                title="Coffee & Books Corner"
              >
                <Coffee size={14} /> <span className="hidden sm:inline">Cozy</span>
              </button>
            </div>

            {/* Right Tools (Lighting Mood, RGB Swatches & Audio) */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Lighting Mood Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg">
                <button
                  onClick={() => { if (soundEnabled) playClick(); setLightingMood('neon'); }}
                  onMouseEnter={playHover}
                  className={`p-2 rounded-xl text-xs transition-all ${
                    lightingMood === 'neon' 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md' 
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                  title="Cyber Neon Lighting"
                >
                  <Sparkles size={15} />
                </button>
                <button
                  onClick={() => { if (soundEnabled) playClick(); setLightingMood('night'); }}
                  onMouseEnter={playHover}
                  className={`p-2 rounded-xl text-xs transition-all ${
                    lightingMood === 'night' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-md' 
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                  title="Midnight Blue"
                >
                  <Moon size={15} />
                </button>
                <button
                  onClick={() => { if (soundEnabled) playClick(); setLightingMood('sunset'); }}
                  onMouseEnter={playHover}
                  className={`p-2 rounded-xl text-xs transition-all ${
                    lightingMood === 'sunset' 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md' 
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                  title="🌅 Golden Sunset Sunbeams"
                >
                  <Sun size={15} />
                </button>
                <button
                  onClick={() => { if (soundEnabled) playClick(); setLightingMood('matrix'); }}
                  onMouseEnter={playHover}
                  className={`p-2 rounded-xl text-xs transition-all ${
                    lightingMood === 'matrix' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md' 
                      : 'text-foreground/60 hover:text-foreground'
                  }`}
                  title="🌌 Cyberpunk Matrix Fog"
                >
                  <Binary size={15} />
                </button>
              </div>

              {/* RGB Swatches (Controls 360° Desk & PC Underglow) */}
              <div className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg">
                {RGB_PALETTE.map((swatch, idx) => (
                  <button
                    key={swatch.color}
                    onClick={() => {
                      if (soundEnabled) playClick();
                      setRgbIndex(idx);
                    }}
                    onMouseEnter={playHover}
                    className={`w-5 h-5 rounded-full transition-transform ${
                      rgbIndex === idx ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: swatch.color }}
                    title={`360° Desk RGB: ${swatch.name}`}
                  />
                ))}
              </div>

              {/* Sound FX Toggle */}
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  toast(soundEnabled ? 'Dev Room Audio Muted 🔇' : 'Dev Room Audio Active 🔊');
                }}
                onMouseEnter={playHover}
                className={`p-2 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg transition-all ${
                  soundEnabled ? 'text-primary border-primary/30 bg-primary/10' : 'text-foreground/40 hover:text-foreground'
                }`}
                title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Auto Rotate Toggle */}
              <button
                onClick={() => {
                  if (soundEnabled) playClick();
                  setAutoRotate(!autoRotate);
                }}
                onMouseEnter={playHover}
                className={`p-2 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg transition-all ${
                  autoRotate ? 'text-primary border-primary/40 bg-primary/10' : 'text-foreground/60 hover:text-foreground'
                }`}
                title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              >
                <RotateCw size={16} className={autoRotate ? 'animate-spin-slow' : ''} />
              </button>
            </div>
          </div>

          {/* Bottom Interactive Screen & Objects Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 pointer-events-none z-20">
            {/* Monitor Screen Mode Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg pointer-events-auto overflow-x-auto max-w-full">
              {MONITOR_MODES.map((mode) => {
                const IconComponent = mode.icon;
                const isActive = monitorMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      if (soundEnabled) playCyberSwitch();
                      setMonitorMode(mode.id);
                    }}
                    onMouseEnter={playHover}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md' 
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    <IconComponent size={14} />
                    <span>{mode.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Interactive Items */}
            <div className="flex items-center gap-2 text-xs font-medium text-foreground/80 pointer-events-auto overflow-x-auto max-w-full">
              <button 
                onClick={handleCatClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-pink-400/50 transition-colors shadow-md text-pink-400 whitespace-nowrap"
                title="Pet the Sleeping Cyber Cat"
              >
                <Heart size={14} className="text-pink-400" /> <span>Cat</span>
              </button>
              <button 
                onClick={handleLampToggle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-amber-400/50 transition-colors shadow-md text-amber-400 whitespace-nowrap"
                title="Toggle ScreenBar Lamp"
              >
                <Lightbulb size={14} className="text-amber-400" /> <span>{lampOn ? 'Lamp (ON)' : 'Lamp (OFF)'}</span>
              </button>
              <button 
                onClick={handleHologramClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-cyan-400/50 transition-colors shadow-md text-cyan-400 whitespace-nowrap"
                title="Project 3D Floating Tech Hologram"
              >
                <Atom size={14} /> <span>Holo</span>
              </button>
              <button 
                onClick={handleKeyboardClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-primary/50 transition-colors shadow-md whitespace-nowrap"
                title="Type on Keyboard or use your physical keys!"
              >
                <Keyboard size={14} className="text-primary" /> <span className="hidden md:inline">Live Typing</span>
              </button>
              <button 
                onClick={handlePhoneClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-cyan-400/50 transition-colors shadow-md whitespace-nowrap"
                title="Check SmartPhone Notifications"
              >
                <Smartphone size={14} className="text-cyan-400" /> <span className="hidden md:inline">Phone</span>
              </button>
              <button 
                onClick={handleChairClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-indigo-400/50 transition-colors shadow-md whitespace-nowrap"
                title="Spin Ergonomic Chair"
              >
                <Sparkles size={14} className="text-indigo-400" /> <span className="hidden md:inline">Chair</span>
              </button>
              <button 
                onClick={handleCoffeeSip}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-amber-400/50 transition-colors shadow-md whitespace-nowrap"
                title="Sip Hot Espresso"
              >
                <Coffee size={14} className="text-amber-400" /> <span className="hidden md:inline">Coffee</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

