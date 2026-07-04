import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';

export const Navbar = () => {
  const { t, language, setLanguage } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { playClick, playHover } = useSound();

  const isHome = location.pathname === '/';

  const navLinks = [
    { nameKey: 'home', href: '/#home' },
    { nameKey: 'about', href: '/#about' },
    { nameKey: 'skills', href: '/#skills' },
    { nameKey: 'experience', href: '/#experience' },
    { nameKey: 'contact', href: '/#contact' },
    { nameKey: 'projects', href: '/projects', isRoute: true },
    { nameKey: 'blog', href: '/blogs', isRoute: true },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isRoute?: boolean) => {
    if (!isRoute && isHome) {
      e.preventDefault();
      const id = href.split('#')[1];
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          onClick={playClick}
          onMouseEnter={playHover}
          className="text-foreground font-bold text-2xl tracking-tighter hover:text-primary transition-colors"
        >
          Artikov
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.nameKey}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href, link.isRoute)}
              onMouseEnter={playHover}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {t(link.nameKey)}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center bg-foreground/5 p-1 rounded-full border border-border">
            {['en', 'uz', 'ru'].map((lang) => (
              <button
                key={lang}
                onClick={() => { playClick(); setLanguage(lang as any); }}
                onMouseEnter={playHover}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full uppercase transition-all",
                  language === lang 
                    ? "bg-primary text-white shadow-md" 
                    : "text-foreground/60 hover:text-foreground"
                )}
              >
                {lang}
              </button>
            ))}
          </div>

          <button 
            onClick={(e) => { playClick(); toggleTheme(e); }}
            onMouseEnter={playHover}
            className="p-2 rounded-full hover:bg-foreground/10 text-foreground transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-foreground"
          onClick={() => { playClick(); setIsOpen(!isOpen); }}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full glass border-b border-border flex flex-col p-6 gap-6 shadow-xl animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <a
              key={link.nameKey}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href, link.isRoute)}
              className="text-lg font-medium text-foreground/80 hover:text-primary"
            >
              {t(link.nameKey)}
            </a>
          ))}
          <div className="h-[1px] w-full bg-border"></div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['en', 'uz', 'ru'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => { playClick(); setLanguage(lang as any); setIsOpen(false); }}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-lg uppercase",
                    language === lang 
                      ? "bg-primary text-white" 
                      : "bg-foreground/5 text-foreground"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button 
              onClick={(e) => { playClick(); toggleTheme(e); setIsOpen(false); }}
              className="p-3 rounded-lg bg-foreground/5 text-foreground flex items-center gap-2 font-medium"
            >
              {theme === 'dark' ? <><Sun className="w-5 h-5"/> Light</> : <><Moon className="w-5 h-5"/> Dark</>}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
