import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 'instant' prevents weird scroll animations when changing pages
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};
