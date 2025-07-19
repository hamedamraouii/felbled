const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Category = require('./models/category');
const SubCategory = require('./models/SubCategory');

// 1. Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/felbled_db', { useNewUrlParser: true, useUnifiedTopology: true });

// 2. Read the JSON file
const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/Categories.json'), 'utf-8'));

async function createSubCategories(subs, parentCategoryId, parentSubCategoryId = null) {
  let subCategoryIds = [];
  for (const sub of subs) {
    if (!sub.name) continue;
    const subCat = new SubCategory({
      name: sub.name,
      image_url: sub.image,
      category: parentCategoryId,
      parent: parentSubCategoryId
    });
    await subCat.save();
    subCategoryIds.push(subCat._id);

    // Collect nested subcategory ObjectIds as well
    if (sub.subcategories && Array.isArray(sub.subcategories)) {
      const nestedIds = await createSubCategories(sub.subcategories, parentCategoryId, subCat._id);
      subCategoryIds = subCategoryIds.concat(nestedIds);
    }
  }
  return subCategoryIds;
}

// 4. Main import function
async function importCategories() {
  for (const key in categoriesData) {
    const cat = categoriesData[key];
    if (!cat.category) continue;
    const categoryDoc = new Category({
      name: cat.category,
      image_url: cat.image
    });
    await categoryDoc.save();

    // Create subcategories
    let subCategoryIds = [];
    if (cat.subcategories && Array.isArray(cat.subcategories)) {
      subCategoryIds = await createSubCategories(cat.subcategories, categoryDoc._id);
    }

    // Update category with subcategories
    categoryDoc.subcategories = subCategoryIds;
    await categoryDoc.save();

    console.log(`Imported category: ${cat.category}`);
  }
  mongoose.disconnect();
}

importCategories().catch(err => {
  console.error(err);
  mongoose.disconnect();
});