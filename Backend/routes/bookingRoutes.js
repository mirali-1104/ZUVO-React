const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth } = require('../middleware/auth');

// Define custom middleware functions
const protect = auth;

// Admin protection middleware
const adminProtect = (req, res, next) => {
  // Call the auth middleware first
  auth(req, res, (err) => {
    if (err) return next(err);
    
    // Check if the user is an admin
    if (req.userType === 'admin' || (req.user && req.user.role === 'admin')) {
      // If admin is found in req.admin, ensure it's also available as req.user
      if (req.admin && !req.user) {
        req.user = req.admin;
      }
      
      return next();
    }
    
    return res.status(403).json({
      success: false,
      error: "Admin access required"
    });
  });
};

// Create a new booking
router.post('/create', protect, bookingController.createBooking);

// Get user's bookings
router.get('/user', protect, bookingController.getUserBookings);
router.get('/user/:userId', protect, bookingController.getUserBookings);

// Get bookings for a host's cars
router.get('/host', protect, bookingController.getHostBookings);
router.get('/host/:hostId', protect, bookingController.getHostBookings);

// Get booking statistics for admin dashboard
router.get('/stats', adminProtect, bookingController.getBookingStats);

// Get total revenue for admin dashboard
router.get('/revenue', adminProtect, bookingController.getTotalRevenue);

// Get a specific booking
router.get('/:id', protect, bookingController.getBookingById);

// Update booking status
router.put('/:id/status', protect, bookingController.updateBookingStatus);

// Cancel a booking
router.put('/:id/cancel', protect, bookingController.cancelBooking);

// Admin routes for all bookings (with pagination and filtering)
router.get('/', adminProtect, bookingController.getAllBookings);

// Delete a booking (admin only)
router.delete('/delete/:id', adminProtect, bookingController.deleteBooking);

module.exports = router; 