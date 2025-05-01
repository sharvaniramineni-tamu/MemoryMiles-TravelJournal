import React, { useState, useContext } from "react";
import axios from "../axios";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [mapLink, setMapLink] = useState(""); // New state for map link
  const [date, setDate] = useState("");
  const [placesStayed, setPlacesStayed] = useState("");
  const [budget, setBudget] = useState("");
  const [photos, setPhotos] = useState([]);
  const [text, setText] = useState("");
  const [bestMoments, setBestMoments] = useState("");
  const navigate = useNavigate();

  const handlePhotoUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let updatedPhotos = [...photos, ...selectedFiles];
    if (updatedPhotos.length > 5) {
      alert("You can only upload up to 5 images. Excess images have been ignored.");
      updatedPhotos = updatedPhotos.slice(0, 5);
    }
    setPhotos(updatedPhotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      alert("You need to be logged in to create a blog.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("title", title);
      formData.append("location", location);
      formData.append("mapLink", mapLink); // Append map link
      formData.append("date", date);
      formData.append("placesStayed", placesStayed);
      formData.append("budget", budget);
      formData.append("text", text);
      formData.append("bestMoments", bestMoments);
      photos.forEach(photo => formData.append("photos", photo));

      const { data: createdBlog } = await axios.post("/travelblogs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate(`/blogs/${createdBlog._id}`);
    } catch (err) {
      console.error("Failed to create blog:", err);
      alert("Error creating blog. Please try again.");
    }
  };

  return (
    <div className="auth-background">
      <div className="auth-container">
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Create Travel Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Blog Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          placeholder="Google Maps URL (optional)"
          value={mapLink}
          onChange={e => setMapLink(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          placeholder="Hotels Stayed"
          value={placesStayed}
          onChange={e => setPlacesStayed(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          placeholder="Budget"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <textarea
          placeholder="Journal about the travel"
          value={text}
          onChange={e => setText(e.target.value)}
          required
          rows={4}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <textarea
          placeholder="Best Moments"
          value={bestMoments}
          onChange={e => setBestMoments(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          style={{ margin: "8px 0" }}
        />
        <small style={{ display: 'block', marginBottom: '8px' }}>
          {photos.length} file(s) selected (max 5)
        </small>
        <button type="submit" style={{ padding: "10px 20px" }}>Create</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default Create;