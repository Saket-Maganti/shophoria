import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Dashboard from './pages/Dashboard';
import OrderDetails from './pages/OrderDetails'; // Import OrderDetails
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; // ✅ Import WishlistProvider
import { AuthProvider } from './context/AuthContext'; // ✅ Import AuthProvider

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap the entire app with AuthProvider */}
      <CartProvider>
        <WishlistProvider> {/* ✅ Wrap the app with WishlistProvider */}
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/order/:id" element={<OrderDetails />} />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
