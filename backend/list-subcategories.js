const mongoose = require('mongoose');
require('dotenv').config();

const SubCategory = require('./models/SubCategory');

async function listSubcategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/felbled');
    const subcategories = await SubCategory.find({}).limit(10);
    console.log('=== Sous-catégories disponibles ===');
    subcategories.forEach(sub => {
      console.log(`ID: ${sub._id}, Nom: ${sub.name}`);
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur:', err);
  }
}

listSubcategories();
