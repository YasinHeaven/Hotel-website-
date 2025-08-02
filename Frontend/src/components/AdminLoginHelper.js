import { useState } from 'react';

const AdminLoginHelper = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Attempting admin login...');
      console.log('API URL:', process.env.REACT_APP_API_URL);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        setMessage('✅ Login successful! Token saved.');
        console.log('Admin token saved:', data.token);
      } else {
        setMessage(`❌ Login failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(`❌ Login error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkToken = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setMessage(`✅ Token found: ${token.substring(0, 20)}...`);
    } else {
      setMessage('❌ No admin token found');
    }
  };

  const clearToken = () => {
    localStorage.removeItem('adminToken');
    setMessage('🗑️ Token cleared');
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      margin: '20px', 
      borderRadius: '10px',
      maxWidth: '500px'
    }}>
      <h2>🔐 Admin Login Helper</h2>
      
      <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            placeholder="Enter admin username"
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            placeholder="Enter admin password"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={checkToken} style={{ marginRight: '10px', padding: '5px 10px' }}>
          Check Token
        </button>
        <button onClick={clearToken} style={{ padding: '5px 10px' }}>
          Clear Token
        </button>
      </div>

      {message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <strong>API URL:</strong> {process.env.REACT_APP_API_URL}
      </div>
    </div>
  );
};

export default AdminLoginHelper;
