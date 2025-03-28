import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import '../styles/Home.css';

function Home() {
  const { user, token, fetchCartCount, fetchWishlistCount } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const productGridRef = useRef(null);
  const categorySectionRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
      const uniqueCategories = [...new Set(res.data.map(p => p.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.log('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : [];

  const searchedProducts = searchQuery
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleShopNowClick = () => {
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      categorySectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = async (product) => {
    if (user && token) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/cart`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Added to cart successfully!');
        fetchCartCount(token);
        console.log('addToCart - Called fetchCartCount after adding to cart');
      } catch (err) {
        const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Server error. Please try again.';
        alert(`Failed to add to cart: ${errorMsg}`);
      }
    } else {
      try {
        let localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = localCart.find(item => item._id === product._id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          localCart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
        alert('Added to local cart! Will sync on login.');
      } catch (err) {
        alert('Failed to add to local cart. Please try again.');
      }
    }
  };

  const addToWishlist = async (product) => {
    if (user && token) {
      try {
        console.log('addToWishlist - Product:', product);
        console.log('addToWishlist - Adding product to wishlist:', product._id, 'with token:', token);
        const response = await axios.post(
          `${API_BASE_URL}/api/wishlist`,
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('addToWishlist - Successfully added to wishlist:', response.data);
        alert('Added to wishlist successfully!');
        fetchWishlistCount(token);
        console.log('addToWishlist - Called fetchWishlistCount after adding to wishlist');
      } catch (err) {
        const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Server error. Please try again.';
        console.error('addToWishlist - Error:', errorMsg, 'Status:', err.response?.status);
        alert(`Failed to add to wishlist: ${errorMsg}`);
      }
    } else {
      try {
        let localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        if (!localWishlist.some(item => item._id === product._id)) {
          localWishlist.push(product);
          localStorage.setItem('wishlist', JSON.stringify(localWishlist));
          alert('Added to local wishlist! Will sync on login.');
        } else {
          alert('Product already in local wishlist.');
        }
      } catch (err) {
        alert('Failed to add to local wishlist. Please try again.');
      }
    }
  };

  const addAllToCart = () => {
    if (searchedProducts.length === 0) {
      alert('No products to add. Please search for products first.');
      return;
    }
    searchedProducts.forEach(product => addToCart(product));
  };

  const categoryImages = {
    Smartphones: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
    Laptops: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=600',
    Sneakers: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600',
    Headphones: 'https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Home Appliances': 'https://images.pexels.com/photos/4394135/pexels-photo-4394135.jpeg?auto=compress&cs=tinysrgb&w=600',
    Clothing: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
    Books: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600'
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="container text-center text-white">
            <h1 className="display-4 fw-bold">
              {user ? `Welcome back, ${user.name}!` : 'Welcome to Shophoria'}
            </h1>
            <p className="lead">Discover the best deals on your favorite products!</p>
            <button className="btn btn-primary btn-lg mt-3" onClick={handleShopNowClick}>
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container my-5">
        {/* Product Browsing Section */}
        <div className="product-browsing-section my-5">
          <h3 className="text-center mb-4">Browse Products</h3>
          <div className="d-flex justify-content-center mb-4">
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-primary ms-2"
              onClick={addAllToCart}
            >
              Add All to Cart
            </button>
          </div>
          {searchQuery && (
            <div className="row">
              {searchedProducts.length > 0 ? (
                searchedProducts.map(product => (
                  <div key={product._id} className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm product-card">
                      <Link to={`/product/${product._id}`} className="text-decoration-none product-link">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'}
                          className="card-img-top"
                          alt={product.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                        />
                        <div className="card-body">
                          <h5 className="card-title product-name">{product.name}</h5>
                          <p className="card-text text-muted">{product.description}</p>
                          <p className="card-text fw-bold product-price">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                      <div className="card-footer bg-transparent border-0">
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-primary btn-sm custom-btn"
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm custom-btn"
                            onClick={() => addToWishlist(product)}
                          >
                            Add to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No products found.</p>
              )}
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="category-filter" ref={categorySectionRef}>
          <h3 className="text-center mb-4">Shop by Category</h3>
          <div className="category-grid">
            {categories.map(category => (
              <button
                key={category}
                className={`category-card ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
              >
                <img src={categoryImages[category] || 'https://via.placeholder.com/100'} alt={category} />
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category-Filtered Product Grid */}
        {selectedCategory && (
          <div className="row" ref={productGridRef}>
            <h3 className="text-center mb-4">{selectedCategory}</h3>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm product-card">
                    <Link to={`/product/${product._id}`} className="text-decoration-none product-link">
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                      />
                      <div className="card-body">
                        <h5 className="card-title product-name">{product.name}</h5>
                        <p className="card-text text-muted">{product.description}</p>
                        <p className="card-text fw-bold product-price">${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                    <div className="card-footer bg-transparent border-0">
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary btn-sm custom-btn"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm custom-btn"
                          onClick={() => addToWishlist(product)}
                        >
                          Add to Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No products found in this category.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;