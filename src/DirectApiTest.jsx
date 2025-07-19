import React, { useEffect, useState } from 'react';

const DirectApiTest = () => {
  const [usersData, setUsersData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔧 Testing direct API call...');
    
    // Test avec URL absolue d'abord
    fetch('http://localhost:5000/api/users')
      .then(res => {
        console.log('🔧 Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('🔧 Data received:', data);
        setUsersData(data);
      })
      .catch(err => {
        console.error('🔧 Error with absolute URL:', err);
        
        // Fallback: test avec proxy
        console.log('🔧 Trying with proxy...');
        fetch('/api/users')
          .then(res => {
            console.log('🔧 Proxy response status:', res.status);
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            return res.json();
          })
          .then(data => {
            console.log('🔧 Proxy data received:', data);
            setUsersData(data);
          })
          .catch(proxyErr => {
            console.error('🔧 Error with proxy:', proxyErr);
            setError(`Absolute URL failed: ${err.message}. Proxy failed: ${proxyErr.message}`);
          });
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🔧 Test API Direct</h1>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>
          <strong>❌ Erreur:</strong> {error}
        </div>
      )}
      
      {usersData && (
        <div style={{ color: 'green', padding: '10px', backgroundColor: '#e6ffe6', borderRadius: '5px' }}>
          <strong>✅ Succès!</strong> {usersData.count} utilisateurs récupérés.
          <details style={{ marginTop: '10px' }}>
            <summary>Voir les détails</summary>
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
              {JSON.stringify(usersData, null, 2)}
            </pre>
          </details>
        </div>
      )}
      
      {!error && !usersData && (
        <div>⏳ Test en cours...</div>
      )}
    </div>
  );
};

export default DirectApiTest;
