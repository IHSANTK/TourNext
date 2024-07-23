

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    console.log(" protector");
  const adminisAuthenticated = useSelector((state) => state.adminauth.adminisAuthenticated);


  if (!adminisAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  

  return children;
};

export default ProtectedRoute;
