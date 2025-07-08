const User = require('../models/user');
const Governorat = require('../models/governorat');
const Delegation = require('../models/Delegation');
const Category = require('../models/category');
const SubCategory = require('../models/SubCategory');
const Secteur = require('../models/secteur');
const { cloudinary } = require('../utils/cloudinary');
const mongoose = require('mongoose');

// Helper to upload a file to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'felbled/users',
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

// Helper for cleaning and validating ObjectIds (array)
const cleanObjectIds = (data, fieldName) => {
  if (!data[fieldName]) return null;
  let values = data[fieldName];

  // Parse if it's a JSON string
  if (typeof values === 'string') {
    try {
      // Try to parse as JSON first
      values = JSON.parse(values);
    } catch (e) {
      // If JSON parse fails, try manual cleaning
      const cleaned = values.replace(/[\[\]"'`]/g, '').trim();
      if (cleaned.includes(',')) {
        values = cleaned.split(',').map(v => v.trim());
      } else {
        values = cleaned ? [cleaned] : [];
      }
    }
  }
  
  if (!Array.isArray(values)) values = [values];
  
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

// Helper for cleaning and validating single ObjectId
const cleanSingleObjectId = (data, fieldName) => {
  if (!data[fieldName]) return null;
  let value = data[fieldName];
  if (typeof value === 'string') {
    const cleaned = value.replace(/[\[\]"'`]/g, '').trim();
    if (cleaned.match(/^[0-9a-fA-F]{24}$/)) {
      return cleaned;
    }
  }
  if (mongoose.Types.ObjectId.isValid(value)) {
    return value.toString();
  }
  return null;
};

// Helper to delete Cloudinary media
const deleteCloudinaryMedia = async (public_id, resource_type = 'image') => {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id, { resource_type });
    console.log(`Média supprimé: ${public_id}`);
  } catch (err) {
    console.error('Erreur suppression Cloudinary:', err);
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    console.log('=== CREATE USER DEBUG ===');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const userData = { ...req.body };
    const files = req.files;

    // **CRITICAL FIX: Parse JSON fields BEFORE any processing**
    console.log('=== PARSING JSON FIELDS ===');
    
    // Parse socialmedia
    if (userData.socialmedia) {
      console.log('Raw socialmedia:', userData.socialmedia, typeof userData.socialmedia);
      if (typeof userData.socialmedia === 'string') {
        try {
          userData.socialmedia = JSON.parse(userData.socialmedia);
          console.log('Parsed socialmedia successfully:', userData.socialmedia);
        } catch (parseError) {
          console.error('Failed to parse socialmedia:', parseError);
          delete userData.socialmedia;
        }
      }
    }
    
    // Parse etiquette
    if (userData.etiquette) {
      console.log('Raw etiquette:', userData.etiquette, typeof userData.etiquette);
      if (typeof userData.etiquette === 'string') {
        try {
          userData.etiquette = JSON.parse(userData.etiquette);
          console.log('Parsed etiquette successfully:', userData.etiquette);
        } catch (parseError) {
          console.error('Failed to parse etiquette:', parseError);
          delete userData.etiquette;
        }
      }
    }

    // Parse categories
    if (userData.categories) {
      console.log('Raw categories:', userData.categories, typeof userData.categories);
      if (typeof userData.categories === 'string') {
        try {
          userData.categories = JSON.parse(userData.categories);
          console.log('Parsed categories successfully:', userData.categories);
        } catch (parseError) {
          console.error('Failed to parse categories:', parseError);
          delete userData.categories;
        }
      }
    }

    // Parse subcategories
    if (userData.subcategories) {
      console.log('Raw subcategories:', userData.subcategories, typeof userData.subcategories);
      if (typeof userData.subcategories === 'string') {
        try {
          userData.subcategories = JSON.parse(userData.subcategories);
          console.log('Parsed subcategories successfully:', userData.subcategories);
        } catch (parseError) {
          console.error('Failed to parse subcategories:', parseError);
          delete userData.subcategories;
        }
      }
    }

    console.log('=== AFTER JSON PARSING ===');
    console.log('Final userData before validation:', userData);

    // Clean data for references (only for ObjectIds)
    if (userData.categories && Array.isArray(userData.categories)) {
      const cleanedCategories = cleanObjectIds(userData, 'categories');
      if (cleanedCategories) {
        userData.categories = cleanedCategories;
      } else {
        delete userData.categories;
      }
    }

    if (userData.subcategories && Array.isArray(userData.subcategories)) {
      const cleanedSubCategories = cleanObjectIds(userData, 'subcategories');
      if (cleanedSubCategories) {
        userData.subcategories = cleanedSubCategories;
      } else {
        delete userData.subcategories;
      }
    }

    const cleanedGouvernorat = cleanSingleObjectId(userData, 'gouvernorat');
    if (cleanedGouvernorat) userData.gouvernorat = cleanedGouvernorat;
    else delete userData.gouvernorat;

    const cleanedDelegation = cleanSingleObjectId(userData, 'delegation');
    if (cleanedDelegation) userData.delegation = cleanedDelegation;
    else delete userData.delegation;

    const cleanedSecteur = cleanSingleObjectId(userData, 'secteur');
    if (cleanedSecteur) userData.secteur = cleanedSecteur;
    else delete userData.secteur;

    // Validate references existence (only if they are ObjectIds)
    if (userData.gouvernorat && mongoose.Types.ObjectId.isValid(userData.gouvernorat)) {
      const gouvernoratExists = await Governorat.findById(userData.gouvernorat);
      if (!gouvernoratExists) {
        return res.status(400).json({
          success: false,
          error: 'Gouvernorat invalide'
        });
      }
    }

    if (userData.delegation && mongoose.Types.ObjectId.isValid(userData.delegation)) {
      const delegationExists = await Delegation.findById(userData.delegation);
      if (!delegationExists) {
        return res.status(400).json({
          success: false,
          error: 'Délégation invalide'
        });
      }
      if (userData.gouvernorat && delegationExists.gouvernorat.toString() !== userData.gouvernorat) {
        return res.status(400).json({
          success: false,
          error: 'La délégation ne correspond pas au gouvernorat sélectionné'
        });
      }
    }

    if (userData.secteur && mongoose.Types.ObjectId.isValid(userData.secteur)) {
      const secteurExists = await Secteur.findById(userData.secteur);
      if (!secteurExists) {
        return res.status(400).json({
          success: false,
          error: 'Secteur invalide'
        });
      }
    }

    if (userData.categories && userData.categories.length > 0) {
      const categoriesExist = await Category.find({
        _id: { $in: userData.categories }
      });
      if (categoriesExist.length !== userData.categories.length) {
        return res.status(400).json({
          success: false,
          error: 'Une ou plusieurs catégories sont invalides'
        });
      }
    }

    if (userData.subcategories && userData.subcategories.length > 0) {
      const subcategoriesExist = await SubCategory.find({
        _id: { $in: userData.subcategories }
      }).populate('category');
      if (subcategoriesExist.length !== userData.subcategories.length) {
        return res.status(400).json({
          success: false,
          error: 'Une ou plusieurs sous-catégories sont invalides'
        });
      }
      if (userData.categories && userData.categories.length > 0) {
        const invalidSubcategories = subcategoriesExist.filter(sub =>
          !userData.categories.includes(sub.category._id.toString())
        );
        if (invalidSubcategories.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'Certaines sous-catégories ne correspondent pas aux catégories sélectionnées'
          });
        }
      }
    }

    // Handle file uploads
    if (files?.logo && files.logo[0]) {
      const logoResult = await uploadToCloudinary(files.logo[0].buffer, {
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });
      userData.logo = {
        public_id: logoResult.public_id,
        url: logoResult.secure_url,
        format: logoResult.format
      };
      userData.logo_url = logoResult.secure_url; // For backward compatibility
    }

    if (files?.images && files.images.length > 0) {
      const imagePromises = files.images.map(image =>
        uploadToCloudinary(image.buffer, {
          transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        })
      );
      const imageResults = await Promise.all(imagePromises);
      userData.images = imageResults.map(result => ({
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format
      }));
      userData.images_url = imageResults.map(result => result.secure_url); // For backward compatibility
    }

    if (files?.video && files.video[0]) {
      const videoResult = await uploadToCloudinary(files.video[0].buffer, {
        resource_type: 'video',
        folder: 'felbled/videos'
      });
      userData.video = videoResult.secure_url; // Store as string URL
    }

    console.log('Final userData before creating user:', userData);

    const newUser = new User(userData);
    await newUser.save();

    const populatedUser = await User.findById(newUser._id)
      .populate('gouvernorat', 'name')
      .populate('delegation', 'name')
      .populate('secteur', 'name image')
      .populate('categories', 'name image')
      .populate('subcategories', 'name image');

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: populatedUser
    });

  } catch (err) {
    console.error('Erreur createUser:', err);
    
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
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Erreur de format de données',
        details: `${err.path}: ${err.message}`
      });
    }
    
    res.status(400).json({
      success: false,
      error: 'Erreur lors de la création de l\'utilisateur',
      details: err.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    console.log('=== UPDATE USER DEBUG ===');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    const updateData = { ...req.body };
    const files = req.files;

    // **CRITICAL FIX: Parse JSON fields BEFORE any processing**
    console.log('=== PARSING JSON FIELDS FOR UPDATE ===');
    
    // Parse socialmedia
    if (updateData.socialmedia) {
      console.log('Raw socialmedia:', updateData.socialmedia, typeof updateData.socialmedia);
      if (typeof updateData.socialmedia === 'string') {
        try {
          updateData.socialmedia = JSON.parse(updateData.socialmedia);
          console.log('Parsed socialmedia successfully:', updateData.socialmedia);
        } catch (parseError) {
          console.error('Failed to parse socialmedia:', parseError);
          delete updateData.socialmedia;
        }
      }
    }
    
    // Parse etiquette
    if (updateData.etiquette) {
      console.log('Raw etiquette:', updateData.etiquette, typeof updateData.etiquette);
      if (typeof updateData.etiquette === 'string') {
        try {
          updateData.etiquette = JSON.parse(updateData.etiquette);
          console.log('Parsed etiquette successfully:', updateData.etiquette);
        } catch (parseError) {
          console.error('Failed to parse etiquette:', parseError);
          delete updateData.etiquette;
        }
      }
    }

    // Parse categories
    if (updateData.categories) {
      console.log('Raw categories:', updateData.categories, typeof updateData.categories);
      if (typeof updateData.categories === 'string') {
        try {
          updateData.categories = JSON.parse(updateData.categories);
          console.log('Parsed categories successfully:', updateData.categories);
        } catch (parseError) {
          console.error('Failed to parse categories:', parseError);
          delete updateData.categories;
        }
      }
    }

    // Parse subcategories
    if (updateData.subcategories) {
      console.log('Raw subcategories:', updateData.subcategories, typeof updateData.subcategories);
      if (typeof updateData.subcategories === 'string') {
        try {
          updateData.subcategories = JSON.parse(updateData.subcategories);
          console.log('Parsed subcategories successfully:', updateData.subcategories);
        } catch (parseError) {
          console.error('Failed to parse subcategories:', parseError);
          delete updateData.subcategories;
        }
      }
    }

    console.log('=== AFTER JSON PARSING FOR UPDATE ===');
    console.log('Final updateData before validation:', updateData);

    // Clean and validate references (same logic as create)
    if (updateData.categories && Array.isArray(updateData.categories)) {
      const cleanedCategories = cleanObjectIds(updateData, 'categories');
      if (cleanedCategories) updateData.categories = cleanedCategories;
    }

    if (updateData.subcategories && Array.isArray(updateData.subcategories)) {
      const cleanedSubCategories = cleanObjectIds(updateData, 'subcategories');
      if (cleanedSubCategories) updateData.subcategories = cleanedSubCategories;
    }

    const cleanedGouvernorat = cleanSingleObjectId(updateData, 'gouvernorat');
    if (cleanedGouvernorat) updateData.gouvernorat = cleanedGouvernorat;

    const cleanedDelegation = cleanSingleObjectId(updateData, 'delegation');
    if (cleanedDelegation) updateData.delegation = cleanedDelegation;

    const cleanedSecteur = cleanSingleObjectId(updateData, 'secteur');
    if (cleanedSecteur) updateData.secteur = cleanedSecteur;
    else if (updateData.hasOwnProperty('secteur')) delete updateData.secteur;

    // Same validation logic as create...
    if (updateData.gouvernorat && updateData.gouvernorat !== user.gouvernorat?.toString()) {
      const gouvernoratExists = await Governorat.findById(updateData.gouvernorat);
      if (!gouvernoratExists) {
        return res.status(400).json({
          success: false,
          error: 'Gouvernorat invalide'
        });
      }
    }

    if (updateData.secteur && updateData.secteur !== user.secteur?.toString()) {
      const secteurExists = await Secteur.findById(updateData.secteur);
      if (!secteurExists) {
        return res.status(400).json({
          success: false,
          error: 'Secteur invalide'
        });
      }
    }

    // Handle file uploads
    if (files?.logo && files.logo[0]) {
      if (user.logo?.public_id) await deleteCloudinaryMedia(user.logo.public_id);
      const logoResult = await uploadToCloudinary(files.logo[0].buffer, {
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });
      updateData.logo = {
        public_id: logoResult.public_id,
        url: logoResult.secure_url,
        format: logoResult.format
      };
      updateData.logo_url = logoResult.secure_url;
    }

    if (files?.images && files.images.length > 0) {
      if (user.images?.length > 0) {
        await Promise.all(
          user.images.map(img => deleteCloudinaryMedia(img.public_id))
        );
      }
      const imagePromises = files.images.map(image =>
        uploadToCloudinary(image.buffer, {
          transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        })
      );
      const imageResults = await Promise.all(imagePromises);
      updateData.images = imageResults.map(result => ({
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format
      }));
      updateData.images_url = imageResults.map(result => result.secure_url);
    }

    if (files?.video && files.video[0]) {
      // If there's an old video, try to delete it
      if (user.video && typeof user.video === 'object' && user.video.public_id) {
        await deleteCloudinaryMedia(user.video.public_id, 'video');
      }
      const videoResult = await uploadToCloudinary(files.video[0].buffer, {
        resource_type: 'video',
        folder: 'felbled/videos'
      });
      updateData.video = videoResult.secure_url; // Store as string
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('gouvernorat', 'name')
      .populate('delegation', 'name')
      .populate('secteur', 'name image')
      .populate('categories', 'name image')
      .populate('subcategories', 'name image')
      .select('-__v');

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser
    });

  } catch (err) {
    console.error('Erreur updateUser:', err);
    res.status(400).json({
      success: false,
      error: 'Erreur lors de la mise à jour',
      details: err.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    
    const deletePromises = [];
    if (user.logo?.public_id) deletePromises.push(deleteCloudinaryMedia(user.logo.public_id));
    if (user.images?.length > 0) {
      user.images.forEach(img => {
        if (img.public_id) deletePromises.push(deleteCloudinaryMedia(img.public_id));
      });
    }
    // Handle video deletion - check if it's an object with public_id
    if (user.video && typeof user.video === 'object' && user.video.public_id) {
      deletePromises.push(deleteCloudinaryMedia(user.video.public_id, 'video'));
    }
    
    await Promise.all(deletePromises);
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Utilisateur et médias supprimés avec succès'
    });
  } catch (err) {
    console.error('Erreur deleteUser:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression',
      details: err.message
    });
  }
};

