import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useParams } from 'react-router-dom';
import './OrderDetails.css';

function OrderDetails() {
  const { id } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view your order details!');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched order:', JSON.stringify(response.data, null, 2)); // Debug
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err.response ? err.response.data : err.message);
        if (err.response && err.response.data.msg === 'Token expired, please log in again') {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          alert('Failed to fetch order details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
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

  if (!order) {
    return <div className="container my-5"><h2>Order not found.</h2></div>;
  }

  return (
    <div className="container my-5">
      <h2>Order Details</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Order ID: {order._id}</h5>
          <p className="card-text"><strong>Status:</strong> {order.status}</p>
          <p className="card-text"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
          <p className="card-text"><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <h6>Items:</h6>
          <ul className="list-group">
            {order.items.map(item => (
              <li key={item.productId._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6>{item.productId.name}</h6>
                    <p className="mb-0">Quantity: {item.quantity}</p>
                    <p className="mb-0">Price: ${item.productId.price.toFixed(2)}</p>
                  </div>
                  <img
                    src={item.productId.images?.[0] || 'https://placehold.it/150x150'}
                    alt={item.productId.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;