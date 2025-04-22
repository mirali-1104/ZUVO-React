const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');
const emailService = require('../utils/emailService');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    console.log('Creating booking from request:', req.body);
    
    const {
      carId,
      userId,
      startDate,
      endDate,
      totalDays,
      totalAmount,
      carName,
      hostId,
      paymentId,
      paymentStatus,
      bookingStatus,
      paymentDetails,
      pickupLocation,
      dropoffLocation,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!carId || !userId || !totalAmount || !carName) {
      console.log('Missing required fields:', { carId, userId, totalAmount, carName });
      return res.status(400).json({
        success: false,
        error: 'Missing required booking information'
      });
    }

    // Parse dates if they are strings
    let parsedStartDate = startDate;
    let parsedEndDate = endDate;

    if (typeof startDate === 'string') {
      parsedStartDate = new Date(startDate);
    }

    if (typeof endDate === 'string') {
      parsedEndDate = new Date(endDate);
    }

    // If dates are missing or invalid, create defaults
    if (!parsedStartDate || isNaN(parsedStartDate.getTime())) {
      console.log('Invalid start date, using current date');
      parsedStartDate = new Date();
    }

    if (!parsedEndDate || isNaN(parsedEndDate.getTime())) {
      console.log('Invalid end date, calculating from total days');
      parsedEndDate = new Date(parsedStartDate);
      parsedEndDate.setDate(parsedEndDate.getDate() + (totalDays || 1));
    }

    console.log('Parsed dates:', { 
      parsedStartDate, 
      parsedEndDate, 
      totalDays 
    });

    // Create a new booking instance
    const newBooking = new Booking({
      carId,
      userId,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      totalDays: totalDays || 1,
      totalAmount,
      carName,
      hostId,
      paymentId,
      paymentStatus: paymentStatus || 'completed',
      bookingStatus: bookingStatus || 'confirmed',
      paymentDetails,
      pickupLocation: pickupLocation || 'Main Branch',
      dropoffLocation,
      specialRequests
    });

    console.log('Created booking instance:', newBooking);

    // Save the booking
    const booking = await newBooking.save();
    console.log('Saved booking to database:', booking._id);

    // Update car availability status (optional)
    if (booking.bookingStatus === 'confirmed') {
      try {
        await Car.findByIdAndUpdate(carId, { isAvailable: false });
        console.log('Updated car availability to false');
      } catch (carUpdateError) {
        console.error('Error updating car availability:', carUpdateError);
        // Don't fail the booking if car update fails
      }
    }

    // Try to get user email for confirmation
    let userEmail = null;
    try {
      const user = await User.findById(userId);
      userEmail = user?.email;
      console.log('Found user email for notification:', userEmail);
    } catch (err) {
      console.error('Error fetching user email:', err);
    }

    // Send booking confirmation email if email service is available
    if (userEmail && emailService.sendBookingConfirmation) {
      try {
        await emailService.sendBookingConfirmation(userEmail, booking);
        console.log('Sent booking confirmation email');
      } catch (emailErr) {
        console.error('Failed to send booking confirmation email:', emailErr);
      }
    }

    return res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Handle specific errors
    if (error.message.includes('not available')) {
      return res.status(409).json({
        success: false,
        error: 'Car is not available for the selected dates'
      });
    }
    
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: validationErrors.join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      // Invalid MongoDB ID
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        details: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create booking'
    });
  }
};

// Get all bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const bookings = await Booking.find({ userId })
      .sort({ bookingDate: -1 })
      .populate('carId', 'carName photos')
      .exec();
    
    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
};

