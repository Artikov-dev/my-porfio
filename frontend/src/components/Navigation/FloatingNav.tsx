import React, { useEffect, useState } from 'react';
import { Home, User, Code2, Briefcase, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'about', icon: User, label: 'About' },
  { id: 'skills', icon: Code2, label: 'Skills' },
  { id: 'experience', icon: Briefcase, label: 'Experience' },
  { id: 'contact', icon: Mail, label: 'Contact' },
];

export const FloatingNav = () => {
  const [active, setActive] = useState('home');

  useEffect(() => {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="glass px-6 py-4 rounded-full flex items-center gap-6 shadow-2xl border border-border">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
              className={cn(
                "relative group p-2 transition-colors cursor-pointer",
                isActive ? "text-primary" : "text-gray-500 hover:text-foreground dark:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-background border border-border px-3 py-1 rounded-md text-xs text-foreground dark:text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.label}
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
