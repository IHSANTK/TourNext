
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    console.log(" protector");
  const userisAuthenticated = useSelector((state) => state.userauth.userisAuthenticated);


  if (!userisAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  

  return children;
};

export default ProtectedRoute;