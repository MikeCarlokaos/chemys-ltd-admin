// crud-admin/server/src/routes/auth.js

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, message: "User registered" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        console.log("Login successful");
        const token = jwt.sign({ username: user.username }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });
        res.json({ success: true, message: "Login successful", token });
      } else {
        console.log("Login failed: Invalid credentials");
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    } else {
      console.log("Login failed: User not found");
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/user-info", async (req, res) => {
  try {
    const { user } = req;

    if (user) {
      res.json({ success: true, username: user.username });
    } else {
      res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
