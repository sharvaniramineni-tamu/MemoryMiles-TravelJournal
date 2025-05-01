import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { AuthContext } from "../authContext";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    async function fetchProfile() {
      try {
        const res = await axios.get(`/users/${user._id}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    }
    fetchProfile();
  }, [user, navigate]);

  if (!profile) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Determine full image URL
  const imgUrl = profile.profilePic.startsWith("http")
    ? profile.profilePic
    : `http://localhost:5500/uploads/${profile.profilePic}`;

  return (
    <div className="auth-background">
      <div className="auth-container">
      <h2 className="text-2xl font-semibold mb-1">{profile.username}</h2>
        <p className="text-gray-600 mb-4">{profile.email}</p>
    <div className="max-w-md mx-auto py-8 px-4 bg-white shadow rounded-lg mt-10">
      <div className="flex flex-col items-center">
        {profile.profilePic && (
          <div
            style={{
              width: '160px',
              height: '120px',
              overflow: 'hidden',
              borderRadius: '8px',
              border: '1px solid #ccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              src={imgUrl}
              alt="Profile"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
      </div>
    </div>
    </div>
    </div>
  );
}
