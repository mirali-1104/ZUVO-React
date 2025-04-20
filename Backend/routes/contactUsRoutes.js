const express = require("express");
const router = express.Router();
const ContactUs = require("../models/ContactUs");
const { auth } = require("../middleware/auth");

// Submit a new query
router.post("/submit", async (req, res) => {
  try {
    const { email, query } = req.body;

    if (!email || !query) {
      return res.status(400).json({ message: "Email and query are required" });
    }

    const newQuery = new ContactUs({
      email,
      query,
    });

    await newQuery.save();

    res.status(201).json({
      success: true,
      message: "Query submitted successfully",
      data: newQuery,
    });
  } catch (error) {
    console.error("Error submitting query:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting query",
      error: error.message,
    });
  }
});

// Get queries for a specific user
router.get("/user/:email", auth, async (req, res) => {
  try {
    const { email } = req.params;
    const userEmail = req.user.email;

    // Ensure the user can only access their own queries
    if (email !== userEmail) {
      return res.status(403).json({ message: "Access denied" });
    }

    const queries = await ContactUs.find({ email }).sort({ submittedAt: -1 });
    res.json(queries);
  } catch (error) {
    console.error("Error fetching user queries:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching queries",
      error: error.message,
    });
  }
});

// Get all queries (admin only)
router.get("/all", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const queries = await ContactUs.find().sort({ submittedAt: -1 });
    res.json(queries);
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching queries",
      error: error.message,
    });
  }
});

// Update query answer (admin only)
router.put("/answer/:id", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { answer } = req.body;
    if (!answer) {
      return res.status(400).json({ message: "Answer is required" });
    }

    const query = await ContactUs.findByIdAndUpdate(
      req.params.id,
      { answer },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }

    res.json({
      success: true,
      message: "Answer updated successfully",
      data: query,
    });
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({
      success: false,
      message: "Error updating answer",
      error: error.message,
    });
  }
});

module.exports = router;
