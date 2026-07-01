import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  // A simple check on localStorage. 
  // Real security is handled by the backend rejecting API calls without the httpOnly cookie.
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
