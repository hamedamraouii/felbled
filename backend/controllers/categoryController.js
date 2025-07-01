const { cloudinary } = require('../utils/cloudinary');
const Category = require('../models/category');
const SubCategory = require('../models/SubCategory');
const mongoose = require('mongoose');

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'felbled/categories',
        ...options
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const deleteCloudinaryMedia = async (public_id, resource_type = 'image') => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id, { resource_type });
    console.log(`Média supprimé: ${public_id}`);
  } catch (err) {
    console.error('Erreur suppression Cloudinary:', err);
  }
};

// Helper pour nettoyer et valider les ObjectIds des sous-catégories
const cleanSubCategoryIds = (data, fieldName) => {
  if (!data[fieldName]) return null;
  
  let values = data[fieldName];
  
  // Si c'est une chaîne, essayer de la parser
  if (typeof values === 'string') {
    try {
      // Essayer de parser comme JSON d'abord
      values = JSON.parse(values);
    } catch (e) {
      // Si ce n'est pas du JSON, traiter comme chaîne séparée par des virgules
      const cleaned = values.replace(/[\[\]"'`]/g, '').trim();
      if (cleaned.includes(',')) {
        values = cleaned.split(',').map(v => v.trim());
      } else {
        values = cleaned ? [cleaned] : [];
      }
    }
  }
  
  // Assurer que c'est un tableau
  if (!Array.isArray(values)) {
    values = [values];
  }
  
  // Filtrer et valider les ObjectIds
  const validIds = values
    .map(id => {
      if (typeof id === 'string') {
        const cleaned = id.replace(/[\[\]"'`]/g, '').trim();
        return cleaned.match(/^[0-9a-fA-F]{24}$/) ? cleaned : null;
      }
      if (mongoose.Types.ObjectId.isValid(id)) {
        return id.toString();
      }
      return null;
    })
    .filter(Boolean);
    
  return validIds.length > 0 ? validIds : null;
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('subcategories', 'name image')
      .select('-__v');
    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (err) {
    console.error('Erreur getAllCategories:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des catégories',
      details: err.message 
    });
  }
};

exports.getCategorieById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('subcategories', 'name image')
      .select('-__v');
    if (!category) {
      return res.status(404).json({ 
        success: false,
        error: 'Catégorie non trouvée' 
      });
    }
    res.json({
      success: true,
      category
    });
  } catch (err) {
    console.error('Erreur getCategorieById:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération de la catégorie',
      details: err.message 
    });
  }
};

