import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const syncCartWithServer = async (token) => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (localCart.length > 0) {
      try {
        await Promise.all(
          localCart.map(item =>
            axios.post(
              `${API_BASE_URL}/api/cart`,
              { productId: item._id, quantity: item.quantity },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
        localStorage.removeItem('cart');
      } catch (err) {
        console.error('Error syncing cart:', err);
      }
    }
  };

  const syncWishlistWithServer = async (token) => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (localWishlist.length > 0) {
      try {
        await Promise.all(
          localWishlist.map(item =>
            axios.post(
              `${API_BASE_URL}/api/wishlist`,
              { productId: item._id },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
        localStorage.removeItem('wishlist');
      } catch (err) {
        console.error('Error syncing wishlist:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      login(res.data.token);
      await syncCartWithServer(res.data.token);
      await syncWishlistWithServer(res.data.token);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      alert('Login failed: ' + (err.response?.data?.msg || 'Please try again.'));
    }
  };

  return (
    <div className="container my-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default Login;