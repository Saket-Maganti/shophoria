import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view your dashboard!');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched orders:', JSON.stringify(response.data, null, 2)); // Debug
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err.response ? err.response.data : err.message);
        if (err.response && err.response.data.msg === 'Token expired, please log in again') {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          alert('Failed to fetch orders. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
    <div className="container my-5">
      <h2>Your Dashboard</h2>
      <h4>Your Orders</h4>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="list-group">
          {orders.map(order => (
            <Link
              key={order._id}
              to={`/order/${order._id}`}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Order ID: {order._id}</h5>
                <small>{new Date(order.createdAt).toLocaleDateString()}</small>
              </div>
              <p className="mb-1">Total: ${order.total.toFixed(2)}</p>
              <small>Status: {order.status}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;