const express = require("express");
const router = express.Router();
const Car = require("../models/Car");
const { auth } = require("../middleware/auth");
const { hostAuth } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Configure multer for multiple file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/cars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and JPG are allowed."));
    }
  },
});

// Handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File size exceeds 5MB limit",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: "Too many files or incorrect field name",
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }
  next(err);
};

// Add new car
router.post(
  "/add",
  auth,
  (req, res, next) => {
    upload.array("photos", 5)(req, res, function (err) {
      if (err) {
        return handleMulterError(err, req, res, next);
      }

      // Continue with the request
      next();
    });
  },
  async (req, res) => {
    try {
      // Log the entire request body for debugging
      console.log("Request body keys:", Object.keys(req.body));
      console.log("Raw hostId value in request:", req.body.hostId);
      console.log("Raw hostName value in request:", req.body.hostName);

      // Get all form data from request body
      const {
        carModel,
        carName,
        brand,
        year,
        color,
        licensePlate,
        vin,
        rentalPrice,
        cancellation,
        minPeriod,
        transmission,
        fuelTypes,
        numberOfSeats,
        mileage,
        additionalFeatures,
        insuranceType,
        insuranceNo,
        insuranceCompany,
        ownerName,
        contactNo,
        location,
        features,
      } = req.body;

      // Extract host information directly from req.body
      const formHostId = req.body.hostId;
      const formHostName = req.body.hostName;

      // Get host information from auth middleware
      console.log(
        "Host info from auth middleware:",
        req.host
          ? {
              id: req.host._id,
              name: req.host.name,
            }
          : "No host in middleware"
      );

      console.log("Host info from form data:", {
        hostId: formHostId,
        hostName: formHostName,
      });

      // Use middleware host info if available, otherwise try form data
      const hostId = req.host?._id || formHostId;
      const hostName = req.host?.name || formHostName;

      // Validate host information
      if (!hostId || !hostName) {
        return res.status(400).json({
          success: false,
          error: "Host information required",
          details: "Both hostId and hostName are required to add a car",
        });
      }

      // Get uploaded photos
      const photos = req.files
        ? req.files.map((file) => `/uploads/cars/${file.filename}`)
        : [];

      // Parse features if provided as a string
      let parsedFeatures = [];
      if (features) {
        if (typeof features === "string") {
          try {
            parsedFeatures = JSON.parse(features);
          } catch (error) {
            console.error("Error parsing features:", error);
            parsedFeatures = features
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);
          }
        } else if (Array.isArray(features)) {
          parsedFeatures = features;
        }
      }

      // Parse location if it's a string
      let parsedLocation = location;
      if (typeof location === "string") {
        try {
          parsedLocation = JSON.parse(location);
          // Ensure it has the correct structure
          if (!parsedLocation.address) {
            parsedLocation = {
              address: location,
              latitude: null,
              longitude: null,
            };
          }
        } catch (error) {
          console.error("Error parsing location:", error);
          parsedLocation = {
            address: location,
            latitude: null,
            longitude: null,
          };
        }
      } else if (!location || typeof location !== "object") {
        // Provide default if missing or wrong type
        parsedLocation = {
          address: "Not specified",
          latitude: null,
          longitude: null,
        };
      }

      // Create new car
      const newCar = new Car({
        hostId,
        hostName,
        carModel,
        carName,
        brand,
        year: year ? Number(year) : undefined,
        color,
        licensePlate,
        vin,
        rentalPrice: Number(rentalPrice),
        cancellation,
        minPeriod: minPeriod ? Number(minPeriod) : 1,
        transmission,
        fuelTypes,
        numberOfSeats: numberOfSeats ? Number(numberOfSeats) : undefined,
        mileage,
        additionalFeatures,
        insuranceType,
        insuranceNo,
        insuranceCompany,
        ownerName,
        contactNo,
        location: parsedLocation,
        photos,
        features: parsedFeatures,
      });

      await newCar.save();

      res.status(201).json({
        success: true,
        message: "Car added successfully",
        car: newCar,
      });
    } catch (error) {
      console.error("Error adding car:", error);

      // Enhanced error handling for validation errors
      if (error.name === "ValidationError") {
        // MongoDB validation error handling
        const validationErrors = Object.values(error.errors)
          .map((err) => `${err.path}: ${err.message}`)
          .join(", ");

        console.error("Validation Errors:", validationErrors);

        return res.status(400).json({
          success: false,
          error: "Invalid car data",
          details: validationErrors,
        });
      }

      res.status(500).json({
        success: false,
        error: "Failed to add car",
        details: error.message,
      });
    }
  }
);

