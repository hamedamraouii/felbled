const mongoose = require('mongoose');


const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image_url: { type: String },
  image: {
    public_id: String,
    url: String,
    format: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);