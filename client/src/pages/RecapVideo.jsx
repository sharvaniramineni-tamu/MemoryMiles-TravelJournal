import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../authContext";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

export default function RecapVideo() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const canvasRef = useRef(null);

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    axios.get(`/travelblogs/${user._id}`).then(res => setBlogs(res.data));
  }, [user, navigate]);

  useEffect(() => {
    if (!blogs.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 360;

    const stream = canvas.captureStream();
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoUrl(URL.createObjectURL(blob));
    };

    async function generate() {
      recorder.start();
      for (let blog of blogs) {
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw photo if valid
        const photoPath = blog.photos && blog.photos[0]
          ? (blog.photos[0].startsWith('/uploads')
              ? `http://localhost:5500${blog.photos[0]}`
              : blog.photos[0])
          : null;

        if (photoPath) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = photoPath;
          await new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          if (img.naturalWidth && img.naturalHeight) {
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
          }
        }

        // Overlay stats text
        ctx.fillStyle = 'black';
        ctx.font = '20px sans-serif';
        ctx.fillText(`Trips: ${blogs.length}`, 10, 30);
        ctx.fillText(`Places: ${new Set(blogs.map(b => b.location)).size}`, 10, 60);

        // Hold frame
        await sleep(2000);
      }
      recorder.stop();
    }

    generate();
  }, [blogs]);

  return (
    <div className="auth-background">
      <div className="auth-container">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <h2 className="text-2xl font-semibold mb-4">Travel Recap Video</h2>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {videoUrl ? (
            <video src={videoUrl} controls width="100%" />
          ) : (
            <p>Generating your recap video...</p>
          )}
        </div>
      </div>
    </div>
  );
}
