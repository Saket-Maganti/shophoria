import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your orders.');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Your Orders</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {orders.length === 0 && !error ? (
        <p>You have no orders yet.</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order._id} className="card mb-3">
              <div className="card-header">
                Order placed on {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="card-body">
                <h5 className="card-title">Order Total: ${order.totalPrice.toFixed(2)}</h5>
                <p className="card-text">Status: {order.status}</p>
                <h6>Shipping Info:</h6>
                <p>
                  {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.postalCode}, {order.shippingInfo.country}
                </p>
                <h6>Items:</h6>
                <ul>
                  {order.items.map(item => (
                    <li key={item._id}>
                      {item.name} - ${item.price} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;