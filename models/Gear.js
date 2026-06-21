const mongoose = require('mongoose');

const gearSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cycle', 'camera', 'cricket', 'drone', 'music', 'sports', 'others']
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'good', 'fair']
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    required: true
  },
  images: [String], 
  location: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Gear', gearSchema);