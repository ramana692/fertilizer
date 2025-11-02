import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WishlistButton = ({ productId, size = 'md', showText = false, onToggle = null }) => {
  const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://fertilizer-c92p.onrender.com' : 'http://localhost:5001');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Determine icon size based on prop
  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      case 'xl':
        return 32;
      case 'md':
      default:
        return 20;
    }
  };

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE}/api/wishlist/check/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsInWishlist(response.data.inWishlist);
      } catch (error) {
        console.error('Error checking wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    checkWishlist();
  }, [productId]);

  // Toggle wishlist status
  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading || updating) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please sign in to save items to your wishlist');
      return;
    }

    setUpdating(true);
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`${API_BASE}/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
        
        if (onToggle) onToggle(false);
      } else {
        // Add to wishlist
        await axios.post(
          `${API_BASE}/api/wishlist/${productId}`, 
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setIsInWishlist(true);
        toast.success('Added to wishlist');
        
        if (onToggle) onToggle(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update wishlist';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <button 
        className={`flex items-center ${showText ? 'space-x-1' : ''} text-gray-400`}
        disabled
      >
        <FaSpinner className="animate-spin" size={getIconSize()} />
        {showText && <span>Loading...</span>}
      </button>
    );
  }

  // Show wishlist button
  return (
    <button
      onClick={toggleWishlist}
      className={`flex items-center ${showText ? 'space-x-1' : ''} ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      disabled={updating}
    >
      {updating ? (
        <FaSpinner className="animate-spin" size={getIconSize()} />
      ) : isInWishlist ? (
        <FaHeart size={getIconSize()} />
      ) : (
        <FaRegHeart size={getIconSize()} />
      )}
      {showText && (
        <span>{isInWishlist ? 'Saved' : 'Save for later'}</span>
      )}
    </button>
  );
};

export default WishlistButton;
