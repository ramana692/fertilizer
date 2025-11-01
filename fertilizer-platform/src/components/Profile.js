import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ username, cartCount, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orders] = useState([
    { id: 1, date: '2025-10-31', items: ['NPK Fertilizer', 'Urea'], status: 'Delivered' },
    { id: 2, date: '2025-10-25', items: ['Organic Manure'], status: 'In Transit' }
  ]);

  return (
    <div className="profile-container">
      <div className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
        👤 {username}
      </div>
      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <h3>Welcome, {username}!</h3>
          </div>
          <div className="profile-menu">
            <div className="menu-item">
              <span className="icon">🛒</span>
              <span>Cart Items: {cartCount}</span>
            </div>
            <div className="menu-item orders-section">
              <span className="icon">📦</span>
              <span>Orders</span>
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-item">
                    <div>Order #{order.id}</div>
                    <div>{order.date}</div>
                    <div className="order-status">{order.status}</div>
                  </div>
                ))}
              </div>
            </div>
            <button className="signout-btn" onClick={onSignOut}>
              <span className="icon">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;