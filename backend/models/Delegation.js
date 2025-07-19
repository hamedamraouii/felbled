const mongoose = require('mongoose');


const delegationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  gouvernorat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Governorat',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Delegation', delegationSchema);