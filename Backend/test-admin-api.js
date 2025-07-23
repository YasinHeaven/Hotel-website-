const express = require('express');
const mongoose = require('mongoose');

// Just test the API endpoint
async function testAdminAPI() {
  try {
    const response = await fetch('http://localhost:5000/api/admin/bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add a fake admin token for testing
        'Authorization': 'Bearer test-token'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Admin bookings data:', data);
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (err) {
    console.error('Request error:', err);
  }
}

testAdminAPI();
