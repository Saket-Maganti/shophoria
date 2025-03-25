import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching user with token:", token);
      const response = await axios.get(`${API_BASE_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched user:", response.data);
      setUser(response.data);
    } catch (err) {
      console.error('User fetch failed:', err.response?.data || err.message);
      setUser(null);
      localStorage.removeItem('token');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const login = (newToken) => {
    console.log("Logging in with token:", newToken);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    fetchUser();
  };

  const logout = () => {
    console.log("Logging out...");
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
