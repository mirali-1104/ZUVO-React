// generateSecret.js
const crypto = require("crypto");
const jwtSecret = crypto.randomBytes(64).toString("hex");
console.log("JWT Secret:", jwtSecret);
