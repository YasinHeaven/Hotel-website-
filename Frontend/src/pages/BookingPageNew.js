import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { bookingAPI, roomAPI } from '../services/api';
import { getAssetPath, createImageErrorHandler } from '../utils/assetUtils';
import './BookingPage.css';

const BookingPage = () => {
  // Use local midnight as base for date pickers
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Fetch available rooms on component mount
  useEffect(() => {
    fetchAvailableRooms();
  }, [checkInDate, checkOutDate]);

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await roomAPI.getAllRooms();
      setRooms(response.data);
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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRoom) {
      setError('Please select a room');
      return;
    }

    if (!bookingForm.name || !bookingForm.email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const bookingData = {
        room: selectedRoom._id,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests,
        userDetails: bookingForm
      };

      await bookingAPI.createBooking(bookingData);
      setSuccess('Booking created successfully! You will receive a confirmation email shortly.');
      
      // Reset form
      setSelectedRoom(null);
      setBookingForm({ name: '', email: '', phone: '' });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      console.error('Error creating booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>Book Your Stay</h1>
        
        {/* Date and Guest Selection */}
        <div className="booking-search">
          <div className="date-inputs">
            <div className="date-input">
              <label>Check-in Date</label>
              <DatePicker
                selected={checkInDate}
                onChange={setCheckInDate}
                minDate={today}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            
            <div className="date-input">
              <label>Check-out Date</label>
              <DatePicker
                selected={checkOutDate}
                onChange={setCheckOutDate}
                minDate={checkInDate}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            
            <div className="guest-input">
              <label>Guests</label>
              <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                {[1,2,3,4,5,6].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="stay-summary">
            <p><strong>{calculateNights()}</strong> night{calculateNights() > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Available Rooms */}
        <div className="available-rooms">
          <h2>Available Rooms</h2>
          
          {loading ? (
            <div className="loading">Loading rooms...</div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div 
                  key={room._id} 
                  className={`room-card ${selectedRoom?._id === room._id ? 'selected' : ''}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="room-image">
                    <img 
                      src={`/assets/${room.type.replace(' ', '%20')}%201.jpg`} 
                      alt={room.type}
                      onError={createImageErrorHandler('room')}
                    />
                  </div>
                  
                  <div className="room-info">
                    <h3>{room.type}</h3>
                    <p className="room-number">Room {room.number}</p>
                    <p className="room-description">{room.description}</p>
                    <div className="room-price">
                      <span className="price">${room.price}/night</span>
                      <span className="status">{room.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Form */}
        {selectedRoom && (
          <div className="booking-form-section">
            <h2>Complete Your Booking</h2>
            
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-item">
                <span>Room:</span>
                <span>{selectedRoom.type} (Room {selectedRoom.number})</span>
              </div>
              <div className="summary-item">
                <span>Check-in:</span>
                <span>{checkInDate.toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span>Check-out:</span>
                <span>{checkOutDate.toLocaleDateString()}</span>
              </div>
              <div className="summary-item">
                <span>Nights:</span>
                <span>{calculateNights()}</span>
              </div>
              <div className="summary-item">
                <span>Guests:</span>
                <span>{guests}</span>
              </div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={bookingForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={bookingForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <button 
                type="submit" 
                className="book-now-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Book Now - $${calculateTotal()}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
