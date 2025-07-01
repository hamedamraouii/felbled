const { cloudinary } = require('../utils/cloudinary');
const Governorat = require('../models/governorat');
const Delegation = require('../models/Delegation');
const mongoose = require('mongoose');

const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'felbled/governorats',
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

// Helper pour nettoyer et valider les ObjectIds des délégations
const cleanDelegationIds = (data, fieldName) => {
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

exports.getAllGouvernorats = async (req, res) => {
  try {
    const governorats = await Governorat.find()
      .populate('delegations', 'name')
      .select('-__v');
    res.json({
      success: true,
      count: governorats.length,
      governorats
    });
  } catch (err) {
    console.error('Erreur getAllGouvernorats:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des gouvernorats',
      details: err.message 
    });
  }
};

exports.getGouvernoratById = async (req, res) => {
  try {
    const governorat = await Governorat.findById(req.params.id)
      .populate('delegations', 'name')
      .select('-__v');
    if (!governorat) {
      return res.status(404).json({ 
        success: false,
        error: 'Gouvernorat non trouvé' 
      });
    }
    res.json({
      success: true,
      governorat
    });
  } catch (err) {
    console.error('Erreur getGouvernoratById:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération du gouvernorat',
      details: err.message 
    });
  }
};

// Nouvelle méthode pour récupérer les délégations d'un gouvernorat
exports.getDelegationsByGouvernorat = async (req, res) => {
  try {
    const { gouvernoratId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(gouvernoratId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de gouvernorat invalide'
      });
    }

    const delegations = await Delegation.find({ gouvernorat: gouvernoratId })
      .select('name')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      delegations
    });
  } catch (err) {
    console.error('Erreur getDelegationsByGouvernorat:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des délégations',
      details: err.message
    });
  }
};

exports.createGouvernorat = async (req, res) => {
  try {
    console.log('Création gouvernorat - Body:', req.body);
    console.log('Création gouvernorat - Files:', req.files);

    const governoratData = { ...req.body };
    const files = req.files;

    // Nettoyage des délégations si elles sont envoyées
    console.log('Avant nettoyage - delegations:', governoratData.delegations);
    const cleanedDelegations = cleanDelegationIds(governoratData, 'delegations');
    if (cleanedDelegations) {
      governoratData.delegations = cleanedDelegations;
    } else {
      delete governoratData.delegations; // Supprimer si invalide ou vide
    }
    console.log('Après nettoyage - delegations:', governoratData.delegations);

    // Vérification que les délégations existent si elles sont fournies
    if (governoratData.delegations && governoratData.delegations.length > 0) {
      const delegationsExist = await Delegation.find({
        _id: { $in: governoratData.delegations }
      });
      
      if (delegationsExist.length !== governoratData.delegations.length) {
        return res.status(400).json({
          success: false,
          error: 'Une ou plusieurs délégations sont invalides'
        });
      }

      // Vérifier que toutes les délégations n'appartiennent pas déjà à un autre gouvernorat
      const delegationsWithGouvernorat = delegationsExist.filter(delegation => 
        delegation.gouvernorat && delegation.gouvernorat.toString() !== 'temp'
      );
      
      if (delegationsWithGouvernorat.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Certaines délégations appartiennent déjà à un autre gouvernorat'
        });
      }
    }

    // Traitement de l'image
    if (files?.image && files.image[0]) {
      console.log('Upload de l\'image...');
      const imageResult = await uploadToCloudinary(files.image[0].buffer, {
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
      });
      
      governoratData.image = {
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
        format: imageResult.format
      };
      
      // Pour la compatibilité avec le modèle existant
      governoratData.image_url = imageResult.secure_url;
      console.log('Image uploadée:', governoratData.image);
    }

    console.log('Données finales avant création:', governoratData);

    // Création du gouvernorat
    const newGouvernorat = new Governorat(governoratData);
    await newGouvernorat.save();

    // Mise à jour des délégations pour qu'elles référencent ce gouvernorat
    if (governoratData.delegations && governoratData.delegations.length > 0) {
      await Delegation.updateMany(
        { _id: { $in: governoratData.delegations } },
        { gouvernorat: newGouvernorat._id }
      );
    }

    // Récupération du gouvernorat avec les délégations peuplées
    const populatedGouvernorat = await Governorat.findById(newGouvernorat._id)
      .populate('delegations', 'name');

    console.log('Gouvernorat créé avec succès');
    res.status(201).json({
      success: true,
      message: 'Gouvernorat créé avec succès',
      governorat: populatedGouvernorat
    });

  } catch (err) {
    console.error('Erreur createGouvernorat:', err);
    
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
      error: 'Erreur lors de la création du gouvernorat',
      details: err.message 
    });
  }
};

