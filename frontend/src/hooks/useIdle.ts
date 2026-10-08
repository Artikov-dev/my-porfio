import { useEffect, useState } from 'react';

// Becomes true once the browser is idle after the first paint.
// Use it to defer non-critical UI so the main content renders first.
export const useIdle = (timeout = 2000) => {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 1000);
    return () => clearTimeout(id);
  }, [timeout]);
  return idle;
};
