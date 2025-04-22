const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',
    required: false
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
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  paymentDetails: {
    type: Object
  },
  carName: {
    type: String,
    required: true
  },
  pickupLocation: {
    type: String,
    default: 'Main Branch'
  },
  dropoffLocation: {
    type: String
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  specialRequests: {
    type: String
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'host', 'admin', null],
    default: null
  },
  cancellationReason: {
    type: String
  }
}, { timestamps: true });

// Ensure car is available for the requested dates before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Check for overlapping bookings
    const existingBooking = await mongoose.model('Booking').findOne({
      carId: this.carId,
      bookingStatus: { $in: ['confirmed', 'pending'] },
      $or: [
        // New booking starts during an existing booking
        { startDate: { $lte: this.startDate }, endDate: { $gte: this.startDate } },
        // New booking ends during an existing booking
        { startDate: { $lte: this.endDate }, endDate: { $gte: this.endDate } },
        // New booking completely encompasses an existing booking
        { startDate: { $gte: this.startDate }, endDate: { $lte: this.endDate } },
        // Existing booking completely encompasses the new booking
        { startDate: { $lte: this.startDate }, endDate: { $gte: this.endDate } }
      ]
    });

    if (existingBooking) {
      const error = new Error('Car is not available for the selected dates');
      return next(error);
    }
  }
  next();
});

// Virtual for computing the duration
bookingSchema.virtual('durationInDays').get(function() {
  return Math.ceil(
    (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
  );
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 