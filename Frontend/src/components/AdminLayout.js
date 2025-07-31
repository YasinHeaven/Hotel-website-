import { useEffect, useState } from 'react';
import { FaBed, FaCalendarCheck, FaSignOutAlt, FaTachometerAlt, FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // ...existing code...
  return (
    <div className={`admin-layout${sidebarOpen ? '' : ' sidebar-closed'}`}> 
      {/* Sidebar toggle button for all devices */}
      <button
        className="admin-sidebar-toggle"
        style={{
          position: 'fixed',
          top: 18,
          left: sidebarOpen ? 238 : 18,
          zIndex: 10001,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'left 0.3s',
          display: 'block',
        }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Hide admin sidebar" : "Show admin sidebar"}
      >
        <span style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>{sidebarOpen ? '\u2715' : '\u2630'}</span>
      </button>
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <h2>🏨 Hotel Admin</h2>
          {/* Close button for mobile */}
          <button
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#dc2626',
              zIndex: 10002,
              display: 'none',
            }}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin sidebar"
          >
            &times;
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/bookings" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <FaCalendarCheck />
            <span>Bookings</span>
          </Link>
          <Link to="/admin/rooms" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <FaBed />
            <span>Rooms</span>
          </Link>
          <Link to="/admin/users" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <FaUsers />
            <span>Users</span>
          </Link>
          {/* Removed Gallery and Settings options as requested */}
        </nav>
        <div className="sidebar-footer">
          {adminInfo && (
            <button className="nav-item" onClick={() => { setSidebarOpen(false); handleLogout(); }} style={{ color: '#dc2626', fontWeight: 600 }}>
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
      {/* Main Content */}
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 