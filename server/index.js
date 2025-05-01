import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import travelBlogsRoute from "./routes/travelBlogs.js";



const app = express();
const PORT = 5500;

dotenv.config();  // Load environment variables from .env

// Middleware
app.use(express.json()); // ✅ Fix: Parse JSON properly
app.use(cors()); // ✅ Enable CORS
app.use(express.urlencoded({ extended: true })); // ✅ Parse URL-encoded bodies

// Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String } // ✅ Add profile picture field
});
const User = mongoose.model("User", UserSchema);

// Registration Route
app.post("/api/users/register", upload.single("file"), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const profilePic = req.file ? req.file.filename : null; // ✅ Save filename

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User({ username, email, password, profilePic });
        await newUser.save();

        console.log("User registered:", newUser);
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: "Username not found" });
      }
  
      if (user.password !== password) {
        return res.status(400).json({ error: "Incorrect password" });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
  
      //res.status(200).json({ message: "Login successful", token });
      res.status(200).json({
        message: "Login successful",
        token: token,
        user: {
          _id: user._id,
          username: user.username
        }
      });      
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { username, email, profilePic } = user;
      res.status(200).json({ username, email, profilePic });
    } catch (err) {
      console.error("Profile fetch error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.use("/api/travelblogs", travelBlogsRoute);
app.use("/uploads", express.static("uploads"));


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
