import { useState } from 'react';
import { bookingAPI } from '../services/api';
import { FaArrowRight } from 'react-icons/fa';

const BookingDebugModal = ({ selectedRoom, onClose, onBookingSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('🔍 DEBUG: Selected Room:', selectedRoom);
    
    const form = e.target;
    const guestName = form.guestName.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const checkIn = form.checkIn.value;
    const checkOut = form.checkOut.value;
    const guests = form.guests.value;
    const specialRequests = form.specialRequests.value;
    
    const bookingData = {
      id: selectedRoom.id || selectedRoom._id,
      guestName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      specialRequests
    };
    
    console.log('🔍 DEBUG: Booking Data:', bookingData);
    
    // Test direct API call
    try {
      const payload = {
        room: bookingData.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests) || 1,
        customerInfo: {
          name: bookingData.guestName,
          email: bookingData.email,
          phone: bookingData.phone,
          specialRequests: bookingData.specialRequests || ''
        }
      };
      
      console.log('🔍 DEBUG: API Payload:', payload);
      
      const response = await bookingAPI.createBooking(payload);
      console.log('🔍 DEBUG: API Response:', response);
      
      setLoading(false);
      
      if (response.data && response.data.booking) {
        console.log('✅ DEBUG: Booking successful!', response.data.booking);
        onClose(); // Close modal
        alert(`✅ Booking created successfully! ID: ${response.data.booking._id}`);
      } else {
        console.error('❌ DEBUG: Invalid response format');
        setError('Invalid response from server');
      }
      
    } catch (err) {
      setLoading(false);
      console.error('❌ DEBUG: API Error:', err);
      console.error('❌ DEBUG: Error Response:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Booking failed. Please try again.');
    }
  };

  return (
    <>
      {loading && (
        <div className="booking-overlay-spinner" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: 60,
            height: 60,
            border: '6px solid #fff',
            borderTop: '6px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      )}
      <div className="booking-modal-overlay" style={{zIndex: 9998}} onClick={() => !loading && onClose()}>
        <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
          <div className="booking-modal-header">
            <h3>DEBUG: Book {selectedRoom?.name}</h3>
            <button className="modal-close-btn" onClick={onClose} disabled={loading}>×</button>
          </div>
          <div style={{padding: '10px', background: '#f0f0f0', margin: '10px', borderRadius: '5px'}}>
            <strong>DEBUG INFO:</strong><br/>
            Room ID: {selectedRoom?.id || selectedRoom?._id || 'NOT FOUND'}<br/>
            Room Name: {selectedRoom?.name || 'NOT FOUND'}<br/>
            Room Type: {selectedRoom?.type || 'NOT FOUND'}
          </div>
          <form onSubmit={handleBookingSubmit} className="booking-form">
            <div className="booking-form-group">
              <label>Full Name</label>
              <input name="guestName" type="text" required placeholder="Enter your full name" />
            </div>
            <div className="booking-form-group">
              <label>Email</label>
              <input name="email" type="email" required placeholder="Enter your email" />
            </div>
            <div className="booking-form-group">
              <label>Phone Number</label>
              <input name="phone" type="tel" required placeholder="Enter your phone number" />
            </div>
            <div className="booking-form-row">
              <div className="booking-form-group">
                <label>Check-in Date</label>
                <input name="checkIn" type="date" required />
              </div>
              <div className="booking-form-group">
                <label>Check-out Date</label>
                <input name="checkOut" type="date" required />
              </div>
            </div>
            <div className="booking-form-group">
              <label>Number of Guests</label>
              <select name="guests" required defaultValue="1">
                {[...Array(selectedRoom?.maxGuests || 1)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="booking-form-group">
              <label>Special Requests</label>
              <textarea name="specialRequests" placeholder="Any special requests or requirements..."></textarea>
            </div>
            <div className="booking-form-actions">
              <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                DEBUG: Confirm Booking
                <FaArrowRight className="btn-arrow" />
              </button>
            </div>
            {error && <div style={{color: 'red', marginTop: 10, padding: '10px', background: '#ffe6e6'}}>{error}</div>}
          </form>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default BookingDebugModal;