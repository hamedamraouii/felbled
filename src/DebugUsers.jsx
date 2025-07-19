import React, { useEffect, useState } from 'react';

const DebugUsers = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 Starting debug fetch...');
    
    fetch('/api/users')
      .then(res => {
        console.log('🔍 Response status:', res.status);
        console.log('🔍 Response headers:', res.headers);
        return res.json();
      })
      .then(data => {
        console.log('🔍 Raw API response:', data);
        console.log('🔍 Data type:', typeof data);
        console.log('🔍 Data.success:', data.success);
        console.log('🔍 Data.users:', data.users);
        console.log('🔍 Data.users type:', typeof data.users);
        console.log('🔍 Data.users length:', data.users?.length);
        setData(data);
      })
      .catch(err => {
        console.error('🔍 Error:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', fontSize: '14px' }}>
      <h2>🔍 Debug Users API</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Success:</strong> {data.success ? '✅' : '❌'}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Count:</strong> {data.count}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Users Array:</strong> {data.users ? `Array with ${data.users.length} items` : 'No users array'}
          </div>
          
          {data.users && data.users.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>First User Sample:</h3>
              <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
                {JSON.stringify(data.users[0], null, 2)}
              </pre>
            </div>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <h3>Full Response:</h3>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', fontSize: '12px', maxHeight: '300px', overflow: 'auto' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugUsers;
