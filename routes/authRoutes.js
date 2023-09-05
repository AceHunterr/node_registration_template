const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authController = require("../controllers/authController");
const User = require("../models/User");
const path = require("path");

// Register a new user
router.post(
  "/register",
  [
    check("username")
      .isLength({ min: 1 })
      .withMessage("Username must not be empty"),
    check("password")
      .isLength({ min: 1 })
      .withMessage("Password must not be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    authController.register(req, res);
  }
);

router.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

// Shorter login form
router.post(
  "/login",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    authController.login(req, res);
  }
);

// router.get("/register", (req, res) => {
//   res.send("This is the registration page or a message");
// });

// Login

router.get("/users", async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({}, "username");
    const usernames = users.map((user) => user.username);

    res.json({ usernames });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
