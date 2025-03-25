import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ cart }) {
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/">Go shopping</Link></p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {item.name} - ${item.price}
              </li>
            ))}
            <li className="list-group-item fw-bold">
              Total: ${totalPrice.toFixed(2)}
            </li>
          </ul>
          <Link to="/checkout" className="btn btn-primary w-100">
            Proceed to Checkout
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;