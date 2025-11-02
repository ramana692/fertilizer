import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://fertilizer-c92p.onrender.com' : 'http://localhost:5001');

  // Sample products for each category
  const categoryProducts = useCallback(() => {
    return {
      paddy: [
        {
          id: 'paddy-1',
          name: 'Paddy Anna (R) 4 (TFL)',
          variety: 'R4',
          price: 43.00,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
          outOfStock: true
        },
        {
          id: 'paddy-2',
          name: 'Paddy ADT 37 (TFL) (1 Kg.)',
          variety: 'ADT 37',
          price: 43.00,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
          outOfStock: true
        },
        {
          id: 'paddy-3',
          name: 'Paddy ASD 16 (TFL) (1 Kg...)',
          variety: 'ASD 16',
          price: 43.00,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
          outOfStock: true
        },
        {
          id: 'paddy-4',
          name: 'Paddy TRY 3 (1 Kg.) – நெல்...',
          variety: 'TRY 3',
          price: 43.00,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
          outOfStock: true
        },
        {
          id: 'paddy-5',
          name: 'Paddy CR 1002 (TFL) (1 Kg.)',
          variety: 'CR 1002',
          price: 43.00,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
          outOfStock: true
        },
        {
          id: 'paddy-6',
          name: 'Paddy CO 51 (TFL) (1 Kg.)',
          variety: 'CO 51',
          price: 43.00,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
          outOfStock: true
        },
        {
          id: 'paddy-7',
          name: 'Paddy TPS 5 (TFL) (1 Kg.)',
          variety: 'TPS 5',
          price: 43.00,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
          outOfStock: true
        },
        {
          id: 'paddy-8',
          name: 'Paddy TRY 1 (TFL) (1 Kg.)',
          variety: 'TRY 1',
          price: 43.00,
          image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
          outOfStock: true
        }
      ],
      maize: [
        {
          id: 'maize-1',
          name: 'Maize Hybrid 900M Gold',
          variety: '900M',
          price: 250.00,
          image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
          outOfStock: false
        },
        {
          id: 'maize-2',
          name: 'Maize Super 3501',
          variety: '3501',
          price: 280.00,
          image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
          outOfStock: true
        }
      ]
    };
  }, []);

  const categoryNames = {
    paddy: 'Paddy - நெல்',
    maize: 'Maize - மக்காச்சோளம்',
    pulses: 'Pulses - பயிறுவகை பயிர்கள்',
    horticulture: 'Horticultural Crops',
    cotton: 'Cotton - பருத்தி',
    sugarcane: 'Sugarcane - கரும்பு',
    wheat: 'Wheat - கோதுமை',
    groundnut: 'Groundnut - நிலக்கடலை'
  };

  useEffect(() => {
    // Load products for this category
    const loadProducts = () => {
      setLoading(true);
      setTimeout(() => {
        setProducts(categoryProducts()[categoryId] || []);
        setLoading(false);
      }, 500);
    };
    loadProducts();
  }, [categoryId, categoryProducts]);

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
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/categories"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Back to Categories
          </Link>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            {categoryNames[categoryId] || 'Products'}
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Browse our selection of quality products
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available in this category</p>
            <Link
              to="/categories"
              className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
              >
                {/* Out of Stock Badge */}
                {product.outOfStock && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    Out of Stock
                  </div>
                )}

                {/* Variety Badge */}
                {product.variety && (
                  <div className="absolute top-2 right-2 z-10">
                    <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm">
                      {product.variety}
                    </div>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative h-56 bg-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Product';
                    }}
                  />
                  {product.outOfStock && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-30"></div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      ₹ {product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={product.outOfStock}
                    className={`w-full py-2 px-4 rounded-md font-semibold text-sm ${
                      product.outOfStock
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    } transition-colors duration-200`}
                  >
                    {product.outOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social Share Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
        <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>
        <button className="bg-blue-400 text-white p-3 rounded-full shadow-lg hover:bg-blue-500">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </button>
        <button className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryProducts;
