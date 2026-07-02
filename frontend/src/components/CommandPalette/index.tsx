import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderGit2, BookOpen, User, X } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 px-4 sm:px-0 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center px-4 py-3 border-b border-border">
            <Search className="w-5 h-5 text-foreground/60 mr-3" />
            <input
              type="text"
              autoFocus
              className="w-full bg-transparent text-foreground dark:text-white outline-none placeholder-gray-500"
              placeholder="Type a command or search..."
            />
            <button onClick={() => setOpen(false)} className="text-foreground/60 hover:text-foreground dark:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </div>
            <button className="w-full flex items-center px-3 py-3 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground dark:text-white rounded-md transition-colors text-left cursor-pointer">
              <FolderGit2 className="w-4 h-4 mr-3" /> Projects
            </button>
            <button className="w-full flex items-center px-3 py-3 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground dark:text-white rounded-md transition-colors text-left cursor-pointer">
              <BookOpen className="w-4 h-4 mr-3" /> Blog
            </button>
            <button className="w-full flex items-center px-3 py-3 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground dark:text-white rounded-md transition-colors text-left cursor-pointer">
              <User className="w-4 h-4 mr-3" /> Contact
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
