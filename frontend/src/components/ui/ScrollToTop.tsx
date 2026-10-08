import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      // The target section may not exist yet: the page is lazy-loaded and the previous
      // page's exit animation runs first. Poll for it instead of a single fixed delay.
      let attempts = 0;
      const timer = setInterval(() => {
        const element = document.getElementById(id);
        if (element) {
          clearInterval(timer);
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (++attempts > 40) {
          clearInterval(timer); // give up after ~4s
        }
      }, 100);
      return () => clearInterval(timer);
    }

    // Scroll to the top of the page when the route changes without a hash
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, hash]);

  return null;
};
