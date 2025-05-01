import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";

import {
    login,
    register,
    deleteUser
} from "../controllers/user.js ";

const router = express.Router();

// Ensure the 'uploads' folder exists
const uploadDir = "../uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
  
const upload = multer({ storage });

// Register Route
router.post("/register", upload.single("file"), async (req, res) => {
  try {
      const { username, email, password } = req.body;
      const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

      // Create new user
      const newUser = new User({
          username,
          email,
          password,
          profilePic: profileImage, // Store the local file path
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

//router.post("/register", register)
// server/routes/user.js
/*router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Check if the password is correct
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token expiration time
      });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  */
  
router.delete('/:id', deleteUser)

const Blog = require('../models/Blog');

// Get blogs for a specific user
router.get('/:username', async (req, res) => {
  try {
      const blogs = await Blog.find({ username: req.params.username });
      res.json(blogs);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching blogs' });
  }
});

// Create a new blog
router.post('/', async (req, res) => {
  try {
      const newBlog = new Blog(req.body); // Assumes Blog model validates input
      const savedBlog = await newBlog.save();
      res.json(savedBlog);
  } catch (err) {
      res.status(500).json({ message: 'Error creating blog' });
  }
});

router.get("/:id", getUserProfile);


export default router;
