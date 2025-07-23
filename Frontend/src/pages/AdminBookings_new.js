import { useEffect, useState } from 'react';
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
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [actionFeedback, setActionFeedback] = useState({ show: false, message: '', error: false });

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
      const params = new URLSearchParams({
        search: searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 10
      });
      // Debug: log the admin token
      const debugToken = localStorage.getItem('adminToken');
      console.log('[DEBUG] adminToken for fetchBookings:', debugToken);
      const response = await apiRequest(`/admin/bookings?${params}`);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Admin Bookings fetched:', data.bookings.length, 'bookings');
        setBookings(data.bookings);
        setTotalPages(data.pagination.totalPages);
      } else {
        const errorText = await response.text();
        setError('Failed to fetch bookings');
        console.error('[DEBUG] Fetch bookings error response:', errorText);
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
    // Require admin notes for all actions, and denial reason for denied
    if (!statusUpdate.adminNotes && statusUpdate.status !== 'approved') {
      setActionFeedback({ show: true, message: 'Please provide admin notes for this action.', error: true });
      setTimeout(() => setActionFeedback({ show: false, message: '', error: false }), 2500);
      return;
    }
    if (statusUpdate.status === 'denied' && !statusUpdate.deniedReason) {
      setActionFeedback({ show: true, message: 'Please provide a denial reason.', error: true });
      setTimeout(() => setActionFeedback({ show: false, message: '', error: false }), 2500);
      return;
    }
    try {
      // Debug: log the admin token
      const debugToken = localStorage.getItem('adminToken');
      console.log('[DEBUG] adminToken for handleStatusUpdate:', debugToken);
      const response = await apiRequest(`/admin/bookings/${selectedBooking._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(statusUpdate)
      });
      if (response.ok) {
        const data = await response.json();
        setBookings(prev => prev.map(booking => booking._id === selectedBooking._id ? data.booking : booking));
        setShowStatusModal(false);
        setStatusUpdate({ status: '', adminNotes: '', deniedReason: '' });
        setSelectedBooking(null);
        setActionFeedback({ show: true, message: `Booking ${statusUpdate.status} successfully!`, error: false });
        setTimeout(() => setActionFeedback({ show: false, message: '', error: false }), 2500);
        fetchBookings();
      } else {
        const errorText = await response.text();
        setActionFeedback({ show: true, message: 'Failed to update booking status: ' + errorText, error: true });
        setTimeout(() => setActionFeedback({ show: false, message: '', error: false }), 2500);
        console.error('[DEBUG] handleStatusUpdate error response:', errorText);
      }
    } catch (err) {
      setActionFeedback({ show: true, message: 'Error updating booking status', error: true });
      setTimeout(() => setActionFeedback({ show: false, message: '', error: false }), 2500);
      console.error('handleStatusUpdate error:', err);
    }
  };

  const handleContactCustomer = async () => {
    if (!selectedBooking || !contactForm.subject || !contactForm.message) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await apiRequest(`/admin/bookings/${selectedBooking._id}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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

  return (
    <AdminLayout>
      <div className="admin-bookings-page">
        <div className="page-header">
          <h1>📋 Booking Management</h1>
          <div className="header-actions">
            <button 
              onClick={fetchBookings}
              className="btn btn-refresh"
              title="Refresh bookings"
            >
              <FaSync /> Refresh
            </button>
          </div>
        </div>

        {/* Filters and Search */}
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
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="booked">Booked</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
              <option value="denied">Denied</option>
              <option value="no-show">No Show</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="sort-select"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="checkIn-asc">Check-in Date</option>
              <option value="totalAmount-desc">Highest Amount</option>
              <option value="totalAmount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Live Update Indicator */}
        <div className="live-indicator">
          <span className="live-dot"></span>
          Live Updates (refreshes every 30 seconds)
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="loading-spinner">Loading bookings...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className={`booking-row ${booking.status}`}>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">
                          <FaUser className="customer-icon" />
                          {booking.user?.name || booking.customerInfo?.name || 'Unknown'}
                        </div>
                        <div className="customer-email">
                          {booking.user?.email || booking.customerInfo?.email || 'No email'}
                        </div>
                        {(booking.user?.phone || booking.customerInfo?.phone) && (
                          <div className="customer-phone">
                            📞 {booking.user?.phone || booking.customerInfo?.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="room-info">
                        <div className="room-type">{booking.room?.type || 'Room'}</div>
                        <div className="room-price">${booking.room?.price || 0}/night</div>
                      </div>
                    </td>
                    <td>
                      <div className="dates-info">
                        <div>📅 In: {formatDate(booking.checkIn)}</div>
                        <div>📅 Out: {formatDate(booking.checkOut)}</div>
                        <div className="booking-date">
                          Booked: {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="guests-count">{booking.guests}</td>
                    <td className="amount">{formatCurrency(booking.totalAmount)}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openDetailsModal(booking)}
                          className="btn btn-view"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openContactModal(booking)}
                          className="btn btn-contact"
                          title="Contact Customer"
                        >
                          <FaEnvelope />
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openStatusModal(booking, 'approved')}
                              className="btn btn-approve"
                              title="Approve Booking"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => openStatusModal(booking, 'denied')}
                              className="btn btn-deny"
                              title="Deny Booking"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {booking.status === 'approved' && (
                          <button
                            onClick={() => openStatusModal(booking, 'booked')}
                            className="btn btn-confirm"
                            title="Confirm Booking"
                          >
                            ✓ Confirm
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <div className="no-bookings">
                <p>No bookings found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn btn-prev"
            >
              ← Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-next"
            >
              Next →
            </button>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedBooking && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Update Booking Status</h3>
                <button onClick={() => setShowStatusModal(false)} className="modal-close">×</button>
              </div>
              <div className="modal-body">
                <div className="booking-summary">
                  <h4>Booking Details</h4>
                  <p><strong>Customer:</strong> {selectedBooking.user?.name || selectedBooking.customerInfo?.name}</p>
                  <p><strong>Room:</strong> {selectedBooking.room?.type}</p>
                  <p><strong>Dates:</strong> {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)}</p>
                  <p><strong>Amount:</strong> {formatCurrency(selectedBooking.totalAmount)}</p>
                  <p><strong>Current Status:</strong> {getStatusBadge(selectedBooking.status)}</p>
                </div>

                <div className="status-form">
                  <label>New Status:</label>
                  <span className="new-status-badge">{getStatusBadge(statusUpdate.status)}</span>

                  <label>Admin Notes:</label>
                  <textarea
                    value={statusUpdate.adminNotes}
                    onChange={(e) => setStatusUpdate(prev => ({...prev, adminNotes: e.target.value}))}
                    placeholder="Add any notes about this status change..."
                    rows={3}
                  />

                  {statusUpdate.status === 'denied' && (
                    <>
                      <label>Reason for Denial:</label>
                      <textarea
                        value={statusUpdate.deniedReason}
                        onChange={(e) => setStatusUpdate(prev => ({...prev, deniedReason: e.target.value}))}
                        placeholder="Please provide a reason for denying this booking..."
                        rows={3}
                        required
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowStatusModal(false)} className="btn btn-cancel">
                  Cancel
                </button>
                <button 
                  onClick={handleStatusUpdate} 
                  className={`btn ${statusUpdate.status === 'approved' ? 'btn-approve' : 'btn-deny'}`}
                  disabled={statusUpdate.status === 'denied' && !statusUpdate.deniedReason}
                >
                  {statusUpdate.status === 'approved' ? 'Approve Booking' : 
                   statusUpdate.status === 'denied' ? 'Deny Booking' : 
                   `Update to ${statusUpdate.status}`}
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
                <button onClick={() => setShowContactModal(false)} className="modal-close">×</button>
              </div>
              <div className="modal-body">
                <div className="customer-contact-info">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedBooking.user?.name || selectedBooking.customerInfo?.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.user?.email || selectedBooking.customerInfo?.email}</p>
                  <p><strong>Phone:</strong> {selectedBooking.user?.phone || selectedBooking.customerInfo?.phone || 'Not provided'}</p>
                </div>

                <div className="contact-form">
                  <label>Contact Method:</label>
                  <select
                    value={contactForm.contactMethod}
                    onChange={(e) => setContactForm(prev => ({...prev, contactMethod: e.target.value}))}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="sms">SMS</option>
                  </select>

                  <label>Message Type:</label>
                  <select
                    value={contactForm.emailType}
                    onChange={(e) => setContactForm(prev => ({...prev, emailType: e.target.value}))}
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
                    onChange={(e) => setContactForm(prev => ({...prev, subject: e.target.value}))}
                    placeholder="Email subject line..."
                  />

                  <label>Message:</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
                    placeholder="Your message to the customer..."
                    rows={6}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowContactModal(false)} className="btn btn-cancel">
                  Cancel
                </button>
                <button 
                  onClick={handleContactCustomer} 
                  className="btn btn-contact"
                  disabled={!contactForm.subject || !contactForm.message}
                >
                  <FaEnvelope /> Send {contactForm.contactMethod}
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
                <button onClick={() => setShowDetailsModal(false)} className="modal-close">×</button>
              </div>
              <div className="modal-body">
                <div className="booking-details-grid">
                  <div className="details-section">
                    <h4>Customer Information</h4>
                    <div className="detail-row">
                      <label>Name:</label>
                      <span>{selectedBooking.user?.name || selectedBooking.customerInfo?.name}</span>
                    </div>
                    <div className="detail-row">
                      <label>Email:</label>
                      <span>{selectedBooking.user?.email || selectedBooking.customerInfo?.email}</span>
                    </div>
                    <div className="detail-row">
                      <label>Phone:</label>
                      <span>{selectedBooking.user?.phone || selectedBooking.customerInfo?.phone || 'Not provided'}</span>
                    </div>
                  </div>

                  <div className="details-section">
                    <h4>Booking Information</h4>
                    <div className="detail-row">
                      <label>Room Type:</label>
                      <span>{selectedBooking.room?.type}</span>
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
                      <span>{selectedBooking.guests}</span>
                    </div>
                    <div className="detail-row">
                      <label>Total Amount:</label>
                      <span>{formatCurrency(selectedBooking.totalAmount)}</span>
                    </div>
                    <div className="detail-row">
                      <label>Status:</label>
                      <span>{getStatusBadge(selectedBooking.status)}</span>
                    </div>
                    <div className="detail-row">
                      <label>Booking Date:</label>
                      <span>{formatDate(selectedBooking.createdAt)}</span>
                    </div>
                  </div>

                  {selectedBooking.specialRequests && (
                    <div className="details-section">
                      <h4>Special Requests</h4>
                      <p className="special-requests">{selectedBooking.specialRequests}</p>
                    </div>
                  )}

                  {selectedBooking.adminNotes && (
                    <div className="details-section">
                      <h4>Admin Notes</h4>
                      <p className="admin-notes">{selectedBooking.adminNotes}</p>
                    </div>
                  )}

                  {selectedBooking.contactHistory && selectedBooking.contactHistory.length > 0 && (
                    <div className="details-section">
                      <h4>Contact History</h4>
                      <div className="contact-history">
                        {selectedBooking.contactHistory.map((contact, index) => (
                          <div key={index} className="contact-item">
                            <div className="contact-header">
                              <span className="contact-date">{formatDate(contact.date)}</span>
                              <span className="contact-type">{contact.type}</span>
                              <span className="contact-method">{contact.contactMethod}</span>
                            </div>
                            <div className="contact-subject">{contact.subject}</div>
                            <div className="contact-message">{contact.message}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowDetailsModal(false)} className="btn btn-cancel">
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    openContactModal(selectedBooking);
                  }} 
                  className="btn btn-contact"
                >
                  <FaEnvelope /> Contact Customer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Feedback Toast/Modal */}
        {actionFeedback.show && (
          <div className={`admin-action-feedback-toast${actionFeedback.error ? ' error' : ''}`} style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: actionFeedback.error ? '#f87171' : '#4ade80', color: '#fff', padding: '16px 24px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <span style={{ whiteSpace: 'pre-line' }}>{actionFeedback.message}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding: 8px 12px;
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 4px;
          font-size: 14px;
          color: #0c4a6e;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .booking-row.pending {
          background-color: #fffbeb;
        }

        .booking-row.approved {
          background-color: #f0fdf4;
        }

        .booking-row.denied {
          background-color: #fef2f2;
        }

        .customer-info, .room-info, .dates-info {
          font-size: 14px;
        }

        .customer-name, .room-type {
          font-weight: bold;
          margin-bottom: 2px;
        }

        .customer-email, .customer-phone, .room-price, .booking-date {
          color: #666;
          font-size: 12px;
        }

        .action-buttons {
          display: flex;
          gap: 4px;
        }

        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .btn-view {
          background: #6b7280;
          color: white;
        }

        .btn-contact {
          background: #3b82f6;
          color: white;
        }

        .btn-approve {
          background: #10b981;
          color: white;
        }

        .btn-deny {
          background: #ef4444;
          color: white;
        }

        .btn-confirm {
          background: #8b5cf6;
          color: white;
        }

        .btn:hover {
          opacity: 0.8;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-large {
          max-width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .booking-summary, .details-section {
          margin-bottom: 20px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .detail-row label {
          font-weight: bold;
          color: #374151;
        }

        .contact-form label {
          display: block;
          margin-bottom: 4px;
          font-weight: bold;
        }

        .contact-form input,
        .contact-form select,
        .contact-form textarea {
          width: 100%;
          padding: 8px;
          margin-bottom: 16px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }

        .contact-history {
          max-height: 200px;
          overflow-y: auto;
        }

        .contact-item {
          padding: 12px;
          margin-bottom: 8px;
          background: white;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .contact-header {
          display: flex;
          gap: 12px;
          margin-bottom: 4px;
          font-size: 12px;
        }

        .contact-date {
          color: #6b7280;
        }

        .contact-type,
        .contact-method {
          background: #3b82f6;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
        }

        .contact-subject {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .contact-message {
          color: #4b5563;
          font-size: 14px;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminBookings;
