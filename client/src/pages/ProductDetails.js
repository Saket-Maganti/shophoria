import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, fetchCartCount, fetchWishlistCount } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products`)
      .then(res => {
        const foundProduct = res.data.find(p => p._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          navigate('/'); // Redirect to home if product not found
        }
        setLoading(false);
      })
      .catch(err => {
        console.log('Error fetching product:', err);
        setLoading(false);
        navigate('/');
      });
  }, [id, navigate]);

  const addToCart = async () => {
    if (user && token) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/cart`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Added to cart successfully!');
        fetchCartCount(token);
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

  const addToWishlist = async () => {
    if (user && token) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/wishlist`,
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Added to wishlist successfully!');
        fetchWishlistCount(token);
      } catch (err) {
        const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Server error. Please try again.';
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

  if (loading) {
    return <div className="container my-5 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="container my-5 text-center">Product not found.</div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400'}
            alt={product.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
            onError={(e) => (e.target.src = 'https://via.placeholder.com/400')}
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">{product.name}</h2>
          <p className="text-muted mb-3">{product.category}</p>
          <p className="lead mb-4">{product.description}</p>
          <h3 className="text-primary mb-4">${product.price.toFixed(2)}</h3>
          <div className="d-flex gap-3">
            <button className="btn btn-primary btn-lg" onClick={addToCart}>
              Add to Cart
            </button>
            <button className="btn btn-outline-danger btn-lg" onClick={addToWishlist}>
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;