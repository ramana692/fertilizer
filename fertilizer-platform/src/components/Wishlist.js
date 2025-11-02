import React, { useState, useEffect, useCallback } from 'react';
import { FaRegHeart, FaShoppingCart, FaTrash, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://fertilizer-c92p.onrender.com' : 'http://localhost:5001');

  const fetchWishlist = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const fetchCartItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchWishlist();
    fetchCartItems();
  }, [fetchWishlist, fetchCartItems]);

  const removeFromWishlist = async (productId) => {
    if (updating) return;
    
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(`${API_BASE}/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWishlist(wishlist.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setUpdating(false);
    }
  };

  const addToCart = async (product) => {
    if (updating) return;
    
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${API_BASE}/api/cart`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update cart items
      await fetchCartItems();
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setUpdating(false);
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product._id === productId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">Sign in to view your saved items</p>
          <div className="space-x-4">
            <Link 
              to="/login" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
            <FaRegHeart className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save your favorite items to your wishlist</p>
          <Link 
            to="/products" 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {wishlist.map((product) => (
            <div key={product._id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-white rounded-md overflow-hidden">
                  <img
                    src={product.images?.[0] || '/images/placeholder-product.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/products/${product._id}`} className="hover:text-blue-600">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.category?.name || 'Fertilizer'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                      {product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={updating}
                    >
                      <FaTrash className="mr-2 text-red-500" />
                      Remove
                    </button>
                    
                    <button
                      onClick={() => addToCart(product)}
                      disabled={isInCart(product._id) || updating}
                      className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isInCart(product._id) 
                        ? 'bg-green-500' 
                        : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      {isInCart(product._id) ? (
                        <>
                          <FaCheck className="mr-2" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="mr-2" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-center">
        <Link 
          to="/products" 
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
        
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in wishlist
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
