// Update a Secteur
exports.updateSecteur = async (req, res) => {
  try {
    const { secteurId } = req.params;
    const { name, description } = req.body;
    let updateFields = { name, description };

    // Handle image update if provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });
      updateFields.image = uploadResult.secure_url;
    }

    const updatedSecteur = await Secteur.findByIdAndUpdate(
      secteurId,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedSecteur) {
      return res.status(404).json({ success: false, error: 'Secteur not found' });
    }
    res.json({ success: true, secteur: updatedSecteur });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete a Secteur
exports.deleteSecteur = async (req, res) => {
  try {
    const { secteurId } = req.params;
    const deleted = await Secteur.findByIdAndDelete(secteurId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Secteur not found' });
    }
    res.json({ success: true, message: 'Secteur deleted' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
const Secteur = require('../models/secteur');
const Category = require('../models/category');
const SubCategory = require('../models/SubCategory');
const { cloudinary } = require('../utils/cloudinary');
const mongoose = require('mongoose');

// Upload to Cloudinary helper
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'felbled/secteurs', ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Create a Secteur with optional image upload
exports.createSecteur = async (req, res) => {
  try {
    const { name, description } = req.body;
    let imageUrl = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });
      imageUrl = uploadResult.secure_url;
    }

    const secteur = new Secteur({
      name,
      description,
      image: imageUrl || null,
      categories: []
    });

    await secteur.save();

    res.status(201).json({ success: true, secteur });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Add a Category to a Secteur
exports.addCategoryToSecteur = async (req, res) => {
  try {
    const { secteurId } = req.params;
    const { name, image } = req.body;

    // Optional: image upload for category (extend as needed)
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: 'felbled/categories',
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });
      imageUrl = uploadResult.secure_url;
    }

    // Create the category
    const category = new Category({
      name,
      image: imageUrl || null,
      subcategories: []
    });
    await category.save();

    // Add to secteur
    await Secteur.findByIdAndUpdate(secteurId, { $push: { categories: category._id } });

    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Add a SubCategory to a Category (within a Secteur)
exports.addSubCategoryToCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    // Optional: image upload for subcategory (extend as needed)
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, {
        folder: 'felbled/subcategories',
        transformation: [{ width: 300, height: 300, crop: 'limit' }]
      });
      imageUrl = uploadResult.secure_url;
    }

    // Create the subcategory
    const subcategory = new SubCategory({
      name,
      image: imageUrl || null,
      category: categoryId
    });
    await subcategory.save();

    // Add to category
    await Category.findByIdAndUpdate(categoryId, { $push: { subcategories: subcategory._id } });

    res.status(201).json({ success: true, subcategory });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get all Secteurs (with categories and subcategories)
exports.getAllSecteurs = async (req, res) => {
  try {
    const secteurs = await Secteur.find()
      .populate({
        path: 'categories',
        populate: { path: 'subcategories', select: 'name image' },
        select: 'name image subcategories'
      })
      .select('name description image categories');
    res.json({ success: true, secteurs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single Secteur (with categories and subcategories)
exports.getSecteurById = async (req, res) => {
  try {
    const { secteurId } = req.params;
    const secteur = await Secteur.findById(secteurId)
      .populate({
        path: 'categories',
        populate: { path: 'subcategories', select: 'name image' },
        select: 'name image subcategories'
      })
      .select('name description image categories');
    if (!secteur) {
      return res.status(404).json({ success: false, error: 'Secteur not found' });
    }
    res.json({ success: true, secteur });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get secteurs by gouvernorat name
exports.getSecteursByGouvernorat = async (req, res) => {
  try {
    const { gouvernorat } = req.query;
    
    // Trouver le gouvernorat par son nom
    const gov = await Governorat.findOne({ name: gouvernorat });
    if (!gov) {
      return res.status(404).json({ success: false, error: 'Gouvernorat not found' });
    }

    // Récupérer les secteurs avec le gouvernorat peuplé
    let secteurs = await Secteur.find({ gouvernorat: gov._id, isActive: true })
      .populate({
        path: 'gouvernorat',
        select: 'name image_url image'
      })
      .populate({
        path: 'categories',
        select: 'name image'
      });

    // Harmonise le champ image du gouvernorat pour le frontend
    secteurs = secteurs.map(secteur => {
      let gouv = secteur.gouvernorat || {};
      let image = null;
      if (gouv.image && typeof gouv.image === 'object' && gouv.image.url) {
        image = gouv.image.url;
      } else if (gouv.image_url) {
        image = gouv.image_url;
      } else if (typeof gouv.image === 'string') {
        image = gouv.image;
      }
      secteur.gouvernorat = {
        ...gouv.toObject?.() || gouv,
        image: image,
        name: gouv.name || secteur.gouvernorat?.name || '',
      };
      return secteur;
    });

    res.json({ success: true, secteurs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};