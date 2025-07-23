import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaStar, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="footer-logo-icon">
                <FaStar />
              </div>
              <div className="footer-logo-text">
                <h3>Yasin Heaven Star Hotel</h3>
                <p>Premium Hospitality</p>
              </div>
            </div>
            <p className="footer-description">
              Your premium destination for luxury hotel bookings worldwide. Experience comfort, elegance, and exceptional service.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link linkedin"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/deals">Deals</Link></li>
              <li><Link to="/booking">My Bookings</Link></li>
              <li><Link to="/rewards">Rewards Program</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Destinations</h4>
            <ul>
              <li><Link to="/destinations/beach">Beach Hotels</Link></li>
              <li><Link to="/destinations/city">City Hotels</Link></li>
              <li><Link to="/destinations/mountain">Mountain Resorts</Link></li>
              <li><Link to="/destinations/luxury">Luxury Hotels</Link></li>
              <li><Link to="/destinations/budget">Budget Hotels</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon location">
                  <FaMapMarkerAlt />
                </div>
                <span>Main Yasin Ghizer Gilgit Baltistan</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon phone">
                  <FaPhone />
                </div>
                <span>+923554240244</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon phone">
                  <FaPhone />
                </div>
                <span>05814460249</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon phone">
                  <FaPhone />
                </div>
                <span>03554650686</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon phone">
                  <FaWhatsapp />
                </div>
                <span>00971586649377</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon email">
                  <FaEnvelope />
                </div>
                <span>info@yasinheavenstarhotel.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Yasin Heaven Star Hotel. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
