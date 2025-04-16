// middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "89a1be9602adff5e49c5a4cf09ddd03c5d01a34a54c23c8769da5efe80d8d619dbdd29e16bc9f10f0d2c596a9842ec00c09873bfbedc624c78b4ce34b6cb9048"
    );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = auth;
