const Car = require('../models/Car');
const mongoose = require('mongoose');

// Get total count of cars
exports.getCarCount = async (req, res) => {
  try {
    // Check if admin - more robust check using both req.userType and req.user.role if available
    if (req.userType !== 'admin' && !(req.user && req.user.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access car count data'
      });
    }
    
    const count = await Car.countDocuments();
    
    return res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting car count:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get car count'
    });
  }
}; 

// Get all cars for admin
exports.getAllCarsForAdmin = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const filter = {};
    if (req.query.brand) filter.brand = new RegExp(req.query.brand, 'i');
    if (req.query.carName) filter.carName = new RegExp(req.query.carName, 'i');
    if (req.query.hostName) filter.hostName = new RegExp(req.query.hostName, 'i');
    if (req.query.available === 'true') filter.isAvailable = true;
    if (req.query.available === 'false') filter.isAvailable = false;
    
    // Sorting
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };
    
    // Execute query with pagination
    const cars = await Car.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
    // Get total count for pagination
    const totalCars = await Car.countDocuments(filter);
    
    return res.status(200).json({
      success: true,
      cars,
      pagination: {
        totalCars,
        totalPages: Math.ceil(totalCars / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching cars for admin:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch cars'
    });
  }
};

// Get car by ID for admin
exports.getCarByIdForAdmin = async (req, res) => {
  try {
    const carId = req.params.id;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid car ID format'
      });
    }
    
    // Find car by ID
    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      car
    });
  } catch (error) {
    console.error('Error fetching car details for admin:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch car details'
    });
  }
};

// Update car by ID for admin
exports.updateCarByAdmin = async (req, res) => {
  try {
    const carId = req.params.id;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid car ID format'
      });
    }
    
    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }
    
    // Update fields - only apply those that were provided
    const updateData = {};
    const updatableFields = [
      'carModel', 'carName', 'brand', 'year', 'color', 'licensePlate', 
      'vin', 'rentalPrice', 'cancellation', 'minPeriod', 'transmission',
      'fuelTypes', 'numberOfSeats', 'mileage', 'additionalFeatures',
      'insuranceType', 'insuranceNo', 'insuranceCompany', 'ownerName',
      'contactNo', 'isAvailable'
    ];
    
    // Apply updates for each field present in request
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Handle numeric fields - convert to numbers
        if (['year', 'rentalPrice', 'minPeriod', 'numberOfSeats'].includes(field)) {
          updateData[field] = Number(req.body[field]);
        } else {
          updateData[field] = req.body[field];
        }
      }
    });
    
    // Handle location separately if provided
    if (req.body.location) {
      let parsedLocation = req.body.location;
      
      // Parse location if it's a string
      if (typeof req.body.location === 'string') {
        try {
          parsedLocation = JSON.parse(req.body.location);
          // Ensure it has the correct structure
          if (!parsedLocation.address) {
            parsedLocation = {
              address: req.body.location,
              latitude: null,
              longitude: null
            };
          }
        } catch (error) {
          console.error('Error parsing location:', error);
          parsedLocation = {
            address: req.body.location,
            latitude: null,
            longitude: null
          };
        }
      }
      
      updateData.location = parsedLocation;
    }
    
    // Handle features separately if provided
    if (req.body.features) {
      let parsedFeatures = [];
      
      if (typeof req.body.features === 'string') {
        try {
          parsedFeatures = JSON.parse(req.body.features);
        } catch (error) {
          console.error('Error parsing features:', error);
          parsedFeatures = req.body.features
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
        }
      } else if (Array.isArray(req.body.features)) {
        parsedFeatures = req.body.features;
      }
      
      updateData.features = parsedFeatures;
    }
    
    // Perform update
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      car: updatedCar
    });
  } catch (error) {
    console.error('Error updating car by admin:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update car',
      details: error.message
    });
  }
}; 