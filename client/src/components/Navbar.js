import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, logout, cartCount, wishlistCount } = useContext(AuthContext);

  useEffect(() => {
    console.log('Navbar - Rendered with user:', user);
    console.log('Navbar - Cart count:', cartCount, 'Wishlist count:', wishlistCount);
  }, [user, cartCount, wishlistCount]);

  return (
    <nav key={user ? user.id : 'logged-out'} className="navbar navbar-expand-lg navbar-dark custom-navbar">
      <div className="container">
        <Link className="navbar-brand custom-brand" to="/">Shophoria</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto custom-nav-links">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart {cartCount > 0 && <span className="badge bg-light text-dark ms-1">{cartCount}</span>}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/wishlist">
                Wishlist {wishlistCount > 0 && <span className="badge bg-light text-dark ms-1">{wishlistCount}</span>}
              </Link>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            )}
            {user ? (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={logout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;