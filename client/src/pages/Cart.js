import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    if (!token) {
      setError('Please log in to view your cart.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to fetch cart. Please try again.');
      setLoading(false);
    }
  }, [token]);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        `${API_BASE_URL}/api/cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(cartItems.map(item =>
        item.productId._id === productId ? { ...item, quantity } : item
      ));
    } catch (err) {
      console.error('Error updating quantity:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to update quantity.');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(cartItems.filter(item => item.productId._id !== productId));
    } catch (err) {
      console.error('Error removing item from cart:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to remove item. Please try again.');
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/orders`,
        { items: cartItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await axios.delete(`${API_BASE_URL}/api/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems([]);
      navigate(`/order/${response.data._id}`);
    } catch (err) {
      console.error('Error during checkout:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to process checkout. Please try again.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    return () => setError('');
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
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

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container my-5">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.productId?.price || 0) * (item.quantity || 1);
  }, 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      <div className="row">
        {cartItems.map(item => (
          <div key={item._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm cart-item">
              <img
                src={item.productId?.images?.[0] || 'https://placehold.it/150x150'}
                className="card-img-top"
                alt={item.productId?.name || 'Product'}
              />
              <div className="card-body">
                <h5 className="card-title">{item.productId?.name || 'Unknown Product'}</h5>
                <p className="card-text">
                  Price: ${item.productId?.price ? item.productId.price.toFixed(2) : 'N/A'}
                </p>
                <p className="card-text">Quantity: {item.quantity}</p>
                <div className="d-flex mb-2">
                  <button
                    className="btn btn-outline-secondary me-2"
                    onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => removeFromCart(item.productId._id)}
                >
                  Remove from Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h4>Total: ${totalPrice.toFixed(2)}</h4>
        <button className="btn btn-success checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;