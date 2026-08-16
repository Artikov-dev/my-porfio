import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '@/lib/api';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Exclude admin pages from analytics tracking
    if (location.pathname.startsWith('/admin') || location.pathname === '/aadminsecret') return;

    const recordVisit = async () => {
      try {
        await api.post('/analytics/visit', { path: location.pathname });
      } catch (error) {
        // Silently fail if backend is offline or analytics unavailable
      }
    };

    recordVisit();
  }, [location.pathname]);
};

