const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Email incorrect' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = generateToken(admin._id);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};

//  AJOUTER cette fonction logout
exports.logoutAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token manquant' 
      });
    }

    // Vérifier que le token est valide
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Optionnel : Logger le logout
    console.log(`Admin ${decoded.id} s'est déconnecté à ${new Date().toISOString()}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Déconnexion réussie' 
    });
    
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      error: 'Token invalide' 
    });
  }
};

//  SUPPRIMER APRÈS PREMIER USAGE
exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    const token = generateToken(newAdmin._id);
    res.status(201).json({ message: 'Admin créé avec succès', token });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement', details: err.message });
  }
};