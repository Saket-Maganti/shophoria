import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  console.log('ProtectedRoute - Token:', token); // Debug: Log the token
  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;