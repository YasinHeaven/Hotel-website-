import { useEffect, useState } from 'react';

const AuthDebug = () => {
  const [authInfo, setAuthInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const userInfo = localStorage.getItem('userInfo');
    
    setAuthInfo({
      token: token ? 'Present' : 'Missing',
      tokenLength: token ? token.length : 0,
      userType,
      userInfo: userInfo ? JSON.parse(userInfo) : null,
      isAuthenticated: !!(token && userType === 'user')
    });
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 10000,
      maxWidth: '300px'
    }}>
      <strong>AUTH DEBUG:</strong><br/>
      Token: {authInfo.token} ({authInfo.tokenLength} chars)<br/>
      User Type: {authInfo.userType || 'None'}<br/>
      Authenticated: {authInfo.isAuthenticated ? 'YES' : 'NO'}<br/>
      User: {authInfo.userInfo?.name || 'None'}<br/>
      Email: {authInfo.userInfo?.email || 'None'}
    </div>
  );
};

export default AuthDebug;