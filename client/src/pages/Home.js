import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { UserContext } from '../context/UserContext';
import '../styles/Home.css';

function Home() {
  const { addToWishlist } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const productGridRef = useRef(null);
  const categorySectionRef = useRef(null); // New ref for category section

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products`)
      .then(res => {
        setProducts(res.data);
        const uniqueCategories = [...new Set(res.data.map(p => p.category))];
        setCategories(uniqueCategories);
      })
      .catch(err => console.log('Error fetching products:', err));
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : [];

  const handleShopNowClick = () => {
    if (productGridRef.current) {
      // If a category is selected and product grid exists, scroll to it
      productGridRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Otherwise, scroll to the category section to prompt selection
      categorySectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Map categories to images
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
            <h1 className="display-4 fw-bold">Welcome to Shophoria</h1>
            <p className="lead">Discover the best deals on your favorite products!</p>
            <button className="btn btn-primary btn-lg mt-3" onClick={handleShopNowClick}>
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container my-5">
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

        {/* Product Grid (only shown when a category is selected) */}
        {selectedCategory && (
          <div className="row" ref={productGridRef}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/150'}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted">{product.description}</p>
                      <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-primary">Add to Cart</button>
                        <button
                          className="btn btn-outline-danger"
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