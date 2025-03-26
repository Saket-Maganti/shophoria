import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';

function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const { id } = useParams();

  const fetchOrder = useCallback(async () => {
    if (!token) {
      setError('Please log in to view your order.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to fetch order. Please try again.');
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
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

  if (!order) {
    return (
      <div className="container my-5">
        <h2>Order Details</h2>
        <p>Order not found.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>Order Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Order #{order._id}</h5>
          <p className="card-text">
            Total: ${order.total.toFixed(2)}
          </p>
          <p className="card-text">
            Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="card-text">
            Status: {order.status}
          </p>
          <h6>Items:</h6>
          <ul className="list-group">
            {order.items.map(item => (
              <li key={item._id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <span>{item.productId?.name || 'Unknown Product'}</span>
                  <span>
                    ${item.productId?.price ? item.productId.price.toFixed(2) : 'N/A'} x {item.quantity}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link to="/dashboard" className="btn btn-secondary mt-3">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default OrderDetails;