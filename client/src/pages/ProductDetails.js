import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function ProductDetails({ cart, setCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [wishlistError, setWishlistError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
      });
  }, [id]);

  const handleReviewChange = (e) => {
    setReview({
      ...review,
      [e.target.name]: e.target.value,
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to submit a review.');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/products/${id}/reviews`,
        review,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProduct(response.data);
      setReview({ rating: 5, comment: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error submitting review');
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const addToWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlistError('Please log in to add to wishlist.');
        return;
      }

      await axios.post(
        `${API_BASE_URL}/api/wishlist/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`${product.name} added to wishlist!`);
      setWishlistError('');
    } catch (err) {
      setWishlistError(err.response?.data?.msg || 'Error adding to wishlist');
    }
  };

  if (!product) {
    return <div className="container">Loading...</div>;
  }

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
      : 'No reviews yet';

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-6">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          ) : (
            <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
              No Image
            </div>
          )}
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Average Rating:</strong> {averageRating} / 5</p>
          <button className="btn btn-primary mb-2 me-2" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
          <button className="btn btn-secondary mb-2" onClick={addToWishlist}>
            Add to Wishlist
          </button>
          {wishlistError && <div className="alert alert-danger mt-2">{wishlistError}</div>}

          <h3 className="mt-4">Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <ul className="list-group mb-4">
              {product.reviews.map(review => (
                <li key={review._id} className="list-group-item">
                  <strong>{review.user.name}</strong> rated it {review.rating}/5
                  <p>{review.comment}</p>
                  <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet. Be the first to leave a review!</p>
          )}

          <h4>Leave a Review</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-3">
              <label htmlFor="rating" className="form-label">Rating (1-5)</label>
              <select
                className="form-control"
                id="rating"
                name="rating"
                value={review.rating}
                onChange={handleReviewChange}
                required
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Comment</label>
              <textarea
                className="form-control"
                id="comment"
                name="comment"
                value={review.comment}
                onChange={handleReviewChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;