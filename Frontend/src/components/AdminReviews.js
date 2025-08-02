import { useCallback, useEffect, useState } from 'react';
import './AdminReviews.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    comment: '',
    location: '',
    isApproved: true
  });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      console.log('Fetching reviews with token:', token ? 'Present' : 'Missing');
      console.log('API URL:', process.env.REACT_APP_API_URL);
      
      if (!token) {
        setMessage('Admin authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/admin?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.success) {
        setReviews(data.reviews || []);
        setMessage('');
      } else {
        setMessage(data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setMessage(`Error fetching reviews: ${error.message}`);
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${reviewId}/approve`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${reviewId}/reject`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${reviewId}`, {
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

  const handleAddReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.name.trim() || !newReview.email.trim() || !newReview.title.trim() || !newReview.comment.trim()) {
      setMessage('Please fill in all required fields');
      return;
    }

    setIsSubmittingReview(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setMessage('Admin authentication required. Please login again.');
        setIsSubmittingReview(false);
        return;
      }

      console.log('Submitting new review:', newReview);
      console.log('API URL:', `${process.env.REACT_APP_API_URL}/reviews`);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReview)
      });

      console.log('Add review response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Add review response data:', data);

      if (data.success) {
        setMessage('✅ Review added successfully!');
        setShowAddForm(false);
        setNewReview({
          name: '',
          email: '',
          rating: 5,
          title: '',
          comment: '',
          location: '',
          isApproved: true
        });
        
        // If the new review needs approval, approve it immediately if isApproved is true
        if (newReview.isApproved && data.review && data.review._id) {
          try {
            const approveResponse = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${data.review._id}/approve`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (approveResponse.ok) {
              console.log('Review auto-approved successfully');
            }
          } catch (approveError) {
            console.log('Auto-approve failed, but review was created:', approveError);
          }
        }
        
        // Refresh the reviews list
        setTimeout(() => fetchReviews(), 1000);
      } else {
        setMessage(`❌ ${data.message || 'Failed to add review'}`);
      }
    } catch (error) {
      console.error('Error adding review:', error);
      setMessage(`❌ Error adding review: ${error.message}`);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleNewReviewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
        <div>
          <h1>Manage Reviews</h1>
          <p>Approve, reject, or delete guest reviews</p>
        </div>
        <button 
          className="btn add-review-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add Review
        </button>
      </div>

      {message && (
        <div className="alert-message">
          {message}
        </div>
      )}

      {showAddForm && (
        <div className="add-review-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Review</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAddReview} className="add-review-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newReview.name}
                    onChange={handleNewReviewChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newReview.email}
                    onChange={handleNewReviewChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating *</label>
                  <select
                    name="rating"
                    value={newReview.rating}
                    onChange={handleNewReviewChange}
                    required
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                    <option value={2}>2 Stars - Fair</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newReview.location}
                    onChange={handleNewReviewChange}
                    placeholder="e.g., New York, USA"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Review Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newReview.title}
                  onChange={handleNewReviewChange}
                  required
                  placeholder="Brief title for the review"
                />
              </div>

              <div className="form-group">
                <label>Review Comment *</label>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleNewReviewChange}
                  required
                  rows="4"
                  placeholder="Detailed review comment"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isApproved"
                    checked={newReview.isApproved}
                    onChange={handleNewReviewChange}
                  />
                  Auto-approve this review
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="btn cancel-btn"
                  disabled={isSubmittingReview}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn submit-btn"
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? (
                    <>
                      <span className="loading-spinner"></span>
                      Adding Review...
                    </>
                  ) : (
                    'Add Review'
                  )}
                </button>
              </div>
            </form>
          </div>
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