// Get delegations by governorate
exports.getDelegationsByGouvernorat = async (req, res) => {
  try {
    const { gouvernoratId } = req.params;
    const delegations = await Delegation.find({ gouvernorat: gouvernoratId })
      .select('name')
      .sort({ name: 1 });
    res.json({ success: true, delegations });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des délégations',
      details: err.message
    });
  }
};

// Get subcategories by category
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await SubCategory.find({ category: categoryId })
      .select('name image')
      .sort({ name: 1 });
    res.json({ success: true, subcategories });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des sous-catégories',
      details: err.message
    });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('subcategories', 'name image')
      .select('name image subcategories');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des catégories',
      details: err.message
    });
  }
};

// Get all users
// Dans votre fonction getAllUsers, assurez-vous d'avoir ceci :

exports.getAllUsers = async (req, res) => {
  try {
    console.log('Fetching users with populated data...');
    
    const users = await User.find()
      .populate('gouvernorat', 'name') // IMPORTANT: Populate avec le nom
      .populate('delegation', 'name')  // IMPORTANT: Populate avec le nom
      .populate('secteur', 'name image')
      .populate('categories', 'name image')
      .populate('subcategories', 'name image')
      .select('-__v');
    
    console.log('Sample user data:', users[0]); // Debug premier utilisateur
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    console.error('Erreur getAllUsers:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des utilisateurs',
      details: err.message
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('gouvernorat', 'name')
      .populate('delegation', 'name')
      .populate('secteur', 'name image')
      .populate('categories', 'name image')
      .populate('subcategories', 'name image')
      .select('-__v');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('Erreur getUserById:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'utilisateur',
      details: err.message
    });
  }
};

