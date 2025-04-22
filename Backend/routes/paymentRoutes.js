const express = require("express");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const paymentController = require("../controllers/paymentController");
const { auth } = require("../middleware/auth");

// Hardcoded test keys for consistent usage - updated to match controller
const RAZORPAY_TEST_KEY_ID = "rzp_test_jVqdtFwidymhM3";
const RAZORPAY_TEST_KEY_SECRET = "069pF4H12sdSJRbdZGytcVgE";

// Initialize Razorpay with test keys
const razorpay = new Razorpay({
  key_id: RAZORPAY_TEST_KEY_ID,
  key_secret: RAZORPAY_TEST_KEY_SECRET,
});

// Create middleware for authorization
const protect = auth;

// Admin protection middleware
const adminProtect = (req, res, next) => {
  // Call the auth middleware first
  auth(req, res, (err) => {
    if (err) return next(err);

    // Check if the user is an admin
    if (req.userType === "admin" || (req.user && req.user.role === "admin")) {
      // If admin is found in req.admin, ensure it's also available as req.user
      if (req.admin && !req.user) {
        req.user = req.admin;
      }
      
      return next();
    }

    return res.status(403).json({
      success: false,
      error: "Admin access required",
    });
  });
};

// Create Razorpay order
router.post("/create-order", protect, paymentController.createOrder);

// Verify payment signature after payment
router.post("/verify", protect, paymentController.verifyPayment);

// Get payment details by ID
router.get("/:paymentId", protect, paymentController.getPayment);

// Admin route to get all payments with details from bookings
router.get("/admin/payments", adminProtect, paymentController.getAdminPayments);

// Process a refund (admin or authorized users only)
router.post("/refund", adminProtect, paymentController.refundPayment);

// Generate random wallet ID (utility function)
const generateWalletId = () => {
  return `WALLET_${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
};

// Legacy wallet routes - to be migrated to controller
router.post("/link-wallet", auth, async (req, res) => {
  try {
    // Generate a random wallet ID
    const walletId = generateWalletId();

    // Update user's wallet status
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        walletLinked: true,
        walletId: walletId,
        walletStatus: "active",
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Wallet linked successfully",
      walletId: walletId,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error linking wallet:", error);
    res
      .status(500)
      .json({ message: "Error linking wallet", error: error.message });
  }
});

// Add a test route to check Razorpay initialization
router.get("/test", (req, res) => {
  try {
    // Create a small test order
    const options = {
      amount: 100, // Rs. 1
      currency: "INR",
      receipt: `test_${Date.now()}`,
      payment_capture: 1,
    };

    // Try to create a test order
    razorpay.orders.create(options, (err, order) => {
      if (err) {
        console.error("Test order creation failed:", err);
        return res.status(500).json({
          success: false,
          error: "Razorpay test failed",
          details: err,
        });
      }

      // Return success with the test order
      return res.status(200).json({
        success: true,
        message: "Razorpay is working correctly",
        testOrder: order,
      });
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: "Test failed",
      details: error.message,
    });
  }
});

module.exports = router;
