import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './ProductPage.css';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err.response ? err.response.data : err.message);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  if (!product) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning" role="alert">
          Product not found.
        </div>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <div className="container">
        <Link to={`/category/${product.category}`} className="btn btn-link mb-3">
          Back to {product.category}
        </Link>
        <div className="row">
          <div className="col-md-6">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/400?text=Product+Image'}
              className="img-fluid product-image"
              alt={product.name}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/400?text=Product+Image')}
            />
          </div>
          <div className="col-md-6">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-category">Category: {product.category}</p>
            <button className="btn btn-primary me-2">Add to Cart</button>
            <button className="btn btn-outline-secondary">Add to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;