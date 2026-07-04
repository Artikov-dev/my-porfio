import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Lofi stream (royalty free stream or sample)
  const lofiStreamUrl = "https://stream.zeno.fm/f3wvbbqmdg8uv"; // Lofi radio stream example

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      className="fixed bottom-24 left-6 z-[90] flex items-end"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <audio ref={audioRef} src={lofiStreamUrl} loop preload="none" />
      
      <div 
        className={`
          flex flex-col items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md 
          border border-slate-200 dark:border-slate-800 rounded-full p-2 shadow-lg 
          transition-all duration-300 origin-bottom
          ${showControls ? 'scale-100 opacity-100 mb-4' : 'scale-75 opacity-0 mb-0 pointer-events-none'}
        `}
      >
        <button 
          onClick={toggleMute}
          className="p-3 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700 my-1"></div>
        <button 
          onClick={togglePlay}
          className="p-3 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      <button
        onClick={togglePlay}
        className={`
          relative flex items-center justify-center w-12 h-12 rounded-full 
          shadow-lg backdrop-blur-md border border-slate-200 dark:border-slate-800
          transition-all duration-300 z-10
          ${isPlaying ? 'bg-primary text-white animate-pulse' : 'bg-white/80 dark:bg-slate-900/80 text-primary hover:bg-primary/10'}
        `}
      >
        <Music size={20} className={isPlaying ? 'animate-spin-slow' : ''} />
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
