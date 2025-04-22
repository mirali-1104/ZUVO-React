const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");

// Register admin (only for initial setup)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password, // Store password as plain text
      role: "admin"
    });

    await admin.save();

    // Generate token
    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error.message
    });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password (plain text comparison)
    if (password !== admin.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      error: "Login failed",
      details: error.message
    });
  }
});

// Get admin profile
router.get("/profile", auth, async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({
      error: "Failed to fetch profile",
      details: error.message
    });
  }
});

module.exports = router; 