const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  image_url: String, 
  image: {
    public_id: String,
    url: String,
    format: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);