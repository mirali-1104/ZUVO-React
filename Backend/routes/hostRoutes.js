const express = require("express");
const router = express.Router();
const Host = require("../models/Host");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../middleware/auth");
const { sendVerificationEmail } = require("../utils/emailService");
const { auth } = require("../middleware/auth");
const path = require("path");
const upload = require("../middleware/upload");
const fs = require("fs");

// Route to register new host
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
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

    // Check if host already exists
    const existingHost = await Host.findOne({ email });
    if (existingHost) {
      return res.status(409).json({ error: "Host already exists" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log("Generated verification token:", verificationToken);
    console.log("Token expires at:", verificationTokenExpires);

    // Create new host
    const newHost = new Host({
      name,
      email,
      password,
      mobile,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await newHost.save();
    console.log("Host saved with verification token");

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      // If email fails to send, still create the account but inform the host
      return res.status(201).json({
        success: true,
        message:
          "Registration successful but verification email could not be sent. Please contact support.",
        host: {
          email: newHost.email,
          isVerified: newHost.isVerified,
        },
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      host: {
        email: newHost.email,
        isVerified: newHost.isVerified,
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

    // First try to find host with exact token match
    const host = await Host.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!host) {
      console.log("No host found with token or token expired");
      
      // Check if token exists but is expired
      const expiredHost = await Host.findOne({ verificationToken: token });
      if (expiredHost) {
        console.log("Token exists but is expired");
        return res.status(400).json({
          success: false,
          error: "Verification token has expired. Please request a new verification email.",
        });
      }

      // If no host found at all, return invalid token
      console.log("Invalid token - no matching host found");
      return res.status(400).json({
        success: false,
        error: "Invalid verification token. Please request a new verification email.",
      });
    }

    console.log("Host found:", host.email);
    console.log("Token expires at:", host.verificationTokenExpires);

    // Update host verification status
    host.isVerified = true;
    host.verificationToken = undefined;
    host.verificationTokenExpires = undefined;
    await host.save();

    // Return JSON response with redirect URL
    res.json({
      success: true,
      message: "Email verified successfully! You can now log in to your account.",
      redirectUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/verification-success`,
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({
      success: false,
      error: "Verification failed. Please try again later.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
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

    // Find host and explicitly select the password field
    const host = await Host.findOne({ email }).select("+password");

    if (!host) {
      console.log("Host not found for email:", email);
      return res.status(401).json({
        success: false,
        error: "Email not found. Please check your email or sign up.",
      });
    }

    // Check if host is verified
    if (!host.isVerified) {
      console.log("Host not verified:", email);
      return res.status(403).json({
        success: false,
        error: "Please verify your email address before logging in",
        isVerified: false,
      });
    }

    console.log("Host found, comparing passwords...");

    // Ensure password exists before comparison
    if (!host.password) {
      console.log("Password field is undefined for host:", email);
      return res.status(500).json({
        success: false,
        error: "Internal server error. Please try again later.",
      });
    }

    const isMatch = await host.comparePassword(password);
    if (!isMatch) {
      console.log("Password mismatch for host:", email);
      return res.status(401).json({
        success: false,
        error: "Incorrect password. Please try again.",
      });
    }

    console.log("Password match, generating token...");
    const token = generateToken(host);

    res.json({
      success: true,
      token,
      host: {
        id: host._id,
        email: host.email,
        name: host.name, // Include name in response
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

    const host = await Host.findOne({ email });
    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    if (host.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    host.verificationToken = verificationToken;
    host.verificationTokenExpires = verificationTokenExpires;
    await host.save();

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

// Update host name
router.put("/update-name", auth, async (req, res) => {
  const { name } = req.body;
  const hostId = req.host.hostId; // extracted from token

  try {
    const updatedHost = await Host.findByIdAndUpdate(
      HostId,
      { name },
      { new: true }
    ).select("-password");

    if (!updatedHost) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found" });
    }

    res.json({ success: true, host: updatedHost });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get host profile
router.get("/profile", auth, async (req, res) => {
  try {
    const host = await Host.findById(req.host._id).select("-password");
    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }
    res.json(host);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Update host profile (excluding profile picture)
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    const updatedHost = await Host.findByIdAndUpdate(
      req.host._id,
      updateFields,
      { new: true }
    ).select("-password");

    res.json(updatedHost);
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

// Upload profile picture
router.post(
  "/profile/picture",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No profile picture uploaded" });
      }

      // Get the file path
      const filePath = `/uploads/${req.file.filename}`;

      // Update only the profilePicture field
      const updatedHost = await Host.findByIdAndUpdate(
        req.host._id,
        { $set: { profilePicture: filePath } },
        { new: true }
      ).select("-password");

      if (!updatedHost) {
        return res.status(404).json({ message: "Host not found" });
      }

      res.json({
        profilePicture: updatedHost.profilePicture,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);

      // Handle multer errors
      if (error.name === "MulterError") {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: "File size too large. Maximum size is 2MB." });
        }
        return res.status(400).json({ message: error.message });
      }

      res.status(500).json({
        message: "Error uploading profile picture",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
);

router.get("/test", (req, res) => res.send("Host routes working"));

module.exports = router;
