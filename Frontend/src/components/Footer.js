import { FaEnvelope, FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhone, FaStar, FaWhatsapp } from 'react-icons/fa';
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
              <a href="https://www.facebook.com/share/p/14GCmpnnqpU/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-link facebook"><FaFacebook /></a>
              <a href="https://www.instagram.com/yasinheavenstarhotel?igsh=YWJ4dTljcDBlcjhk" target="_blank" rel="noopener noreferrer" className="social-link instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/deals">Deals</Link></li>
              <li><Link to="/booking">My Bookings</Link></li>
              
            </ul>
          </div>


          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '8px', padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <FaMapMarkerAlt style={{ color: '#dc3545', fontSize: '1.3rem', marginRight: '12px' }} />
                <span style={{ color: '#222', fontWeight: 500 }}>Main Yasin Ghizer Gilgit Baltistan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '8px', padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <FaPhone style={{ color: '#dc3545', fontSize: '1.3rem', marginRight: '12px' }} />
                <span style={{ color: '#222', fontWeight: 500 }}>+923554240244</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '8px', padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <FaPhone style={{ color: '#dc3545', fontSize: '1.3rem', marginRight: '12px' }} />
                <span style={{ color: '#222', fontWeight: 500 }}>05814460249</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '8px', padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <FaPhone style={{ color: '#dc3545', fontSize: '1.3rem', marginRight: '12px' }} />
                <span style={{ color: '#222', fontWeight: 500 }}>03554650686</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '8px', padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <FaWhatsapp style={{ color: '#25d366', fontSize: '1.3rem', marginRight: '12px' }} />
                <span style={{ color: '#222', fontWeight: 500 }}>00971586649377</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '8px', padding: '10px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <FaEnvelope style={{ color: '#007bff', fontSize: '1.3rem', marginRight: '12px' }} />
                <span style={{ color: '#222', fontWeight: 500 }}>yasinheavenstarhotel@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Yasin Heaven Star Hotel. All rights reserved.</p>
            <div style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>
              <a href="https://www.vertexsolution.software/" target="_blank" rel="noopener noreferrer" style={{ color: '#dc3545', textDecoration: 'none' }}>
                Powered By Vertex Solution
              </a>
            </div>
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
