import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { CartContext } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { cart, cartItemCount, refreshCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view your cart!');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        refreshCart(); // Update the cart context
      } catch (err) {
        console.error('Error fetching cart:', err.response ? err.response.data : err.message);
        if (err.response?.data.msg === 'Token expired, please log in again') {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          alert('Failed to fetch cart. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/cart/update/${productId}`, { quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshCart();
    } catch (err) {
      console.error('Error updating cart:', err.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshCart();
    } catch (err) {
      console.error('Error removing item:', err.message);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to checkout!');
      window.location.href = '/login';
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/orders`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order placed successfully!');
      refreshCart();
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (!cart?.items?.length) return <div className="container my-5"><h2>Your cart is empty.</h2></div>;

  return (
    <div className="container my-5">
      <h2>Your Cart</h2>
      <div className="row">
        {cart.items.map(item => (
          <div key={item.productId._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={item.productId.images?.[0] || 'https://placehold.it/150x150'} className="card-img-top" alt={item.productId.name} />
              <div className="card-body">
                <h5 className="card-title">{item.productId.name}</h5>
                <p className="card-text">Price: ${item.productId.price.toFixed(2)}</p>
                <p className="card-text">Subtotal: ${(item.quantity * item.productId.price).toFixed(2)}</p>
                <div className="cart-actions">
                  <button onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                  <button onClick={() => handleRemove(item.productId._id)}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4>Total: ${cart.items.reduce((sum, item) => sum + item.quantity * item.productId.price, 0).toFixed(2)}</h4>
        <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
}

export default Cart;