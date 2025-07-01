const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image_url: String, 
  image: {
    public_id: String,
    url: String,
    format: String
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  }]
});

module.exports = mongoose.model('Category', CategorySchema);