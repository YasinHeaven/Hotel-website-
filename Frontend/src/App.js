import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminProvider } from './contexts/AdminContext';
import AboutPage from './pages/AboutPage';
import AdminBookings from './pages/AdminBookings';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminReviewsPage from './pages/AdminReviewsPage';
import AdminRooms from './pages/AdminRooms';
import AdminUsers from './pages/AdminUsers';
// import BeachHotelsPage from './pages/BeachHotelsPage';
import CityHotelsPage from './pages/CityHotelsPage';
import DealsPage from './pages/DealsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import GalleryPage from './pages/GalleryPage';
import HomePage from './pages/HomePage';
import MountainResortsPage from './pages/MountainResortsPage';
import RestaurantPage from './pages/RestaurantPage';
import RoomsPage from './pages/RoomsPage';
// import RewardsPage from './pages/RewardsPage';
import UserBookingsPage from './pages/UserBookingsPage';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';

function App() {
  return (
    <AdminProvider>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/booking" element={<UserBookingsPage />} />
            <Route path="/book-room" element={<RoomsPage />} />
            {/* <Route path="/destinations/beach" element={<BeachHotelsPage />} /> */}
            <Route path="/destinations/city" element={<CityHotelsPage />} />
            <Route path="/destinations/mountain" element={<MountainResortsPage />} />
            <Route path="/restaurant" element={<RestaurantPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            {/* <Route path="/rewards" element={<RewardsPage />} /> */}
            <Route path="/gallery" element={<GalleryPage />} />
            
            {/* User Authentication Routes - Redirect to home if already logged in */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <UserLogin />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={
              <ProtectedRoute requireAuth={false}>
                <UserSignup />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={
              <ProtectedRoute requireAuth={false}>
                <AdminLogin />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAuth={true} redirectTo="/admin/login">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/rooms" element={
              <ProtectedRoute requireAuth={true} redirectTo="/admin/login">
                <AdminRooms />
              </ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <ProtectedRoute requireAuth={true} redirectTo="/admin/login">
                <AdminBookings />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAuth={true} redirectTo="/admin/login">
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/reviews" element={
              <ProtectedRoute requireAuth={true} redirectTo="/admin/login">
                <AdminReviewsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AdminProvider>
  );
}

export default App;