import React, { useEffect, useState } from 'react';
import { Home, User, Code2, Briefcase, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', icon: Home, labelKey: 'home' },
  { id: 'about', icon: User, labelKey: 'about' },
  { id: 'skills', icon: Code2, labelKey: 'skills' },
  { id: 'experience', icon: Briefcase, labelKey: 'experience' },
  { id: 'contact', icon: Mail, labelKey: 'contact' },
];

export const FloatingNav = () => {
  const [active, setActive] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { playClick, playHover } = useSound();

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setActive('');
      return;
    }

    const handleScroll = () => {
      const sections = navItems.map(i => document.getElementById(i.id));
      const scrollPos = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        if (section) {
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          if (scrollPos >= top && scrollPos <= bottom) {
            setActive(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleNavClick = (id: string) => {
    playClick();
    if (!isHome) {
      navigate('/#' + id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="glass px-4 md:px-6 py-3 md:py-4 rounded-full flex items-center gap-4 md:gap-6 shadow-2xl border border-border">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={playHover}
              className={cn(
                "relative group p-2 transition-colors cursor-pointer",
                isActive ? "text-primary" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
              aria-label={t(item.labelKey)}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background border border-border px-3 py-1 rounded-md text-xs text-foreground dark:text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                {t(item.labelKey)}
              </span>
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

