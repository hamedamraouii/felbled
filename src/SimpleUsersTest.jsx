import React, { useEffect, useState } from 'react';

const SimpleUsersTest = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🧪 Fetching users...');
    
    fetch('/api/users')
      .then(res => {
        console.log('🧪 Response received:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('🧪 Data received:', data);
        
        if (data.success && data.users) {
          console.log(`🧪 Setting ${data.users.length} users`);
          setUsers(data.users);
          
          // Log first few users for debugging
          data.users.slice(0, 3).forEach((user, index) => {
            console.log(`🧪 User ${index + 1}:`, {
              nom: user.nom,
              gouvernorat: user.gouvernorat,
              gouvernoratName: user.gouvernoratName,
              activité: user.activité,
              activity: user.activity
            });
          });
        } else {
          console.error('🧪 Unexpected data format:', data);
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error('🧪 Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>🔄 Chargement...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>🧪 Test Simple des Utilisateurs</h1>
      <p>Nombre d'utilisateurs: <strong>{users.length}</strong></p>
      
      {users.length > 0 ? (
        <div>
          <h2>Premiers utilisateurs:</h2>
          {users.slice(0, 5).map((user, index) => (
            <div key={user._id || index} style={{ 
              border: '1px solid #ccc', 
              margin: '10px 0', 
              padding: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              <div><strong>Nom:</strong> {user.nom || 'N/A'}</div>
              <div><strong>Gouvernorat:</strong> {user.gouvernoratName || user.gouvernorat || 'N/A'}</div>
              <div><strong>Activité:</strong> {user.activité || user.activity || 'N/A'}</div>
              <div><strong>Délégation:</strong> {user.delegationName || user.delegation || 'N/A'}</div>
            </div>
          ))}
          
          <h2>Gouvernorats disponibles:</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[...new Set(users.map(user => user.gouvernoratName || user.gouvernorat).filter(Boolean))].map(gouv => (
              <span key={gouv} style={{ 
                backgroundColor: '#e0e0e0', 
                padding: '5px 10px', 
                borderRadius: '5px',
                fontSize: '12px'
              }}>
                {gouv}
              </span>
            ))}
          </div>
          
          <h2>Activités disponibles:</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[...new Set(users.map(user => user.activité || user.activity).filter(Boolean))].slice(0, 20).map(act => (
              <span key={act} style={{ 
                backgroundColor: '#e0f0e0', 
                padding: '5px 10px', 
                borderRadius: '5px',
                fontSize: '12px'
              }}>
                {act}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ color: 'red' }}>❌ Aucun utilisateur trouvé</div>
      )}
    </div>
  );
};

export default SimpleUsersTest;
