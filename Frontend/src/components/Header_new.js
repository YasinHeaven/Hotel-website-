import { useEffect, useState } from 'react';
import { FaBars, FaSignInAlt, FaSignOutAlt, FaTimes, FaUser, FaUserPlus } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authUtils } from '../services/api';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = authUtils.getToken();
    const savedUserType = localStorage.getItem('userType');
    
    if (token && savedUserType) {
      setUserType(savedUserType);
      if (savedUserType === 'user') {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          setUser(JSON.parse(userInfo));
        }
      } else if (savedUserType === 'admin') {
        const adminInfo = localStorage.getItem('adminInfo');
        if (adminInfo) {
          setUser(JSON.parse(adminInfo));
        }
      }
    }
  }, [location]);

  const handleLogout = () => {
    authUtils.removeToken();
    localStorage.removeItem('userInfo');
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
    navigate('/');
    alert('Logged out successfully!');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo Section */}
          <Link to="/" className="logo">
            <img src="/assets/logo.jpg" alt="Yasin Heaven Star Hotel" className="logo-image" />
            <div className="logo-text">
              <span className="logo-title">Yasin Heaven Star Hotel</span>
              <span className="logo-subtitle">Premium Hospitality</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
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

          {/* Authentication Section */}
          <div className="auth-section">
            {user ? (
              <div className="user-menu">
                <span className="user-info">
                  {user.name || user.email}
                  {userType === 'admin' && <span className="admin-badge">Admin</span>}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">
                  <FaSignInAlt />
                  Login
                </Link>
                <Link to="/signup" className="btn-signup">
                  <FaUserPlus />
                  Sign Up
                </Link>
                <Link to="/admin/login" className="btn-admin">
                  <FaUser />
                  Admin
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="mobile-nav">
              <div className="mobile-nav-content">
                <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  Home
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
