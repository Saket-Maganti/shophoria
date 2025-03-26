import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token && token !== 'null' ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;