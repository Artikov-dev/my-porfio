import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  // The YouTube Video ID the user provided
  const videoId = "j8L6IvuYGOQ"; 

  const onReady = (event: YouTubeEvent) => {
    // Access to player in all event handlers via event.target
    setPlayer(event.target);
    event.target.setVolume(30); // 30% volume
  };

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className="fixed bottom-24 left-4 md:bottom-24 md:left-6 z-[90] flex items-end"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Invisible YouTube Player */}
      <div className="hidden">
        <YouTube 
          videoId={videoId} 
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 0,
              controls: 0,
              loop: 1,
              playlist: videoId // Required for looping single video
            }
          }}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
      
      <div 
        className={`
          flex flex-col items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md 
          border border-slate-200 dark:border-slate-800 rounded-full p-2 shadow-lg 
          transition-all duration-300 origin-bottom
          ${showControls ? 'scale-100 opacity-100 mb-4 pointer-events-auto' : 'scale-75 opacity-0 mb-0 pointer-events-none'}
        `}
      >
        <button 
          onClick={toggleMute}
          className="p-3 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700 my-1"></div>
        <button 
          onClick={togglePlay}
          className="p-3 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          title={isPlaying ? "To'xtatish" : "O'ynash"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      <button
        onClick={togglePlay}
        className={`
          relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full 
          shadow-lg backdrop-blur-md border border-slate-200 dark:border-slate-800
          transition-all duration-300 z-10
          ${isPlaying ? 'bg-primary text-white animate-pulse' : 'bg-white/80 dark:bg-slate-900/80 text-primary hover:bg-primary/10'}
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
