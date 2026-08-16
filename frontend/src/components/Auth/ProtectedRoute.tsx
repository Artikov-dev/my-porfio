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
      try {
        await api.get('/auth/me');
        if (isMounted) {
          setIsAuthenticated(true);
          localStorage.setItem('isAdmin', 'true');
        }
      } catch (err) {
        if (isMounted) {
          setIsAuthenticated(false);
          localStorage.removeItem('isAdmin');
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
