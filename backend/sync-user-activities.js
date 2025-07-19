const mongoose = require('mongoose');
const User = require('./models/user');
const SubCategory = require('./models/SubCategory');

// Script pour synchroniser le champ activité avec les sous-catégories existantes
async function syncExistingUsers() {
  try {
    console.log('🔧 Démarrage de la synchronisation des utilisateurs existants...');
    
    // Connexion à MongoDB (utilise la même connexion que le serveur)
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/felbled');
    }
    
    // Récupérer tous les utilisateurs qui ont des subcategories mais pas d'activité
    const users = await User.find({
      $and: [
        { subcategories: { $exists: true, $ne: [] } },
        { 
          $or: [
            { activité: { $exists: false } },
            { activité: '' },
            { activité: null }
          ]
        }
      ]
    }).populate('subcategories', 'name');
    
    console.log(`📊 Trouvé ${users.length} utilisateurs à synchroniser`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      if (user.subcategories && user.subcategories.length > 0) {
        const firstSubcategory = user.subcategories[0];
        const subcategoryName = typeof firstSubcategory === 'object' ? firstSubcategory.name : firstSubcategory;
        
        if (subcategoryName) {
          console.log(`🔄 Mise à jour de ${user.nom}: activité = "${subcategoryName}"`);
          
          await User.findByIdAndUpdate(user._id, {
            activité: subcategoryName
          });
          
          updatedCount++;
        }
      }
    }
    
    console.log(`✅ Synchronisation terminée: ${updatedCount} utilisateurs mis à jour`);
    
    // Vérification
    const verificationUsers = await User.find({
      $and: [
        { subcategories: { $exists: true, $ne: [] } },
        { activité: { $exists: true, $ne: '' } }
      ]
    }).select('nom activité subcategories');
    
    console.log(`🔍 Vérification: ${verificationUsers.length} utilisateurs ont maintenant une activité synchronisée`);
    
    // Afficher quelques exemples
    console.log('\n📋 Exemples d\'utilisateurs synchronisés:');
    verificationUsers.slice(0, 5).forEach(user => {
      console.log(`  - ${user.nom}: "${user.activité}"`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

// Exécution du script
if (require.main === module) {
  syncExistingUsers();
}

module.exports = { syncExistingUsers };
