import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaEdit, FaMapMarkerAlt, FaSignInAlt, FaTimesCircle, FaTrash, FaUserPlus, FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { authUtils, bookingAPI } from '../services/api';
import './BookingPage.css';

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBookings();
    }
  }, [isAuthenticated]);

  const checkAuthentication = () => {
    const token = authUtils.getToken();
    const userType = localStorage.getItem('userType');
    
    if (token && userType === 'user') {
      setIsAuthenticated(true);
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking => 
          new Date(booking.checkIn) > now && booking.status !== 'cancelled'
        );
      case 'past':
        return bookings.filter(booking => 
          new Date(booking.checkOut) < now || booking.status === 'completed'
        );
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <FaCheckCircle className="status-icon booked" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />;
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'checked-in':
        return <FaClock className="status-icon checked-in" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="login-prompt" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            border: '2px dashed #e5e7eb',
            borderRadius: '12px',
            padding: '40px',
            margin: '20px 0'
          }}>
            <div style={{fontSize: '4rem', color: '#dc2626', marginBottom: '20px'}}>
              🔒
            </div>
            <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px'}}>
              Login Required
            </h1>
            <p style={{fontSize: '1.2rem', color: '#6b7280', marginBottom: '30px', maxWidth: '600px'}}>
              You need to be logged in to view and manage your bookings. 
              Please sign in to access your booking history, upcoming reservations, and manage your account.
            </p>
            
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center'}}>
              <Link 
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                <FaSignInAlt />
                Sign In
              </Link>
              
              <Link 
                to="/signup"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  border: '2px solid #dc2626',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#dc2626';
                }}
              >
                <FaUserPlus />
                Create Account
              </Link>
            </div>
            
            <div style={{
              marginTop: '40px',
              padding: '20px',
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              maxWidth: '500px'
            }}>
              <h3 style={{color: '#92400e', marginBottom: '10px', fontSize: '1.1rem'}}>
                Why create an account?
              </h3>
              <ul style={{color: '#92400e', textAlign: 'left', margin: 0, paddingLeft: '20px'}}>
                <li>View your booking history</li>
                <li>Manage upcoming reservations</li>
                <li>Access exclusive member deals</li>
                <li>Faster checkout process</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage your room reservations and view booking history</p>
          <Link to="/book-room" className="btn btn-primary">
            <FaCalendarAlt /> Book New Room
          </Link>
        </div>

        {/* Booking Tabs */}
        <div className="booking-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings ({bookings.length})
          </button>
          <button 
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({getFilteredBookings().length})
          </button>
          <button 
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past ({getFilteredBookings().length})
          </button>
          <button 
            className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({getFilteredBookings().length})
          </button>
        </div>

        {/* Bookings Content */}
        <div className="bookings-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchUserBookings} className="btn btn-primary">
                Try Again
              </button>
            </div>
          ) : getFilteredBookings().length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No bookings found</h3>
              <p>
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet."
                  : `No ${activeTab} bookings found.`
                }
              </p>
              <Link to="/book-room" className="btn btn-primary">
                <FaCalendarAlt /> Make Your First Booking
              </Link>
            </div>
          ) : (
            <div className="bookings-grid">
              {getFilteredBookings().map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-status">
                      {getStatusIcon(booking.status)}
                      <span className={`status-text ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="booking-id">
                      #{booking._id.slice(-6)}
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="room-info">
                      <h3>{booking.room?.type || 'Room'}</h3>
                      <p className="room-number">Room {booking.room?.number}</p>
                    </div>

                    <div className="booking-dates">
                      <div className="date-item">
                        <FaCalendarAlt />
                        <div>
                          <label>Check-in</label>
                          <span>{formatDate(booking.checkIn)}</span>
                        </div>
                      </div>
                      <div className="date-item">
                        <FaCalendarAlt />
                        <div>
                          <label>Check-out</label>
                          <span>{formatDate(booking.checkOut)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="booking-info">
                      <div className="info-item">
                        <FaClock />
                        <span>{calculateNights(booking.checkIn, booking.checkOut)} night{calculateNights(booking.checkIn, booking.checkOut) > 1 ? 's' : ''}</span>
                      </div>
                      <div className="info-item">
                        <FaUsers />
                        <span>{booking.guests || 1} guest{(booking.guests || 1) > 1 ? 's' : ''}</span>
                      </div>
                      <div className="info-item">
                        <FaMapMarkerAlt />
                        <span>Yasin Heaven Star Hotel</span>
                      </div>
                    </div>

                    {booking.customerInfo && (
                      <div className="customer-info">
                        <p><strong>Guest:</strong> {booking.customerInfo.name}</p>
                        <p><strong>Email:</strong> {booking.customerInfo.email}</p>
                        {booking.customerInfo.phone && (
                          <p><strong>Phone:</strong> {booking.customerInfo.phone}</p>
                        )}
                      </div>
                    )}

                    <div className="booking-total">
                      <strong>Total: ${booking.totalAmount || (booking.room?.price * calculateNights(booking.checkIn, booking.checkOut))}</strong>
                    </div>
                  </div>

                  <div className="booking-actions">
                    {booking.status === 'booked' && new Date(booking.checkIn) > new Date() && (
                      <>
                        <button className="btn btn-outline">
                          <FaEdit /> Modify
                        </button>
                        <button className="btn btn-secondary">
                          <FaTrash /> Cancel
                        </button>
                      </>
                    )}
                    <button className="btn btn-primary">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Welcome Message for New Users */}
        {bookings.length === 0 && !loading && !error && (
          <div className="welcome-section">
            <h2>Welcome to Yasin Heaven Star Hotel! 🌟</h2>
            <p>Start your journey with us by booking your first room.</p>
            <div className="features-grid">
              <div className="feature">
                <FaCheckCircle />
                <h4>Easy Booking</h4>
                <p>Quick and simple room reservation process</p>
              </div>
              <div className="feature">
                <FaCalendarAlt />
                <h4>Flexible Dates</h4>
                <p>Choose from available dates that suit you</p>
              </div>
              <div className="feature">
                <FaUsers />
                <h4>Family Friendly</h4>
                <p>Rooms for individuals, couples, and families</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
