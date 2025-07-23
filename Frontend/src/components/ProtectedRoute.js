import { Navigate, useLocation } from 'react-router-dom';
import { authUtils } from '../services/api';

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/login', requireAdmin = false }) => {
  const location = useLocation();
  const isUserAuthenticated = authUtils.isAuthenticated();
  const isAdminAuthenticated = localStorage.getItem('adminToken') && localStorage.getItem('userType') === 'admin';
  
  // For admin routes
  if (location.pathname.startsWith('/admin')) {
    if (requireAuth && !isAdminAuthenticated) {
      // Admin route requires authentication but admin is not logged in
      alert('Please log in as an administrator to access this page.');
      return <Navigate to="/admin/login" replace />;
    }
    
    if (!requireAuth && isAdminAuthenticated) {
      // Admin trying to access admin login while already logged in
      return <Navigate to="/admin" replace />;
    }
    
    // Check if a regular user is trying to access admin routes
    if (isUserAuthenticated && !isAdminAuthenticated) {
      alert('You are logged in as a user. Please logout first to access admin panel.');
      return <Navigate to="/" replace />;
    }
  } else {
    // For regular user routes
    if (requireAuth && !isUserAuthenticated) {
      // Save the intended destination before redirecting to login
      localStorage.setItem('redirectAfterLogin', location.pathname);
      alert('Please log in to access this page. You will be redirected back after login.');
      return <Navigate to={redirectTo} replace />;
    }
    
    if (!requireAuth && isUserAuthenticated) {
      // If user is already authenticated and trying to access auth pages, redirect to home
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;
