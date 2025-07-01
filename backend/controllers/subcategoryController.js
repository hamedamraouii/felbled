const { cloudinary } = require('../utils/cloudinary');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/category');
const mongoose = require('mongoose');

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'felbled/subcategories',
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

exports.getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find()
      .populate('category', 'name image')
      .select('-__v')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: subcategories.length,
      subcategories
    });
  } catch (err) {
    console.error('Erreur getAllSubCategories:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des sous-catégories',
      details: err.message 
    });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id)
      .populate('category', 'name image')
      .select('-__v');
      
    if (!subcategory) {
      return res.status(404).json({ 
        success: false,
        error: 'Sous-catégorie non trouvée' 
      });
    }
    
    res.json({
      success: true,
      subcategory
    });
  } catch (err) {
    console.error('Erreur getSubCategoryById:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération de la sous-catégorie',
      details: err.message 
    });
  }
};

exports.createSubCategory = async (req, res) => {
  try {
    console.log('Création sous-catégorie - Body:', req.body);
    console.log('Création sous-catégorie - Files:', req.files);

    const subcategoryData = { ...req.body };
    const files = req.files;

    if (!subcategoryData.name) {
      return res.status(400).json({
        success: false,
        error: 'Le nom de la sous-catégorie est requis'
      });
    }

    // Vérifier si une sous-catégorie avec le même nom existe déjà
    const existingSubCategory = await SubCategory.findOne({ name: subcategoryData.name.trim() });
    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        error: 'Une sous-catégorie avec ce nom existe déjà'
      });
    }

    // Vérifier que la catégorie existe si fournie
    if (subcategoryData.category) {
      const categoryExists = await Category.findById(subcategoryData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error: 'Catégorie invalide'
        });
      }

      // Vérifier que la catégorie n'est pas déjà assignée à une autre sous-catégorie de manière exclusive
      // (Cette vérification dépend de votre logique métier)
    }

    // Nettoyer les données
    subcategoryData.name = subcategoryData.name.trim();

    // Traitement de l'image
    if (files?.image && files.image[0]) {
      console.log('Upload de l\'image...');
      const imageResult = await uploadToCloudinary(files.image[0].buffer, {
        transformation: [{ width: 400, height: 300, crop: 'limit' }]
      });
      
      subcategoryData.image = {
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
        format: imageResult.format
      };
      
      // Pour la compatibilité avec le modèle existant
      subcategoryData.image_url = imageResult.secure_url;
      console.log('Image uploadée:', subcategoryData.image);
    }

    console.log('Données finales avant création:', subcategoryData);

    // Création de la sous-catégorie
    const newSubCategory = new SubCategory(subcategoryData);
    await newSubCategory.save();

    // Si associée à une catégorie, l'ajouter à la liste des sous-catégories de la catégorie
    if (subcategoryData.category) {
      await Category.findByIdAndUpdate(
        subcategoryData.category,
        { $addToSet: { subcategories: newSubCategory._id } }
      );
    }

    // Récupération de la sous-catégorie avec la catégorie peuplée
    const populatedSubCategory = await SubCategory.findById(newSubCategory._id)
      .populate('category', 'name image');

    console.log('Sous-catégorie créée avec succès');
    res.status(201).json({
      success: true,
      message: 'Sous-catégorie créée avec succès',
      subcategory: populatedSubCategory
    });

  } catch (err) {
    console.error('Erreur createSubCategory:', err);
    
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
      error: 'Erreur lors de la création de la sous-catégorie',
      details: err.message 
    });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    console.log('Mise à jour sous-catégorie - ID:', req.params.id);
    console.log('Mise à jour sous-catégorie - Body:', req.body);
    console.log('Mise à jour sous-catégorie - Files:', req.files);

    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ 
        success: false,
        error: 'Sous-catégorie non trouvée' 
      });
    }

    const updateData = { ...req.body };
    const files = req.files;

    if (!updateData.name) {
      return res.status(400).json({
        success: false,
        error: 'Le nom de la sous-catégorie est requis'
      });
    }

    // Vérifier si une autre sous-catégorie avec le même nom existe
    const existingSubCategory = await SubCategory.findOne({ 
      name: updateData.name.trim(),
      _id: { $ne: req.params.id }
    });
    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        error: 'Une autre sous-catégorie avec ce nom existe déjà'
      });
    }

    // Gérer le changement de catégorie
    const oldCategory = subcategory.category;
    
    if (updateData.category && updateData.category !== oldCategory?.toString()) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          error: 'Catégorie invalide'
        });
      }
    }

    // Nettoyer les données
    updateData.name = updateData.name.trim();

    // Gestion de l'image
    if (files?.image && files.image[0]) {
      // Suppression de l'ancienne image si elle existe
      if (subcategory.image?.public_id) {
        await deleteCloudinaryMedia(subcategory.image.public_id);
      }
      
      const imageResult = await uploadToCloudinary(files.image[0].buffer, {
        transformation: [{ width: 400, height: 300, crop: 'limit' }]
      });
      
      updateData.image = {
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
        format: imageResult.format
      };
      
      // Pour la compatibilité avec le modèle existant
      updateData.image_url = imageResult.secure_url;
    }

    // Mise à jour de la sous-catégorie
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('category', 'name image')
    .select('-__v');

    // Mise à jour des relations avec les catégories
    if (oldCategory && oldCategory.toString() !== updateData.category) {
      // Retirer de l'ancienne catégorie
      await Category.findByIdAndUpdate(
        oldCategory,
        { $pull: { subcategories: req.params.id } }
      );
    }

    if (updateData.category && updateData.category !== oldCategory?.toString()) {
      // Ajouter à la nouvelle catégorie
      await Category.findByIdAndUpdate(
        updateData.category,
        { $addToSet: { subcategories: req.params.id } }
      );
    }

    res.json({
      success: true,
      message: 'Sous-catégorie mise à jour avec succès',
      subcategory: updatedSubCategory
    });

  } catch (err) {
    console.error('Erreur updateSubCategory:', err);
    res.status(400).json({ 
      success: false,
      error: 'Erreur lors de la mise à jour',
      details: err.message 
    });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ 
        success: false,
        error: 'Sous-catégorie non trouvée' 
      });
    }

    // Vérifier s'il y a des utilisateurs qui utilisent cette sous-catégorie
    const User = require('../models/user');
    const usersWithThisSubCategory = await User.find({ subcategories: req.params.id });
    
    if (usersWithThisSubCategory.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de supprimer cette sous-catégorie car ${usersWithThisSubCategory.length} utilisateur(s) l'utilisent encore`
      });
    }

    // Retirer la référence de la sous-catégorie de toutes les catégories associées
    if (subcategory.category) {
      await Category.findByIdAndUpdate(
        subcategory.category,
        { $pull: { subcategories: req.params.id } }
      );
    }

    // Suppression de l'image Cloudinary si elle existe
    if (subcategory.image?.public_id) {
      await deleteCloudinaryMedia(subcategory.image.public_id);
    }

    // Suppression de la sous-catégorie
    await SubCategory.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: 'Sous-catégorie et image supprimées avec succès' 
    });

  } catch (err) {
    console.error('Erreur deleteSubCategory:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la suppression',
      details: err.message 
    });
  }
};

