import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await adminAPI.login({ email, password });
      
      if (response.data.token) {
        // Clear any existing user data first
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        
        // Save admin token and info
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminInfo', JSON.stringify(response.data.admin));
        localStorage.setItem('userType', 'admin');
        
        console.log('✅ Admin login successful!');
        console.log('📋 Admin info:', response.data.admin);
        
        // Show success message
        alert('Login successful! Redirecting to admin dashboard...');
        
        // Call onLogin callback if provided
        if (onLogin) onLogin(response.data.admin);
        
        // Redirect to admin dashboard
        navigate('/admin');
        
      } else {
        setError('Login failed - no token received');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container" style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Admin Login</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Administrative access to hotel management system
        </p>
      </div>
      
      {/* Secure: Do not display admin credentials here. */}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            margin: '10px 0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            margin: '10px 0',
            backgroundColor: loading ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Admin Login'}
        </button>
        
        {error && (
          <div className="error" style={{
            color: 'red',
            backgroundColor: '#ffe6e6',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            {error}
          </div>
        )}
      </form>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '1.5rem',
        padding: '1rem',
        borderTop: '1px solid #eee'
      }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Looking for user access?
        </p>
        <Link 
          to="/login" 
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          ← User Login
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin; 