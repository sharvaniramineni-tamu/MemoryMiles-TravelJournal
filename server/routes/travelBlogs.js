import express from "express";
import TravelBlog from "../models/TravelBlog.js";
const router = express.Router();

// Get all blogs for a user
router.get("/:userId", async (req, res) => {
  try {
    const blogs = await TravelBlog.find({ userId: req.params.userId });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new blog (old method)
router.post("/", async (req, res) => {
  const newBlog = new TravelBlog(req.body);
  try {
    const saved = await newBlog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create blog with image upload
import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post("/upload", upload.array("photos"), async (req, res) => {
  try {
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    const newBlog = new TravelBlog({
      userId: req.body.userId,
      title: req.body.title,
      text: req.body.text,           // now matches schema
      location: req.body.location,
      date: req.body.date,
      placesStayed: req.body.placesStayed,
      budget: req.body.budget,
      bestMoments: req.body.bestMoments,
      mapLink: req.body.mapLink,
      photos: imagePaths
    });
    const saved = await newBlog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Error uploading blog" });
  }
});

// Get single blog
router.get("/blog/:id", async (req, res) => {
  try {
    const blog = await TravelBlog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT: Update blog
router.put("/:id", async (req, res) => {
  try {
    const blog = await TravelBlog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.userId.toString() !== req.body.userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const updated = await TravelBlog.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});


// DELETE: Remove blog
router.delete("/:id", async (req, res) => {
  try {
    const blog = await TravelBlog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    await TravelBlog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;
