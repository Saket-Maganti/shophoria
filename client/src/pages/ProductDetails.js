import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (token) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/cart`,
          { productId: id, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Product added to cart!');
        navigate('/cart');
      } catch (err) {
        console.error('Error adding to cart:', err);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = localCart.find(item => item.productId._id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        localCart.push({
          productId: {
            _id: id,
            name: product.name,
            price: product.price,
          },
          quantity,
        });
      }
      localStorage.setItem('cart', JSON.stringify(localCart));
      alert('Product added to cart!');
      navigate('/cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (token) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/wishlist`,
          { productId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Product added to wishlist!');
      } catch (err) {
        console.error('Error adding to wishlist:', err);
      }
    } else {
      const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      const existingItem = localWishlist.find(item => item._id === id);
      if (!existingItem) {
        localWishlist.push({
          _id: id,
          name: product.name,
          price: product.price,
        });
        localStorage.setItem('wishlist', JSON.stringify(localWishlist));
        alert('Product added to wishlist!');
      } else {
        alert('Product is already in your wishlist!');
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (!product) return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <div className="row">
          <div className="col-md-6">
            <div className="product-image">
              <img src={product.images[0]} alt={product.name} className="img-fluid rounded" />
            </div>
          </div>
          <div className="col-md-6">
            <h1 className="mb-3">{product.name}</h1>
            <div className="d-flex align-items-center mb-3">
              <div className="product-rating me-2">
                {renderStars(product.rating || 0)}
              </div>
              <span className="text-muted">({product.rating || 0}/5)</span>
            </div>
            <h3 className="text-primary mb-3">${product.price}</h3>
            <p className="text-muted mb-4">{product.description}</p>
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">Quantity:</label>
              <input
                type="number"
                id="quantity"
                className="form-control w-25"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                min="1"
              />
            </div>
            <div className="d-flex gap-3">
              <button onClick={handleAddToCart} className="btn btn-primary">
                Add to Cart
              </button>
              <button onClick={handleAddToWishlist} className="btn btn-outline-secondary">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;