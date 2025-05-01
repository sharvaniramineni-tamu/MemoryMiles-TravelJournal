import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  budget: {
    type: String, // Could also use Number if consistent
  },
  placesStayed: {
    type: String,
  },
  photos: {
    type: [String],
  },
  text: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Entry", EntrySchema);
