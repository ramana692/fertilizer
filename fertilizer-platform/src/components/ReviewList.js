import React, { useState, useEffect } from 'react';
import { FaStar, FaThumbsUp, FaRegThumbsUp, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewList = ({ productId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const API_BASE = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://fertilizer-c92p.onrender.com' : 'http://localhost:5001');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/reviews/product/${productId}?page=${page}&limit=5`);
        if (page === 1) {
          setReviews(response.data.data);
        } else {
          setReviews(prev => [...prev, ...response.data.data]);
        }
        setHasMore(response.data.data.length > 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, page, API_BASE]);

  const handleLike = async (reviewId) => {
    if (!currentUser) {
      toast.info('Please login to like reviews');
      return;
    }

    try {
      await axios.put(`${API_BASE}/api/reviews/${reviewId}/like`);
      
      setReviews(reviews.map(review => {
        if (review._id === reviewId) {
          const isLiked = review.likes.includes(currentUser.id);
          return {
            ...review,
            likes: isLiked 
              ? review.likes.filter(id => id !== currentUser.id)
              : [...review.likes, currentUser.id]
          };
        }
        return review;
      }));

    } catch (error) {
      console.error('Error liking review:', error);
      toast.error('Failed to like review');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && page === 1) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
      ) : (
        <>
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {review.user?.avatar ? (
                    <img 
                      src={`${API_BASE}/uploads/${review.user.avatar}`} 
                      alt={review.user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUser className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} w-4 h-4`} 
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                        {review.verifiedPurchase && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleLike(review._id)}
                      className="flex items-center text-sm text-gray-500 hover:text-blue-500"
                    >
                      {review.likes?.includes(currentUser?.id) ? (
                        <FaThumbsUp className="text-blue-500 mr-1" />
                      ) : (
                        <FaRegThumbsUp className="mr-1" />
                      )}
                      <span>{review.likes?.length || 0}</span>
                    </button>
                  </div>
                  
                  <h5 className="font-medium text-gray-900 mt-1">{review.title}</h5>
                  <p className="text-gray-600 mt-1">{review.comment}</p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex space-x-2 mt-3">
                      {review.images.map((image, idx) => (
                        <img 
                          key={idx} 
                          src={`${API_BASE}/uploads/reviews/${image}`} 
                          alt={`Review ${idx + 1}`}
                          className="h-16 w-16 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80"
                          onClick={() => window.open(`${API_BASE}/uploads/reviews/${image}`, '_blank')}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More Reviews'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewList;
