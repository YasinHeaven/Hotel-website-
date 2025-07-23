import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaPhone, FaStar } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <nav className={`nav nav-left ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/rooms" 
              className={`nav-link ${isActive('/rooms') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Rooms
            </Link>
            <Link 
              to="/deals" 
              className={`nav-link ${isActive('/deals') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Deals
              <span className="hot-badge">Hot</span>
            </Link>
          </nav>

          <Link to="/" className="logo">
            <div className="logo-icon">
              <img src="/assets/logo.jpg" alt="Yasin Heaven Star Hotel Logo" className="logo-image" />
            </div>
            <div className="logo-text">
              <h2>Yasin Heaven Star Hotel</h2>
              <p>Premium Hospitality</p>
            </div>
          </Link>
          
          <nav className={`nav nav-right ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/restaurant" 
              className={`nav-link ${isActive('/restaurant') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Restaurant
            </Link>
            <Link 
              to="/facilities" 
              className={`nav-link ${isActive('/facilities') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Facilities
            </Link>
            <Link 
              to="/booking" 
              className={`nav-link ${isActive('/booking') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Bookings
            </Link>
            <div className="phone-number">
              <FaPhone />
              <span>+923554240244</span>
            </div>
            <button className="btn btn-primary">
              <FaUser />
              Sign In
            </button>
          </nav>
          
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Mobile Navigation - shows all items */}
          <nav className={`nav nav-mobile ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/rooms" 
              className={`nav-link ${isActive('/rooms') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Rooms
            </Link>
            <Link 
              to="/deals" 
              className={`nav-link ${isActive('/deals') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Deals
              <span className="hot-badge">Hot</span>
            </Link>
            <Link 
              to="/restaurant" 
              className={`nav-link ${isActive('/restaurant') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Restaurant
            </Link>
            <Link 
              to="/facilities" 
              className={`nav-link ${isActive('/facilities') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Facilities
            </Link>
            <Link 
              to="/booking" 
              className={`nav-link ${isActive('/booking') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Bookings
            </Link>
            <div className="phone-number">
              <FaPhone />
              <span>+923554240244</span>
            </div>
            <button className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
              <FaUser />
              Sign In
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
