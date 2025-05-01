// client/src/pages/ViewBlog.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../axios";
import { AuthContext } from "../authContext";

export default function ViewBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axios.get(`/travelblogs/blog/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Error loading blog:", err);
      }
    }
    fetchBlog();
  }, [id]);

  if (!blog) return <div className="text-center mt-10">Loading...</div>;

  // Only embed if it's a valid Google Maps URL
  const embedUrl = blog.mapLink && blog.mapLink.includes("google.com/maps")
    ? blog.mapLink.replace("/maps", "/maps/embed")
    : null;

  return (
    <div className="auth-background">
      <div className="auth-container">
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* Title and metadata */}
      <h1 className="text-3xl font-bold mb-2 text-blue-800">{blog.title}</h1>
      <p className="text-gray-600 italic mb-4">
        📍 {blog.location} | 📅 {new Date(blog.date).toLocaleDateString()}
      </p>

      {/* Embedded Google Map (only if valid) */}
      {embedUrl && (
        <div className="mb-6" style={{ width: '100%', height: '300px' }}>
          <iframe
            src={embedUrl}
            title="Location Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
      )}

      {/* Clickable Map Link */}
      {blog.mapLink && (
        <p className="mb-6">
          <a
            href={blog.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Open in Google Maps
          </a>
        </p>
      )}

      {/* Details and content */}
      <p className="text-md mb-4"><strong>Stayed at:</strong> {blog.placesStayed}</p>
      <p className="text-md mb-4"><strong>Budget:</strong> {blog.budget}</p>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Journal:</h2>
        <p className="whitespace-pre-wrap leading-relaxed">{blog.text}</p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Best Moments:</h2>
        <p className="whitespace-pre-wrap leading-relaxed">{blog.bestMoments}</p>
      </section>

      {/* Image gallery */}
      {blog.photos?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {blog.photos.map((url, idx) => {
            const src = url.startsWith("/uploads")
              ? `http://localhost:5500${url}`
              : url;
            return (
              <div
                key={idx}
                style={{
                  width: '200px', height: '150px',
                  overflow: 'hidden', borderRadius: '8px',
                  border: '1px solid #ccc', display: 'flex',
                  justifyContent: 'center', alignItems: 'center'
                }}
              >
                <img
                  src={src}
                  alt={`Photo ${idx + 1}`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Delete for author */}
      {user?._id === blog.userId && (
        <footer className="flex justify-end space-x-4">
          <Link
            to={`/blogs/${id}/edit`}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </Link>
          <button
            onClick={async () => {
              if (window.confirm("Delete this blog?")) {
                await axios.delete(`/travelblogs/${id}`, { data: { userId: user._id } });
                navigate("/");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </footer>
      )}
    </div>
        </div>
      </div>
  );
}
