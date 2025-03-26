import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);

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

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <UserContext.Provider value={{ cart, refreshCart, wishlist, addToWishlist }}>
      {children}
    </UserContext.Provider>
  );
};