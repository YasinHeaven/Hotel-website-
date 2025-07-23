import { createContext, useContext, useEffect, useState } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminInfo');
    
    if (token && admin) {
      setIsAdminLoggedIn(true);
      setAdminInfo(JSON.parse(admin));
    }
  }, []);

  const loginAdmin = (token, admin) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminInfo', JSON.stringify(admin));
    setIsAdminLoggedIn(true);
    setAdminInfo(admin);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('userType');
    setIsAdminLoggedIn(false);
    setAdminInfo(null);
  };

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn,
      adminInfo,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </AdminContext.Provider>
  );
};
