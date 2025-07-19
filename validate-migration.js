#!/usr/bin/env node

/**
 * Script de validation post-migration
 * Vérifie que les APIs fonctionnent correctement
 */

const http = require('http');

const API_BASE = 'http://localhost:5000';

const endpoints = [
  { name: 'Categories', path: '/api/categories' },
  { name: 'Gouvernorats', path: '/api/gouvernorats' },
  { name: 'Users', path: '/api/users' }
];

async function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${API_BASE}${endpoint.path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            name: endpoint.name,
            status: res.statusCode,
            success: json.success,
            count: json.count,
            hasData: !!(json.data || json.users || json.categories || json.governorats)
          });
        } catch (e) {
          reject({ name: endpoint.name, error: 'Invalid JSON' });
        }
      });
    });
    
    req.on('error', (err) => reject({ name: endpoint.name, error: err.message }));
    req.setTimeout(5000, () => reject({ name: endpoint.name, error: 'Timeout' }));
  });
}

async function validateMigration() {
  console.log('🔍 Validation de la migration Frontend → Backend API');
  console.log('================================================\n');

  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const result = await testEndpoint(endpoint);
      results.push(result);
      
      const status = result.status === 200 ? '✅' : '❌';
      const success = result.success ? '✅' : '❌';
      const hasData = result.hasData ? '✅' : '❌';
      
      console.log(`  ${status} Status: ${result.status}`);
      console.log(`  ${success} Success: ${result.success}`);
      console.log(`  ${hasData} Has Data: ${result.hasData} (${result.count} items)`);
      console.log('');
    } catch (error) {
      console.log(`  ❌ Error: ${error.error}\n`);
      results.push({ name: endpoint.name, error: error.error });
    }
  }

  // Résumé
  const successCount = results.filter(r => !r.error && r.status === 200 && r.success && r.hasData).length;
  console.log('📊 RÉSULTATS');
  console.log('============');
  console.log(`✅ APIs fonctionnelles: ${successCount}/${endpoints.length}`);
  
  if (successCount === endpoints.length) {
    console.log('🎉 Migration réussie ! Toutes les APIs fonctionnent correctement.');
    console.log('🚀 Le frontend peut maintenant consommer les données du backend.');
  } else {
    console.log('⚠️  Certaines APIs ont des problèmes. Vérifiez que le backend est démarré.');
  }
}

// Exécution
if (require.main === module) {
  validateMigration().catch(console.error);
}

module.exports = { validateMigration, testEndpoint };
