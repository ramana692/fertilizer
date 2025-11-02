// Updated: 2025-11-02 00:28 - Dark Blue Theme with Red Cart Buttons
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar, FaSearch, FaFilter } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('name');
  const [wishlist, setWishlist] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://fertilizer-c92p.onrender.com' : 'http://localhost:5001');

  const categories = ['all', 'organic', 'chemical', 'npk', 'micronutrients', 'specialty'];

  const fetchProducts = useCallback(async () => {
    // Helper: sleep
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));
    const attempts = [0, 1500, 3000, 5000];

    try {
      // Warm up Render free instance (no-op if already awake)
      try { await axios.get(`${API_BASE}/`, { timeout: 4000 }); } catch (_) {}

      let lastErr;
      for (let i = 0; i < attempts.length; i++) {
        if (attempts[i] > 0) await wait(attempts[i]);
        try {
          const response = await axios.get(`${API_BASE}/api/products`, { timeout: 8000 });
          setProducts(response.data);
          lastErr = undefined;
          break;
        } catch (err) {
          lastErr = err;
          // Try next attempt
        }
      }

      if (lastErr) {
        console.error('Error fetching products after retries:', lastErr?.message || lastErr);
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const fetchWishlist = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_BASE}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, [fetchProducts, fetchWishlist]);

  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, priceRange, sortBy, filterAndSortProducts]);

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      await axios.post(
        `${API_BASE}/api/cart`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to manage wishlist');
        return;
      }

      const isInWishlist = wishlist.some(item => item._id === productId);

      if (isInWishlist) {
        await axios.delete(`${API_BASE}/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(wishlist.filter(item => item._id !== productId));
        toast.success('Removed from wishlist');
      } else {
        await axios.post(
          `${API_BASE}/api/wishlist`,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const product = products.find(p => p._id === productId);
        setWishlist([...wishlist, product]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 text-center shadow-md">
        <p className="text-sm font-semibold">🚀 Free Shipping on Orders Above ₹999 | Same Day Delivery Available 🚀</p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-b-4 border-orange-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-orange-900">🌱 AgriGrow Fertilizer Mart</h1>
              <p className="text-lg text-orange-700 mt-2 font-semibold">Nurturing Growth, Harvesting Success</p>
              <p className="text-sm text-gray-600 mt-1">Your Trusted Partner in Modern Agriculture</p>
            </div>
            <div className="text-right bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide">24/7 Customer Support</p>
              <p className="text-sm text-orange-800 mt-1">📞 Order Now: <span className="font-bold text-orange-600 text-lg">7065060162</span></p>
              <p className="text-sm text-orange-800">💬 Help Desk: <span className="font-bold text-orange-600 text-lg">7428208822</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border-2 border-blue-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3.5 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900 placeholder-gray-500 shadow-lg font-medium bg-white hover:border-blue-400 transition-all"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-xl cursor-pointer hover:text-blue-700" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-lg font-semibold text-gray-900 bg-white hover:border-blue-400 transition-all cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-lg font-semibold text-gray-900 bg-white hover:border-blue-400 transition-all cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-6 pt-6 border-t-2 border-blue-100 flex items-center space-x-4">
            <FaFilter className="text-blue-600 text-lg" />
            <span className="text-sm font-bold text-gray-700">Price Range:</span>
            <input
              type="number"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              className="w-28 px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-md bg-white"
            />
            <span className="text-gray-600 font-bold">-</span>
            <input
              type="number"
              placeholder="1000"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-28 px-4 py-2 border-2 border-blue-300 rounded-lg text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-md bg-white"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              // Random discount for demo (25%, 35%, 50%, 59%)
              const discounts = [25, 35, 50, 59];
              const discount = discounts[index % discounts.length];
              const originalPrice = product.price / (1 - discount / 100);
              
              return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
              >
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm z-10">
                    {discount}%
                  </div>
                )}

                {/* Product Image */}
                <div className="relative h-48 bg-white border-b">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaShoppingCart className="h-16 w-16" />
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`absolute top-2 left-2 p-2 rounded-full shadow-lg hover:scale-110 transform transition-all duration-200 z-10 ${
                      isInWishlist(product._id) 
                        ? 'bg-red-50 hover:bg-red-100' 
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {isInWishlist(product._id) ? (
                      <FaHeart className="h-5 w-5 text-red-500 animate-pulse" />
                    ) : (
                      <FaRegHeart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                    )}
                  </button>

                  {/* Category Badge */}
                  {product.category && (
                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-blue-800 text-white text-xs font-bold rounded shadow-md">
                      {product.category}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description || 'High-quality fertilizer for optimal plant growth'}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.reviewCount || 0})
                    </span>
                  </div>

                  {/* Price and Stock */}
                  <div className="mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-800">
                        ₹{product.price.toFixed(2)}
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.stock > 0 ? (
                      <span className="text-xs text-blue-800 font-bold">✓ In Stock</span>
                    ) : (
                      <span className="text-xs text-red-600 font-medium">✗ Out of Stock</span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={product.stock === 0}
                    className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center text-sm shadow-lg ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transform hover:scale-105'
                    } transition-all duration-200`}
                  >
                    <FaShoppingCart className="mr-2" />
                    ADD TO CART
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders above ₹500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">💳</div>
            <h3 className="font-bold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-sm text-gray-600">100% secure transactions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="font-bold text-gray-900 mb-2">Best Offers</h3>
            <p className="text-sm text-gray-600">Daily deals & discounts</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">Expert agri assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
