import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Wishlist() {
  const { user, token, fetchWishlistCount } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    try {
      console.log('fetchWishlist - Fetching wishlist with token:', token);
      const res = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('fetchWishlist - Wishlist fetched:', res.data);
      setWishlistItems(res.data);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Server error. Please try again.';
      console.error('fetchWishlist - Error:', errorMsg);
      setError(errorMsg);
      setWishlistItems([]);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      console.log('removeFromWishlist - Removing product:', productId);
      await axios.delete(`${API_BASE_URL}/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Removed from wishlist successfully!');
      fetchWishlist();
      fetchWishlistCount(token);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Server error. Please try again.';
      console.error('removeFromWishlist - Error:', errorMsg);
      alert(`Failed to remove from wishlist: ${errorMsg}`);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Wishlist</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {wishlistItems.length === 0 ? (
        <p className="text-center">Your wishlist is empty.</p>
      ) : (
        <div className="row">
          {wishlistItems.map(item => (
            <div key={item._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm product-card">
                <img
                  src={item.product?.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/150'}
                  className="card-img-top"
                  alt={item.product?.name || 'Product'}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                />
                <div className="card-body">
                  <h5 className="card-title product-name">{item.product?.name || 'Product Not Found'}</h5>
                  <p className="card-text text-muted">{item.product?.description || 'No description available'}</p>
                  <p className="card-text fw-bold product-price">${item.product?.price?.toFixed(2) || 'N/A'}</p>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <div className="d-flex justify-content-between">
                    {item.product ? (
                      <Link to={`/product/${item.product._id}`} className="btn btn-primary btn-sm custom-btn">
                        View Product
                      </Link>
                    ) : (
                      <button className="btn btn-secondary btn-sm custom-btn" disabled>
                        View Product
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm custom-btn"
                      onClick={() => removeFromWishlist(item.product?._id)}
                      disabled={!item.product}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;