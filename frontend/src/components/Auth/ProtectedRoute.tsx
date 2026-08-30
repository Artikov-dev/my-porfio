import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { api } from '@/lib/api';

export const ProtectedRoute = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const hasLocalAdmin = localStorage.getItem('isAdmin') === 'true';

      try {
        await api.get('/auth/me', { timeout: 5000 });
        
        if (isMounted) {
          setIsAuthenticated(true);
          localStorage.setItem('isAdmin', 'true');
        }
      } catch (err: any) {
        // If server returns explicit 403 or 401, revoke access
        if (err?.response?.status === 403 || err?.response?.status === 401) {
          if (isMounted) {
            setIsAuthenticated(false);
            localStorage.removeItem('isAdmin');
          }
        } else {
          // If network error / timeout, maintain session if already authenticated
          if (isMounted && hasLocalAdmin) {
            setIsAuthenticated(true);
          }
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/aadminsecret" replace />;
  }

  return <Outlet />;
};

