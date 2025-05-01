import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      console.error("User is not logged in or user ID missing");
      alert("You need to be logged in to create a blog.");
      return;
    }

    try {
      const response = await axios.post("/api/travelblogs", {
        userId: user._id,
        title,
        content,
        location,
      });

      const createdBlog = response.data;
      if (!createdBlog._id) {
        console.warn("Blog created but no ID returned.");
        navigate("/travelblogs"); // fallback navigation
      } else {
        navigate(`/travelblogs/${createdBlog._id}`);
      }
    } catch (err) {
      console.error("Failed to create blog:", err);
      alert("Error creating blog. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Create Travel Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          style={{ width: "100%", padding: "8px", margin: "8px 0" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>Create</button>
      </form>
    </div>
  );
};

export default CreateBlog;
