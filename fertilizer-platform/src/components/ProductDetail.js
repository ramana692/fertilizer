import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaArrowLeft, FaCheck, FaTruck, FaShieldAlt, FaLeaf } from 'react-icons/fa';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://fertilizer-c92p.onrender.com' : 'http://localhost:5001');

  const checkWishlist = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const wishlistItems = response.data.data || [];
      setIsInWishlist(wishlistItems.some(item => item._id === productId));
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  }, [API_BASE, productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/products/${productId}`);
        setProduct(response.data);
        await checkWishlist();
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, API_BASE, checkWishlist]);

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to manage wishlist');
        return;
      }

      if (isInWishlist) {
        await axios.delete(`${API_BASE}/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(
          `${API_BASE}/api/wishlist`,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      await axios.post(
        `${API_BASE}/api/cart`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Product not found</p>
          <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center font-medium">
            <FaArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=Product+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaLeaf className="h-32 w-32 text-gray-400" />
                </div>
              )}
              
              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 p-3 rounded-full shadow-lg hover:scale-110 transform transition-all duration-200 ${
                  isInWishlist ? 'bg-red-50' : 'bg-white'
                }`}
              >
                {isInWishlist ? (
                  <FaHeart className="h-6 w-6 text-red-500" />
                ) : (
                  <FaRegHeart className="h-6 w-6 text-gray-600" />
                )}
              </button>

              {/* Stock Badge */}
              {product.stock > 0 ? (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  <FaCheck className="inline mr-1" /> In Stock
                </div>
              ) : (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category Badge */}
            {product.category && (
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold mb-4 w-fit">
                {product.category}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-5 w-5 ${
                      i < (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-3 text-gray-600 font-medium">
                {product.rating || 4}.0 ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline space-x-3">
                <span className="text-5xl font-black text-blue-600">
                  ₹{product.price?.toFixed(2)}
                </span>
                <span className="text-2xl text-gray-500 line-through">
                  ₹{(product.price * 1.4)?.toFixed(2)}
                </span>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  30% OFF
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'High-quality fertilizer designed to boost plant growth and improve soil health. Perfect for all types of crops and gardens.'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-900 w-16 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center shadow-lg transition-all duration-200 ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                }`}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <FaTruck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-600">On orders ₹999+</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <FaShieldAlt className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-600">100% Protected</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <FaLeaf className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-900">Quality Assured</p>
                <p className="text-xs text-gray-600">Premium Grade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 py-4 px-6 font-bold text-center transition-colors ${
                  activeTab === 'description'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-4 px-6 font-bold text-center transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Reviews ({product.reviewCount || 0})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">
                    {product.description || 'This premium fertilizer is formulated with the perfect balance of nutrients to ensure optimal plant growth and health.'}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Key Features:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>High-quality nutrients for maximum crop yield</li>
                    <li>Suitable for all soil types</li>
                    <li>Eco-friendly and sustainable formulation</li>
                    <li>Easy to apply and fast-acting</li>
                    <li>Improves soil structure and fertility</li>
                  </ul>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">Specifications:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-bold text-gray-900">{product.category || 'General'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Stock Status</p>
                      <p className="font-bold text-gray-900">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                <ReviewList productId={productId} />
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
                  <ReviewForm productId={productId} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
