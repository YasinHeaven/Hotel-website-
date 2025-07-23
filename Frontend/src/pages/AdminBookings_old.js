import { useEffect, useState } from 'react';
import { FaCheck, FaEnvelope, FaEye, FaPhone, FaRefresh, FaTimes, FaUser } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import { apiRequest } from '../config/api';
import './AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    adminNotes: '',
    deniedReason: ''
  });
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    emailType: 'general_inquiry',
    contactMethod: 'email'
  });
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    fetchBookings();
    
    // Set up auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchBookings();
    }, 30000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [searchTerm, statusFilter, sortBy, sortOrder, currentPage]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        search: searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 10
      });

      const response = await apiRequest(`/admin/bookings?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Admin Bookings fetched:', data.bookings.length, 'bookings');
        setBookings(data.bookings);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error fetching bookings');
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !statusUpdate.status) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest(`/admin/bookings/${selectedBooking._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(statusUpdate)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Booking status updated:', data.booking);
        
        // Update booking in the list
        setBookings(prev => prev.map(booking => 
          booking._id === selectedBooking._id ? data.booking : booking
        ));
        
        setShowStatusModal(false);
        setStatusUpdate({ status: '', adminNotes: '', deniedReason: '' });
        setSelectedBooking(null);
        
        alert(`Booking ${statusUpdate.status} successfully!`);
      } else {
        const errorData = await response.json();
        alert('Failed to update booking status: ' + errorData.message);
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Error updating booking status');
    }
  };

  const handleContactCustomer = async () => {
    if (!selectedBooking || !contactForm.subject || !contactForm.message) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest(`/admin/bookings/${selectedBooking._id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Contact sent:', data);
        
        setShowContactModal(false);
        setContactForm({
          subject: '',
          message: '',
          emailType: 'general_inquiry',
          contactMethod: 'email'
        });
        setSelectedBooking(null);
        
        alert(`${contactForm.contactMethod} sent successfully to customer!`);
        fetchBookings(); // Refresh to show contact history
      } else {
        const errorData = await response.json();
        alert('Failed to send contact: ' + errorData.message);
      }
    } catch (err) {
      console.error('Contact customer error:', err);
      alert('Error sending contact to customer');
    }
  };

  const openStatusModal = (booking, status) => {
    setSelectedBooking(booking);
    setStatusUpdate({ status, adminNotes: '', deniedReason: '' });
    setShowStatusModal(true);
  };

  const openContactModal = (booking) => {
    setSelectedBooking(booking);
    setContactForm({
      subject: `Regarding your booking at ${booking.room?.type || 'our hotel'}`,
      message: '',
      emailType: 'general_inquiry',
      contactMethod: 'email'
    });
    setShowContactModal(true);
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-500 text-white',
      'approved': 'bg-green-500 text-white',
      'booked': 'bg-blue-500 text-white',
      'checked-in': 'bg-purple-500 text-white',
      'checked-out': 'bg-gray-500 text-white',
      'cancelled': 'bg-red-500 text-white',
      'denied': 'bg-red-600 text-white',
      'no-show': 'bg-orange-500 text-white'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-300 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest('/admin/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          userId: '',
          roomId: '',
          checkIn: '',
          checkOut: '',
          guests: 1,
          specialRequests: ''
        });
        fetchBookings();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create booking');
      }
    } catch (err) {
      setError('Error creating booking');
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest(`/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchBookings();
      } else {
        setError('Failed to update booking status');
      }
    } catch (err) {
      setError('Error updating booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await apiRequest(`/admin/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchBookings();
        } else {
          setError('Failed to delete booking');
        }
      } catch (err) {
        setError('Error deleting booking');
      }
    }
  };

  const openModal = (mode, booking = null) => {
    setModalMode(mode);
    setSelectedBooking(booking);
    if (mode === 'create') {
      setFormData({
        userId: '',
        roomId: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        specialRequests: ''
      });
    } else if (mode === 'edit' && booking) {
      setFormData({
        userId: booking.user?._id || '',
        roomId: booking.room?._id || '',
        checkIn: booking.checkIn?.split('T')[0] || '',
        checkOut: booking.checkOut?.split('T')[0] || '',
        guests: booking.guests || 1,
        specialRequests: booking.specialRequests || ''
      });
    }
    setShowModal(true);
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

  if (loading && bookings.length === 0) {
    return (
      <AdminLayout>
        <div className="bookings-container">
          <div className="loading-spinner">Loading bookings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>Booking Management</h1>
          <button 
            className="btn-primary"
            onClick={() => openModal('create')}
          >
            <FaPlus /> Add New Booking
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="bookings-controls">
          <div className="search-filter-group">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search by guest name, email, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <FaFilter />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="booked">Booked</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
                <option value="denied">Denied</option>
              </select>
            </div>

            <div className="sort-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Created Date</option>
                <option value="checkIn">Check-in Date</option>
                <option value="checkOut">Check-out Date</option>
                <option value="totalAmount">Amount</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div className="guest-info">
                      <div className="guest-name">{booking.user?.name || 'N/A'}</div>
                      <div className="guest-email">{booking.user?.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <div className="room-info">
                      <div className="room-type">{booking.room?.type || 'N/A'}</div>
                      <div className="room-number">#{booking.room?.number || 'N/A'}</div>
                    </div>
                  </td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td>{booking.guests}</td>
                  <td>${booking.totalAmount}</td>
                  <td>
                    <select
                      className={`status-select ${getStatusBadge(booking.status)}`}
                      value={booking.status}
                      onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="booked">Booked</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                      <option value="denied">Denied</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => openModal('view', booking)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => openModal('edit', booking)}
                        title="Edit Booking"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteBooking(booking._id)}
                        title="Delete Booking"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && !loading && (
            <div className="no-bookings">
              <p>No bookings found</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>
                  {modalMode === 'create' && 'Create New Booking'}
                  {modalMode === 'edit' && 'Edit Booking'}
                  {modalMode === 'view' && 'Booking Details'}
                </h3>
                <button
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                {modalMode === 'view' && selectedBooking ? (
                  <div className="booking-details">
                    <div className="detail-section">
                      <h4>Customer Information</h4>
                      <div className="detail-row">
                        <label>Account Holder:</label>
                        <span>{selectedBooking.user?.name} ({selectedBooking.user?.email})</span>
                      </div>
                      {selectedBooking.customerInfo && (
                        <>
                          <div className="detail-row">
                            <label>Guest Name:</label>
                            <span>{selectedBooking.customerInfo.name}</span>
                          </div>
                          <div className="detail-row">
                            <label>Guest Email:</label>
                            <span>{selectedBooking.customerInfo.email}</span>
                          </div>
                          <div className="detail-row">
                            <label>Guest Phone:</label>
                            <span>{selectedBooking.customerInfo.phone || 'Not provided'}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="detail-section">
                      <h4>Booking Information</h4>
                      <div className="detail-row">
                        <label>Room:</label>
                        <span>{selectedBooking.room?.type} - #{selectedBooking.room?.number}</span>
                      </div>
                      <div className="detail-row">
                        <label>Check-in:</label>
                        <span>{new Date(selectedBooking.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-row">
                        <label>Check-out:</label>
                        <span>{new Date(selectedBooking.checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-row">
                        <label>Guests:</label>
                        <span>{selectedBooking.guests}</span>
                      </div>
                      <div className="detail-row">
                        <label>Total Amount:</label>
                        <span>${selectedBooking.totalAmount}</span>
                      </div>
                      <div className="detail-row">
                        <label>Status:</label>
                        <span className={getStatusBadge(selectedBooking.status)}>
                          {selectedBooking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="detail-row">
                        <label>Booking Date:</label>
                        <span>{new Date(selectedBooking.createdAt).toLocaleDateString()}</span>
                      </div>
                      {selectedBooking.specialRequests && (
                        <div className="detail-row">
                          <label>Special Requests:</label>
                          <span>{selectedBooking.specialRequests}</span>
                        </div>
                      )}
                    </div>

                    <div className="detail-section">
                      <h4>Admin Actions</h4>
                      <div className="admin-action-buttons">
                        <button 
                          className="btn-back" 
                          onClick={() => setShowModal(false)}
                          style={{
                            backgroundColor: '#6b7280',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '8px'
                          }}
                        >
                          ← Back to List
                        </button>
                        <button 
                          className="btn-approve" 
                          onClick={() => handleUpdateStatus(selectedBooking._id, 'approved')}
                          disabled={selectedBooking.status === 'approved'}
                        >
                          Approve Booking
                        </button>
                        <button 
                          className="btn-deny" 
                          onClick={() => handleUpdateStatus(selectedBooking._id, 'denied')}
                          disabled={selectedBooking.status === 'denied'}
                        >
                          Deny Booking
                        </button>
                        <button 
                          className="btn-edit" 
                          onClick={() => openModal('edit', selectedBooking)}
                        >
                          Edit Booking
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCreateBooking}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Guest:</label>
                        <select
                          value={formData.userId}
                          onChange={(e) => setFormData({...formData, userId: e.target.value})}
                          required
                        >
                          <option value="">Select Guest</option>
                          {users.map(user => (
                            <option key={user._id} value={user._id}>
                              {user.name} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Room:</label>
                        <select
                          value={formData.roomId}
                          onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                          required
                        >
                          <option value="">Select Room</option>
                          {rooms.map(room => (
                            <option key={room._id} value={room._id}>
                              {room.type} - #{room.number} (${room.price}/night)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Check-in Date:</label>
                        <input
                          type="date"
                          value={formData.checkIn}
                          onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Check-out Date:</label>
                        <input
                          type="date"
                          value={formData.checkOut}
                          onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Guests:</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={formData.guests}
                          onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
                          required
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Special Requests:</label>
                        <textarea
                          value={formData.specialRequests}
                          onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                          rows="3"
                          placeholder="Any special requests or notes..."
                        />
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button type="button" onClick={() => setShowModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        {modalMode === 'create' ? 'Create Booking' : 'Update Booking'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;