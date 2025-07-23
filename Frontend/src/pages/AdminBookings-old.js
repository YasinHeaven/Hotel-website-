import React, { useEffect, useState } from 'react';
import { 
  FaCalendarAlt, FaUsers, FaBed, FaEdit, FaTrash, FaPlus, 
  FaSearch, FaFilter, FaEye, FaCheckCircle, FaTimesCircle,
  FaClock, FaUserCheck
} from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import './AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({ 
    user: '', 
    room: '', 
    checkIn: '', 
    checkOut: '', 
    guests: 1,
    status: 'booked',
    customerInfo: { name: '', email: '', phone: '' }
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [bookingsRes, usersRes, roomsRes] = await Promise.all([
        fetch('/api/bookings', { headers }),
        fetch('/api/users', { headers }),
        fetch('/api/rooms', { headers })
      ]);

      if (bookingsRes.ok && usersRes.ok && roomsRes.ok) {
        const bookingsData = await bookingsRes.json();
        const usersData = await usersRes.json();
        const roomsData = await roomsRes.json();
        
        setBookings(bookingsData);
        setUsers(usersData);
        setRooms(roomsData);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.room?.number?.toString().includes(searchTerm) ||
        booking._id.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('customerInfo.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        customerInfo: { ...prev.customerInfo, [field]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/bookings/${editingId}` : '/api/bookings';
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      const bookingData = {
        ...form,
        guests: parseInt(form.guests)
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error saving booking');
      }

      const result = await res.json();
      setSuccess(editingId ? 'Booking updated successfully!' : 'Booking created successfully!');
      resetForm();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm({ 
      user: '', 
      room: '', 
      checkIn: '', 
      checkOut: '', 
      guests: 1,
      status: 'booked',
      customerInfo: { name: '', email: '', phone: '' }
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (booking) => {
    setForm({
      user: booking.user?._id || booking.user,
      room: booking.room?._id || booking.room,
      checkIn: booking.checkIn?.slice(0, 10),
      checkOut: booking.checkOut?.slice(0, 10),
      guests: booking.guests || 1,
      status: booking.status,
      customerInfo: booking.customerInfo || { name: '', email: '', phone: '' }
    });
    setEditingId(booking._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete booking');
      
      setSuccess('Booking deleted successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to delete booking');
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      setSuccess('Booking status updated successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <FaCheckCircle className="status-icon booked" />;
      case 'checked-in':
        return <FaUserCheck className="status-icon checked-in" />;
      case 'checked-out':
        return <FaCheckCircle className="status-icon checked-out" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    return nights;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-bookings">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading bookings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-bookings">
        {/* Header */}
        <div className="bookings-header">
          <div className="header-content">
            <h1><FaCalendarAlt /> Manage Bookings</h1>
            <p>Manage hotel bookings, check-ins, and reservations</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus /> {showForm ? 'Cancel' : 'New Booking'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="message error-message">
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}
        
        {success && (
          <div className="message success-message">
            <span>{success}</span>
            <button onClick={() => setSuccess('')}>×</button>
          </div>
        )}

        {/* Booking Form */}
        {showForm && (
          <div className="booking-form-card">
            <div className="form-header">
              <h3>{editingId ? 'Edit Booking' : 'Create New Booking'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>User</label>
                  <select 
                    name="user" 
                    value={form.user} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Room</label>
                  <select 
                    name="room" 
                    value={form.room} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room._id} value={room._id}>
                        Room {room.number} - {room.type} (${room.price}/night)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input 
                    type="date" 
                    name="checkIn" 
                    value={form.checkIn} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input 
                    type="date" 
                    name="checkOut" 
                    value={form.checkOut} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Guests</label>
                  <input 
                    type="number" 
                    name="guests" 
                    value={form.guests} 
                    onChange={handleChange} 
                    min="1" 
                    max="10"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    name="status" 
                    value={form.status} 
                    onChange={handleChange}
                  >
                    <option value="booked">Booked</option>
                    <option value="checked-in">Checked In</option>
                    <option value="checked-out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="customer-info-section">
                <h4>Customer Information</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Customer Name</label>
                    <input 
                      type="text" 
                      name="customerInfo.name" 
                      value={form.customerInfo.name} 
                      onChange={handleChange} 
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      name="customerInfo.email" 
                      value={form.customerInfo.email} 
                      onChange={handleChange} 
                      placeholder="Email address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone</label>
                    <input 
                      type="tel" 
                      name="customerInfo.phone" 
                      value={form.customerInfo.phone} 
                      onChange={handleChange} 
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bookings-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by user, email, room, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="booked">Booked</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bookings-table-container">
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <FaCalendarAlt className="empty-icon" />
              <h3>No bookings found</h3>
              <p>
                {searchTerm || statusFilter !== 'all' 
                  ? 'No bookings match your search criteria.' 
                  : 'No bookings have been made yet.'
                }
              </p>
            </div>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <div className="booking-id">
                        #{booking._id.slice(-6)}
                      </div>
                    </td>
                    <td>
                      <div className="guest-info">
                        <div className="guest-name">
                          {booking.user?.name || booking.customerInfo?.name || 'N/A'}
                        </div>
                        <div className="guest-email">
                          {booking.user?.email || booking.customerInfo?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="room-info">
                        <div className="room-number">Room {booking.room?.number || 'N/A'}</div>
                        <div className="room-type">{booking.room?.type || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <div className="check-in">
                          <FaCalendarAlt /> {formatDate(booking.checkIn)}
                        </div>
                        <div className="check-out">
                          <FaCalendarAlt /> {formatDate(booking.checkOut)}
                        </div>
                        <div className="nights">
                          {calculateNights(booking.checkIn, booking.checkOut)} night(s)
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="guests-count">
                        <FaUsers /> {booking.guests || 1}
                      </div>
                    </td>
                    <td>
                      <div className="status-container">
                        {getStatusIcon(booking.status)}
                        <span className={`status-text ${booking.status}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="total-amount">
                        ${(booking.room?.price || 0) * calculateNights(booking.checkIn, booking.checkOut)}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => setSelectedBooking(booking)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEdit(booking)}
                          title="Edit Booking"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(booking._id)}
                          title="Delete Booking"
                        >
                          <FaTrash />
                        </button>
                        
                        {/* Quick Status Updates */}
                        {booking.status === 'booked' && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => updateBookingStatus(booking._id, 'checked-in')}
                            title="Check In"
                          >
                            <FaUserCheck />
                          </button>
                        )}
                        
                        {booking.status === 'checked-in' && (
                          <button 
                            className="btn btn-sm btn-warning"
                            onClick={() => updateBookingStatus(booking._id, 'checked-out')}
                            title="Check Out"
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Booking Details</h3>
                <button className="modal-close" onClick={() => setSelectedBooking(null)}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="booking-details-grid">
                  <div className="detail-section">
                    <h4>Guest Information</h4>
                    <p><strong>Name:</strong> {selectedBooking.user?.name || selectedBooking.customerInfo?.name}</p>
                    <p><strong>Email:</strong> {selectedBooking.user?.email || selectedBooking.customerInfo?.email}</p>
                    <p><strong>Phone:</strong> {selectedBooking.customerInfo?.phone || 'N/A'}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Room Information</h4>
                    <p><strong>Room:</strong> {selectedBooking.room?.number}</p>
                    <p><strong>Type:</strong> {selectedBooking.room?.type}</p>
                    <p><strong>Price:</strong> ${selectedBooking.room?.price}/night</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Booking Information</h4>
                    <p><strong>Check-in:</strong> {formatDate(selectedBooking.checkIn)}</p>
                    <p><strong>Check-out:</strong> {formatDate(selectedBooking.checkOut)}</p>
                    <p><strong>Guests:</strong> {selectedBooking.guests}</p>
                    <p><strong>Nights:</strong> {calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)}</p>
                    <p><strong>Status:</strong> {selectedBooking.status}</p>
                    <p><strong>Total:</strong> ${(selectedBooking.room?.price || 0) * calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
    });
    setEditingId(booking._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this booking?')) return;
    await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
    });
    fetchBookings();
  };

  return (
    <AdminLayout>
      <div>
        <h3>Manage Bookings</h3>
        <form onSubmit={handleSubmit}>
          <input name="user" placeholder="User ID" value={form.user} onChange={handleChange} required />
          <input name="room" placeholder="Room ID" value={form.room} onChange={handleChange} required />
          <input name="checkIn" type="date" value={form.checkIn} onChange={handleChange} required />
          <input name="checkOut" type="date" value={form.checkOut} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="booked">Booked</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit">{editingId ? 'Update' : 'Add'} Booking</button>
          {error && <span className="error">{error}</span>}
        </form>
        <table>
          <thead>
            <tr>
              <th>User</th><th>Room</th><th>Check In</th><th>Check Out</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking.user?.name || booking.user}</td>
                <td>{booking.room?.number || booking.room}</td>
                <td>{booking.checkIn?.slice(0, 10)}</td>
                <td>{booking.checkOut?.slice(0, 10)}</td>
                <td>{booking.status}</td>
                <td>
                  <button onClick={() => handleEdit(booking)}>Edit</button>
                  <button onClick={() => handleDelete(booking._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings; 