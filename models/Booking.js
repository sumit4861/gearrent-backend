const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  gear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gear',
    required: true
  },
  renter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  }
}, {timestamps: true});

module.exports = mongoose.model('Booking', bookingSchema);