const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Token generation utility
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// Token verification utility
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Main authentication middleware
const auth = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authorization token required",
      });
    }

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Find associated user
    const user = await User.findOne({
      _id: decoded.userId,
    });

    if (!user) {
      throw new Error("User not found for token");
    }

    // 4. Attach to request
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);

    let message = "Please authenticate";
    if (err.name === "TokenExpiredError") message = "Token expired";
    if (err.name === "JsonWebTokenError") message = "Invalid token";

    res.status(401).json({
      success: false,
      error: message,
    });
  }
};

exports.auth = auth;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
