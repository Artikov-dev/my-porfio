import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import type { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { useI18n } from '@/contexts/I18nContext';

// The YouTube iframe + API script is ~1MB; only load it once the user presses play
const YouTube = React.lazy(() => import('react-youtube'));

// Touch screens have no hover, so the mute/pause panel is shown while music plays
const isTouchDevice = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

export const MusicPlayer = () => {
  // isPlaying only follows the player's real state events, so the UI never claims music
  // is playing when the browser blocked it (e.g. iOS refusing playback outside a tap)
  const [isPlaying, setIsPlaying] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);
  const pendingPlayRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [activated, setActivated] = useState(false);
  const [isTouch] = useState(isTouchDevice);
  const { t } = useI18n();

  // The YouTube Video ID the user provided
  const videoId = "j8L6IvuYGOQ";

  const setPending = (value: boolean) => {
    pendingPlayRef.current = value;
    setPendingPlay(value);
  };

  // If playback never starts (blocked by the browser), drop the "starting" state so the next
  // tap — now with a ready player — calls playVideo() directly inside the user gesture
  useEffect(() => {
    if (!pendingPlay) return;
    const timer = setTimeout(() => setPending(false), 6000);
    return () => clearTimeout(timer);
  }, [pendingPlay]);

  const onReady = (event: YouTubeEvent) => {
    // Access to player in all event handlers via event.target
    setPlayer(event.target);
    event.target.setVolume(30); // 30% volume
    if (isMuted) event.target.mute();
    // The player may be preloaded on hover/touch; only start if play was actually requested
    if (pendingPlayRef.current) event.target.playVideo();
  };

  // Start loading the player as soon as the user shows interest, so that by the click it is
  // usually ready and playVideo() runs inside the click itself (required by mobile browsers)
  const preload = () => {
    if (!activated) setActivated(true);
  };

  const togglePlay = () => {
    if (!player) {
      setActivated(true);
      setPending(!pendingPlayRef.current);
      return;
    }
    if (isPlaying) {
      player.pauseVideo();
    } else {
      setPending(true);
      player.playVideo();
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
    }
    // Before the player exists, the choice is applied in onReady
    setIsMuted(!isMuted);
  };

  const onStateChange = (event: YouTubeEvent) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) {
      setIsPlaying(true);
      setPending(false);
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
      setPending(false);
    }
  };

  const controlsVisible = showControls || (isTouch && isPlaying);
  const busy = pendingPlay && !isPlaying;

  return (
    <div
      className="fixed bottom-24 left-4 md:bottom-24 md:left-6 z-[90] flex items-end"
      onMouseEnter={() => {
        setShowControls(true);
        preload();
      }}
      onMouseLeave={() => setShowControls(false)}
      onTouchStart={preload}
      onFocus={() => {
        setShowControls(true);
        preload();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setShowControls(false);
      }}
    >
      {/* Invisible YouTube Player */}
      <div className="hidden">
        {activated && (
        <Suspense fallback={null}>
        <YouTube
          videoId={videoId} 
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 0,
              controls: 0,
              loop: 1,
              playlist: videoId,
              enablejsapi: 1,
              origin: typeof window !== 'undefined' ? window.location.origin : 'https://artikov.dev'
            }
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
        </Suspense>
        )}
      </div>
      
      <div 
        className={`
          flex flex-col items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md 
          border border-slate-200 dark:border-slate-800 rounded-full p-2 shadow-lg 
          transition-all duration-300 origin-bottom
          ${controlsVisible ? 'scale-100 opacity-100 mb-4 pointer-events-auto' : 'scale-75 opacity-0 mb-0 pointer-events-none'}
        `}
      >
        <button 
          onClick={toggleMute}
          className="p-3 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          title={isMuted ? t('music_unmute') : t('music_mute')}
          aria-label={isMuted ? t('music_unmute') : t('music_mute')}
          tabIndex={controlsVisible ? 0 : -1}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700 my-1"></div>
        <button 
          onClick={togglePlay}
          className="p-3 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          title={isPlaying ? t('music_pause') : t('music_play')}
          aria-label={isPlaying ? t('music_pause') : t('music_play')}
          tabIndex={controlsVisible ? 0 : -1}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      <button
        onClick={togglePlay}
        aria-label={isPlaying ? t('music_pause') : t('music_play')}
        aria-pressed={isPlaying}
        aria-busy={busy}
        className={`
          relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full 
          shadow-lg backdrop-blur-md border border-slate-200 dark:border-slate-800
          transition-all duration-300 z-10
          ${isPlaying ? 'bg-primary text-white animate-pulse' : busy ? 'bg-primary/60 text-white animate-pulse' : 'bg-white/80 dark:bg-slate-900/80 text-primary hover:bg-primary/10'}
        `}
      >
        <Music size={18} className={isPlaying ? 'animate-spin-slow' : ''} />
        {isPlaying && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>
      
      <style>{`
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
      `}</style>
    </div>
  );
};
