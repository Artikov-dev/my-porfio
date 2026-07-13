import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Exclude admin pages from analytics tracking
    if (location.pathname.startsWith('/admin')) return;

    const recordVisit = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/visit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: location.pathname }),
        });
      } catch (error) {
        console.error('Failed to record visit', error);
      }
    };

    recordVisit();
  }, [location.pathname]);
};