// Nouvelle méthode pour récupérer les sous-catégories d'une catégorie
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de catégorie invalide'
      });
    }

    const subcategories = await SubCategory.find({ category: categoryId })
      .select('name image')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      subcategories
    });
  } catch (err) {
    console.error('Erreur getSubCategoriesByCategory:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des sous-catégories',
      details: err.message
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    console.log('Création catégorie - Body:', req.body);
    console.log('Création catégorie - Files:', req.files);

    const categoryData = { ...req.body };
    const files = req.files;

    // Nettoyage des sous-catégories si elles sont envoyées
    console.log('Avant nettoyage - subcategories:', categoryData.subcategories);
    const cleanedSubCategories = cleanSubCategoryIds(categoryData, 'subcategories');
    if (cleanedSubCategories) {
      categoryData.subcategories = cleanedSubCategories;
    } else {
      delete categoryData.subcategories; // Supprimer si invalide ou vide
    }
    console.log('Après nettoyage - subcategories:', categoryData.subcategories);

    // Vérification que les sous-catégories existent si elles sont fournies
    if (categoryData.subcategories && categoryData.subcategories.length > 0) {
      const subcategoriesExist = await SubCategory.find({
        _id: { $in: categoryData.subcategories }
      });
      
      if (subcategoriesExist.length !== categoryData.subcategories.length) {
        return res.status(400).json({
          success: false,
          error: 'Une ou plusieurs sous-catégories sont invalides'
        });
      }

      // Vérifier que toutes les sous-catégories n'appartiennent pas déjà à une autre catégorie
      const subcategoriesWithCategory = subcategoriesExist.filter(subcategory => 
        subcategory.category && subcategory.category.toString() !== 'temp'
      );
      
      if (subcategoriesWithCategory.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Certaines sous-catégories appartiennent déjà à une autre catégorie'
        });
      }
    }

    // Traitement de l'image
    if (files?.image && files.image[0]) {
      console.log('Upload de l\'image...');
      const imageResult = await uploadToCloudinary(files.image[0].buffer, {
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
      });
      
      categoryData.image = {
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
        format: imageResult.format
      };
      
      // Pour la compatibilité avec le modèle existant
      categoryData.image_url = imageResult.secure_url;
      console.log('Image uploadée:', categoryData.image);
    }

    console.log('Données finales avant création:', categoryData);

    // Création de la catégorie
    const newCategory = new Category(categoryData);
    await newCategory.save();

    // Mise à jour des sous-catégories pour qu'elles référencent cette catégorie
    if (categoryData.subcategories && categoryData.subcategories.length > 0) {
      await SubCategory.updateMany(
        { _id: { $in: categoryData.subcategories } },
        { category: newCategory._id }
      );
    }

    // Récupération de la catégorie avec les sous-catégories peuplées
    const populatedCategory = await Category.findById(newCategory._id)
      .populate('subcategories', 'name image');

    console.log('Catégorie créée avec succès');
    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      category: populatedCategory
    });

  } catch (err) {
    console.error('Erreur createCategory:', err);
    
    // Gestion spécifique des erreurs
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => ({
        field: error.path,
        message: error.message,
        value: error.value
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Erreur de validation',
        details: errors
      });
    }
    
    res.status(400).json({ 
      success: false,
      error: 'Erreur lors de la création de la catégorie',
      details: err.message 
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    console.log('Mise à jour catégorie - ID:', req.params.id);
    console.log('Mise à jour catégorie - Body:', req.body);
    console.log('Mise à jour catégorie - Files:', req.files);

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ 
        success: false,
        error: 'Catégorie non trouvée' 
      });
    }

    const updateData = { ...req.body };
    const files = req.files;

    // Nettoyage des sous-catégories si elles sont envoyées
    const cleanedSubCategories = cleanSubCategoryIds(updateData, 'subcategories');
    if (cleanedSubCategories) {
      updateData.subcategories = cleanedSubCategories;
    }

    // Vérification que les nouvelles sous-catégories existent
    if (updateData.subcategories && updateData.subcategories.length > 0) {
      const subcategoriesExist = await SubCategory.find({
        _id: { $in: updateData.subcategories }
      });
      
      if (subcategoriesExist.length !== updateData.subcategories.length) {
        return res.status(400).json({
          success: false,
          error: 'Une ou plusieurs sous-catégories sont invalides'
        });
      }

      // Vérifier que les sous-catégories n'appartiennent pas déjà à une autre catégorie
      const subcategoriesWithOtherCategory = subcategoriesExist.filter(subcategory => 
        subcategory.category && 
        subcategory.category.toString() !== req.params.id &&
        subcategory.category.toString() !== 'temp'
      );
      
      if (subcategoriesWithOtherCategory.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Certaines sous-catégories appartiennent déjà à une autre catégorie'
        });
      }
    }

    // Gestion de l'image
    if (files?.image && files.image[0]) {
      // Suppression de l'ancienne image si elle existe
      if (category.image?.public_id) {
        await deleteCloudinaryMedia(category.image.public_id);
      }
      
      const imageResult = await uploadToCloudinary(files.image[0].buffer, {
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
      });
      
      updateData.image = {
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
        format: imageResult.format
      };
      
      // Pour la compatibilité avec le modèle existant
      updateData.image_url = imageResult.secure_url;
    }

    // Récupération des anciennes sous-catégories pour nettoyage
    const oldSubCategories = await SubCategory.find({ category: req.params.id });
    const oldSubCategoryIds = oldSubCategories.map(sc => sc._id.toString());

    // Mise à jour de la catégorie
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('subcategories', 'name image')
    .select('-__v');

    // Mise à jour des références des sous-catégories
    if (updateData.subcategories) {
      // Retirer l'ancienne catégorie des sous-catégories qui ne sont plus associées
      const subcategoriesToRemove = oldSubCategoryIds.filter(id => 
        !updateData.subcategories.includes(id)
      );
      
      if (subcategoriesToRemove.length > 0) {
        await SubCategory.updateMany(
          { _id: { $in: subcategoriesToRemove } },
          { $unset: { category: 1 } }
        );
      }

      // Assigner la catégorie aux nouvelles sous-catégories
      const subcategoriesToAdd = updateData.subcategories.filter(id => 
        !oldSubCategoryIds.includes(id)
      );
      
      if (subcategoriesToAdd.length > 0) {
        await SubCategory.updateMany(
          { _id: { $in: subcategoriesToAdd } },
          { category: req.params.id }
        );
      }
    }

    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      category: updatedCategory
    });

  } catch (err) {
    console.error('Erreur updateCategory:', err);
    res.status(400).json({ 
      success: false,
      error: 'Erreur lors de la mise à jour',
      details: err.message 
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ 
        success: false,
        error: 'Catégorie non trouvée' 
      });
    }

    // Vérifier s'il y a des utilisateurs qui utilisent cette catégorie
    const User = require('../models/user');
    const usersWithThisCategory = await User.find({ categories: req.params.id });
    
    if (usersWithThisCategory.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de supprimer cette catégorie car ${usersWithThisCategory.length} utilisateur(s) l'utilisent encore`
      });
    }

    // Retirer la référence de la catégorie de toutes les sous-catégories associées
    await SubCategory.updateMany(
      { category: req.params.id },
      { $unset: { category: 1 } }
    );

    // Suppression de l'image Cloudinary si elle existe
    if (category.image?.public_id) {
      await deleteCloudinaryMedia(category.image.public_id);
    }

    // Suppression de la catégorie
    await Category.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: 'Catégorie et image supprimées avec succès' 
    });

  } catch (err) {
    console.error('Erreur deleteCategory:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la suppression',
      details: err.message 
    });
  }
};

