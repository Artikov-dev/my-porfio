import React, { useState } from 'react';
import { DevRoomScene } from '../DevRoom/DevRoomScene';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useI18n } from '@/contexts/I18nContext';
import { useSound } from '@/hooks/useSound';
import { 
  Sparkles, 
  RotateCw, 
  Sun, 
  Moon, 
  Flame, 
  Coffee, 
  Monitor, 
  Cpu, 
  Layers
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

export const DevRoomSection: React.FC = () => {
  const { t } = useI18n();
  const { playClick, playHover } = useSound();

  const [rgbIndex, setRgbIndex] = useState(0);
  const [lightingMood, setLightingMood] = useState<'neon' | 'night' | 'sunset'>('neon');
  const [autoRotate, setAutoRotate] = useState(true);

  const activeRgb = RGB_PALETTE[rgbIndex].color;

  const cycleRgb = () => {
    playClick();
    const next = (rgbIndex + 1) % RGB_PALETTE.length;
    setRgbIndex(next);
    toast.success(`RGB Theme: ${RGB_PALETTE[next].name}`, {
      icon: '🖥️',
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#fff',
        border: `1px solid ${RGB_PALETTE[next].color}`,
      },
    });
  };

  const handleCoffeeSip = () => {
    playClick();
    toast.success('Espresso Boosted! Focus +100% ☕', {
      icon: '☕',
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #f59e0b',
      },
    });
  };

  const handleMonitorSwitch = () => {
    playClick();
    toast('Code Display Switched 💻', {
      icon: '⚡',
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #38bdf8',
      },
    });
  };

  const handleNeonToggle = () => {
    playClick();
    toast('Neon Tube Toggled 💡', {
      icon: '✨',
      style: {
        borderRadius: '12px',
        background: '#0f172a',
        color: '#fff',
        border: `1px solid ${activeRgb}`,
      },
    });
  };

  return (
    <section id="workspace" className="py-20 md:py-32 px-4 md:px-6 relative max-w-7xl mx-auto">
      {/* Background Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[500px] blur-[150px] rounded-full pointer-events-none opacity-20 transition-colors duration-700 -z-10"
        style={{ backgroundColor: activeRgb }}
      />

      {/* Section Header */}
      <ScrollReveal>
        <div className="flex flex-col items-center justify-center text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4 border border-primary/20 backdrop-blur-md">
            <Sparkles size={16} className="animate-spin-slow" />
            <span>{t('workspace_badge') || 'Interactive 3D Experience'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            {t('workspace_title') || 'Virtual Developer Workspace'}
          </h2>
          <p className="text-foreground/60 max-w-2xl text-base md:text-lg">
            {t('workspace_desc') || 'Explore my virtual high-performance coding setup in 3D. Click objects to interact, switch RGB lighting, and change room moods.'}
          </p>
        </div>
      </ScrollReveal>

      {/* 3D Canvas Stage Container */}
      <ScrollReveal delay={0.2}>
        <div className="relative w-full h-[540px] sm:h-[620px] md:h-[720px] rounded-3xl glass border border-white/10 overflow-hidden shadow-2xl bg-gradient-to-b from-background/40 to-background/90 group">
          {/* 3D Scene */}
          <DevRoomScene
            rgbColor={activeRgb}
            lightingMood={lightingMood}
            autoRotate={autoRotate}
            onCoffeeClick={handleCoffeeSip}
            onPcClick={cycleRgb}
            onMonitorClick={handleMonitorSwitch}
            onNeonClick={handleNeonToggle}
          />

          {/* Top Control Bar (HUD) */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
            {/* Lighting Mood Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg pointer-events-auto">
              <button
                onClick={() => { playClick(); setLightingMood('neon'); }}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  lightingMood === 'neon' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <Sparkles size={14} /> Cyber Neon
              </button>
              <button
                onClick={() => { playClick(); setLightingMood('night'); }}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  lightingMood === 'night' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <Moon size={14} /> Midnight
              </button>
              <button
                onClick={() => { playClick(); setLightingMood('sunset'); }}
                onMouseEnter={playHover}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  lightingMood === 'sunset' 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md' 
                    : 'text-foreground/60 hover:text-foreground'
                }`}
              >
                <Sun size={14} /> Golden Hour
              </button>
            </div>

            {/* Quick Actions (Auto-Rotate & RGB Swatches) */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* RGB Swatches */}
              <div className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg">
                {RGB_PALETTE.map((swatch, idx) => (
                  <button
                    key={swatch.color}
                    onClick={() => {
                      playClick();
                      setRgbIndex(idx);
                    }}
                    onMouseEnter={playHover}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      rgbIndex === idx ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: swatch.color }}
                    title={swatch.name}
                  />
                ))}
              </div>

              {/* Auto Rotate Toggle */}
              <button
                onClick={() => {
                  playClick();
                  setAutoRotate(!autoRotate);
                }}
                onMouseEnter={playHover}
                className={`p-2.5 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg transition-all ${
                  autoRotate ? 'text-primary border-primary/40 bg-primary/10' : 'text-foreground/60 hover:text-foreground'
                }`}
                title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
              >
                <RotateCw size={18} className={autoRotate ? 'animate-spin-slow' : ''} />
              </button>
            </div>
          </div>

          {/* Bottom Interactive Hints HUD */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none z-20">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-foreground/80 pointer-events-auto">
              <span 
                onClick={handleMonitorSwitch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-primary/50 transition-colors shadow-md"
              >
                <Monitor size={14} className="text-primary" /> Click Monitor
              </span>
              <span 
                onClick={handleCoffeeSip}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-amber-400/50 transition-colors shadow-md"
              >
                <Coffee size={14} className="text-amber-400" /> Click Coffee
              </span>
              <span 
                onClick={cycleRgb}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-emerald-400/50 transition-colors shadow-md"
              >
                <Cpu size={14} className="text-emerald-400" /> Click PC Tower
              </span>
              <span 
                onClick={handleNeonToggle}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-white/10 backdrop-blur-md cursor-pointer hover:border-purple-400/50 transition-colors shadow-md"
              >
                <Flame size={14} className="text-purple-400" /> Click Neon Sign
              </span>
            </div>

            <div className="text-[11px] font-mono text-foreground/50 glass px-3 py-1.5 rounded-xl border border-white/5 backdrop-blur-md hidden sm:block">
              🖱️ Drag to Orbit • Scroll to Zoom
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
