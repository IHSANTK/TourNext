
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children,restricted }) => {
    console.log(" protector");
  const userisAuthenticated = useSelector((state) => state.userauth.userisAuthenticated);


  if (userisAuthenticated) {
    if (restricted) {
      return <Navigate to="/user/dashboard" />;
    }
        return children;
  }

  if (!userisAuthenticated && !restricted) {
    return <Navigate to="/user/login" />;
  }

  return children;
};

export default ProtectedRoute;