const mongoose = require('mongoose');

const governoratSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image_url: String, // pour l'affichage rapide
  image: {
    public_id: String,
    url: String,
    format: String
  },
  delegations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delegation'
  }]
});

module.exports = mongoose.model('Governorat', governoratSchema);