// Get all governorats
exports.getGovernorats = async (req, res) => {
  try {
    const governorats = await Governorat.find()
      .populate('delegations', 'name')
      .select('name image_url image delegations');
    res.json({ success: true, governorats });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des gouvernorats',
      details: err.message
    });
  }
};

// Get all secteurs
exports.getSecteurs = async (req, res) => {
  try {
    const secteurs = await Secteur.find()
      .populate('categories', 'name image subcategories')
      .select('name description image')
      .sort({ name: 1 });
    res.json({ success: true, secteurs });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des secteurs',
      details: err.message
    });
  }
};

// Get secteur by ID
exports.getSecteurById = async (req, res) => {
  try {
    const { secteurId } = req.params;
    const secteur = await Secteur.findById(secteurId)
      .populate({
        path: 'categories',
        select: 'name image subcategories',
        populate: {
          path: 'subcategories',
          select: 'name image'
        }
      });
    
    if (!secteur) {
      return res.status(404).json({
        success: false,
        error: 'Secteur non trouvé'
      });
    }
    
    res.json({ success: true, secteur });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du secteur',
      details: err.message
    });
  }
};

// Get categories by secteur
exports.getCategoriesBySecteur = async (req, res) => {
  try {
    const { secteurId } = req.params;
    const secteur = await Secteur.findById(secteurId)
      .populate({
        path: 'categories',
        select: 'name image subcategories',
        populate: {
          path: 'subcategories',
          select: 'name image'
        }
      });
    
    if (!secteur) {
      return res.status(404).json({
        success: false,
        error: 'Secteur non trouvé'
      });
    }
    
    res.json({ 
      success: true, 
      categories: secteur.categories,
      secteur: { name: secteur.name, _id: secteur._id }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des catégories du secteur',
      details: err.message
    });
  }
};