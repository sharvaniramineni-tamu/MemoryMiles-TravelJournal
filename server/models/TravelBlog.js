import mongoose from "mongoose";

const TravelBlogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  title: { type: String, required: true },
  text: { type: String, required: true },  // renamed from `text`
  location: { type: String },
  date: { type: String },
  placesStayed: { type: String },
  budget: { type: String },
  photos: [{ type: String }],
  bestMoments: { type: String },
  mapLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TravelBlog", TravelBlogSchema);
