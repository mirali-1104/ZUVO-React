const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../middleware/auth");
const { sendVerificationEmail } = require("../utils/emailService");
const { auth } = require("../middleware/auth");
const path = require("path");
const upload = require("../middleware/upload");
const fs = require("fs");
const userController = require("../controllers/userController");

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

// Route to register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Password strength validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log("Generated verification token:", verificationToken);
    console.log("Token expires at:", verificationTokenExpires);

    // Hash password

    // Create new user
    const newUser = new User({
      email,
      password: password,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await newUser.save();
    console.log("User saved with verification token");

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      // If email fails to send, still create the account but inform the user
      return res.status(201).json({
        success: true,
        message:
          "Registration successful but verification email could not be sent. Please contact support.",
        user: {
          email: newUser.email,
          isVerified: newUser.isVerified,
        },
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      user: {
        email: newUser.email,
        isVerified: newUser.isVerified,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      error: "Registration failed. Please try again later.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Email verification route
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Verification attempt with token:", token);

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("No user found with token or token expired");
      // Check if token exists but is expired
      const expiredUser = await User.findOne({ verificationToken: token });
      if (expiredUser) {
        console.log("Token exists but is expired");
        return res.status(400).json({
          success: false,
          error:
            "Verification token has expired. Please request a new verification email.",
        });
      }
      return res.status(400).json({
        success: false,
        error: "Invalid verification token",
      });
    }

    console.log("User found:", user.email);
    console.log("Token expires at:", user.verificationTokenExpires);

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Return JSON response instead of redirecting
    res.json({
      success: true,
      message:
        "Email verified successfully! You can now log in to your account.",
      redirectUrl: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/verification-success`,
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({
      success: false,
      error: "Verification failed. Please try again later.",
    });
  }
});

// Update login route to check for verification
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    // Basic validation
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user and explicitly select the password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({
        success: false,
        error: "Email not found. Please check your email or sign up.",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      console.log("User not verified:", email);
      return res.status(403).json({
        success: false,
        error: "Please verify your email address before logging in",
        isVerified: false,
      });
    }

    console.log("User found, comparing passwords...");

    // Ensure password exists before comparison
    if (!user.password) {
      console.log("Password field is undefined for user:", email);
      return res.status(500).json({
        success: false,
        error: "Internal server error. Please try again later.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({
        success: false,
        error: "Incorrect password. Please try again.",
      });
    }

    console.log("Password match, generating token...");
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name, // Include name in response
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      error: "Login failed. Please try again later.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Resend verification email route
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send new verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      return res.status(500).json({
        error: "Could not send verification email. Please try again later.",
      });
    }

    res.json({
      success: true,
      message: "Verification email has been resent. Please check your inbox.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({
      error: "Failed to resend verification email. Please try again later.",
    });
  }
});

// Update user name
router.put("/update-name", auth, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId; // extracted from token

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Update user profile (excluding profile picture)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Upload profile picture
router.post("/profile/picture", auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No profile picture uploaded" });
    }

    // Get the file path
    const filePath = `/uploads/${req.file.filename}`;

    // Update only the profilePicture field
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profilePicture: filePath } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      profilePicture: updatedUser.profilePicture
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    
    // Handle multer errors
    if (error.name === 'MulterError') {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum size is 2MB.' });
      }
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ 
      message: "Error uploading profile picture", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  }
});

// Add this route for getting user count (put it before any route with path parameters to avoid conflicts)
router.get('/count', adminProtect, userController.getUserCount);

router.get("/test", (req, res) => res.send("User routes working"));

module.exports = router;