// Nouvelle méthode pour associer une sous-catégorie à une catégorie
exports.assignToCategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const { categoryId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(subcategoryId) || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        error: 'IDs invalides'
      });
    }

    const subcategory = await SubCategory.findById(subcategoryId);
    const category = await Category.findById(categoryId);

    if (!subcategory || !category) {
      return res.status(404).json({
        success: false,
        error: 'Sous-catégorie ou catégorie non trouvée'
      });
    }

    // Vérifier si la sous-catégorie n'appartient pas déjà à une autre catégorie
    if (subcategory.category && subcategory.category.toString() !== categoryId) {
      return res.status(400).json({
        success: false,
        error: 'Cette sous-catégorie appartient déjà à une autre catégorie'
      });
    }

    // Assigner la sous-catégorie à la catégorie
    subcategory.category = categoryId;
    await subcategory.save();

    // Ajouter la sous-catégorie à la liste des sous-catégories de la catégorie
    if (!category.subcategories.includes(subcategoryId)) {
      category.subcategories.push(subcategoryId);
      await category.save();
    }

    const updatedSubCategory = await SubCategory.findById(subcategoryId)
      .populate('category', 'name image');

    res.json({
      success: true,
      message: 'Sous-catégorie assignée à la catégorie avec succès',
      subcategory: updatedSubCategory
    });

  } catch (err) {
    console.error('Erreur assignToCategory:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'assignation',
      details: err.message
    });
  }
};

// Nouvelle méthode pour désassocier une sous-catégorie d'une catégorie
exports.unassignFromCategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de sous-catégorie invalide'
      });
    }

    const subcategory = await SubCategory.findById(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        error: 'Sous-catégorie non trouvée'
      });
    }

    // Vérifier s'il y a des utilisateurs qui utilisent cette sous-catégorie
    const User = require('../models/user');
    const usersWithThisSubCategory = await User.find({ subcategories: subcategoryId });
    
    if (usersWithThisSubCategory.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de désassigner cette sous-catégorie car ${usersWithThisSubCategory.length} utilisateur(s) l'utilisent encore`
      });
    }

    const oldCategoryId = subcategory.category;

    // Désassigner la sous-catégorie
    subcategory.category = undefined;
    await subcategory.save();

    // Retirer la sous-catégorie de l'ancienne catégorie
    if (oldCategoryId) {
      await Category.findByIdAndUpdate(
        oldCategoryId,
        { $pull: { subcategories: subcategoryId } }
      );
    }

    const updatedSubCategory = await SubCategory.findById(subcategoryId)
      .populate('category', 'name image');

    res.json({
      success: true,
      message: 'Sous-catégorie désassignée avec succès',
      subcategory: updatedSubCategory
    });

  } catch (err) {
    console.error('Erreur unassignFromCategory:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la désassignation',
      details: err.message
    });
  }
};