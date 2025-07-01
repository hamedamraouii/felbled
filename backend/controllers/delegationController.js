const Delegation = require('../models/Delegation');
const Governorat = require('../models/governorat');
const mongoose = require('mongoose');

exports.getAllDelegations = async (req, res) => {
  try {
    const delegations = await Delegation.find()
      .populate('gouvernorat', 'name')
      .select('-__v')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      count: delegations.length,
      delegations
    });
  } catch (err) {
    console.error('Erreur getAllDelegations:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des délégations',
      details: err.message 
    });
  }
};

exports.getDelegationById = async (req, res) => {
  try {
    const delegation = await Delegation.findById(req.params.id)
      .populate('gouvernorat', 'name')
      .select('-__v');
      
    if (!delegation) {
      return res.status(404).json({ 
        success: false,
        error: 'Délégation non trouvée' 
      });
    }
    
    res.json({
      success: true,
      delegation
    });
  } catch (err) {
    console.error('Erreur getDelegationById:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération de la délégation',
      details: err.message 
    });
  }
};

exports.createDelegation = async (req, res) => {
  try {
    const { name, gouvernorat } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Le nom de la délégation est requis'
      });
    }

    // Vérifier si une délégation avec le même nom existe déjà
    const existingDelegation = await Delegation.findOne({ name: name.trim() });
    if (existingDelegation) {
      return res.status(400).json({
        success: false,
        error: 'Une délégation avec ce nom existe déjà'
      });
    }

    // Vérifier que le gouvernorat existe si fourni
    if (gouvernorat) {
      const gouvernoratExists = await Governorat.findById(gouvernorat);
      if (!gouvernoratExists) {
        return res.status(400).json({
          success: false,
          error: 'Gouvernorat invalide'
        });
      }
    }

    const newDelegation = new Delegation({
      name: name.trim(),
      gouvernorat: gouvernorat || undefined
    });

    await newDelegation.save();

    // Si associée à un gouvernorat, l'ajouter à la liste des délégations du gouvernorat
    if (gouvernorat) {
      await Governorat.findByIdAndUpdate(
        gouvernorat,
        { $addToSet: { delegations: newDelegation._id } }
      );
    }

    const populatedDelegation = await Delegation.findById(newDelegation._id)
      .populate('gouvernorat', 'name');

    res.status(201).json({
      success: true,
      message: 'Délégation créée avec succès',
      delegation: populatedDelegation
    });

  } catch (err) {
    console.error('Erreur createDelegation:', err);
    res.status(400).json({ 
      success: false,
      error: 'Erreur lors de la création de la délégation',
      details: err.message 
    });
  }
};

exports.updateDelegation = async (req, res) => {
  try {
    const { name, gouvernorat } = req.body;

    const delegation = await Delegation.findById(req.params.id);
    if (!delegation) {
      return res.status(404).json({ 
        success: false,
        error: 'Délégation non trouvée' 
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Le nom de la délégation est requis'
      });
    }

    // Vérifier si une autre délégation avec le même nom existe
    const existingDelegation = await Delegation.findOne({ 
      name: name.trim(),
      _id: { $ne: req.params.id }
    });
    if (existingDelegation) {
      return res.status(400).json({
        success: false,
        error: 'Une autre délégation avec ce nom existe déjà'
      });
    }

    // Gérer le changement de gouvernorat
    const oldGouvernorat = delegation.gouvernorat;
    
    if (gouvernorat && gouvernorat !== oldGouvernorat?.toString()) {
      const gouvernoratExists = await Governorat.findById(gouvernorat);
      if (!gouvernoratExists) {
        return res.status(400).json({
          success: false,
          error: 'Gouvernorat invalide'
        });
      }
    }

    // Mettre à jour la délégation
    delegation.name = name.trim();
    delegation.gouvernorat = gouvernorat || undefined;
    await delegation.save();

    // Mettre à jour les relations avec les gouvernorats
    if (oldGouvernorat && oldGouvernorat.toString() !== gouvernorat) {
      // Retirer de l'ancien gouvernorat
      await Governorat.findByIdAndUpdate(
        oldGouvernorat,
        { $pull: { delegations: req.params.id } }
      );
    }

    if (gouvernorat && gouvernorat !== oldGouvernorat?.toString()) {
      // Ajouter au nouveau gouvernorat
      await Governorat.findByIdAndUpdate(
        gouvernorat,
        { $addToSet: { delegations: req.params.id } }
      );
    }

    const updatedDelegation = await Delegation.findById(req.params.id)
      .populate('gouvernorat', 'name');

    res.json({
      success: true,
      message: 'Délégation mise à jour avec succès',
      delegation: updatedDelegation
    });

  } catch (err) {
    console.error('Erreur updateDelegation:', err);
    res.status(400).json({ 
      success: false,
      error: 'Erreur lors de la mise à jour',
      details: err.message 
    });
  }
};

exports.deleteDelegation = async (req, res) => {
  try {
    const delegation = await Delegation.findById(req.params.id);
    if (!delegation) {
      return res.status(404).json({ 
        success: false,
        error: 'Délégation non trouvée' 
      });
    }

    // Vérifier s'il y a des utilisateurs qui utilisent cette délégation
    const User = require('../models/user');
    const usersWithThisDelegation = await User.find({ delegation: req.params.id });
    
    if (usersWithThisDelegation.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Impossible de supprimer cette délégation car ${usersWithThisDelegation.length} utilisateur(s) l'utilisent encore`
      });
    }

    // Retirer des gouvernorats
    if (delegation.gouvernorat) {
      await Governorat.findByIdAndUpdate(
        delegation.gouvernorat,
        { $pull: { delegations: req.params.id } }
      );
    }

    await Delegation.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: 'Délégation supprimée avec succès' 
    });

  } catch (err) {
    console.error('Erreur deleteDelegation:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la suppression',
      details: err.message 
    });
  }
};