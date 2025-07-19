const mongoose = require('mongoose');

// Script pour tester la création d'un utilisateur avec subcategory
async function testUserCreation() {
  try {
    console.log('🧪 Test de création d\'utilisateur avec sous-catégorie...');
    
    // Données de test
    const testUserData = {
      nom: 'Test User Sync',
      gouvernorat: 'Tunis',
      delegation: 'Tunis',
      subcategories: ['686508eec58ffffdac33fe92'], // ID de "medecins"
      telephone: '12345678',
      email: 'test@example.com'
    };

    console.log('📤 Envoi des données:', testUserData);

    // Simuler l'appel API
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUserData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Utilisateur créé avec succès:');
      console.log('📋 Nom:', result.user.nom);
      console.log('🎯 Activité:', result.user.activité);
      console.log('🏷️ Subcategories:', result.user.subcategories);
      console.log('🏛️ Gouvernorat:', result.user.gouvernorat);
      
      // Vérifier que l'activité a été synchronisée
      if (result.user.activité === 'medecins') {
        console.log('🎉 SUCCÈS: Le champ activité a été automatiquement synchronisé !');
      } else {
        console.log('❌ ÉCHEC: Le champ activité n\'a pas été synchronisé correctement');
        console.log('   Attendu: "medecins"');
        console.log('   Reçu:', result.user.activité);
      }
    } else {
      console.error('❌ Erreur lors de la création:', result.error);
    }

  } catch (error) {
    console.error('❌ Erreur dans le test:', error.message);
  }
}

// Exécution du test
testUserCreation();
