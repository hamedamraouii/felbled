const mongoose = require('mongoose');

const governoratSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  image_url: { type: String }, 
  image: {
    public_id: String,
    url: String,
    format: String
  },
  delegations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delegation'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Governorat', governoratSchema);