// Get all cars for a host
router.get("/host-cars", hostAuth, async (req, res) => {
  try {
    // Log authentication information
    console.log("Host-cars request received");
    console.log("Raw token:", req.token);
    console.log("Auth middleware info:", {
      userType: req.userType,
      hostInfo: req.host
        ? {
            id: req.host._id,
            name: req.host.name,
            email: req.host.email,
          }
        : "No host information",
      token: req.token ? req.token.substring(0, 15) + "..." : "No token",
    });

    // Check if host information is available
    if (!req.host || !req.host._id) {
      console.error("No host information available in request");
      return res.status(401).json({
        success: false,
        error: "Host authentication required",
      });
    }

    console.log("Searching for cars with hostId:", req.host._id);

    const cars = await Car.find({ hostId: req.host._id });
    console.log(`Found ${cars.length} cars for host ${req.host._id}`);

    res.json({
      success: true,
      cars,
    });
  } catch (error) {
    console.error("Error in host-cars route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cars",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Update car availability (PATCH method)
router.patch("/:carId/availability", hostAuth, async (req, res) => {
  try {
    const { carId } = req.params;
    const { isAvailable } = req.body;

    if (isAvailable === undefined) {
      return res.status(400).json({
        success: false,
        error: "isAvailable field is required",
      });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        error: "Car not found",
      });
    }

    // Verify the car belongs to this host
    if (car.hostId.toString() !== req.host._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to update this car",
      });
    }

    car.isAvailable = isAvailable;
    await car.save();

    res.json({
      success: true,
      message: `Car is now ${isAvailable ? "available" : "unavailable"}`,
      car: {
        _id: car._id,
        carName: car.carName,
        isAvailable: car.isAvailable,
      },
    });
  } catch (error) {
    console.error("Error updating car availability:", error);
    res.status(500).json({
      success: false,
      error: "Error updating car availability",
      details: error.message,
    });
  }
});

