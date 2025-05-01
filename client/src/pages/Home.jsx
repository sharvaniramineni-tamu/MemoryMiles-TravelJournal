import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../authContext";
import { Link } from "react-router-dom";
import axios from "../axios";
import Stats from "../components/Stats";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      axios.get(`/travelblogs/${user._id}`).then(res => {
        setBlogs(res.data);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="auth-background">
        <div className="auth-container">
          <div className="home text-center mt-10">
            <h2 className="text-2xl mb-4">
              Get started with <span style={{ color: "var(--color-secondary)" }}>MemoryMiles</span>
            </h2>
            <Link to="/register" className="btn" style={{ marginRight: '1rem' }}>
              Register
            </Link>
            <Link to="/login" className="btn">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filtered = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="auth-background">
      <div className="auth-container">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Header and Create Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Welcome, {user.username}!</h2>
            <Link to="/create" className="btn">
              + Create New Travel Blog
            </Link>
          </div>

          {/* Travel Stats */}
          <Stats blogs={blogs} />
          <Link to="/recap" className="btn mb-6 inline-block">Show Recap Video</Link>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mb-6 p-2 border rounded"
          />

          {/* Blog Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((blog) => (
              <div key={blog._id} className="card rounded-lg overflow-hidden shadow p-4">
                <h3 className="text-xl font-bold mb-1">{blog.title}</h3>
                <p className="text-gray-600 mb-4">📍 {blog.location}</p>
                <Link to={`/blogs/${blog._id}`} className="btn inline-block">
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
