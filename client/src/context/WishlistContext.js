import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from './AuthContext'; // Import AuthContext

const WishlistContext = createContext({
  wishlist: { items: [] },
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  loading: false,
});

export function WishlistProvider({ children }) {
  const { token } = useContext(AuthContext); // Access token from AuthContext
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      if (!token) {
        setWishlist({ items: JSON.parse(localStorage.getItem('wishlist')) || [] });
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err.response ? err.response.data : err.message);
      setWishlist({ items: [] }); // Fallback to empty wishlist on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]); // Refetch wishlist when token changes (login/logout)

  const addToWishlist = async (productId) => {
    try {
      if (!token) {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!storedWishlist.some(item => item._id === productId)) {
          storedWishlist.push({ _id: productId });
          localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
          setWishlist({ items: storedWishlist });
        }
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(response.data);
    } catch (err) {
      console.error('Error adding to wishlist:', err.response ? err.response.data : err.message);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (!token) {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const updatedWishlist = storedWishlist.filter(item => item._id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setWishlist({ items: updatedWishlist });
        return;
      }

      const response = await axios.delete(`${API_BASE_URL}/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data);
    } catch (err) {
      console.error('Error removing from wishlist:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}