exports.updateGouvernorat = async (req, res) => {
  try {
    console.log('Mise à jour gouvernorat - ID:', req.params.id);
    console.log('Mise à jour gouvernorat - Body:', req.body);
    console.log('Mise à jour gouvernorat - Files:', req.files);

    const governorat = await Governorat.findById(req.params.id);
    if (!governorat) {
      return res.status(404).json({ 
        success: false,
        error: 'Gouvernorat non trouvé' 
      });
    }

    const updateData = { ...req.body };
    const files = req.files;

    // Nettoyage des délégations si elles sont envoyées
    const cleanedDelegations = cleanDelegationIds(updateData, 'delegations');
    if (cleanedDelegations) {
      updateData.delegations = cleanedDelegations;
    }

    // Vérification que les nouvelles délégations existent
    if (updateData.delegations && updateData.delegations.length > 0) {
      const delegationsExist = await Delegation.find({
        _id: { $in: updateData.delegations }
      });
      
      if (delegationsExist.length !== updateData.delegations.length) {
        return res.status(400).json({
          success: false,
          error: 'Une ou plusieurs délégations sont invalides'
        });
      }

      // Vérifier que les délégations n'appartiennent pas déjà à un autre gouvernorat
      const delegationsWithOtherGouvernorat = delegationsExist.filter(delegation => 
        delegation.gouvernorat && 
        delegation.gouvernorat.toString() !== req.params.id &&
        delegation.gouvernorat.toString() !== 'temp'
      );
      
      if (delegationsWithOtherGouvernorat.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Certaines délégations appartiennent déjà à un autre gouvernorat'
        });
      }
    }

    // Gestion de l'image
    if (files?.image && files.image[0]) {
      // Suppression de l'ancienne image si elle existe
      if (governorat.image?.public_id) {
        await deleteCloudinaryMedia(governorat.image.public_id);
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

    // Récupération des anciennes délégations pour nettoyage
    const oldDelegations = await Delegation.find({ gouvernorat: req.params.id });
    const oldDelegationIds = oldDelegations.map(d => d._id.toString());

    // Mise à jour du gouvernorat
    const updatedGouvernorat = await Governorat.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('delegations', 'name')
    .select('-__v');

    // Mise à jour des références des délégations
    if (updateData.delegations) {
      // Retirer l'ancien gouvernorat des délégations qui ne sont plus associées
      const delegationsToRemove = oldDelegationIds.filter(id => 
        !updateData.delegations.includes(id)
      );
      
      if (delegationsToRemove.length > 0) {
        await Delegation.updateMany(
          { _id: { $in: delegationsToRemove } },
          { $unset: { gouvernorat: 1 } }
        );
      }

      // Assigner le gouvernorat aux nouvelles délégations
      const delegationsToAdd = updateData.delegations.filter(id => 
        !oldDelegationIds.includes(id)
      );
      
      if (delegationsToAdd.length > 0) {
        await Delegation.updateMany(
          { _id: { $in: delegationsToAdd } },
          { gouvernorat: req.params.id }
        );
      }
    }

    res.json({
      success: true,
      message: 'Gouvernorat mis à jour avec succès',
      governorat: updatedGouvernorat
    });

  } catch (err) {
    console.error('Erreur updateGouvernorat:', err);
    res.status(400).json({ 
      success: false,
      error: 'Erreur lors de la mise à jour',
      details: err.message 
    });
  }
};

