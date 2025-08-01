import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaArrowRight } from 'react-icons/fa';
import { bookingAPI } from '../services/api';

const BookRoomModal = ({ selectedRoom, onClose, onBookingSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [disabledRanges, setDisabledRanges] = useState([]);
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    if (selectedRoom?.id) {
      bookingAPI.getRoomBookings(selectedRoom.id)
        .then(res => {
          const ranges = res.data.map(b => ({ start: new Date(b.checkIn), end: new Date(b.checkOut) }));
          setDisabledRanges(ranges);
        })
        .catch(err => console.error('Failed to fetch room bookings:', err));
    }
  }, [selectedRoom]);

  // Compute next available window for minimum 1-night stay
  useEffect(() => {
    if (!disabledRanges.length) return;
    const sorted = [...disabledRanges].sort((a,b) => a.start - b.start);
    let freeStart = new Date(); freeStart.setHours(0,0,0,0);
    let freeEnd;
    for (let r of sorted) {
      if (freeStart < r.start) {
        freeEnd = new Date(r.start); freeEnd.setDate(freeEnd.getDate() + 1);
        break;
      }
      if (freeStart >= r.start && freeStart <= r.end) {
        freeStart = new Date(r.end); freeStart.setDate(freeStart.getDate() + 1);
      }
    }
    if (!freeEnd) {
      freeEnd = new Date(freeStart); freeEnd.setDate(freeEnd.getDate() + 1);
    }
    setSuggestion({ start: freeStart, end: freeEnd });
  }, [disabledRanges]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation: require both dates
    if (!checkInDate || !checkOutDate) {
      setError('Please select both check-in and check-out dates.');
      return;
    }

    // Set both dates to midnight for comparison
    const today = new Date();
    today.setHours(0,0,0,0);
    const checkIn = new Date(checkInDate);
    checkIn.setHours(0,0,0,0);
    const checkOut = new Date(checkOutDate);
    checkOut.setHours(0,0,0,0);

    if (checkIn.getTime() < today.getTime()) {
      setError('Check-in date cannot be in the past. Please select today or a future date.');
      return;
    }
    if (checkOut.getTime() <= checkIn.getTime()) {
      setError('Check-out date must be after check-in date.');
      return;
    }

    setLoading(true);
    const form = e.target;
    const guestName = form.guestName.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const checkInStr = checkInDate.toISOString().split('T')[0];
    const checkOutStr = checkOutDate.toISOString().split('T')[0];
    const guests = form.guests.value;
    const specialRequests = form.specialRequests.value;

    try {
      const payload = {
        room: selectedRoom.id || selectedRoom._id,
        checkIn: checkInStr,
        checkOut: checkOutStr,
        guests: parseInt(guests, 10) || 1,
        customerInfo: {
          name: guestName,
          email,
          phone,
          specialRequests: specialRequests || ''
        }
      };
      await bookingAPI.createBooking(payload);
      setLoading(false);
      onBookingSuccess();
    } catch (err) {
      setLoading(false);
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
            <h3>Book {selectedRoom?.name}</h3>
            <button className="modal-close-btn" onClick={onClose} disabled={loading}>×</button>
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
                <DatePicker
                  selected={checkInDate}
                  onChange={(date) => setCheckInDate(date)}
                  selectsStart
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={new Date()}
                  excludeDateIntervals={disabledRanges}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select check-in date"
                  required
                  className="booking-date-input"
                />
              </div>
              <div className="booking-form-group">
                <label>Check-out Date</label>
                <DatePicker
                  selected={checkOutDate}
                  onChange={(date) => setCheckOutDate(date)}
                  selectsEnd
                  startDate={checkInDate}
                  endDate={checkOutDate}
                  minDate={checkInDate || new Date()}
                  excludeDateIntervals={disabledRanges}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select check-out date"
                  required
                  className="booking-date-input"
                />
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
                Confirm Booking
                <FaArrowRight className="btn-arrow" />
              </button>
            </div>
            {error && <div style={{color: 'red', marginTop: 10}}>{error}</div>}
            {suggestion && (
              <div style={{ marginTop: '1rem', color: '#555' }}>
                Next available: {suggestion.start.toISOString().split('T')[0]} to {suggestion.end.toISOString().split('T')[0]}
              </div>
            )}
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

export default BookRoomModal;