import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCart(null);
      setCartItemCount(0);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('CartContext - Fetched cart:', JSON.stringify(response.data, null, 2)); // Debug
      setCart(response.data);
      // Calculate the total number of items in the cart
      const totalItems = response.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartItemCount(totalItems);
    } catch (err) {
      console.error('CartContext - Error fetching cart:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data.msg === 'Token expired, please log in again') {
        localStorage.removeItem('token');
        setCart(null);
        setCartItemCount(0);
      }
    }
  };

  // Fetch cart on initial load and when token changes
  useEffect(() => {
    fetchCart();
  }, []);

  // Function to refresh cart (e.g., after adding an item)
  const refreshCart = () => {
    fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, cartItemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};