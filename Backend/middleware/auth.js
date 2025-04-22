const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Host = require("../models/Host"); // Make sure you have a Host model
require("dotenv").config();

// Token generation utility (updated for hosts)
const generateToken = (user, userType = "user") => {
  const payload = {
    email: user.email,
    [userType + "Id"]: user._id, // Creates either userId, adminId, or hostId
    userType: userType, // Add user type to the token
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// Token verification utility remains the same
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw err;
  }
};

// Main authentication middleware (updated for hosts)
const auth = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    console.log("Auth Middleware - Received token:", token ? token.substring(0, 15) + "..." : "None");
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authorization token required",
      });
    }

    // 2. Verify token
    const decoded = verifyToken(token);
    console.log("Auth Middleware - Decoded token:", decoded);
    
    // Log what we're looking for
    console.log("Auth Middleware - Looking for:", {
      adminId: decoded.adminId || 'Not present',
      hostId: decoded.hostId || 'Not present',
      userId: decoded.userId || 'Not present',
      userType: decoded.userType || 'Not present'
    });

    // 3. Check user type and find appropriate user
    if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) throw new Error("Admin not found");
      req.admin = admin;
      req.userType = 'admin';
      console.log("Auth Middleware - Found admin:", admin.email);
    } 
    else if (decoded.hostId) {
      const host = await Host.findById(decoded.hostId);
      if (!host) throw new Error("Host not found");
      req.host = host;
      req.userType = 'host';
      console.log("Auth Middleware - Found host:", host.email);
    }
    else if (decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (!user) throw new Error("User not found");
      req.user = user;
      req.userType = 'user';
      console.log("Auth Middleware - Found user:", user.email);
    } else {
      console.log("Auth Middleware - Invalid token structure, no valid ID found");
      throw new Error("Invalid token structure");
    }

    // Attach token to request
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
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Host-specific middleware
const hostAuth = async (req, res, next) => {
  try {
    // Extract token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    console.log("HostAuth Middleware - Full token:", token ? `${token.substring(0, 10)}...${token.substring(token.length - 10)}` : "None");
    console.log("HostAuth Middleware - Headers:", req.headers);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authorization token required",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
      console.log("HostAuth Middleware - Token successfully verified!");
    } catch (err) {
      console.error("HostAuth Middleware - Token verification failed:", err.message);
      return res.status(401).json({
        success: false,
        error: `Token verification failed: ${err.message}`,
      });
    }
    
    console.log("HostAuth Middleware - Decoded token:", decoded);
    
    // Check if it's a host token
    if (!decoded.hostId || decoded.userType !== 'host') {
      console.log("HostAuth Middleware - Not a host token");
      return res.status(403).json({
        success: false,
        error: "Host authorization required",
      });
    }
    
    // Find the host
    const host = await Host.findById(decoded.hostId);
    if (!host) {
      console.log("HostAuth Middleware - Host not found in database");
      return res.status(401).json({
        success: false,
        error: "Host not found",
      });
    }
    
    // Attach host info and token to request
    req.host = host;
    req.userType = 'host';
    req.token = token;
    console.log("HostAuth Middleware - Host authenticated successfully:", host.email);
    
    next();
  } catch (err) {
    console.error("Host Authentication error:", err.message);

    let message = "Host authentication failed";
    if (err.name === "TokenExpiredError") message = "Token expired";
    if (err.name === "JsonWebTokenError") message = "Invalid token";

    res.status(401).json({
      success: false,
      error: message,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

exports.auth = auth;
exports.hostAuth = hostAuth;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
