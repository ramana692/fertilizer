import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { FaShoppingCart, FaHeart, FaUser, FaBox } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Categories from './components/Categories';
import CategoryProducts from './components/CategoryProducts';
import Profile from './components/Profile';
import Wishlist from './components/Wishlist';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import OrderDetail from './components/OrderDetail';
import ProductDetail from './components/ProductDetail';

// Protected Route Component
const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://fertilizer-c92p.onrender.com' : 'http://localhost:5001');

  // Check for existing session on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUsername(user.name || user.email);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }, []);

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add response interceptor to handle 401 Unauthorized
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setIsLoggedIn(false);
        }
        return Promise.reject(error);
      }
    );
    
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [setIsLoggedIn]);

  // Fetch cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      if (isLoggedIn) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_BASE}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCartCount(response.data.items?.length || 0);
        } catch (error) {
          console.error('Error fetching cart count:', error);
        }
      }
    };
    fetchCartCount();
  }, [isLoggedIn, API_BASE]);

  const handleLogin = (user) => {
    setUsername(user.name || user.email);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setIsLoggedIn(false);
    window.location.href = '/login';
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Header with navigation */}
      {isLoggedIn && (
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                🌱 Fertilizer Shop
              </Link>
              
              <nav className="flex items-center space-x-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                  Home
                </Link>
                <Link to="/categories" className="text-gray-700 hover:text-blue-600 font-medium">
                  Categories
                </Link>
                <Link to="/orders" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <FaBox className="mr-1" />
                  Orders
                </Link>
                <Link to="/wishlist" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <FaHeart className="mr-1" />
                  Wishlist
                </Link>
                <Link to="/cart" className="flex items-center text-gray-700 hover:text-blue-600 font-medium relative">
                  <FaShoppingCart className="mr-1" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  <FaUser className="mr-1" />
                  {username || 'Profile'}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium"
                >
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </header>
      )}

      <main className="flex-grow bg-gray-50">
        <Routes>
          {/* Home Page */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* Categories Page */}
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Categories />
              </ProtectedRoute>
            } 
          />

          {/* Category Products Page */}
          <Route 
            path="/category/:categoryId" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CategoryProducts />
              </ProtectedRoute>
            } 
          />

          {/* Authentication Routes */}
          <Route 
            path="/login" 
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            } 
          />
          
          <Route 
            path="/register" 
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <Register />
            } 
          />

          {/* Shopping Routes */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Cart />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Checkout />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/orders" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Orders />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/orders/:id" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <OrderDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Wishlist />
              </ProtectedRoute>
            } 
          />

          {/* Product Routes */}
          <Route 
            path="/products/:productId" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ProductDetail />
              </ProtectedRoute>
            } 
          />

          {/* User Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Profile username={username} cartCount={cartCount} onSignOut={handleLogout} />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Page */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-6">Page not found</p>
                  <Link 
                    to="/" 
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
                  >
                    Go back home
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">About Us</h3>
              <p className="mt-4 text-gray-600">Providing quality fertilizers for better agricultural yields.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
                <li><Link to="/wishlist" className="text-gray-600 hover:text-blue-600">Wishlist</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Us</h3>
              <address className="mt-4 not-italic text-gray-600">
                <p>123 Farm Street</p>
                <p>Agriculture City, AC 12345</p>
                <p>Email: info@fertilizershop.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Fertilizer Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
