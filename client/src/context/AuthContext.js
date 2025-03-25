import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = async (storedToken) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      console.log('Token validation successful:', response.data);
      return true;
    } catch (err) {
      console.error('Token validation failed:', err.response?.data || err.message);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const isValid = await validateToken(storedToken);
        if (!isValid) {
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = (newToken) => {
    console.log('Logging in with token:', newToken);
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    console.log('Logging out, clearing token');
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};