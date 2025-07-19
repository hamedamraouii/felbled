const mongoose = require('mongoose');
require('dotenv').config();

const fetch = require('node-fetch');

async function testFullUserCreationFlow() {
  try {
    console.log('=== Test complet de création d\'utilisateur ===');
    
    // 1. Créer un admin s'il n'existe pas ou se connecter
    console.log('1. Tentative de connexion admin...');
    
    let adminResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'admin123'
      })
    });

    let adminResult = await adminResponse.json();
    
    if (!adminResult.success) {
      console.log('Admin n\'existe pas, création...');
      // Créer un admin
      const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: 'Admin Test',
          email: 'admin@test.com',
          password: 'admin123'
        })
      });
      
      const registerResult = await registerResponse.json();
      console.log('Résultat création admin:', registerResult);
      
      // Se connecter maintenant
      adminResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@test.com',
          password: 'admin123'
        })
      });
      
      adminResult = await adminResponse.json();
    }
    
    if (!adminResult.token) {
      console.log('❌ Impossible d\'obtenir un token admin');
      console.log('Réponse admin:', adminResult);
      return;
    }
    
    console.log('✅ Token admin obtenu');
    const authToken = adminResult.token;

    // 2. Créer un utilisateur avec la sous-catégorie
    console.log('2. Création utilisateur avec sous-catégorie...');
    
    const userData = {
      nom: 'Dr. Test Sync',
      email: 'drtest.sync@example.com',
      telephone: '12345678',
      location: 'Tunis',
      description: 'Test de synchronisation activité',
      subcategories: ['686bc346df70e8d2e7a5b118'] // ID de la sous-catégorie "Médecins"
    };

    console.log('Données utilisateur:', userData);

    const userResponse = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(userData)
    });

    const userResult = await userResponse.json();
    console.log('Réponse création utilisateur:', userResult);

    if (userResult.success && userResult.user) {
      console.log('✅ Utilisateur créé avec succès!');
      console.log(`Nom: ${userResult.user.nom}`);
      console.log(`Activité: ${userResult.user.activité}`);
      console.log(`Sous-catégories: ${JSON.stringify(userResult.user.subcategories)}`);
      
      if (userResult.user.activité === 'Médecins') {
        console.log('🎉 SUCCÈS: Synchronisation activité/sous-catégorie fonctionne parfaitement!');
      } else {
        console.log('❌ Problème de synchronisation');
        console.log('Activité attendue: Médecins');
        console.log('Activité obtenue:', userResult.user.activité);
      }
    } else {
      console.log('❌ Erreur lors de la création utilisateur');
    }

  } catch (err) {
    console.error('Erreur lors du test complet:', err);
  }
}

// Attendre que le serveur soit prêt
setTimeout(testFullUserCreationFlow, 1000);
