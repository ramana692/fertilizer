import React, { useState } from 'react';
import './Review.css';

const Review = ({ product, onSubmitReview, userReviews }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview({ rating, review, productId: product._id });
    setRating(5);
    setReview('');
    setShowForm(false);
  };

  return (
    <div className="reviews-section">
      <h3>Product Reviews</h3>
      
      <div className="reviews-summary">
        <div className="average-rating">
          <span className="rating-number">{product.averageRating.toFixed(1)}</span>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                className={`star ${star <= product.averageRating ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="total-reviews">({product.ratings.length} reviews)</span>
        </div>
      </div>

      {!showForm ? (
        <button className="write-review-btn" onClick={() => setShowForm(true)}>
          Write a Review
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-input">
            <label>Your Rating:</label>
            <div className="stars-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <div className="review-input">
            <label>Your Review:</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this product..."
              required
            />
          </div>

          <div className="form-buttons">
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit">Submit Review</button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {product.ratings.map((review, index) => (
          <div key={index} className="review-item">
            <div className="review-header">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= review.rating ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="review-text">{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;