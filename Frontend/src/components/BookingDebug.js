import { useEffect, useState } from 'react';
import { apiRequest } from '../config/api';

const BookingDebug = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminToken, setAdminToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setAdminToken(token ? 'Present' : 'Missing');
    
    if (token) {
      fetchBookings(token);
    }
  }, []);

  const fetchBookings = async (token) => {
    try {
      setLoading(true);
      
      console.log('🔍 Fetching bookings with token:', token ? token.substring(0, 10) + '...' : 'None');
      
      const response = await apiRequest('/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Bookings fetched:', data);
        setBookings(data.bookings || []);
        setError('');
      } else {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        setError(`Failed to fetch bookings: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(`Error fetching bookings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Booking System Debug</h2>
      
      <div style={{ 
        background: '#f0f9ff', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>System Status</h3>
        <p><strong>Admin Token:</strong> {adminToken}</p>
        <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}</p>
      </div>
      
      {error && (
        <div style={{ 
          background: '#fef2f2', 
          color: '#b91c1c',
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      <div>
        <h3>Bookings ({bookings.length})</h3>
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found. This could mean:</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>ID</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Customer</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Room</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #e5e7eb' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>{booking._id.substring(0, 8)}...</td>
                  <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                    {booking.user?.name || booking.customerInfo?.name || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                    {booking.room?.type || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: booking.status === 'pending' ? '#fef3c7' : 
                                  booking.status === 'approved' ? '#d1fae5' :
                                  booking.status === 'denied' ? '#fee2e2' : '#e5e7eb',
                      color: booking.status === 'pending' ? '#92400e' :
                             booking.status === 'approved' ? '#065f46' :
                             booking.status === 'denied' ? '#991b1b' : '#374151'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #e5e7eb' }}>
                    {new Date(booking.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {bookings.length === 0 && !loading && (
          <ul style={{ color: '#6b7280', paddingLeft: '20px' }}>
            <li>No bookings have been created yet</li>
            <li>There's an issue with the API connection</li>
            <li>Admin authentication is not working correctly</li>
            <li>The database is empty</li>
          </ul>
        )}
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Troubleshooting Steps</h3>
        <ol style={{ color: '#374151', paddingLeft: '20px' }}>
          <li>Ensure the backend server is running</li>
          <li>Check that you're logged in as an admin</li>
          <li>Verify the API URL is correct in .env file</li>
          <li>Try creating a test booking as a user</li>
          <li>Check browser console for any errors</li>
        </ol>
      </div>
    </div>
  );
};

export default BookingDebug;