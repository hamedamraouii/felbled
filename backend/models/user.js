const mongoose = require('mongoose');
const { Schema } = mongoose;

const etiquetteSchema = new Schema({
  name: { type: String, required: true },
}, { _id: false });

// Media schema for handling file uploads
const mediaSchema = new Schema({
  public_id: { type: String, default: null },
  url: { type: String, required: true },
  format: { type: String, default: null }
}, { _id: false });

// Social media schema
const socialMediaSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const userSchema = new Schema({
  name: { type: String, required: true },
  
  // Media fields - support both formats
  logo_url: { type: String, default: null }, 
  logo: { type: mediaSchema, default: null }, 
  
  images_url: { type: [String], default: [] },
  images: { type: [mediaSchema], default: [] }, 
  
  video: { type: String, default: null }, 
  
  // Location fields
  location: { type: String, default: null }, 
  latitude: { type: String, default: null },
  longitude: { type: String, default: null },
  
  // Address fields - now reference ObjectIds for consistency
  gouvernorat: {
    type: Schema.Types.ObjectId,
    ref: 'Governorat',
    default: null
  },
  pays: { type: String, default: null },
  delegation: {
    type: Schema.Types.ObjectId,
    ref: 'Delegation',
    default: null
  },
  address: { type: String, default: null },
  
  // Business info
  activité: { type: String, default: null },
  
  // CHANGED: secteur is now a reference to Secteur model
  secteur: {
    type: Schema.Types.ObjectId,
    ref: 'Secteur',
    default: null
  },
  
  description: { type: String, default: null },
  telephone: { type: String, default: null },
  horaire: { type: String, default: null },
  
  // Categories - now reference ObjectIds for consistency
  category: { type: [String], default: [] }, // keep for backward compatibility
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: undefined
  }],
  subcategories: [{
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    default: undefined
  }],
  
  // Tags and social media
  etiquette: { type: [etiquetteSchema], default: [] },
  socialmedia: { type: [socialMediaSchema], default: [] }
}, {
  timestamps: true, 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual properties
userSchema.virtual('logoUrl').get(function() {
  if (this.logo && this.logo.url) return this.logo.url;
  return this.logo_url;
});

userSchema.virtual('imageUrls').get(function() {
  if (this.images && this.images.length > 0) {
    return this.images.map(img => img.url);
  }
  return this.images_url || [];
});

// Indexes
userSchema.index({ gouvernorat: 1, delegation: 1 });
userSchema.index({ activité: 1, secteur: 1 });
userSchema.index({ secteur: 1 });

module.exports = mongoose.model('User', userSchema);