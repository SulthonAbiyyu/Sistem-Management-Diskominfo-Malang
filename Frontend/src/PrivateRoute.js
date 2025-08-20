import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredLevel }) => {
  const { isLoggedIn } = useAuth();
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredLevel && user.level !== requiredLevel) {
    return <Navigate to="/unauthorized" />; // Halaman unauthorized harus disediakan
  }

  return children;
};

export default PrivateRoute;
