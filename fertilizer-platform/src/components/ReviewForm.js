import React, { useState, useEffect } from 'react';
import { FaStar, FaTimes, FaImage, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewForm = ({ productId, onReviewSubmit, currentUser }) => {
  const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://fertilizer-c92p.onrender.com' : 'http://localhost:5001');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    // Check if user has purchased the product
    const checkPurchase = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/orders/check-purchase/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHasPurchased(response.data.hasPurchased);
      } catch (error) {
        console.error('Error checking purchase:', error);
      }
    };

    if (currentUser) {
      checkPurchase();
    }
  }, [productId, currentUser, API_BASE]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate number of images
    if (images.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    // Validate image size and type
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      if (!file.type.match('image.*')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    // Create preview URLs
    const newPreviewImages = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviewImages = [...previewImages];
    
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(newPreviewImages[index]);
    
    newImages.splice(index, 1);
    newPreviewImages.splice(index, 1);
    
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!title.trim() || !comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('product', productId);
      formData.append('rating', rating);
      formData.append('title', title);
      formData.append('comment', comment);
      formData.append('verifiedPurchase', hasPurchased);
      
      // Append images if any
      images.forEach((image, index) => {
        formData.append('images', image);
      });
      
      const response = await axios.post(`${API_BASE}/api/reviews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Review submitted successfully!');
      
      // Reset form
      setRating(0);
      setHover(0);
      setTitle('');
      setComment('');
      setImages([]);
      setPreviewImages([]);
      
      // Notify parent component
      if (onReviewSubmit) {
        onReviewSubmit(response.data.data);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit review';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
      
      {!currentUser ? (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-2">Please sign in to write a review</p>
          <button 
            onClick={() => window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      className="hidden"
                    />
                    <FaStar
                      className="w-8 h-8"
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Review Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share your experience to help other customers"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <div className="flex items-center">
              <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <FaImage className="mr-2" />
                Add Images
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={images.length >= 5}
                />
              </label>
              <span className="ml-2 text-sm text-gray-500">
                {images.length}/5 images (max 5MB each)
              </span>
            </div>
            
            {previewImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="h-20 w-20 object-cover rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {hasPurchased && (
            <div className="flex items-center text-sm text-green-600 mb-4">
              <FaCheck className="mr-1" />
              <span>You purchased this product on {new Date().toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !title.trim() || !comment.trim()}
              className={`px-4 py-2 rounded-md text-white ${isSubmitting || rating === 0 || !title.trim() || !comment.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
