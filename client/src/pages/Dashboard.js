import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setError('Please log in to view your orders.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err.response?.data || err.message);
      setError(err.response?.data?.msg || 'Failed to fetch orders. Please try again.');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  if (!orders || orders.length === 0) {
    return (
      <div className="container my-5">
        <h2>Your Orders</h2>
        <p>You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>Your Orders</h2>
      <div className="row">
        {orders.map(order => (
          <div key={order._id} className="col-md-4 mb-4">
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
                <Link to={`/order/${order._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;