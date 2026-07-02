import React from 'react';
import { useSocket } from '@/hooks/useSocket';

export const LiveStatus = () => {
  const { activeUsers } = useSocket();

  return (
    <div className="fixed bottom-8 left-8 z-50 hidden md:flex items-center gap-3 glass px-4 py-2 rounded-full border border-white/5">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      <span className="text-xs font-medium text-foreground/60">
        <strong className="text-foreground dark:text-white">{activeUsers || 1}</strong> viewing now
      </span>
    </div>
  );
};
