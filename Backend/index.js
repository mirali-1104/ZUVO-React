const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const { auth } = require("./middleware/auth");
// Middlewares

app.use(
  cors({
    origin: "http://localhost:5173", // Your React app URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // If using cookies/auth
  })
);

app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory created");
}

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadsDir));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Backend with MongoDB is running!");
});
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const HostRoutes = require("./routes/hostRoutes");
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact-us", contactUsRoutes);
app.use("/api/host", HostRoutes);
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File size too large. Maximum size is 2MB." });
    }
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
