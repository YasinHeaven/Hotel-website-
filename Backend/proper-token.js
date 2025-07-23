// Generate a proper admin token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBob3RlbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTMwODU1MDAsImV4cCI6MTc1Mzc1NTUwMH0.cHfOJZ8BKQr5Ac1fOPJ-LQU29zGGHyZ0aDLdj0MKr-o';

// This creates a proper token using JWT_SECRET = 'your_super_secret_jwt_key_here_change_this_in_production'
// Payload: { id: 'admin-id', email: 'admin@hotel.com', role: 'admin' }
// Expires: 7 days from now

console.log('Use this token in localStorage:');
console.log(token);
