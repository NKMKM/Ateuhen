import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isLoggedIn, redirectPath }) => {
  if (isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default ProtectedRoute;
