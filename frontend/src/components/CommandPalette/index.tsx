import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FolderGit2, 
  BookOpen, 
  User, 
  Home, 
  Code2, 
  Briefcase, 
  FileText, 
  Sun, 
  Moon, 
  Globe, 
  Terminal as TerminalIcon, 
  Download, 
  Send, 
  X,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useSound } from '@/hooks/useSound';

// Custom Social Icons
const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface CommandItem {
  id: string;
  category: 'navigation' | 'actions' | 'social';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string[];
  action: () => void;
}

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { playClick, playHover } = useSound();
  
  const listRef = useRef<HTMLDivElement>(null);

  // Shortcut to toggle palette (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const closePalette = () => {
    setOpen(false);
    setSearch('');
    setSelectedIndex(0);
  };

  const handleNavigate = (path: string, hashId?: string) => {
    playClick();
    closePalette();
    if (hashId) {
      if (window.location.pathname !== '/') {
        navigate('/#' + hashId);
      } else {
        document.getElementById(hashId)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const items: CommandItem[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-home',
      category: 'navigation',
      title: t('home') || 'Home',
      subtitle: 'Go to main overview page',
      icon: Home,
      keywords: ['home', 'main', 'start', 'asosiy', 'главная'],
      action: () => handleNavigate('/', 'home'),
    },
    {
      id: 'nav-projects',
      category: 'navigation',
      title: t('projects') || 'Projects',
      subtitle: 'Explore full-stack portfolio projects',
      icon: FolderGit2,
      keywords: ['projects', 'apps', 'portfolio', 'loyihalar', 'проекты', 'work'],
      action: () => handleNavigate('/projects'),
    },
    {
      id: 'nav-blogs',
      category: 'navigation',
      title: t('blog') || 'Blogs & Articles',
      subtitle: 'Technical articles and guides',
      icon: BookOpen,
      keywords: ['blog', 'articles', 'posts', 'maqolalar', 'статьи'],
      action: () => handleNavigate('/blogs'),
    },
    {
      id: 'nav-resume',
      category: 'navigation',
      title: t('view_resume') || 'Interactive Resume',
      subtitle: 'View and download CV (PDF)',
      icon: FileText,
      keywords: ['resume', 'cv', 'rezyume', 'резюме', 'experience', 'pdf'],
      action: () => handleNavigate('/resume'),
    },
    {
      id: 'nav-about',
      category: 'navigation',
      title: t('about_me') || 'About Me',
      subtitle: 'Bio, philosophy and background',
      icon: User,
      keywords: ['about', 'bio', 'haqimda', 'обо мне', 'roma artikov'],
      action: () => handleNavigate('/', 'about'),
    },
    {
      id: 'nav-skills',
      category: 'navigation',
      title: t('skills_title') || 'Skills & Tech Stack',
      subtitle: 'React, Node.js, TypeScript, PostgreSQL...',
      icon: Code2,
      keywords: ['skills', 'tech', 'stack', 'konikmalar', 'навыки', 'react', 'node'],
      action: () => handleNavigate('/', 'skills'),
    },
    {
      id: 'nav-experience',
      category: 'navigation',
      title: t('work_experience') || 'Experience',
      subtitle: 'Career timeline & work history',
      icon: Briefcase,
      keywords: ['experience', 'work', 'job', 'tajriba', 'опыт'],
      action: () => handleNavigate('/', 'experience'),
    },
    {
      id: 'nav-contact',
      category: 'navigation',
      title: t('contact') || 'Contact',
      subtitle: 'Get in touch directly',
      icon: Send,
      keywords: ['contact', 'email', 'message', 'aloqa', 'контакты'],
      action: () => handleNavigate('/', 'contact'),
    },

    // Actions
    {
      id: 'act-theme',
      category: 'actions',
      title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: `Current theme: ${theme}`,
      icon: theme === 'dark' ? Sun : Moon,
      keywords: ['theme', 'mode', 'dark', 'light', 'rejim', 'qorongu', 'yorug'],
      action: () => {
        playClick();
        toggleTheme();
        closePalette();
      },
    },
    {
      id: 'act-lang-en',
      category: 'actions',
      title: 'Change Language to English',
      subtitle: language === 'en' ? 'Currently Active' : 'Switch UI language to EN',
      icon: Globe,
      keywords: ['language', 'english', 'en', 'til', 'ingliz', 'язык', 'английский'],
      action: () => {
        playClick();
        setLanguage('en');
        closePalette();
      },
    },
    {
      id: 'act-lang-uz',
      category: 'actions',
      title: "Tilni O'zbekchaga o'zgartirish",
      subtitle: language === 'uz' ? 'Hozirda faol' : "Interfeys tilini o'zbekchaga o'tkazish",
      icon: Globe,
      keywords: ['language', 'uzbek', 'uz', 'til', 'ozbek', 'узбекский'],
      action: () => {
        playClick();
        setLanguage('uz');
        closePalette();
      },
    },
    {
      id: 'act-lang-ru',
      category: 'actions',
      title: 'Сменить язык на Русский',
      subtitle: language === 'ru' ? 'Активен сейчас' : 'Переключить интерфейс на русский',
      icon: Globe,
      keywords: ['language', 'russian', 'ru', 'til', 'rus', 'язык', 'русский'],
      action: () => {
        playClick();
        setLanguage('ru');
        closePalette();
      },
    },
    {
      id: 'act-download-cv',
      category: 'actions',
      title: 'Download Resume (PDF)',
      subtitle: `Direct download: resume-${language}.pdf`,
      icon: Download,
      keywords: ['download', 'cv', 'pdf', 'resume', 'yuklab olish', 'скачать'],
      action: () => {
        playClick();
        const link = document.createElement('a');
        link.href = `/resume-${language}.pdf`;
        link.download = `Roma_Artikov_Resume_${language.toUpperCase()}.pdf`;
        link.click();
        closePalette();
      },
    },
    {
      id: 'act-terminal',
      category: 'actions',
      title: 'Open Hacker Terminal',
      subtitle: 'Press ` or ~ to toggle interactive terminal',
      icon: TerminalIcon,
      keywords: ['terminal', 'hacker', 'console', 'bash', 'snake', 'matrix'],
      action: () => {
        playClick();
        closePalette();
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '`' }));
      },
    },

    // Socials
    {
      id: 'soc-telegram',
      category: 'social',
      title: 'Telegram: @artikov_06_tt',
      subtitle: 'Message me directly on Telegram',
      icon: Send,
      keywords: ['telegram', 'tg', 'chat', 'direct'],
      action: () => {
        window.open('https://t.me/artikov_06_tt', '_blank');
        closePalette();
      },
    },
    {
      id: 'soc-github',
      category: 'social',
      title: 'GitHub: @Artikov-dev',
      subtitle: 'Explore open source code repositories',
      icon: GithubIcon,
      keywords: ['github', 'git', 'repo', 'code'],
      action: () => {
        window.open('https://github.com/Artikov-dev', '_blank');
        closePalette();
      },
    },
    {
      id: 'soc-linkedin',
      category: 'social',
      title: 'LinkedIn: Roma Artikov',
      subtitle: 'Connect professionally on LinkedIn',
      icon: LinkedinIcon,
      keywords: ['linkedin', 'network', 'career'],
      action: () => {
        window.open('https://www.linkedin.com/in/artikovdev/', '_blank');
        closePalette();
      },
    },
    {
      id: 'soc-instagram',
      category: 'social',
      title: 'Instagram: @artikovv_r',
      subtitle: 'Follow my personal & tech updates',
      icon: InstagramIcon,
      keywords: ['instagram', 'insta', 'social'],
      action: () => {
        window.open('https://instagram.com/artikovv_r', '_blank');
        closePalette();
      },
    },
  ], [t, language, theme]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  }, [items, search]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-start justify-center pt-20 md:pt-28 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
        onClick={closePalette}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-2xl bg-background/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header & Search Bar */}
          <div className="flex items-center px-5 py-4 border-b border-border gap-3">
            <Search className="w-5 h-5 text-primary shrink-0" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-foreground dark:text-white outline-none placeholder-foreground/40 text-base"
              placeholder="Type a command, page or search (e.g. 'projects', 'dark', 'resume')..."
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="text-foreground/40 hover:text-foreground p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-foreground/40 bg-foreground/5 border border-border px-2 py-0.5 rounded-md">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div 
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto p-3 space-y-1 custom-scrollbar"
          >
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-foreground/50 text-sm">
                No matching commands or pages found for "{search}".
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => {
                      playHover();
                      setSelectedIndex(index);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary text-white shadow-md'
                        : 'text-foreground/80 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold truncate leading-snug">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className={`text-xs truncate ${isSelected ? 'text-white/80' : 'text-foreground/50'}`}>
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-foreground/5 text-foreground/40'
                      }`}>
                        {item.category}
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'opacity-100 translate-x-0.5' : 'opacity-0'}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-foreground/[0.02] text-xs text-foreground/50">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-foreground/5 border border-border rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-foreground/5 border border-border rounded">↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-foreground/5 border border-border rounded">↵</kbd> Select
              </span>
            </div>
            <span className="hidden sm:inline-block">Roma Artikov Command Palette</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