// Add PUT route for car availability - simplified version with extra debugging
router.put('/:carId/availability', async (req, res) => {
  try {
    const { carId } = req.params;
    const { isAvailable } = req.body;

    console.log("PUT availability update received:", {
      carId,
      isAvailable,
      body: req.body,
      headers: req.headers,
    });

    // Skip hostAuth middleware for now to isolate the issue
    // Instead, grab the token directly
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided"
      });
    }
    
    // Check if token is valid
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token verified:", decoded);
    } catch (err) {
      console.error("Token verification failed:", err);
      return res.status(401).json({
        success: false,
        error: `Token invalid: ${err.message}`
      });
    }
    
    // Get host ID from token
    const hostId = decoded.hostId;
    if (!hostId) {
      return res.status(401).json({
        success: false,
        error: "Not a host token"
      });
    }
    
    // Basic validation for carId
    if (!carId) {
      return res.status(400).json({
        success: false,
        error: 'Car ID is required'
      });
    }

    // Convert isAvailable to boolean
    const availabilityStatus = typeof isAvailable === 'boolean' 
      ? isAvailable 
      : (isAvailable === 'true' || isAvailable === true);
    
    console.log(`Attempting to find car with ID: ${carId}`);
    
    // Find car using findById with explicit error handling
    let car;
    try {
      car = await Car.findById(carId);
      console.log("Car found:", car ? "Yes" : "No");
    } catch (findError) {
      console.error("Error finding car:", findError);
      return res.status(400).json({
        success: false,
        error: `Invalid car ID: ${findError.message}`
      });
    }
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    console.log(`Car belongs to host: ${car.hostId}, request from: ${hostId}`);
    
    // Verify ownership
    if (car.hostId.toString() !== hostId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to update this car'
      });
    }

    // Update availability
    car.isAvailable = availabilityStatus;
    
    try {
      await car.save();
      console.log(`Car ${carId} availability successfully updated to ${availabilityStatus}`);
    } catch (saveError) {
      console.error("Error saving car:", saveError);
      return res.status(500).json({
        success: false,
        error: `Failed to save car: ${saveError.message}`
      });
    }

    return res.json({
      success: true,
      message: `Car availability updated to ${availabilityStatus ? 'available' : 'unavailable'}`,
      car: {
        _id: car._id,
        carName: car.carName,
        isAvailable: car.isAvailable
      }
    });

  } catch (error) {
    console.error('Error in availability update:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Server error updating car availability',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Debug route to test authentication
router.get("/debug-auth", (req, res) => {
  try {
    // Get the token from the headers
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    // Try to decode the token without verifying to see its contents
    let decoded;
    try {
      decoded = jwt.decode(token);
    } catch (err) {
      decoded = { error: "Failed to decode token" };
    }

    res.json({
      success: true,
      message: "Debug info",
      token_info: {
        received: !!token,
        length: token.length,
        start: token.substring(0, 15) + "...",
        end: "..." + token.substring(token.length - 15),
        decoded_payload: decoded,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Debug route error",
      details: error.message,
    });
  }
});

// Debug route to check all cars
router.get("/debug-all-cars", async (req, res) => {
  try {
    const allCars = await Car.find().limit(10);

    // Map to safer format for response
    const carSummaries = allCars.map((car) => ({
      _id: car._id,
      carName: car.carName,
      brand: car.brand,
      hostId: car.hostId,
      hostName: car.hostName,
    }));

    res.json({
      success: true,
      count: carSummaries.length,
      cars: carSummaries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching cars",
      details: error.message,
    });
  }
});

// Simple test route to debug host cars authentication
router.get("/test-host-cars", async (req, res) => {
  try {
    // Get token directly from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    console.log(
      "Test route - token:",
      token ? `${token.substring(0, 10)}...` : "None"
    );

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    // Manual token verification
    const jwt = require("jsonwebtoken");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Token verification error:", err.message);
      return res.status(401).json({
        success: false,
        error: `Token invalid: ${err.message}`,
      });
    }

    console.log("Decoded token:", decoded);

    // Check if it's a host token
    if (!decoded.hostId || decoded.userType !== "host") {
      return res.status(403).json({
        success: false,
        error: "Not a host token",
      });
    }

    // Find the host
    const Host = require("../models/Host");
    const host = await Host.findById(decoded.hostId);

    if (!host) {
      return res.status(404).json({
        success: false,
        error: "Host not found",
      });
    }

    console.log("Found host:", host.email);

    // Fetch cars
    const cars = await Car.find({ hostId: decoded.hostId });

    res.json({
      success: true,
      host: {
        id: host._id,
        name: host.name,
        email: host.email,
      },
      cars_count: cars.length,
      cars: cars.map((car) => ({
        id: car._id,
        name: car.carName,
        brand: car.brand,
      })),
    });
  } catch (error) {
    console.error("Test route error:", error);
    res.status(500).json({
      success: false,
      error: "Test route failed",
      details: error.message,
    });
  }
});

// Get all available cars for public viewing
router.get("/available", async (req, res) => {
  try {
    console.log("Fetching available cars");
    
    // Query for cars that are marked as available
    const availableCars = await Car.find({ isAvailable: true })
      .select('_id carName brand carModel rentalPrice transmission fuelTypes numberOfSeats photos isAvailable')
      .sort({ createdAt: -1 }) // Sort by newest first if you have createdAt field
      .limit(20); // Limit to avoid overwhelming response
    
    console.log(`Found ${availableCars.length} available cars`);
    
    res.json({
      success: true,
      count: availableCars.length,
      cars: availableCars
    });
  } catch (error) {
    console.error("Error fetching available cars:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch available cars",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Simple public health check route
router.get("/health-check", (req, res) => {
  res.json({
    success: true,
    message: "Car API is working",
    timestamp: new Date().toISOString(),
  });
});

// Simple test route to update car availability without middleware
router.post("/test-update-availability", async (req, res) => {
  try {
    console.log("Test update availability route called");
    console.log("Request body:", req.body);
    
    const { carId, isAvailable } = req.body;
    
    if (!carId) {
      return res.status(400).json({
        success: false,
        error: "carId is required"
      });
    }
    
    // Convert isAvailable to boolean
    const availabilityStatus = typeof isAvailable === 'boolean' 
      ? isAvailable 
      : (isAvailable === 'true' || isAvailable === true);
    
    console.log(`Setting car ${carId} availability to ${availabilityStatus}`);
    
    // Find the car
    let car;
    try {
      car = await Car.findById(carId);
    } catch (error) {
      console.error("Error finding car:", error);
      return res.status(400).json({
        success: false,
        error: `Invalid car ID: ${error.message}`
      });
    }
    
    if (!car) {
      return res.status(404).json({
        success: false,
        error: "Car not found"
      });
    }
    
    // Update the car
    car.isAvailable = availabilityStatus;
    
    try {
      await car.save();
      console.log("Car successfully updated");
    } catch (error) {
      console.error("Error saving car:", error);
      return res.status(500).json({
        success: false,
        error: `Error saving car: ${error.message}`
      });
    }
    
    // Return success
    return res.json({
      success: true,
      message: `Car availability updated to ${availabilityStatus ? "available" : "unavailable"}`,
      car: {
        _id: car._id,
        carName: car.carName,
        isAvailable: car.isAvailable
      }
    });
    
  } catch (error) {
    console.error("Error in test update route:", error);
    return res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message
    });
  }
});

module.exports = router;
