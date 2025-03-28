import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log('Initial load - User loaded from localStorage:', parsedUser);
      fetchCartCount(token);
      fetchWishlistCount(token);
    } else {
      console.log('Initial load - No user or token found in localStorage');
    }
  }, [token]);

  const fetchCartCount = async (authToken) => {
    if (!authToken) {
      setCartCount(0);
      console.log('fetchCartCount - No token, cart count set to 0');
      return;
    }
    try {
      console.log('fetchCartCount - Fetching cart count with token:', authToken);
      const res = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const count = res.data.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartCount(count);
      console.log('fetchCartCount - Cart count updated:', count, 'Response data:', res.data);
    } catch (err) {
      console.error('fetchCartCount - Error fetching cart count:', err.response?.data || err.message);
      setCartCount(0);
    }
  };

  const fetchWishlistCount = async (authToken) => {
    if (!authToken) {
      setWishlistCount(0);
      console.log('fetchWishlistCount - No token, wishlist count set to 0');
      return;
    }
    try {
      console.log('fetchWishlistCount - Fetching wishlist count with token:', authToken);
      const res = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const count = res.data.length;
      setWishlistCount(count);
      console.log('fetchWishlistCount - Wishlist count updated:', count, 'Response data:', res.data);
    } catch (err) {
      console.error('fetchWishlistCount - Error fetching wishlist count:', err.response?.data || err.message);
      setWishlistCount(0);
    }
  };

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${newToken}` }
    })
      .then(res => {
        const userData = res.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('login - User logged in:', userData);
        fetchCartCount(newToken);
        fetchWishlistCount(newToken);
      })
      .catch(err => {
        console.error('login - Error fetching user data:', err.response?.data || err.message);
        logout();
      });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
    console.log('logout - User logged out, cartCount:', cartCount, 'wishlistCount:', wishlistCount);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, cartCount, wishlistCount, fetchCartCount, fetchWishlistCount }}>
      {children}
    </AuthContext.Provider>
  );
};