import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaBed, FaCalendarAlt, FaCheckCircle, FaCreditCard, FaUser, FaUsers, FaWifi } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { authUtils, bookingAPI, roomAPI } from '../services/api';
import { createImageErrorHandler, getAssetPath } from '../utils/assetUtils';
import './BookRoomPage.css';

const BookRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Select Room, 2: Fill Details, 3: Confirmation
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
    fetchAvailableRooms();
  }, []);

  useEffect(() => {
    fetchAvailableRooms();
  }, [checkInDate, checkOutDate]);

  const checkAuthentication = () => {
    const token = authUtils.getToken();
    const userType = localStorage.getItem('userType');
    
    if (token && userType === 'user') {
      setIsAuthenticated(true);
      // Pre-fill user info if available
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setCustomerInfo(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || ''
        }));
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      setError('');
      
      const checkIn = checkInDate.toISOString().split('T')[0];
      const checkOut = checkOutDate.toISOString().split('T')[0];
      
      const response = await roomAPI.getAllRooms();
      // Filter available rooms (you could also pass dates to API)
      const availableRooms = response.data.filter(room => room.status === 'available');
      setRooms(availableRooms);
    } catch (err) {
      setError('Failed to fetch rooms. Please try again.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    return selectedRoom.price * calculateNights();
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setStep(2);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/book-room');
      navigate('/login');
      return;
    }

    if (!selectedRoom) {
      setError('Please select a room');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const bookingData = {
        room: selectedRoom._id,
        checkIn: checkInDate.toISOString().split('T')[0],
        checkOut: checkOutDate.toISOString().split('T')[0],
        guests,
        customerInfo
      };

      const response = await bookingAPI.createBooking(bookingData);
      
      if (response.data && response.data.booking) {
        const booking = response.data.booking;
        const bookingId = booking._id;
        
        // Show success notification
        setSnackbar({ 
          open: true, 
          message: `🎉 Booking request submitted! ID: ${bookingId}`, 
          severity: 'success' 
        });
        
        // Set detailed success message
        setSuccess(`
          🎉 Booking Request Submitted Successfully! 
          
          📄 Booking ID: ${bookingId}
          📊 Status: ${booking.status || 'Pending'}
          
          📋 What happens next:
          ${response.data.nextSteps ? response.data.nextSteps.map(step => `• ${step}`).join('\n          ') : '• Admin will review within 24 hours\n          • You\'ll receive email confirmation\n          • Check "My Bookings" for updates'}
          
          💡 You can track your booking status in real-time on the "My Bookings" page.
        `);
        
        setStep(3);
        setSelectedBooking(booking);
        
        // Auto-redirect after 8 seconds
        setTimeout(() => {
          navigate('/booking');
        }, 8000);
        
      } else {
        setSnackbar({ 
          open: true, 
          message: '❌ Booking failed. Please try again.', 
          severity: 'error' 
        });
        setError('Booking submission failed. Please check your details and try again.');
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Booking failed: ' + (err.response?.data?.message || 'Unknown error'), severity: 'error' });
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Step 1: Room Selection
  if (step === 1) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="booking-header">
            <h1>Book Your Room</h1>
            <p>Select your preferred dates and room type</p>
          </div>

          {/* Date Selection */}
          <div className="date-selection">
            <div className="date-picker-group">
              <label>
                <FaCalendarAlt /> Check-in Date
                <DatePicker
                  selected={checkInDate}
                  onChange={setCheckInDate}
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                  className="date-input"
                />
              </label>
              
              <label>
                <FaCalendarAlt /> Check-out Date
                <DatePicker
                  selected={checkOutDate}
                  onChange={setCheckOutDate}
                  minDate={checkInDate}
                  dateFormat="yyyy-MM-dd"
                  className="date-input"
                />
              </label>
              
              <label>
                <FaUsers /> Guests
                <select 
                  value={guests} 
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="guests-select"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="booking-summary">
              <p><strong>{calculateNights()}</strong> night{calculateNights() > 1 ? 's' : ''}</p>
              <p>{checkInDate.toLocaleDateString()} - {checkOutDate.toLocaleDateString()}</p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Room Selection */}
          <div className="room-grid">
            {loading ? (
              <div className="loading">Loading available rooms...</div>
            ) : rooms.length === 0 ? (
              <div className="no-rooms">No rooms available for selected dates</div>
            ) : (
              rooms.map(room => (
                <div key={room._id} className="room-card">
                  <div className="room-image">
                    <img 
                      src={getAssetPath(`${room.type.replace(/ /g, '_')}_1.jpg`, 'room')} 
                      alt={room.type}
                      onError={createImageErrorHandler('room')}
                    />
                  </div>
                  
                  <div className="room-details">
                    <h3>{room.type}</h3>
                    <p className="room-number">Room {room.number}</p>
                    <p className="room-description">{room.description}</p>
                    
                    <div className="room-features">
                      <span><FaWifi /> WiFi</span>
                      <span><FaBed /> {room.bedType || 'Comfortable Bed'}</span>
                      <span><FaUser /> Up to {room.capacity || 2} guests</span>
                    </div>
                    
                    <div className="room-pricing">
                      <div className="price">
                        <span className="amount">${room.price}</span>
                        <span className="period">per night</span>
                      </div>
                      <div className="total">
                        <strong>Total: ${room.price * calculateNights()}</strong>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleRoomSelect(room)}
                      className="btn btn-primary select-room-btn"
                    >
                      Select This Room
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Customer Details
  if (step === 2) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="booking-progress">
            <div className="step completed">1. Select Room</div>
            <div className="step active">2. Guest Details</div>
            <div className="step">3. Confirmation</div>
          </div>

          <div className="booking-details">
            <div className="selected-room-summary">
              <h3>Selected Room</h3>
              <div className="room-summary-card">
                <h4>{selectedRoom.type} - Room {selectedRoom.number}</h4>
                <p>{selectedRoom.description}</p>
                <div className="booking-dates">
                  <p><strong>Check-in:</strong> {checkInDate.toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {checkOutDate.toLocaleDateString()}</p>
                  <p><strong>Nights:</strong> {calculateNights()}</p>
                  <p><strong>Guests:</strong> {guests}</p>
                </div>
                <div className="total-amount">
                  <h4>Total Amount: ${calculateTotal()}</h4>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="customer-form">
              <h3>Guest Information</h3>
              
              {!isAuthenticated && (
                <div className="auth-notice">
                  <p>You need to be logged in to complete the booking.</p>
                  <button 
                    type="button" 
                    onClick={() => {
                      localStorage.setItem('redirectAfterLogin', '/book-room');
                      navigate('/login');
                    }}
                    className="btn btn-primary"
                  >
                    Login to Continue
                  </button>
                </div>
              )}

              {isAuthenticated && (
                <>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Special Requests (Optional)</label>
                    <textarea
                      name="specialRequests"
                      value={customerInfo.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                      className="form-input"
                      placeholder="Any special requests or preferences..."
                    />
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="btn btn-secondary"
                    >
                      Back to Rooms
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Confirmation
  if (step === 3) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="booking-confirmation">
            <div className="success-icon">
              <FaCheckCircle style={{ color: '#28a745', fontSize: '4rem' }} />
            </div>
            <h1>🎉 Booking Request Submitted!</h1>
            
            <div className="status-info" style={{
              background: '#e3f2fd', 
              padding: '1rem', 
              borderRadius: '8px', 
              margin: '1rem 0',
              border: '1px solid #2196f3'
            }}>
              <h3 style={{ color: '#1976d2', margin: '0 0 0.5rem 0' }}>
                📋 What happens next?
              </h3>
              <ul style={{ color: '#0d47a1', margin: 0, paddingLeft: '1.2rem' }}>
                <li>✅ Your booking request has been received</li>
                <li>⏳ Our team will review your request within 24 hours</li>
                <li>📧 You'll receive an email confirmation with payment details</li>
                <li>🏨 Check your "My Bookings" page for real-time status updates</li>
              </ul>
            </div>
            
            {selectedBooking && (
              <div className="booking-id-section" style={{
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                margin: '1rem 0',
                border: '2px dashed #6c757d'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>
                  📄 Booking Reference
                </h4>
                <p style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  color: '#007bff',
                  fontFamily: 'monospace',
                  margin: 0
                }}>
                  ID: {selectedBooking._id}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', margin: '0.5rem 0 0 0' }}>
                  Please save this reference number for your records
                </p>
              </div>
            )}
            
            <div className="confirmation-details">
              <h3>📋 Booking Summary</h3>
              <div className="summary-card" style={{
                background: '#ffffff',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '1.5rem',
                margin: '1rem 0'
              }}>
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  <p><strong>🏨 Room:</strong> {selectedRoom.type} - Room {selectedRoom.number}</p>
                  <p><strong>👤 Guest:</strong> {customerInfo.name}</p>
                  <p><strong>📧 Email:</strong> {customerInfo.email}</p>
                  <p><strong>📞 Phone:</strong> {customerInfo.phone}</p>
                  <p><strong>📅 Check-in:</strong> {checkInDate.toLocaleDateString()}</p>
                  <p><strong>📅 Check-out:</strong> {checkOutDate.toLocaleDateString()}</p>
                  <p><strong>👥 Guests:</strong> {guests}</p>
                  <p><strong>💰 Total Amount:</strong> <span style={{ 
                    color: '#28a745', 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold' 
                  }}>${calculateTotal()}</span></p>
                  <p><strong>📊 Status:</strong> <span style={{ 
                    color: '#ffc107', 
                    fontWeight: 'bold',
                    background: '#fff3cd',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}>⏳ Pending Approval</span></p>
                </div>
              </div>
            </div>

            <div className="confirmation-actions" style={{ marginTop: '2rem' }}>
              <button 
                onClick={() => navigate('/booking')}
                className="btn btn-primary"
                style={{ marginRight: '1rem' }}
              >
                <FaCreditCard /> View My Bookings
              </button>
              <button 
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                🏠 Back to Home
              </button>
            </div>
            
            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              background: '#d4edda', 
              borderRadius: '8px',
              border: '1px solid #c3e6cb',
              color: '#155724'
            }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                💡 <strong>Tip:</strong> You can track your booking status in real-time on the 
                "My Bookings" page. We'll also send you email updates at each step of the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Existing JSX code */}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default BookRoomPage;
