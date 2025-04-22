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
const fs = require("fs");
const multer = require("multer");
const hostController = require("../controllers/hostController");

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

// Configure multer for profile picture upload
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/profiles");
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

const uploadProfile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
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

// Route to register new host
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const existingHost = await Host.findOne({ email });
    if (existingHost) {
      return res.status(409).json({ error: "Host already exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

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

    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
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

// Email verification
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const host = await Host.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!host) {
      const expiredHost = await Host.findOne({ verificationToken: token });
      if (expiredHost) {
        return res.status(400).json({
          success: false,
          error:
            "Verification token has expired. Please request a new verification email.",
        });
      }

      return res.status(400).json({
        success: false,
        error:
          "Invalid verification token. Please request a new verification email.",
      });
    }

    host.isVerified = true;
    host.verificationToken = undefined;
    host.verificationTokenExpires = undefined;
    await host.save();

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
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const host = await Host.findOne({ email }).select("+password");

    if (!host) {
      return res.status(401).json({
        success: false,
        error: "Email not found. Please check your email or sign up.",
      });
    }

    if (!host.isVerified) {
      return res.status(403).json({
        success: false,
        error: "Please verify your email address before logging in",
        isVerified: false,
      });
    }

    const isMatch = await host.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password. Please try again.",
      });
    }

    const token = generateToken(host, "host");

    res.json({
      success: true,
      token,
      host: {
        id: host._id,
        email: host.email,
        name: host.name,
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

// Resend verification email
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

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    host.verificationToken = verificationToken;
    host.verificationTokenExpires = verificationTokenExpires;
    await host.save();

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
  const hostId = req.host.hostId;

  try {
    const updatedHost = await Host.findByIdAndUpdate(
      hostId,
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

// Update host profile (including profile picture)
router.put(
  "/profile",
  auth,
  uploadProfile.single("profilePicture"),
  async (req, res) => {
    try {
      const { name, email, mobile, address, licenseNo, issueDate, expiryDate } =
        req.body;

      const updateFields = {
        name,
        email,
        mobile,
        address,
        licenseNo,
        issueDate,
        expiryDate,
      };

      if (req.file) {
        const host = await Host.findById(req.host._id);
        if (host.profilePicture) {
          const oldPicturePath = path.join(
            __dirname,
            "..",
            host.profilePicture
          );
          if (fs.existsSync(oldPicturePath)) {
            fs.unlinkSync(oldPicturePath);
          }
        }
        updateFields.profilePicture = `/uploads/profiles/${req.file.filename}`;
      }

      const updatedHost = await Host.findByIdAndUpdate(
        req.host._id,
        updateFields,
        { new: true }
      ).select("-password");

      res.json({
        success: true,
        message: "Profile updated successfully",
        host: updatedHost,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update profile",
        details: error.message,
      });
    }
  }
);

// Test route
router.get("/test", (req, res) => res.send("Host routes working"));

// Debug token route
router.get("/debug-token", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: "No token provided"
      });
    }
    
    // Try to decode without verification
    const decodedRaw = jwt.decode(token);
    
    // Try to verify
    let verifiedToken;
    let isValid = false;
    try {
      verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
      isValid = true;
    } catch (err) {
      verifiedToken = { error: err.message };
    }
    
    res.json({
      success: true,
      token_preview: token.substring(0, 20) + "...",
      decoded_raw: decodedRaw,
      verified: isValid,
      verified_token: verifiedToken
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Token debugging failed",
      details: err.message
    });
  }
});

// Debug endpoint to check hosts
router.get("/debug-hosts", async (req, res) => {
  try {
    // Only return limited host info for security
    const hosts = await Host.find().select('_id name email isVerified').limit(10);
    
    res.json({
      success: true,
      count: hosts.length,
      hosts: hosts.map(host => ({
        id: host._id,
        name: host.name,
        email: host.email,
        isVerified: host.isVerified
      }))
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Could not fetch hosts",
      details: err.message
    });
  }
});

// Add this route for getting host count (put it before any route with path parameters to avoid conflicts)
router.get('/count', adminProtect, hostController.getHostCount);

// Admin route to get all hosts with pagination and filtering
router.get('/admin/hosts', adminProtect, hostController.getAllHostsForAdmin);

module.exports = router;
