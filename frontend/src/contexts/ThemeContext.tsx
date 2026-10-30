import React, { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const readStoredTheme = (): Theme | null => {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
};

const systemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // The inline script in index.html already applied the theme before the first paint;
  // start from the same value so React never renders the wrong one first.
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? systemTheme());

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  // Until the visitor picks a theme themselves, follow the OS setting live
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      if (!readStoredTheme()) setTheme(systemTheme());
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  // Only an explicit choice is remembered (it used to save the OS default on first visit,
  // which then stopped following the OS forever)
  const applyTheme = (next: Theme) => {
    try {
      localStorage.setItem('theme', next);
    } catch {
      // storage blocked — the choice lasts for this page view
    }
    setTheme(next);
  };

  const toggleTheme = (e?: React.MouseEvent) => {
    if (!document.startViewTransition) {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
      return;
    }

    // Tepadagi burchakdan (yoki bosilgan tugmadan) chiqishi uchun
    const x = e?.clientX ?? window.innerWidth - 60;
    const y = e?.clientY ?? 60;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const isDark = theme === 'dark';
    
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        applyTheme(isDark ? 'light' : 'dark');
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 800,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // Silliq va tezroq "ease-out"
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
