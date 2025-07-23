import { useEffect, useState } from 'react';
import { FaBed, FaCalendarCheck, FaDollarSign, FaEdit, FaEye, FaPlus, FaUsers } from 'react-icons/fa';
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await apiRequest('/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentBookings(data.recentBookings);
        setRecentUsers(data.recentUsers);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Error loading dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'booked': 'status-booked',
      'checked-in': 'status-checked-in',
      'checked-out': 'status-checked-out',
      'cancelled': 'status-cancelled',
      'no-show': 'status-no-show'
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
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening at your hotel today.</p>
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

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => window.location.href = '/admin/bookings'}>
              <FaPlus />
              <span>New Booking</span>
            </button>
            <button className="action-btn success" onClick={() => window.location.href = '/admin/rooms'}>
              <FaPlus />
              <span>Add Room</span>
            </button>
            <button className="action-btn info" onClick={() => window.location.href = '/admin/users'}>
              <FaEye />
              <span>View Users</span>
            </button>
            <button className="action-btn warning" onClick={() => window.location.href = '/admin/bookings'}>
              <FaEdit />
              <span>Manage Bookings</span>
            </button>
          </div>
        </div>

        {/* Recent Data */}
        <div className="recent-data">
          <div className="recent-section">
            <h2>Recent Bookings</h2>
            <div className="recent-list">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking._id} className="recent-item">
                    <div className="item-info">
                      <h4>{booking.user?.name || 'Unknown Guest'}</h4>
                      <p>{booking.room?.type} - #{booking.room?.number}</p>
                      <span className="item-date">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="item-status">
                      <span className={`status-badge ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                      <span className="item-amount">{formatCurrency(booking.totalAmount)}</span>
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
