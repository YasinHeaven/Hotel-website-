import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Room APIs
export const roomAPI = {
  // Get all rooms
  getAllRooms: () => api.get('/rooms'),
  
  // Get room by ID
  getRoomById: (id) => api.get(`/rooms/${id}`),
  
  // Create new room (admin only)
  createRoom: (roomData) => api.post('/rooms', roomData),
  
  // Update room (admin only)
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  
  // Delete room (admin only)
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  
  // Get available rooms for dates
  getAvailableRooms: (checkIn, checkOut) => 
    api.get(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}`),
};

// Booking APIs
export const bookingAPI = {
  // Create new booking
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  
  // Get user bookings
  getUserBookings: () => api.get('/bookings/my-bookings'),
  
  // Get all bookings (admin only)
  getAllBookings: () => api.get('/bookings'),
  
  // Update booking status (admin only)
  updateBookingStatus: (id, status) => 
    api.put(`/bookings/${id}/status`, { status }),
  
  // Cancel booking
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  
  // Get booking by ID
  getBookingById: (id) => api.get(`/bookings/${id}`),
};

// User APIs
export const userAPI = {
  // Register user
  register: (userData) => api.post('/users/register', userData),
  
  // Login user
  login: (credentials) => api.post('/users/login', credentials),
  
  // Get user profile
  getProfile: () => api.get('/users/profile'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/users/profile', userData),
  
  // Get all users (admin only)
  getAllUsers: () => api.get('/users'),
  
  // Delete user (admin only)
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Admin APIs
export const adminAPI = {
  // Admin login
  login: (credentials) => api.post('/admin/login', credentials),
  
  // Get admin profile
  getProfile: () => api.get('/admin/profile'),
  
  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
};

// Gallery APIs
export const galleryAPI = {
  // Get all gallery images
  getAllImages: () => api.get('/gallery'),
  
  // Upload new image (admin only)
  uploadImage: (formData) => 
    api.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // Delete image (admin only)
  deleteImage: (id) => api.delete(`/gallery/${id}`),
  
  // Update image (admin only)
  updateImage: (id, imageData) => api.put(`/gallery/${id}`, imageData),
};

// Auth utilities
export const authUtils = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token; // Convert to boolean
  }
};

export default api;
