import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, restricted }) => {
  const adminisAuthenticated = useSelector((state) => state.adminauth.adminisAuthenticated);
  const location = useLocation();

  if (adminisAuthenticated) {
    if (restricted) {
      return <Navigate to="/admin/dashboard" />;
    }
        return children;
  }

  if (!adminisAuthenticated && !restricted) {
    return <Navigate to="/admin/login"  />;
  }

  return children;
};

export default ProtectedRoute;
