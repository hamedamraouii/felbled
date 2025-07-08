const mongoose = require('mongoose');
const Secteur = require('./models/secteur');

// Secteur data extracted from frontend models.js
const secteursData = [
  { name: 'EVENEMENTIEL', description: 'Services et produits liés aux événements et fêtes' },
  { name: 'SHOPPING', description: 'Commerce de détail, vêtements, accessoires et produits de consommation' },
  { name: 'GROSSISTE - DEPOT', description: 'Commerce de gros et distribution' },
  { name: 'BÂTIMENT', description: 'Construction, architecture et travaux publics' },
  { name: 'MÉTIER', description: 'Artisanat et métiers manuels' },
  { name: 'MARCHÉ', description: 'Commerce alimentaire et produits de première nécessité' },
  { name: 'DROIT', description: 'Services juridiques et conseil' },
  { name: 'SÉCURITÉ', description: 'Services de sécurité et surveillance' },
  { name: 'EDUCATION', description: 'Enseignement et formation' },
  { name: 'SPORT', description: 'Activités sportives et récréatives' },
  { name: 'LOISIR', description: 'Divertissement et activités de loisir' },
  { name: 'GASTRONOMIE', description: 'Restauration et services alimentaires' },
  { name: 'SANTÉ', description: 'Services médicaux et paramédicaux' },
  { name: 'INFORMATIQUE', description: 'Technologies de l\'information et services numériques' },
  { name: 'TOURISME', description: 'Hébergement et services touristiques' }
];

async function seedSecteurs() {
  try {
    // Connect to MongoDB (you'll need to set MONGO_URI env variable)
    if (!process.env.MONGO_URI) {
      console.log('⚠️  MONGO_URI not set. Please set environment variable to run seed script.');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing secteurs
    await Secteur.deleteMany({});
    console.log('✓ Cleared existing secteurs');

    // Insert new secteurs
    const createdSecteurs = await Secteur.insertMany(secteursData);
    console.log(`✓ Created ${createdSecteurs.length} secteurs:`);
    
    createdSecteurs.forEach(secteur => {
      console.log(`  - ${secteur.name} (${secteur._id})`);
    });

    console.log('\n🎉 Secteur seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding secteurs:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed');
  }
}

// Run if this file is executed directly
if (require.main === module) {
  seedSecteurs();
}

module.exports = { seedSecteurs, secteursData };