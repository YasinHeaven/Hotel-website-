import { useCallback, useEffect, useState } from 'react';
import './AdminReviews.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [message, setMessage] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reviews/admin?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      } else {
        setMessage('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setMessage('Error fetching reviews');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprove = async (reviewId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Review approved successfully!');
        fetchReviews(); // Refresh the list
      } else {
        setMessage('Failed to approve review');
      }
    } catch (error) {
      console.error('Error approving review:', error);
      setMessage('Error approving review');
    }
  };

  const handleReject = async (reviewId) => {
    if (!window.confirm('Are you sure you want to reject this review?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reviews/${reviewId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Review rejected successfully!');
        fetchReviews(); // Refresh the list
      } else {
        setMessage('Failed to reject review');
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      setMessage('Error rejecting review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Review deleted successfully!');
        fetchReviews(); // Refresh the list
      } else {
        setMessage('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setMessage('Error deleting review');
    }
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (review) => {
    if (!review.isApproved && review.isVisible) {
      return <span className="status-badge pending">Pending</span>;
    } else if (review.isApproved && review.isVisible) {
      return <span className="status-badge approved">Approved</span>;
    } else {
      return <span className="status-badge rejected">Rejected</span>;
    }
  };

  if (loading) {
    return (
      <div className="admin-reviews">
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="admin-reviews">
      <div className="admin-reviews-header">
        <h1>Manage Reviews</h1>
        <p>Approve, reject, or delete guest reviews</p>
      </div>

      {message && (
        <div className="alert-message">
          {message}
        </div>
      )}

      <div className="reviews-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Reviews
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending Approval
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
      </div>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <h3>No reviews found</h3>
            <p>No reviews match the current filter.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <h3>{review.name}</h3>
                  <p className="email">{review.email}</p>
                  {review.location && <p className="location">{review.location}</p>}
                </div>
                <div className="review-meta">
                  {getStatusBadge(review)}
                  <div className="rating">
                    {renderStars(review.rating)}
                    <span className="rating-number">({review.rating}/5)</span>
                  </div>
                  <div className="date">{formatDate(review.createdAt)}</div>
                </div>
              </div>

              <div className="review-content">
                <h4 className="review-title">{review.title}</h4>
                <p className="review-comment">{review.comment}</p>
              </div>

              <div className="review-actions">
                {!review.isApproved && review.isVisible && (
                  <button 
                    className="btn approve-btn"
                    onClick={() => handleApprove(review._id)}
                  >
                    Approve
                  </button>
                )}
                
                {review.isApproved && (
                  <button 
                    className="btn reject-btn"
                    onClick={() => handleReject(review._id)}
                  >
                    Reject
                  </button>
                )}
                
                <button 
                  className="btn delete-btn"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
