// const jwt = require("jsonwebtoken");
require('dotenv').config()

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log("Auth Header:", authHeader); // Log the header to check if token is being sent

  if (!authHeader) {
    // console.log("No auth header found");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token
  // console.log("Extracted Token:", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // console.log("JWT Verification Error:", err.message);
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = user; // Attach user data to request
    // console.log("Authenticated User:", user);
    next();
  });
};

module.exports = authMiddleware;
