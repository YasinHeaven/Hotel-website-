import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaEdit, FaMapMarkerAlt, FaSignInAlt, FaTimesCircle, FaTrash, FaUserPlus, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { authUtils, bookingAPI } from '../services/api';
import './BookingPage.css';

const UserBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBookings();
      
      // Set up auto-refresh every 30 seconds for real-time updates
      const interval = setInterval(() => {
        fetchUserBookings();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const checkAuthentication = () => {
    const token = authUtils.getToken();
    const userType = localStorage.getItem('userType');
    
    if (token && userType === 'user') {
      setIsAuthenticated(true);
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
          new Date(booking.checkIn) > now && !['cancelled', 'denied', 'no-show'].includes(booking.status)
        );
      case 'past':
        return bookings.filter(booking => 
          new Date(booking.checkOut) < now || ['checked-out'].includes(booking.status)
        );
      case 'cancelled':
        return bookings.filter(booking => ['cancelled', 'denied', 'no-show'].includes(booking.status));
      case 'pending':
        return bookings.filter(booking => booking.status === 'pending');
      case 'confirmed':
        return bookings.filter(booking => ['approved', 'booked', 'checked-in'].includes(booking.status));
      default:
        return bookings;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'approved':
        return <FaCheckCircle className="status-icon approved" />;
      case 'booked':
        return <FaCheckCircle className="status-icon booked" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />;
      case 'denied':
        return <FaTimesCircle className="status-icon denied" />;
      case 'checked-in':
        return <FaSignInAlt className="status-icon checked-in" />;
      case 'checked-out':
        return <FaCheckCircle className="status-icon checked-out" />;
      case 'no-show':
        return <FaTimesCircle className="status-icon no-show" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // yellow
      case 'approved':
        return '#10b981'; // green
      case 'booked':
        return '#3b82f6'; // blue
      case 'cancelled':
        return '#ef4444'; // red
      case 'denied':
        return '#dc2626'; // dark red
      case 'checked-in':
        return '#8b5cf6'; // purple
      case 'checked-out':
        return '#6b7280'; // gray
      case 'no-show':
        return '#f97316'; // orange
      default:
        return '#6b7280';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'pending':
        return 'Your booking is being reviewed by our team. You will be notified once approved.';
      case 'approved':
        return 'Your booking has been approved! Please proceed with payment to confirm.';
      case 'booked':
        return 'Your booking is confirmed. Looking forward to your stay!';
      case 'denied':
        return 'Unfortunately, your booking request was declined. Please contact us for details.';
      case 'cancelled':
        return 'This booking has been cancelled.';
      case 'checked-in':
        return 'Welcome! You have checked in. Enjoy your stay!';
      case 'checked-out':
        return 'Thank you for staying with us! We hope you enjoyed your visit.';
      case 'no-show':
        return 'You did not check in for this booking.';
      default:
        return '';
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
          <div className="header-content">
            <div className="header-info">
              <h1>My Bookings</h1>
              <p>Manage your room reservations and view booking history</p>
            </div>
            <div className="header-actions">
              <div className="live-indicator">
                <span className="live-dot"></span>
                Live Updates
              </div>
              <Link to="/book-room" className="btn btn-primary">
                <FaCalendarAlt /> Book New Room
              </Link>
            </div>
          </div>
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
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            🔄 Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button 
            className={`tab ${activeTab === 'confirmed' ? 'active' : ''}`}
            onClick={() => setActiveTab('confirmed')}
          >
            ✅ Confirmed ({bookings.filter(b => ['approved', 'booked', 'checked-in'].includes(b.status)).length})
          </button>
          <button 
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            📅 Upcoming ({getFilteredBookings().length})
          </button>
          <button 
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            📋 Past ({getFilteredBookings().length})
          </button>
          <button 
            className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            ❌ Cancelled ({getFilteredBookings().length})
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
                      <span className={`status-text ${booking.status}`} style={{
                        color: '#fff',
                        background: 'rgba(0,0,0,0.18)',
                        padding: '2px 10px',
                        borderRadius: '6px',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        textShadow: '0 1px 4px rgba(0,0,0,0.25)'
                      }}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="booking-id">
                      #{booking._id.slice(-6)}
                    </div>
                  </div>

                  {/* Status Message */}
                  {getStatusMessage(booking.status) && (
                    <div className="status-message" style={{
                      backgroundColor: booking.status === 'denied' ? '#fef2f2' : 
                                      booking.status === 'pending' ? '#fffbeb' :
                                      booking.status === 'approved' ? '#f0fdf4' : '#f8fafc',
                      color: getStatusColor(booking.status),
                      padding: '12px',
                      borderRadius: '6px',
                      margin: '12px 0',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: `1px solid ${getStatusColor(booking.status)}20`
                    }}>
                      ℹ️ {getStatusMessage(booking.status)}
                    </div>
                  )}

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
                      <strong>Total: Rs {booking.totalAmount || (booking.room?.price * calculateNights(booking.checkIn, booking.checkOut))}</strong>
                    </div>

                    {/* Show denial reason for cancelled/denied bookings */}
                    {(booking.status === 'cancelled' || booking.status === 'denied') && booking.denialReason && (
                      <div className="booking-denial-reason" style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginTop: '10px', border: '1px solid #fca5a5' }}>
                        <strong>Reason for Denial:</strong> {booking.denialReason}
                      </div>
                    )}
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
                    {/* View Details button removed for user side */}
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

export default UserBookingsPage;
