import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // ✅ FIXED IMPORT
import { API_BASE_URL } from '../config';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ FIXED
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token); // ✅ FIXED
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  const refreshCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (err) {
      console.log('Error fetching cart:', err);
    }
  };

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.some(item => item._id === product._id)) return prev; // Avoid duplicates
      return [...prev, product];
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, cart, refreshCart, wishlist, addToWishlist }}>
      {children}
    </UserContext.Provider>
  );
};