// Get all bookings for a host's cars
exports.getHostBookings = async (req, res) => {
  try {
    const hostId = req.params.hostId || req.host._id;
    
    // First find all cars owned by this host
    const hostCars = await Car.find({ hostId }).select('_id');
    const carIds = hostCars.map(car => car._id);
    
    // Then find all bookings for these cars
    const bookings = await Booking.find({ 
      carId: { $in: carIds }
    })
    .populate('carId', 'carName photos')
    .populate('userId', 'name email phone')
    .sort({ bookingDate: -1 })
    .exec();
    
    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Error fetching host bookings:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('carId')
      .populate('userId', 'name email phone')
      .exec();
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    // Check if the user is authorized to view this booking
    // A user can view their own bookings, or hosts can view bookings for their cars
    const isAuthorized = 
      String(booking.userId._id) === String(req.user?._id) || 
      String(booking.carId.hostId) === String(req.host?._id) ||
      req.user?.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking'
      });
    }
    
    return res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus } = req.body;
    
    if (!bookingStatus) {
      return res.status(400).json({
        success: false,
        error: 'Booking status is required'
      });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    // Update booking status
    booking.bookingStatus = bookingStatus;
    
    // If cancelling, record cancellation details
    if (bookingStatus === 'cancelled') {
      booking.cancelledAt = new Date();
      booking.cancelledBy = req.body.cancelledBy || 'user';
      booking.cancellationReason = req.body.cancellationReason || 'User requested cancellation';
      
      // Return the car to available state
      await Car.findByIdAndUpdate(booking.carId, { isAvailable: true });
    }
    
    // If completing the booking
    if (bookingStatus === 'completed') {
      // Return the car to available state
      await Car.findByIdAndUpdate(booking.carId, { isAvailable: true });
    }
    
    await booking.save();
    
    return res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    // Check if the booking can be cancelled
    if (booking.bookingStatus === 'completed' || booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel a booking that is already ${booking.bookingStatus}`
      });
    }
    
    // Check if the user is the booking owner or the host
    const isAuthorized = 
      String(booking.userId) === String(req.user?._id) || 
      String(booking.hostId) === String(req.host?._id) ||
      req.user?.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }
    
    // Update booking status to cancelled
    booking.bookingStatus = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = req.body.cancelledBy || 'user';
    booking.cancellationReason = req.body.reason || 'User requested cancellation';
    
    await booking.save();
    
    // Return the car to available state
    await Car.findByIdAndUpdate(booking.carId, { isAvailable: true });
    
    return res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to cancel booking'
    });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    // Check if admin - more robust check using both req.userType and req.user.role if available
    if (req.userType !== 'admin' && !(req.user && req.user.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access all bookings'
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Filters
    const filter = {};
    if (req.query.status) filter.bookingStatus = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    
    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.bookingDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    const bookings = await Booking.find(filter)
      .populate('carId', 'carName photos')
      .populate('userId', 'name email phone')
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    const total = await Booking.countDocuments(filter);
    
    return res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      bookings
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
};

// Get booking statistics for admin dashboard
exports.getBookingStats = async (req, res) => {
  try {
    // Check if admin - more robust check using both req.userType and req.user.role if available
    if (req.userType !== 'admin' && !(req.user && req.user.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access booking statistics'
      });
    }
    
    // Aggregate to count bookings by status
    const bookingStatsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: "$bookingStatus",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Convert to a more usable format
    const stats = {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0
    };
    
    bookingStatsByStatus.forEach(stat => {
      if (stat._id && stats.hasOwnProperty(stat._id)) {
        stats[stat._id] = stat.count;
      }
    });
    
    // Monthly booking trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrends = await Booking.aggregate([
      {
        $match: {
          bookingDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$bookingDate" },
            month: { $month: "$bookingDate" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    // Format the monthly data
    const monthlyData = monthlyTrends.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, 1);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year: item._id.year,
        value: item.count
      };
    });
    
    return res.status(200).json({
      success: true,
      ...stats,
      monthlyTrends: monthlyData
    });
  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch booking statistics'
    });
  }
};

// Get total revenue from all bookings
exports.getTotalRevenue = async (req, res) => {
  try {
    // Check if admin - more robust check using both req.userType and req.user.role if available
    if (req.userType !== 'admin' && !(req.user && req.user.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access revenue data'
      });
    }
    
    // Calculate total revenue from all bookings
    const revenueStat = await Booking.aggregate([
      {
        $match: {
          bookingStatus: { $in: ['confirmed', 'completed'] },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalRevenue = revenueStat.length > 0 ? revenueStat[0].totalRevenue : 0;
    
    return res.status(200).json({
      success: true,
      totalRevenue
    });
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate total revenue'
    });
  }
};

// Delete a booking by ID (admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Attempting to delete booking with ID: ${id}`);
    
    // Check if the booking exists
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    // If the booking was confirmed, we might want to update the car's availability
    if (booking.bookingStatus === 'confirmed') {
      try {
        await Car.findByIdAndUpdate(booking.carId, { isAvailable: true });
        console.log(`Updated car ${booking.carId} availability to true`);
      } catch (carUpdateError) {
        console.error('Error updating car availability:', carUpdateError);
        // Don't fail the deletion if car update fails
      }
    }
    
    // Delete the booking
    const deletedBooking = await Booking.findByIdAndDelete(id);
    
    console.log(`Successfully deleted booking with ID: ${id}`);
    
    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: deletedBooking
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking ID format'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to delete booking'
    });
  }
}; 