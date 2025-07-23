import { useEffect, useState } from 'react';
import { FaBed, FaCalendarCheck, FaCog, FaImages, FaSignOutAlt, FaTachometerAlt, FaUser, FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    const admin = localStorage.getItem('adminInfo');
    if (admin) {
      setAdminInfo(JSON.parse(admin));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('userType');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>🏨 Hotel Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/bookings" className="nav-item">
            <FaCalendarCheck />
            <span>Bookings</span>
          </Link>
          <Link to="/admin/rooms" className="nav-item">
            <FaBed />
            <span>Rooms</span>
          </Link>
          <Link to="/admin/users" className="nav-item">
            <FaUsers />
            <span>Users</span>
          </Link>
          <Link to="/admin/gallery" className="nav-item">
            <FaImages />
            <span>Gallery</span>
          </Link>
          <Link to="/admin/settings" className="nav-item">
            <FaCog />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          {adminInfo && (
            <div className="admin-profile">
              <div className="admin-avatar">
                <FaUser />
              </div>
              <div className="admin-details">
                <span className="admin-name">{adminInfo.name || 'Admin'}</span>
                <span className="admin-email">{adminInfo.email}</span>
                <span className="admin-role">Hotel Administrator</span>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-title">
            <h1>Admin Panel</h1>
            <p>Yasin Heaven Star Hotel Management</p>
          </div>
          <div className="header-actions">
            <div className="admin-info">
              <FaUser style={{ marginRight: '8px' }} />
              <span>Welcome, {adminInfo?.name || 'Admin'}</span>
            </div>
          </div>
        </header>
        
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 