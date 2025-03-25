import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './Wishlist.css';

function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view your wishlist!');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched wishlist:', JSON.stringify(response.data, null, 2)); // Debug
        setWishlist(response.data);
      } catch (err) {
        console.error('Error fetching wishlist:', err.response ? err.response.data : err.message);
        if (err.response && err.response.data.msg === 'Token expired, please log in again') {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          alert('Failed to fetch wishlist. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return <div className="container my-5"><h2>Your wishlist is empty.</h2></div>;
  }

  return (
    <div className="container my-5">
      <h2>Your Wishlist</h2>
      <div className="row">
        {wishlist.items.map(item => (
          <div key={item.productId._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={item.productId.images?.[0] || 'https://placehold.it/150x150'}
                className="card-img-top"
                alt={item.productId.name}
              />
              <div className="card-body">
                <h5 className="card-title">{item.productId.name}</h5>
                <p className="card-text">{item.productId.description}</p>
                <p className="card-text text-primary">${item.productId.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;