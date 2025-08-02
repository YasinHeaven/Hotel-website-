import { useEffect, useState } from 'react';

const ReviewSystemTest = () => {
  const [testResults, setTestResults] = useState({
    apiConnection: 'Testing...',
    publicReviews: 'Testing...',
    adminConnection: 'Testing...'
  });

  useEffect(() => {
    const runTests = async () => {
      // Test 1: Basic API Connection
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reviews`);
        const data = await response.json();
        
        if (data.success !== undefined) {
          setTestResults(prev => ({
            ...prev,
            apiConnection: '✅ API Connection Working',
            publicReviews: `✅ Reviews API: ${data.stats?.totalReviews || 0} reviews found`
          }));
        } else {
          setTestResults(prev => ({
            ...prev,
            apiConnection: '❌ API Connection Failed',
            publicReviews: '❌ Reviews API Failed'
          }));
        }
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          apiConnection: `❌ API Error: ${error.message}`,
          publicReviews: '❌ Reviews API Failed'
        }));
      }

      // Test 2: Admin API Connection (if token exists)
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reviews/admin`, {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setTestResults(prev => ({
              ...prev,
              adminConnection: `✅ Admin API Working: ${data.reviews?.length || 0} reviews`
            }));
          } else {
            setTestResults(prev => ({
              ...prev,
              adminConnection: `❌ Admin API Failed: ${response.status}`
            }));
          }
        } catch (error) {
          setTestResults(prev => ({
            ...prev,
            adminConnection: `❌ Admin API Error: ${error.message}`
          }));
        }
      } else {
        setTestResults(prev => ({
          ...prev,
          adminConnection: '⚠️ No admin token found (login required)'
        }));
      }
    };

    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px', borderRadius: '10px' }}>
      <h2>🔍 Review System Test Results</h2>
      <div style={{ marginBottom: '10px' }}>
        <strong>API URL:</strong> {process.env.REACT_APP_API_URL}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>API Connection:</strong> {testResults.apiConnection}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Public Reviews:</strong> {testResults.publicReviews}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Admin Connection:</strong> {testResults.adminConnection}
      </div>
    </div>
  );
};

export default ReviewSystemTest;
