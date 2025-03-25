import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    return '';
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
      setErrors({ ...errors, email: validateEmail(value) });
    } else if (field === 'password') {
      setPassword(value);
      setErrors({ ...errors, password: validatePassword(value) });
    }
  };

  const syncCartWithServer = async (token) => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (localCart.length > 0) {
      try {
        for (const item of localCart) {
          await axios.post(
            `${API_BASE_URL}/api/cart`,
            { productId: item.productId._id, quantity: item.quantity },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        const response = await axios.get(`${API_BASE_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem('cart', JSON.stringify(response.data.items || []));
      } catch (err) {
        console.error('Error syncing cart with server:', err);
      }
    }
  };

  const syncWishlistWithServer = async (token) => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (localWishlist.length > 0) {
      try {
        for (const item of localWishlist) {
          await axios.post(
            `${API_BASE_URL}/api/wishlist`,
            { productId: item._id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        const response = await axios.get(`${API_BASE_URL}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem('wishlist', JSON.stringify(response.data.items || []));
      } catch (err) {
        console.error('Error syncing wishlist with server:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      await syncCartWithServer(token);
      await syncWishlistWithServer(token);
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    } catch (err) {
      setServerError(err.response?.data?.msg || 'Error logging in');
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg auth-card">
        <div className="card-body p-5">
          <h2 className="text-center mb-4">Login to Your Account</h2>
          {serverError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {serverError}
              <button
                type="button"
                className="btn-close"
                onClick={() => setServerError('')}
                aria-label="Close"
              ></button>
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : email && !errors.email ? 'is-valid' : ''}`}
                  id="email"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : password && !errors.password ? 'is-valid' : ''}`}
                  id="password"
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Login
            </button>
            <p className="text-center text-muted">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-primary fw-bold text-decoration-none">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;