import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";
import { AuthContext } from "../authContext";

const EditBlog = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    date: "",
    placesStayed: "",
    budget: "",
    text: "",
    bestMoments: "",
  });

  useEffect(() => {
    axios.get(`/travelblogs/blog/${id}`).then(res => {
      if (res.data.userId !== user._id) return navigate("/");
      setForm(res.data);
    });
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        userId: user._id  // ✅ Add userId for backend authorization
      };
      await axios.put(`/travelblogs/${id}`, payload);
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error("Failed to update blog:", err);
    }
  };
  
  return (
    <div className="auth-background">
        <div className="auth-container">
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-xl font-semibold mb-4">Edit Your Blog</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          key !== "photos" && (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={key}
              value={value}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          )
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default EditBlog;