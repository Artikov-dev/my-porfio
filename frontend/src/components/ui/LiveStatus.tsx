import React from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useI18n } from '@/contexts/I18nContext';

export const LiveStatus = () => {
  const { activeUsers } = useSocket();
  const { t } = useI18n();

  // 0 = not connected (backend asleep / offline): show nothing rather than a made-up "1"
  if (activeUsers < 1) return null;

  return (
    <div className="fixed bottom-8 left-8 z-50 hidden md:flex items-center gap-3 glass px-4 py-2 rounded-full border border-white/5">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
      <span className="text-xs font-medium text-foreground/60">
        <strong className="text-foreground dark:text-white">{activeUsers}</strong> {t('viewing_now')}
      </span>
    </div>
  );
};
