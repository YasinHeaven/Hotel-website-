import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authUtils, userAPI } from '../services/api';

const UserLogin = () => {
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
      const response = await userAPI.login({ email, password });
      
      if (response.data.token) {
        // Save token and user info
        authUtils.setToken(response.data.token);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        localStorage.setItem('userType', 'user');
        
        console.log('✅ User login successful!');
        alert('Login successful! Welcome back.');
        
        // Redirect to booking or home page
        const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectTo);
        
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
    <div className="auth-container" style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>User Login</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Sign in to book rooms and manage your reservations
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your Email"
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
          placeholder="Your Password"
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
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        {error && (
          <div style={{
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
        <p>Don't have an account?</p>
        <Link 
          to="/signup" 
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Create Account
        </Link>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '1rem'
      }}>
        <Link 
          to="/admin/login" 
          style={{
            color: '#6c757d',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          Admin Login →
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
