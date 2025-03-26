import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/UserContext';
import './CategoryPage.css';

function CategoryPage() {
  const { categoryName } = useParams();
  const { token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartLoading, setCartLoading] = useState({});
  const [wishlistLoading, setWishlistLoading] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`, {
          params: { category: categoryName },
        });
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err.response ? err.response.data : err.message);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const handleAddToCart = async (productId, quantity = 1) => {
    setCartLoading(prev => ({ ...prev, [productId]: true }));
    try {
      if (!token) {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = storedCart.find(item => item._id === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          const productToAdd = products.find(p => p._id === productId);
          if (productToAdd) {
            storedCart.push({ ...productToAdd, quantity });
            localStorage.setItem('cart', JSON.stringify(storedCart));
            addToCart({ ...productToAdd, quantity });
            alert('Product added to cart!');
          }
        }
      } else {
        await axios.post(
          `${API_BASE_URL}/api/cart`,
          { productId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const productToAdd = products.find(p => p._id === productId);
        if (productToAdd) {
          addToCart({ ...productToAdd, quantity });
        }
        alert('Product added to cart!');
      }
    } catch (err) {
      console.error('Error adding to cart:', err.response ? err.response.data : err.message);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setCartLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddToWishlist = async (productId) => {
    setWishlistLoading(prev => ({ ...prev, [productId]: true }));
    try {
      if (!token) {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingItem = storedWishlist.find(item => item._id === productId);
        if (existingItem) {
          alert('Product already in wishlist!');
          return;
        }
        const productToAdd = products.find(p => p._id === productId);
        if (productToAdd) {
          storedWishlist.push(productToAdd);
          localStorage.setItem('wishlist', JSON.stringify(storedWishlist));
          alert('Product added to wishlist!');
        }
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
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const getCategoryFallbackImage = (category) => {
    const fallbackImages = {
      Laptops: 'https://via.placeholder.com/150?text=Laptop+Image',
      Sneakers: 'https://via.placeholder.com/150?text=Sneaker+Image',
      Smartphones: 'https://via.placeholder.com/150?text=Smartphone+Image',
      Headphones: 'https://via.placeholder.com/150?text=Headphone+Image',
      'Home Appliances': 'https://via.placeholder.com/150?text=Home+Appliance+Image',
      Clothing: 'https://via.placeholder.com/150?text=Clothing+Image',
      Books: 'https://via.placeholder.com/150?text=Book+Image',
      default: 'https://via.placeholder.com/150?text=Product+Image'
    };
    return fallbackImages[category] || fallbackImages.default;
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

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="category-page-container">
      <div className="container">
        <h2 className="category-page-title">{categoryName}</h2>
        <div className="row">
          {products.length === 0 ? (
            <p className="no-products">No products found in this category.</p>
          ) : (
            products.map(item => (
              <div key={item._id} className="col-md-4 mb-4">
                <div className="card product-card">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.images?.[0] || getCategoryFallbackImage(item.category)}
                      className="card-img-top"
                      alt={item.name}
                      onError={(e) => (e.target.src = getCategoryFallbackImage(item.category))}
                    />
                  </Link>
                  <div className="card-body">
                    <Link to={`/product/${item._id}`} className="text-decoration-none">
                      <h5 className="card-title">{item.name}</h5>
                    </Link>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text price">${item.price.toFixed(2)}</p>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleAddToCart(item._id)}
                      disabled={cartLoading[item._id]}
                    >
                      {cartLoading[item._id] ? (
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
                      onClick={() => handleAddToWishlist(item._id)}
                      disabled={wishlistLoading[item._id]}
                    >
                      {wishlistLoading[item._id] ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Adding...
                        </>
                      ) : (
                        'Add to Wishlist'
                      )}
                    </button>
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

export default CategoryPage;