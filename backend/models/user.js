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
  
  // Address fields - FIXED: These should reference ObjectIds or be strings
  gouvernorat: { 
    type: Schema.Types.Mixed, // Can be ObjectId or String
    default: null 
  }, 
  pays: { type: String, default: null },
  delegation: { 
    type: Schema.Types.Mixed, // Can be ObjectId or String
    default: null 
  },
  address: { type: String, default: null },
  
  // Business info
  activité: { type: String, default: null },
  secteur: { 
    type: mongoose.Schema.Types.Mixed, // Can be ObjectId or String for backward compatibility
    ref: 'Secteur',
    default: null 
  },
  description: { type: String, default: null },
  telephone: { type: String, default: null },
  horaire: { type: String, default: null },
  
  // Categories - FIXED: Make both compatible
  category: { type: [String], default: [] }, 
  categories: [{ 
    type: Schema.Types.Mixed, 
    ref: 'Category', 
    default: undefined // Changed from [] to undefined
  }], 
  subcategories: [{ 
    type: Schema.Types.Mixed, 
    ref: 'SubCategory', 
    default: undefined // Changed from [] to undefined
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

module.exports = mongoose.model('User', userSchema);