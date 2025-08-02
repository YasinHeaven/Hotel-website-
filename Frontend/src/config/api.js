// API Configuration
const API_CONFIG = {
    // Base URL for API requests
    BASE_URL: process.env.REACT_APP_API_URL || 'https://hotel-website-production-672b.up.railway.app',

    // Timeout for requests
    TIMEOUT: 10000,

    // Default headers
    HEADERS: {
        'Content-Type': 'application/json',
    }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint = '') => {
    const baseUrl = API_CONFIG.BASE_URL;
    return endpoint ? `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}` : baseUrl;
};

// Helper function for fetch requests with proper headers
export const apiRequest = async (endpoint, options = {}) => {
    const url = getApiUrl(endpoint);
    // Always use adminToken for admin endpoints
    const token = localStorage.getItem('adminToken');

    const defaultOptions = {
        headers: {
            ...API_CONFIG.HEADERS,
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, finalOptions);
        // If unauthorized, clear admin token and redirect
        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');
            localStorage.removeItem('userType');
            window.location.href = '/admin/login';
        }
        return response;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

export default API_CONFIG;