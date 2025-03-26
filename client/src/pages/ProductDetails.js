import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import '../pages/ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err.response ? err.response.data : err.message);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async (productId, qty) => {
    setCartLoading(true);
    try {
      if (!token) {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = storedCart.find(item => item._id === productId);
        if (existingItem) {
          existingItem.quantity += qty;
        } else {
          const productToAdd = { ...product, quantity: qty };
          storedCart.push(productToAdd);
        }
        localStorage.setItem('cart', JSON.stringify(storedCart));
        alert('Product added to cart!');
      } else {
        await axios.post(
          `${API_BASE_URL}/api/cart`,
          { productId, quantity: qty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Product added to cart!');
      }
    } catch (err) {
      console.error('Error adding to cart:', err.response ? err.response.data : err.message);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async (productId) => {
    setWishlistLoading(true);
    try {
      if (!token) {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingItem = storedWishlist.find(item => item._id === productId);
        if (existingItem) {
          alert('Product already in wishlist!');
          return;
        }
        storedWishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
        alert('Product added to wishlist!');
      } else {
        await axios.post(
          `${API_BASE_URL}/api/wishlist`,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Product added to wishlist!');
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err.response ? err.response.data : err.message);
      alert('Failed to add product to wishlist. Please try again.');
    } finally {
      setWishlistLoading(false);
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

  if (error || !product) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Product not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400?text=Product+Image'}
            className="img-fluid product-image"
            alt={product.name}
            onError={(e) => (e.target.src = 'https://via.placeholder.com/400?text=Product+Image')}
          />
        </div>
        <div className="col-md-6">
          <h2 className="product-title">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-category">Category: {product.category}</p>
          <div className="quantity-selector">
            <label htmlFor="quantity" className="me-2">Quantity:</label>
            <input
              type="number"
              id="quantity"
              className="form-control d-inline-block w-auto"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
            />
          </div>
          <div className="action-buttons mt-3">
            <button
              className="btn btn-primary me-2"
              onClick={() => handleAddToCart(product._id, quantity)}
              disabled={cartLoading}
            >
              {cartLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleAddToWishlist(product._id)}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : (
                'Add to Wishlist'
              )}
            </button>
          </div>
          <button
            className="btn btn-link mt-3"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;