const mongoose = require('mongoose');
const { Schema } = mongoose;

const secteurSchema = new Schema({
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
  image: { 
    type: String, 
    default: null 
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  gouvernorat: {
    type: Schema.Types.ObjectId,
    ref: 'Gouvernorat',
    required: false,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better performance

secteurSchema.index({ isActive: 1 });

module.exports = mongoose.model('Secteur', secteurSchema);