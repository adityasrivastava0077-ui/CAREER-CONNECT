
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({ message: "Auth API is working!" });
});

// Student and Recruiter Signup
router.post("/signup", async (req, res) => {
  try {
    const {
      fullName,
      recruiterName,
      email,
      phone,
      password,
      role,
      college,
      course,
      graduationYear,
      companyName,
      website,
      description,
    } = req.body;

    // Required field validation
    const name = role === "recruiter" ? recruiterName : fullName;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    if (!["student", "recruiter"].includes(role)) {
      return res.status(400).json({
        message: "Invalid account type.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    // Check whether email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      fullName: name,
      email: email.toLowerCase().trim(),
      phone,
      password: hashedPassword,
      role,
      college: role === "student" ? college : "",
      course: role === "student" ? course : "",
      graduationYear: role === "student" ? graduationYear : "",
      companyName: role === "recruiter" ? companyName : "",
      website: role === "recruiter" ? website : "",
      description: role === "recruiter" ? description : "",
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    return res.status(500).json({
      message: "Server error during signup.",
    });
  }
});

module.exports = router;

// Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Please enter email, password and account type.",
      });
    }

    if (!["student", "recruiter"].includes(role)) {
      return res.status(400).json({
        message: "Invalid account type.",
      });
    }

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check account type
    if (user.role !== role) {
      return res.status(403).json({
        message: "Please select the correct account type.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login.",
    });
  }
});
