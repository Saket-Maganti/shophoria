import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Wishlist() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err.response ? err.response.data : err.message);
      setError('Failed to load wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [token, navigate]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data);
      alert('Product removed from wishlist!');
    } catch (err) {
      console.error('Error removing from wishlist:', err.response ? err.response.data : err.message);
      alert('Failed to remove product from wishlist. Please try again.');
    }
  };

  const handleClearWishlist = async () => {
    if (!window.confirm('Are you sure you want to clear your wishlist?')) return;

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/wishlist/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data);
      alert('Wishlist cleared!');
    } catch (err) {
      console.error('Error clearing wishlist:', err.response ? err.response.data : err.message);
      alert('Failed to clear wishlist. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>My Wishlist</h2>
      {wishlist?.items?.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <>
          <button
            className="btn btn-danger mb-3"
            onClick={handleClearWishlist}
            disabled={wishlist?.items?.length === 0}
          >
            Clear Wishlist
          </button>
          <div className="row">
            {wishlist.items.map(item => (
              <div key={item.productId._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.productId.images?.[0] || 'https://via.placeholder.com/150'}
                    className="card-img-top"
                    alt={item.productId.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.productId.name}</h5>
                    <p className="card-text">{item.productId.description}</p>
                    <p className="card-text text-primary">${item.productId.price.toFixed(2)}</p>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveFromWishlist(item.productId._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Wishlist;