exports.deleteGouvernorat = async (req, res) => {
  try {
    const governorat = await Governorat.findById(req.params.id);
    if (!governorat) {
      return res.status(404).json({ 
        success: false,
        error: 'Gouvernorat non trouvé' 
      });
    }

    // Vérifier s'il y a des utilisateurs qui utilisent ce gouvernorat
    const User = require('../models/user');
    const usersWithThisGouvernorat = await User.find({ gouvernorat: req.params.id });
    
    if (usersWithThisGouvernorat.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de supprimer ce gouvernorat car ${usersWithThisGouvernorat.length} utilisateur(s) l'utilisent encore`
      });
    }

    // Retirer la référence du gouvernorat de toutes les délégations associées
    await Delegation.updateMany(
      { gouvernorat: req.params.id },
      { $unset: { gouvernorat: 1 } }
    );

    // Suppression de l'image Cloudinary si elle existe
    if (governorat.image?.public_id) {
      await deleteCloudinaryMedia(governorat.image.public_id);
    }

    // Suppression du gouvernorat
    await Governorat.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: 'Gouvernorat et image supprimés avec succès' 
    });

  } catch (err) {
    console.error('Erreur deleteGouvernorat:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la suppression',
      details: err.message 
    });
  }
};

// Nouvelle méthode pour ajouter une délégation à un gouvernorat
exports.addDelegationToGouvernorat = async (req, res) => {
  try {
    const { gouvernoratId } = req.params;
    const { delegationId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(gouvernoratId) || !mongoose.Types.ObjectId.isValid(delegationId)) {
      return res.status(400).json({
        success: false,
        error: 'IDs invalides'
      });
    }

    const governorat = await Governorat.findById(gouvernoratId);
    const delegation = await Delegation.findById(delegationId);

    if (!governorat || !delegation) {
      return res.status(404).json({
        success: false,
        error: 'Gouvernorat ou délégation non trouvé'
      });
    }

    // Vérifier si la délégation n'appartient pas déjà à un autre gouvernorat
    if (delegation.gouvernorat && delegation.gouvernorat.toString() !== gouvernoratId) {
      return res.status(400).json({
        success: false,
        error: 'Cette délégation appartient déjà à un autre gouvernorat'
      });
    }

    // Ajouter la délégation au gouvernorat
    if (!governorat.delegations.includes(delegationId)) {
      governorat.delegations.push(delegationId);
      await governorat.save();
    }

    // Mettre à jour la référence dans la délégation
    delegation.gouvernorat = gouvernoratId;
    await delegation.save();

    const updatedGouvernorat = await Governorat.findById(gouvernoratId)
      .populate('delegations', 'name');

    res.json({
      success: true,
      message: 'Délégation ajoutée au gouvernorat avec succès',
      governorat: updatedGouvernorat
    });

  } catch (err) {
    console.error('Erreur addDelegationToGouvernorat:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'ajout de la délégation',
      details: err.message
    });
  }
};

// Nouvelle méthode pour retirer une délégation d'un gouvernorat
exports.removeDelegationFromGouvernorat = async (req, res) => {
  try {
    const { gouvernoratId, delegationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gouvernoratId) || !mongoose.Types.ObjectId.isValid(delegationId)) {
      return res.status(400).json({
        success: false,
        error: 'IDs invalides'
      });
    }

    const governorat = await Governorat.findById(gouvernoratId);
    const delegation = await Delegation.findById(delegationId);

    if (!governorat || !delegation) {
      return res.status(404).json({
        success: false,
        error: 'Gouvernorat ou délégation non trouvé'
      });
    }

    // Vérifier s'il y a des utilisateurs qui utilisent cette délégation
    const User = require('../models/user');
    const usersWithThisDelegation = await User.find({ delegation: delegationId });
    
    if (usersWithThisDelegation.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de retirer cette délégation car ${usersWithThisDelegation.length} utilisateur(s) l'utilisent encore`
      });
    }

    // Retirer la délégation du gouvernorat
    governorat.delegations = governorat.delegations.filter(id => id.toString() !== delegationId);
    await governorat.save();

    // Retirer la référence du gouvernorat dans la délégation
    delegation.gouvernorat = undefined;
    await delegation.save();

    const updatedGouvernorat = await Governorat.findById(gouvernoratId)
      .populate('delegations', 'name');

    res.json({
      success: true,
      message: 'Délégation retirée du gouvernorat avec succès',
      governorat: updatedGouvernorat
    });

  } catch (err) {
    console.error('Erreur removeDelegationFromGouvernorat:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du retrait de la délégation',
      details: err.message
    });
  }
};