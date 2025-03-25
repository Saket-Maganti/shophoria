import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { CartContext } from '../context/CartContext';
import './Home.css';

function Home() {
  const { refreshCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState(1000);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        console.log('Fetched products:', response.data); // Debug
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (category === 'All' || product.category === category) &&
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      product.price <= priceRange
    )
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  // Add to Cart function
  const handleAddToCart = async (productId) => {
    console.log('Adding to cart:', productId); // Debug
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to your cart!');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/cart`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Add to cart response:', JSON.stringify(response.data, null, 2)); // Detailed debug
      alert('Product added to cart!');
      refreshCart();
    } catch (err) {
      console.error('Error adding to cart:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data.msg === 'Token expired, please log in again') {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to add product to cart. Please try again.');
      }
    }
  };

  // Add to Wishlist function
  const handleAddToWishlist = async (productId) => {
    console.log('Adding to wishlist:', productId); // Debug
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to your wishlist!');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Add to wishlist response:', JSON.stringify(response.data, null, 2)); // Debug
      alert('Product added to wishlist!');
    } catch (err) {
      console.error('Error adding to wishlist:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data.msg === 'Token expired, please log in again') {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (err.response && err.response.data.msg === 'Product already in wishlist') {
        alert('This product is already in your wishlist!');
      } else {
        alert('Failed to add product to wishlist. Please try again.');
      }
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

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section text-center text-white">
        <h1>Welcome to Shophoria</h1>
        <p>Discover the best deals on your favorite products!</p>
        <a href="#products" className="btn btn-primary btn-lg">Shop Now</a>
      </div>

      {/* Filters Section */}
      <div className="container my-5">
        <div className="row mb-4">
          <div className="col-md-3">
            <h5>Categories</h5>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
          </div>
          <div className="col-md-3">
            <h5>Search</h5>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <h5>Sort By</h5>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div className="col-md-3">
            <h5>Price Range: $0 - ${priceRange}</h5>
            <input
              type="range"
              className="form-range"
              min="0"
              max="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="row" id="products">
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map(product => (
              <div key={product._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.images?.[0] || 'https://placehold.it/150x150'}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text text-primary">${product.price.toFixed(2)}</p>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(product._id)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => handleAddToWishlist(product._id)}
                      >
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;