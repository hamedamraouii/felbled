const mongoose = require('mongoose');

const SecteurSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  image_url: String, 
  image: {
    public_id: String,
    url: String,
    format: String
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Secteur', SecteurSchema);