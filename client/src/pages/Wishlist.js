import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

function Wishlist({ cart, setCart }) {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your wishlist.');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWishlist(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching wishlist');
      }
    };

    fetchWishlist();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(response.data);
      alert('Product removed from wishlist!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error removing from wishlist');
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Your Wishlist</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {wishlist.length === 0 && !error ? (
        <p>Your wishlist is empty. <Link to="/">Go shopping</Link></p>
      ) : (
        <ul className="list-group">
          {wishlist.map(item => (
            <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <Link to={`/product/${item.product._id}`} className="text-decoration-none">
                  {item.product.name} - ${item.product.price}
                </Link>
              </div>
              <div>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => addToCart(item.product)}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromWishlist(item.product._id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Wishlist;