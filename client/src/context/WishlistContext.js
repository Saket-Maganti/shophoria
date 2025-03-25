import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { token } = useAuth();

    const fetchWishlist = useCallback(async () => {  // ✅ Wrap in useCallback to prevent unnecessary re-renders
        if (!token) return;
        try {
            const res = await axios.get('/api/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(res.data.products || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    }, [token]);  // ✅ Depend on token

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);  // ✅ Now correctly uses fetchWishlist

    const addToWishlist = async (productId) => {
        try {
            await axios.post('/api/wishlist/add', { productId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWishlist();  // ✅ Fetch wishlist after adding an item
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`/api/wishlist/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWishlist();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

// ✅ Export useWishlist correctly
export const useWishlist = () => useContext(WishlistContext);
