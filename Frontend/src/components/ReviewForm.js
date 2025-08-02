import { useEffect, useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    comment: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in and auto-fill their details
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          name: user.name || user.firstName + ' ' + (user.lastName || ''),
          email: user.email
        }));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀🚀🚀 HANDLESUBMIT CALLED! 🚀🚀🚀');
    alert('HandleSubmit function was called!'); // Temporary alert for testing
    console.log('📊 Form data:', formData);
    console.log('🌐 API URL:', process.env.REACT_APP_API_URL);
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.title.trim() || !formData.comment.trim()) {
      console.log('❌ Validation failed: Missing required fields');
      setError('Please fill in all required fields');
      return;
    }

    if (formData.comment.trim().length < 10) {
      console.log('❌ Validation failed: Comment too short');
      setError('Please write a more detailed review (at least 10 characters)');
      return;
    }

    console.log('✅ Validation passed, submitting...');
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add auth header only if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Token found, adding auth header');
      } else {
        console.log('👤 No token found, submitting as guest');
      }
      
      const apiUrl = `${process.env.REACT_APP_API_URL}/reviews`;
      console.log('📡 Making request to:', apiUrl);
      console.log('📋 Headers:', headers);
      console.log('📤 Body:', JSON.stringify(formData));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
      });

      console.log('📨 Response received:', response.status);
      const data = await response.json();
      console.log('📊 Response data:', data);

      if (data.success) {
        console.log('✅ Review submitted successfully!');
        setSuccess('🎉 Review submitted successfully! It will be visible after admin approval.');
        setError('');
        onSubmitSuccess && onSubmitSuccess('🎉 Thank you for your review! It will appear on the website after approval.');
        
        // Reset form
        setFormData(prev => ({
          ...prev,
          rating: 5,
          title: '',
          comment: '',
          location: ''
        }));
        
        // Close form after showing success message for 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        console.log('❌ Review submission failed:', data.message);
        setError(data.message || 'Failed to submit review. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      console.error('💥 Exception during review submission:', error);
      console.error('📍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if (error.message.includes('404')) {
        setError('⚠️ Service temporarily unavailable. Please try again later.');
      } else if (error.message.includes('401')) {
        setError('🔒 Please login first to submit a review.');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('🌐 Network error. Please check your internet connection and try again.');
      } else {
        setError('❌ Failed to submit review. Please check your connection and try again.');
      }
      setSuccess('');
    } finally {
      console.log('🏁 Form submission completed, resetting loading state');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h2>Write a Review</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {isLoggedIn ? (
            <div className="login-success" style={{
              background: '#d4edda',
              border: '1px solid #c3e6cb',
              color: '#155724',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              ✅ <strong>Logged in as:</strong> {formData.name} ({formData.email})
            </div>
          ) : (
            <div className="guest-notice" style={{
              background: '#e3f2fd',
              border: '1px solid #90caf9',
              color: '#0d47a1',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              📝 <strong>Guest Review:</strong> You can submit a review as a guest. Reviews require admin approval before appearing on the website.
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength="100"
                placeholder="Your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location (Optional)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                maxLength="100"
                placeholder="Your city/country"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Rating *</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => handleRatingChange(star)}
                  aria-label={`Rate ${star} stars`}
                >
                  ⭐
                </button>
              ))}
              <span className="rating-text">
                {formData.rating} star{formData.rating !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Review Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength="150"
              placeholder="Brief summary of your experience"
            />
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review *</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
              maxLength="1000"
              rows="5"
              placeholder="Tell us about your experience at Yasin Heaven Star Hotel..."
            />
            <small className="char-count">
              {formData.comment.length}/1000 characters
            </small>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
              onClick={(e) => {
                console.log('🖱️ Submit button clicked!');
                alert('Submit button was clicked!'); // Temporary alert for testing
                console.log('🔄 Is submitting:', isSubmitting);
                console.log('📝 Form data at click:', formData);
                // Don't prevent default here, let the form handle it
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>

        <div className="review-note">
          <p><strong>Note:</strong> Your review will be published after admin approval to ensure quality and authenticity.</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
