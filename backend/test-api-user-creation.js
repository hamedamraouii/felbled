const mongoose = require('mongoose');
require('dotenv').config();

const fetch = require('node-fetch');

async function testUserCreationAPI() {
  try {
    // Données pour créer un utilisateur avec une sous-catégorie
    const userData = {
      nom: 'Dr. Test',
      email: 'drtest@example.com',
      telephone: '12345678',
      location: 'Tunis',
      description: 'Médecin généraliste',
      subcategories: ['686bc346df70e8d2e7a5b118'] // ID de la sous-catégorie "Médecins" créée
    };

    console.log('=== Test création utilisateur via API ===');
    console.log('Données envoyées:', userData);

    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    console.log('Réponse de l\'API:', result);

    if (result.success && result.user) {
      console.log('✅ Utilisateur créé avec succès!');
      console.log(`Nom: ${result.user.nom}`);
      console.log(`Activité: ${result.user.activité}`);
      console.log(`Sous-catégories: ${JSON.stringify(result.user.subcategories)}`);
      
      if (result.user.activité === 'Médecins') {
        console.log('🎉 Synchronisation activité/sous-catégorie réussie!');
      } else {
        console.log('❌ Problème de synchronisation');
      }
    } else {
      console.log('❌ Erreur lors de la création');
    }

  } catch (err) {
    console.error('Erreur lors du test API:', err);
  }
}

// Attendre que le serveur soit prêt
setTimeout(testUserCreationAPI, 2000);
