const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Host",
    required: true
  },
  hostName: {
    type: String,
    required: true
  },
  carModel: {
    type: String,
    trim: true
  },
  carName: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number
  },
  color: {
    type: String,
    trim: true
  },
  licensePlate: {
    type: String,
    trim: true
  },
  vin: {
    type: String,
    trim: true
  },
  rentalPrice: {
    type: Number,
    required: true
  },
  cancellation: {
    type: String,
    default: "Yes"
  },
  minPeriod: {
    type: Number,
    default: 1
  },
  transmission: {
    type: String,
    enum: ["Manual", "Automatic"],
    default: "Manual"
  },
  fuelTypes: {
    type: String,
    trim: true
  },
  numberOfSeats: {
    type: Number
  },
  mileage: {
    type: String,
    trim: true
  },
  additionalFeatures: {
    type: String,
    trim: true
  },
  insuranceType: {
    type: String,
    trim: true
  },
  insuranceNo: {
    type: String,
    trim: true
  },
  insuranceCompany: {
    type: String,
    trim: true
  },
  ownerName: {
    type: String,
    trim: true
  },
  contactNo: {
    type: String,
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    }
  },
  photos: [{
    type: String // URLs to the stored images
  }],
  features: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalRentals: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Car", carSchema); 