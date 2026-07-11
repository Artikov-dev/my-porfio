import React, { createContext, useContext, useEffect, useState } from 'react';
import { GodModeTransition, TransitionMode } from '@/components/Theme/GodModeTransition';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [transitionMode, setTransitionMode] = useState<TransitionMode>(null);

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e?: React.MouseEvent) => {
    if (transitionMode) return; // Prevent multiple clicks during animation

    const isDark = theme === 'dark';
    
    // Trigger animation: 'big-bang' when turning Light, 'black-hole' when turning Dark
    setTransitionMode(isDark ? 'big-bang' : 'black-hole');
  };

  const handleAnimationHalfway = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAnimationComplete = () => {
    setTransitionMode(null);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <GodModeTransition 
        mode={transitionMode}
        onAnimationHalfway={handleAnimationHalfway}
        onAnimationComplete={handleAnimationComplete}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

