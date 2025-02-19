const express = require("express");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const crypto = require("crypto");


const router = express.Router();

const bcrypt = require("bcryptjs");

bcrypt.setRandomFallback((len) => {
  const buf = new Uint8Array(len);
  return crypto.randomFillSync(buf);
});


// Register User
router.post("/signup", async (req, res) => {
  try {
      const { name, email, password, phone, address } = req.body;

      if (!name || !email || !password || !phone) {
          return res.status(400).json({ message: "All fields are required" });
      }

      if (typeof password !== "string") {
          return res.status(400).json({ message: "Password must be a valid string" });
      }

      // console.log("Password received:", password); // Debugging

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists" });

      // Generate salt and hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({ 
          name, 
          email, 
          password: hashedPassword, 
          phone, 
          address  // Store the address object in MongoDB
      });

      await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.status(201).json({ token, user: newUser });
  } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

  
  

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("Email:", email); // Log email after destructuring
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  } catch (error) {
    console.error("Error during login:", error); // Log detailed error
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});


module.exports = router;
