const mongoose = require('mongoose');
require('dotenv').config();

const SubCategory = require('./models/SubCategory');
const Category = require('./models/category');

async function testUserCreation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/felbled');
    
    // Créer d'abord une catégorie de test si elle n'existe pas
    let category = await Category.findOne({ name: 'Santé' });
    if (!category) {
      category = new Category({ name: 'Santé', image: 'test.jpg' });
      await category.save();
      console.log('Catégorie "Santé" créée');
    }
    
    // Créer une sous-catégorie de test si elle n'existe pas
    let subcategory = await SubCategory.findOne({ name: 'Médecins' });
    if (!subcategory) {
      subcategory = new SubCategory({ 
        name: 'Médecins', 
        image: 'test.jpg', 
        category: category._id 
      });
      await subcategory.save();
      console.log('Sous-catégorie "Médecins" créée');
    }
    
    console.log('=== Test de synchronisation activité ===');
    console.log(`Sous-catégorie ID: ${subcategory._id}`);
    console.log(`Nom de la sous-catégorie: ${subcategory.name}`);
    
    // Simuler la logique de synchronisation
    const userData = {
      subcategories: [subcategory._id.toString()]
    };
    
    // Récupérer le nom de la première sous-catégorie pour remplir activité
    const firstSubcategoryId = userData.subcategories[0];
    if (mongoose.Types.ObjectId.isValid(firstSubcategoryId)) {
      const sub = await SubCategory.findById(firstSubcategoryId);
      if (sub) {
        userData.activité = sub.name;
        console.log(`✅ Activité synchronisée: ${userData.activité}`);
      }
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur:', err);
  }
}

testUserCreation();
