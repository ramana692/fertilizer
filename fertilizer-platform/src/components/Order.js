import React, { useState } from 'react';
import './Order.css';

const Order = ({ cart, onPlaceOrder, onClose }) => {
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPlaceOrder({
      shippingAddress,
      paymentMethod,
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="order-modal">
      <div className="order-content">
        <h2>Place Order</h2>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="total">
            <h3>Total: ₹{calculateTotal()}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>Shipping Address</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Street Address"
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="State"
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="text"
              placeholder="Pincode"
              value={shippingAddress.pincode}
              onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              readOnly
            />
          </div>

          <h3>Payment Method</h3>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                value="CARD"
                checked={paymentMethod === 'CARD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Credit/Debit Card
            </label>
            <label>
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
            </label>
          </div>

          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Order;