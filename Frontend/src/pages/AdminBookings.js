import { useCallback, useEffect, useState } from 'react';
import { FaCheck, FaEnvelope, FaEye, FaSync, FaTimes, FaUser } from 'react-icons/fa';
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

  const fetchBookings = useCallback(async () => {
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
        setBookings(data.bookings);
        setTotalPages(data.pagination.totalPages);
        setError('');
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error fetching bookings');
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !statusUpdate.status) {
      alert('Please select a status to update');
      return;
    }

    if (statusUpdate.status === 'denied' && !statusUpdate.deniedReason) {
      alert('Please provide a reason for denying this booking');
      return;
    }

    try {
      setLoading(true);
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
        // Update the booking in the list
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === selectedBooking._id
              ? { ...booking, ...data.booking }
              : booking
          )
        );

        alert(`✅ Booking ${statusUpdate.status} successfully!`);

        // Close modal and reset form
        setShowStatusModal(false);
        setStatusUpdate({ status: '', adminNotes: '', deniedReason: '' });
        setSelectedBooking(null);

        // Refresh bookings
        fetchBookings();

      } else {
        const errorData = await response.json();
        alert(`❌ Failed to update booking status: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('❌ Status update error:', err);
      alert(`❌ Error updating booking status: ${err.message || 'Network error'}`);
    } finally {
      setLoading(false);
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
        alert(`✅ ${contactForm.contactMethod} sent successfully!`);
        setShowContactModal(false);
        setContactForm({
          subject: '',
          message: '',
          emailType: 'general_inquiry',
          contactMethod: 'email'
        });
        fetchBookings();
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to send ${contactForm.contactMethod}: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Contact customer error:', err);
      alert(`❌ Error sending ${contactForm.contactMethod}: ${err.message}`);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'pending': 'status-badge pending',
      'approved': 'status-badge approved',
      'booked': 'status-badge booked',
      'checked-in': 'status-badge checked-in',
      'checked-out': 'status-badge checked-out',
      'cancelled': 'status-badge cancelled',
      'denied': 'status-badge denied',
      'no-show': 'status-badge no-show'
    };
    return statusClasses[status] || 'status-badge';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="admin-bookings-page">
        {/* Page Header */}
        <div className="page-header">
          <h1>Booking Management</h1>
          <div className="header-actions">
            <button
              onClick={fetchBookings}
              className="btn-refresh"
              disabled={loading}
            >
              <FaSync className={loading ? 'spinning' : ''} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Live Updates Indicator */}
        <div className="live-indicator">
          <div className="live-dot"></div>
          <span>Live updates every 30 seconds</span>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by customer name, email, or room type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="booked">Booked</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
              <option value="denied">Denied</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="checkIn">Sort by Check-in</option>
              <option value="totalAmount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-select"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Bookings Table */}
        <div className="bookings-table-container">
          {loading && bookings.length === 0 ? (
            <div className="loading-spinner">
              <FaSync className="spinning" /> Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found matching your criteria.</p>
            </div>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className={`booking-row ${booking.status}`}
                  >
                    <td className="customer-info">
                      <div className="customer-name">
                        <FaUser className="customer-icon" />
                        {booking.user?.name || booking.customerInfo?.name || 'N/A'}
                      </div>
                      <div className="customer-email">
                        {booking.user?.email || booking.customerInfo?.email || 'N/A'}
                      </div>
                      <div className="customer-phone">
                        {booking.customerInfo?.phone || 'N/A'}
                      </div>
                    </td>

                    <td className="room-info">
                      <div className="room-type">
                        {booking.room?.type || 'N/A'}
                      </div>
                      <div className="room-price">
                        {booking.room?.price || 0} PKR/night
                      </div>
                    </td>

                    <td className="dates-info">
                      <div><strong>In:</strong> {formatDate(booking.checkIn)}</div>
                      <div><strong>Out:</strong> {formatDate(booking.checkOut)}</div>
                      <div className="booking-date">
                        {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} nights
                      </div>
                      <div className="booking-created">
                        <strong>Booked At:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>{formatDateTime(booking.createdAt)}</span>
                      </div>
                    </td>

                    <td className="guests-count">
                      {booking.guests || 1}
                    </td>

                    <td className="amount">
                      {booking.totalAmount || 0} PKR
                    </td>

                    <td>
                      <span className={getStatusBadgeClass(booking.status)}>
                        {booking.status}
                      </span>
                    </td>

                    <td className="booking-date">
                      {formatDateTime(booking.createdAt)}
                    </td>

                    <td className="action-buttons">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                        className="btn btn-view"
                        title="View Details"
                      >
                        <FaEye /> View
                      </button>

                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setStatusUpdate({ status: 'approved', adminNotes: '', deniedReason: '' });
                              setShowStatusModal(true);
                            }}
                            className="btn btn-approve"
                            title="Approve Booking"
                          >
                            <FaCheck /> Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setStatusUpdate({ status: 'denied', adminNotes: '', deniedReason: '' });
                              setShowStatusModal(true);
                            }}
                            className="btn btn-deny"
                            title="Deny Booking"
                          >
                            <FaTimes /> Deny
                          </button>
                        </>
                      )}

                      {!['cancelled', 'denied', 'checked-out'].includes(booking.status) && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowContactModal(true);
                          }}
                          className="btn btn-contact"
                          title="Contact Customer"
                        >
                          <FaEnvelope /> Contact
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-prev"
            >
              Previous
            </button>

            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-next"
            >
              Next
            </button>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedBooking && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Update Booking Status</h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="booking-summary">
                  <h4>Booking Details</h4>
                  <p><strong>Customer:</strong> {selectedBooking.user?.name || selectedBooking.customerInfo?.name}</p>
                  <p><strong>Room:</strong> {selectedBooking.room?.type}</p>
                  <p><strong>Dates:</strong> {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)}</p>
                  <p><strong>Current Status:</strong> <span className={getStatusBadgeClass(selectedBooking.status)}>{selectedBooking.status}</span></p>
                  <p><strong>Amount:</strong> Rs {selectedBooking.totalAmount}</p>
                </div>

                <div className="status-form">
                  <label>New Status:</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="">Select Status</option>
                    <option value="approved">Approved</option>
                    <option value="booked">Booked (Payment Confirmed)</option>
                    <option value="checked-in">Checked In</option>
                    <option value="checked-out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="denied">Denied</option>
                    <option value="no-show">No Show</option>
                  </select>

                  {statusUpdate.status === 'denied' && (
                    <>
                      <label>Denial Reason (Required):</label>
                      <textarea
                        value={statusUpdate.deniedReason}
                        onChange={(e) => setStatusUpdate(prev => ({ ...prev, deniedReason: e.target.value }))}
                        placeholder="Please provide a reason for denying this booking..."
                        rows="3"
                        required
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="btn btn-primary"
                  disabled={!statusUpdate.status || loading}
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Customer Modal */}
        {showContactModal && selectedBooking && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Contact Customer</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="customer-contact-info">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedBooking.user?.name || selectedBooking.customerInfo?.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.user?.email || selectedBooking.customerInfo?.email}</p>
                  <p><strong>Phone:</strong> {selectedBooking.customerInfo?.phone || 'N/A'}</p>
                </div>

                <div className="contact-form">
                  <label>Contact Method:</label>
                  <select
                    value={contactForm.contactMethod}
                    onChange={(e) => setContactForm(prev => ({ ...prev, contactMethod: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="sms">SMS</option>
                  </select>

                  <label>Message Type:</label>
                  <select
                    value={contactForm.emailType}
                    onChange={(e) => setContactForm(prev => ({ ...prev, emailType: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="booking_confirmation">Booking Confirmation</option>
                    <option value="status_update">Status Update</option>
                    <option value="payment_reminder">Payment Reminder</option>
                    <option value="general_inquiry">General Inquiry</option>
                  </select>

                  <label>Subject:</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter message subject..."
                  />

                  <label>Message:</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter your message..."
                    rows="5"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContactCustomer}
                  className="btn btn-primary"
                  disabled={!contactForm.subject || !contactForm.message}
                >
                  Send {contactForm.contactMethod}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="modal-overlay">
            <div className="modal modal-large">
              <div className="modal-header">
                <h3>Booking Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="booking-details-grid">
                  <div className="details-section">
                    <h4>Customer Information</h4>
                    <div className="detail-row">
                      <label>Name:</label>
                      <span>{selectedBooking.user?.name || selectedBooking.customerInfo?.name || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <label>Email:</label>
                      <span>{selectedBooking.user?.email || selectedBooking.customerInfo?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <label>Phone:</label>
                      <span>{selectedBooking.customerInfo?.phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="details-section">
                    <h4>Booking Information</h4>
                    <div className="detail-row">
                      <label>Booking ID:</label>
                      <span>{selectedBooking._id}</span>
                    </div>
                    <div className="detail-row">
                      <label>Room Type:</label>
                      <span>{selectedBooking.room?.type || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <label>Check-in:</label>
                      <span>{formatDate(selectedBooking.checkIn)}</span>
                    </div>
                    <div className="detail-row">
                      <label>Check-out:</label>
                      <span>{formatDate(selectedBooking.checkOut)}</span>
                    </div>
                    <div className="detail-row">
                      <label>Guests:</label>
                      <span>{selectedBooking.guests || 1}</span>
                    </div>
                    <div className="detail-row">
                      <label>Total Amount:</label>
                      <span>Rs {selectedBooking.totalAmount || 0}</span>
                    </div>
                    <div className="detail-row">
                      <label>Status:</label>
                      <span className={getStatusBadgeClass(selectedBooking.status)}>
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>

                  {selectedBooking.customerInfo?.specialRequests && (
                    <div className="details-section">
                      <h4>Special Requests</h4>
                      <p className="special-requests">
                        {selectedBooking.customerInfo.specialRequests}
                      </p>
                    </div>
                  )}

                  {selectedBooking.adminNotes && (
                    <div className="details-section">
                      <h4>Admin Notes</h4>
                      <p className="admin-notes">
                        {selectedBooking.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;