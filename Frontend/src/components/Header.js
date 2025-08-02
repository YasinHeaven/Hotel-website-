import { useEffect, useRef, useState } from 'react';
import { FaBars, FaSignInAlt, FaSignOutAlt, FaTimes, FaUser, FaUserPlus } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status for both users and admins
    const userToken = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUserType === 'user' && userToken) {
      setUserType('user');
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    } else if (savedUserType === 'admin' && adminToken) {
      setUserType('admin');
      const adminInfo = localStorage.getItem('adminInfo');
      if (adminInfo) {
        setUser(JSON.parse(adminInfo));
      }
    } else {
      // Clear state if no valid authentication
      setUser(null);
      setUserType(null);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAuthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear all authentication data
    if (userType === 'user') {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    } else if (userType === 'admin') {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
    }
    
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
    navigate('/');
    alert('Logged out successfully!');
  };

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
    console.log('New menu state will be:', !isMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header${user && userType === 'admin' ? ' admin-header' : ''}`}> 
      <div className="header-container">
        <div className="header-content">
          {/* Desktop Navigation - Left Side */}
          {user && userType === 'admin' ? (
            <nav className="desktop-nav">
              <Link to="/admin" className={`nav-link admin-panel-link ${isActive('/admin') ? 'active' : ''}`}> 
                🏨 Admin Panel
              </Link>
            </nav>
          ) : (
            <nav className="desktop-nav">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}> 
                Home
              </Link>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}> 
                About
              </Link>
              <Link to="/rooms" className={`nav-link ${isActive('/rooms') ? 'active' : ''}`}> 
                Rooms
              </Link>
              <Link to="/deals" className={`nav-link deals-link ${isActive('/deals') ? 'active' : ''}`}> 
                Deals
                <span className="hot-badge">Hot</span>
              </Link>
              <Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}> 
                Gallery
              </Link>
            </nav>
          )}

          {/* Logo Section - Center for users, right for admin */}
          <Link to="/" className={`logo${user && userType === 'admin' ? ' logo-admin' : ''}`}> 
            <div className="logo-text">
              <span className="logo-title">Yasin Heaven Star Hotel</span>
              <span className="logo-subtitle">Premium Hospitality</span>
            </div>
            <img 
              src="/assets/Logo/logo.jpg" 
              alt="Yasin Heaven Star Hotel" 
              className="logo-image"
              onError={(e) => {
                e.target.src = '/assets/Homepage/Home 1.jpg';
                e.target.onerror = null;
              }}
            />
          </Link>

          {/* Authentication Section - Right Side */}
          <div className="auth-section">
            {user && userType === 'admin' ? null : (
              <nav className="desktop-nav-right">
                <Link to="/restaurant" className={`nav-link ${isActive('/restaurant') ? 'active' : ''}`}> 
                  Restaurant
                </Link>
                <Link to="/facilities" className={`nav-link ${isActive('/facilities') ? 'active' : ''}`}> 
                  Facilities
                </Link>
                <Link to="/booking" className={`nav-link ${isActive('/booking') ? 'active' : ''}`}> 
                  My Bookings
                </Link>
              </nav>
            )}
            {user ? (
              <div className="user-menu">
                <span className="user-info">
                  {user.name || user.email}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="auth-dropdown" ref={dropdownRef}>
                <button 
                  className="auth-dropdown-trigger"
                  onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                >
                  <FaUser />
                  Account
                </button>
                {isAuthDropdownOpen && (
                  <div className="auth-dropdown-menu">
                    <Link 
                      to="/login" 
                      className="auth-dropdown-item"
                      onClick={() => setIsAuthDropdownOpen(false)}
                    >
                      <FaSignInAlt />
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="auth-dropdown-item"
                      onClick={() => setIsAuthDropdownOpen(false)}
                    >
                      <FaUserPlus />
                      Sign Up
                    </Link>
                    <Link 
                      to="/admin/login" 
                      className="auth-dropdown-item admin-item"
                      onClick={() => setIsAuthDropdownOpen(false)}
                    >
                      <FaUser />
                      Admin Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile Navigation */}
          <div className="mobile-nav" style={{display: isMenuOpen ? 'block' : 'none'}}>
            <div className="mobile-nav-content">
                <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/about" className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
                <Link to="/rooms" className={`mobile-nav-link ${isActive('/rooms') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Rooms
                </Link>
                <Link to="/deals" className={`mobile-nav-link ${isActive('/deals') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Deals <span className="hot-badge">Hot</span>
                </Link>
                <Link to="/gallery" className={`mobile-nav-link ${isActive('/gallery') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Gallery
                </Link>
                <Link to="/restaurant" className={`mobile-nav-link ${isActive('/restaurant') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Restaurant
                </Link>
                <Link to="/facilities" className={`mobile-nav-link ${isActive('/facilities') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Facilities
                </Link>
                <Link to="/booking" className={`mobile-nav-link ${isActive('/booking') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  My Bookings
                </Link>
                {/* Admin Panel Link for Mobile - Only visible when admin is logged in */}
                {user && userType === 'admin' && (
                  <Link to="/admin" className={`mobile-nav-link admin-panel-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    🏨 Admin Panel
                  </Link>
                )}
                
                <div className="mobile-auth">
                  {user ? (
                    <div className="mobile-user-menu">
                      <span className="mobile-user-info">
                        {user.name || user.email}
                        {userType === 'admin' && <span className="admin-badge">Admin</span>}
                      </span>
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="mobile-logout-btn">
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  ) : (
                    <div className="mobile-auth-buttons">
                      <Link to="/login" className="mobile-btn-login" onClick={() => setIsMenuOpen(false)}>
                        <FaSignInAlt /> Login
                      </Link>
                      <Link to="/signup" className="mobile-btn-signup" onClick={() => setIsMenuOpen(false)}>
                        <FaUserPlus /> Sign Up
                      </Link>
                      <Link to="/admin/login" className="mobile-btn-admin" onClick={() => setIsMenuOpen(false)}>
                        <FaUser /> Admin
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
