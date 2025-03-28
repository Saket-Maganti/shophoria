import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { user, token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      if (user && token) {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItems(res.data);
        } catch (err) {
          console.error('Error fetching cart:', err);
        }
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(localCart);
      }
    };

    fetchCart();
  }, [user, token]);

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(item);
      return;
    }

    if (user && token) {
      try {
        await axios.put(
          `${API_BASE_URL}/api/cart/${item._id}`,
          { quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(cartItems.map(i => (i._id === item._id ? { ...i, quantity: newQuantity } : i)));
      } catch (err) {
        console.error('Error updating quantity:', err);
      }
    } else {
      let localCart = JSON.parse(localStorage.getItem('cart')) || [];
      localCart = localCart.map(i => (i._id === item._id ? { ...i, quantity: newQuantity } : i));
      localStorage.setItem('cart', JSON.stringify(localCart));
      setCartItems(localCart);
    }
  };

  const removeItem = async (item) => {
    if (user && token) {
      try {
        await axios.delete(`${API_BASE_URL}/api/cart/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(cartItems.filter(i => i._id !== item._id));
      } catch (err) {
        console.error('Error removing item:', err);
      }
    } else {
      let localCart = JSON.parse(localStorage.getItem('cart')) || [];
      localCart = localCart.filter(i => i._id !== item._id);
      localStorage.setItem('cart', JSON.stringify(localCart));
      setCartItems(localCart);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.product ? item.product.price : item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item._id} className="card mb-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.product ? item.product.name : item.name}</h5>
                  <p className="text-muted">
                    ${item.product ? item.product.price : item.price} x {item.quantity}
                  </p>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm ms-2 me-3"
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="text-end mt-4">
            <h4>Total: ${totalPrice.toFixed(2)}</h4>
            <button className="btn btn-primary mt-2">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;