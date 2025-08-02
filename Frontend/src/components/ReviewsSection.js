import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReviewForm from './ReviewForm';
import './ReviewsSection.css';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showForm]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews?limit=6`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
        setReviewStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleSubmitSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      >
        ⭐
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="reviews-section">
        <div className="container">
          <div className="loading-spinner">Loading reviews...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="reviews-section">
      <div className="container">
        <div className="reviews-header">
          <div className="reviews-title-section">
            <h2 className="section-title">Guest Reviews</h2>
            <p className="section-subtitle">
              What our guests say about their stay at Yasin Heaven Star Hotel
            </p>
          </div>
          
          {reviewStats.totalReviews > 0 && (
            <div className="reviews-stats">
              <div className="average-rating">
                <div className="rating-number">{reviewStats.averageRating}</div>
                <div className="rating-stars">
                  {renderStars(Math.round(reviewStats.averageRating))}
                </div>
                <div className="rating-text">
                  Based on {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {reviews.length > 0 ? (
          <>
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-name">{review.name}</div>
                      {review.location && (
                        <div className="reviewer-location">{review.location}</div>
                      )}
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <div className="review-content">
                    <h4 className="review-title">{review.title}</h4>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                  
                  <div className="review-footer">
                    <span className="review-date">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="reviews-actions">
              <button 
                className="write-review-btn"
                onClick={() => setShowForm(true)}
              >
                Write a Review
              </button>
            </div>
          </>
        ) : (
          <div className="no-reviews">
            <div className="no-reviews-content">
              <h3>Be the First to Review!</h3>
              <p>Share your experience and help other travelers discover Yasin Heaven Star Hotel.</p>
              <button 
                className="write-review-btn"
                onClick={() => setShowForm(true)}
              >
                Write the First Review
              </button>
            </div>
          </div>
        )}

        {showForm && createPortal(
          <ReviewForm 
            onClose={handleFormClose}
            onSubmitSuccess={handleSubmitSuccess}
          />,
          document.body
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
