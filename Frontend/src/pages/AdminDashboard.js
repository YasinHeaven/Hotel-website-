import { useCallback, useEffect, useState } from 'react';
import { FaBed, FaCalendarCheck, FaDollarSign, FaUsers } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import { apiRequest } from '../config/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    bookings: 0,
    revenue: 0,
    todayBookings: 0,
    checkedIn: 0,
    pending: 0,
    occupancyRate: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initializeAdmin = useCallback(async () => {
    try {
      setLoading(true);
      
      // SECURITY: Check if a regular user is already logged in
      const userToken = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const userInfo = localStorage.getItem('userInfo');
      
      if (userToken && userType === 'user' && userInfo) {
        console.log('🚫 User is already logged in, redirecting to home page');
        alert('You are logged in as a user. Please logout first to access admin panel.');
        window.location.href = '/';
        return;
      }
      
      // Check if admin token already exists
      const existingToken = localStorage.getItem('adminToken');
      if (existingToken) {
        console.log('� Existing admin token found, validating...');
        try {
          const testResponse = await apiRequest('/admin/dashboard/stats', {
            headers: { 'Authorization': `Bearer ${existingToken}` }
          });
          
          if (testResponse.ok) {
            setIsAuthenticated(true);
            console.log('✅ Existing admin token is valid');
            fetchDashboardData();
            return;
          } else {
            console.log('❌ Existing token is invalid, removing...');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
            localStorage.removeItem('userType');
          }
        } catch (tokenError) {
          console.log('❌ Token validation failed:', tokenError);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminInfo');
          localStorage.removeItem('userType');
        }
      }
      
      // NO AUTO-AUTHENTICATION - Redirect to admin login
      console.log('🔒 No valid admin token found, redirecting to admin login');
      window.location.href = '/admin/login';
      
    } catch (error) {
      console.error('❌ Admin initialization failed:', error);
      setError('Authentication error: ' + error.message);
      window.location.href = '/admin/login';
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAdmin();
  }, [initializeAdmin]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      console.log('🔍 Fetching dashboard data...');
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const response = await apiRequest('/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dashboard data received:', data);
        setStats(data.stats);
        setRecentBookings(data.recentBookings);
        setRecentUsers(data.recentUsers);
        setError(''); // Clear any previous errors
      } else {
        const errorData = await response.text();
        console.error('❌ API Error:', response.status, errorData);
        setError(`Failed to fetch dashboard data (${response.status}): ${errorData}`);
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  // Function to approve/update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      let denialReason = '';
      if (newStatus === 'cancelled') {
        denialReason = window.prompt('Please provide a reason for denying this booking:');
        if (!denialReason) {
          alert('Denial reason is required.');
          return;
        }
      }
      console.log(`🔄 Updating booking ${bookingId} to status: ${newStatus}`);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin token missing. Please refresh the page.');
        return;
      }
      const body = newStatus === 'cancelled' ? { status: newStatus, deniedReason: denialReason } : { status: newStatus };
      const response = await apiRequest(`/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      console.log(`📡 Response status: ${response.status}`);
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Booking updated successfully:', result);
        alert(`Booking ${newStatus} successfully!`);
        fetchDashboardData(); // Refresh data
      } else {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch {
          errorMessage = errorText;
        }
        alert('Failed to update booking: ' + errorMessage);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('Network error updating booking: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'approved': 'status-approved',
      'booked': 'status-booked',
      'checked-in': 'status-checked-in',
      'checked-out': 'status-checked-out',
      'cancelled': 'status-cancelled',
      'no-show': 'status-no-show',
      'denied': 'status-denied'
    };
    return statusClasses[status] || 'status-default';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-container">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening at your hotel today.</p>
          </div>
          <div className="header-actions">
            {isAuthenticated && (
              <div className="admin-status">
                <span className="status-badge authenticated">✅ Admin Authenticated</span>
              </div>
            )}
            <button 
              onClick={fetchDashboardData} 
              className="btn btn-outline"
              style={{ marginLeft: '10px' }}
            >
              � Refresh Data
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.users}</p>
              <span className="stat-label">Registered guests</span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <FaBed />
            </div>
            <div className="stat-content">
              <h3>Total Rooms</h3>
              <p className="stat-number">{stats.rooms}</p>
              <span className="stat-label">Available rooms</span>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <FaCalendarCheck />
            </div>
            <div className="stat-content">
              <h3>Total Bookings</h3>
              <p className="stat-number">{stats.bookings}</p>
              <span className="stat-label">All time bookings</span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-number">{formatCurrency(stats.revenue)}</p>
              <span className="stat-label">All time revenue</span>
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-icon">
              <FaCalendarCheck />
            </div>
            <div className="stat-content">
              <h3>Today's Bookings</h3>
              <p className="stat-number">{stats.todayBookings}</p>
              <span className="stat-label">New bookings today</span>
            </div>
          </div>

          <div className="stat-card accent">
            <div className="stat-icon">
              <FaBed />
            </div>
            <div className="stat-content">
              <h3>Checked In</h3>
              <p className="stat-number">{stats.checkedIn}</p>
              <span className="stat-label">Currently occupied</span>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">
              <FaCalendarCheck />
            </div>
            <div className="stat-content">
              <h3>Pending Check-ins</h3>
              <p className="stat-number">{stats.pending}</p>
              <span className="stat-label">Awaiting arrival</span>
            </div>
          </div>

          <div className="stat-card gradient">
            <div className="stat-icon">
              <FaBed />
            </div>
            <div className="stat-content">
              <h3>Occupancy Rate</h3>
              <p className="stat-number">{stats.occupancyRate}%</p>
              <span className="stat-label">Current occupancy</span>
            </div>
          </div>
        </div>


        {/* Recent Data */}
        <div className="recent-data">
          <div className="recent-section">
            <h2>Recent Bookings</h2>
            <div className="recent-list">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking._id} className={`recent-item ${booking.status === 'pending' ? 'pending-booking' : ''}`}> 
                    <div className="item-info">
                      <h4>{booking.user?.name || booking.customerInfo?.name || 'Unknown Guest'}</h4>
                      <p>{booking.room?.type} - Room #{booking.room?.number}</p>
                      <span className="item-date">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                      <span className="guest-count">{booking.guests} Guest(s)</span>
                    </div>
                    <div className="item-status">
                      <span className={`status-badge ${getStatusBadge(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="item-amount">{formatCurrency(booking.totalAmount)}</span>
                      {booking.status === 'pending' && (
                        <div className="booking-actions dashboard-actions">
                          <button 
                            className="dashboard-approve-btn"
                            onClick={() => updateBookingStatus(booking._id, 'approved')}
                            title="Approve Booking"
                          >
                            <span className="dashboard-btn-icon">✔</span>
                          </button>
                          <button 
                            className="dashboard-deny-btn"
                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                            title="Reject Booking"
                          >
                            <span className="dashboard-btn-icon">✖</span>
                          </button>
                        </div>
                      )}
                      {booking.status === 'approved' && (
                        <div className="booking-actions dashboard-actions">
                          <button 
                            className="dashboard-checkin-btn"
                            onClick={() => updateBookingStatus(booking._id, 'checked-in')}
                            title="Check In Guest"
                          >
                            <span className="dashboard-btn-icon">🏨</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No recent bookings</p>
              )}
            </div>
            <button 
              className="view-all-btn"
              onClick={() => window.location.href = '/admin/bookings'}
            >
              View All Bookings
            </button>
          </div>

          <div className="recent-section">
            <h2>Recent Users</h2>
            <div className="recent-list">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user._id} className="recent-item">
                    <div className="item-info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                      <span className="item-date">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="item-status">
                      <span className="user-phone">{user.phone}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No recent users</p>
              )}
            </div>
            <button 
              className="view-all-btn"
              onClick={() => window.location.href = '/admin/users'}
            >
              View All Users
            </button>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="performance-indicators">
          <h2>Performance Overview</h2>
          <div className="indicators-grid">
            <div className="indicator">
              <h3>Booking Conversion</h3>
              <div className="progress-bar">
                <div className="progress" style={{width: '75%'}}></div>
              </div>
              <span>75% of inquiries convert to bookings</span>
            </div>
            <div className="indicator">
              <h3>Customer Satisfaction</h3>
              <div className="progress-bar">
                <div className="progress success" style={{width: '92%'}}></div>
              </div>
              <span>92% customer satisfaction rate</span>
            </div>
            <div className="indicator">
              <h3>Room Utilization</h3>
              <div className="progress-bar">
                <div className="progress warning" style={{width: `${stats.occupancyRate}%`}}></div>
              </div>
              <span>{stats.occupancyRate}% rooms currently occupied</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
