import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './FloatingReviewButton.css';
import ReviewForm from './ReviewForm';

const FloatingReviewButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleSubmitSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <>
      {successMessage && (
        <div className="floating-success-message">
          {successMessage}
        </div>
      )}
      
      <button 
        className="floating-review-btn"
        onClick={() => setShowForm(true)}
        aria-label="Write a review"
      >
        <FaStar />
        <span>Review</span>
      </button>

      {showForm && (
        <ReviewForm 
          onClose={handleFormClose}
          onSubmitSuccess={handleSubmitSuccess}
        />
      )}
    </>
  );
};

export default FloatingReviewButton;