// Nouvelle méthode pour ajouter une sous-catégorie à une catégorie
exports.addSubCategoryToCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { subcategoryId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res.status(400).json({
        success: false,
        error: 'IDs invalides'
      });
    }

    const category = await Category.findById(categoryId);
    const subcategory = await SubCategory.findById(subcategoryId);

    if (!category || !subcategory) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie ou sous-catégorie non trouvée'
      });
    }

    // Vérifier si la sous-catégorie n'appartient pas déjà à une autre catégorie
    if (subcategory.category && subcategory.category.toString() !== categoryId) {
      return res.status(400).json({
        success: false,
        error: 'Cette sous-catégorie appartient déjà à une autre catégorie'
      });
    }

    // Ajouter la sous-catégorie à la catégorie
    if (!category.subcategories.includes(subcategoryId)) {
      category.subcategories.push(subcategoryId);
      await category.save();
    }

    // Mettre à jour la référence dans la sous-catégorie
    subcategory.category = categoryId;
    await subcategory.save();

    const updatedCategory = await Category.findById(categoryId)
      .populate('subcategories', 'name image');

    res.json({
      success: true,
      message: 'Sous-catégorie ajoutée à la catégorie avec succès',
      category: updatedCategory
    });

  } catch (err) {
    console.error('Erreur addSubCategoryToCategory:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'ajout de la sous-catégorie',
      details: err.message
    });
  }
};

// Nouvelle méthode pour retirer une sous-catégorie d'une catégorie
exports.removeSubCategoryFromCategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res.status(400).json({
        success: false,
        error: 'IDs invalides'
      });
    }

    const category = await Category.findById(categoryId);
    const subcategory = await SubCategory.findById(subcategoryId);

    if (!category || !subcategory) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie ou sous-catégorie non trouvée'
      });
    }

    // Vérifier s'il y a des utilisateurs qui utilisent cette sous-catégorie
    const User = require('../models/user');
    const usersWithThisSubCategory = await User.find({ subcategories: subcategoryId });
    
    if (usersWithThisSubCategory.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de retirer cette sous-catégorie car ${usersWithThisSubCategory.length} utilisateur(s) l'utilisent encore`
      });
    }

    // Retirer la sous-catégorie de la catégorie
    category.subcategories = category.subcategories.filter(id => id.toString() !== subcategoryId);
    await category.save();

    // Retirer la référence de la catégorie dans la sous-catégorie
    subcategory.category = undefined;
    await subcategory.save();

    const updatedCategory = await Category.findById(categoryId)
      .populate('subcategories', 'name image');

    res.json({
      success: true,
      message: 'Sous-catégorie retirée de la catégorie avec succès',
      category: updatedCategory
    });

  } catch (err) {
    console.error('Erreur removeSubCategoryFromCategory:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du retrait de la sous-catégorie',
      details: err.message
    });
  }
};