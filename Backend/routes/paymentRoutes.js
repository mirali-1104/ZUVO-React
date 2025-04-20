const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const crypto = require("crypto");
const Razorpay = require("razorpay");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post("/create-order", auth, async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    
    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});

// Generate random wallet ID
const generateWalletId = () => {
  return `WALLET_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
};

// Verify payment and update wallet status
router.post("/verify", auth, async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;
    
    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
    
    // Generate a random wallet ID
    const walletId = generateWalletId();
    
    // Update user's wallet status
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        walletLinked: true,
        walletId: walletId,
        walletStatus: "active"
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Payment verified and wallet linked successfully",
      walletId: walletId,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment", error: error.message });
  }
});

module.exports = router; 