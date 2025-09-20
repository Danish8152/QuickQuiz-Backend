// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import connectDB from "../config/mongodb.js";

const router = express.Router();

// Middleware to guarantee DB connected before routes run
router.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB middleware error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const {email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({email, password: hash });

    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    console.error("SignUp error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Sign in
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" });

    // You can return token and basic user info
    res.json({ message: "Login successful || Refresh the page for access", token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("SignIn error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
