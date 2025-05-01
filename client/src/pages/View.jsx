import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const View = () => {
  const { id } = useParams();
  const [travelBlog, setTravelBlog] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5500/api/travel-blogs/${id}`);
        setTravelBlog(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBlogDetails();
  }, [id]);

  if (!travelBlog) return <p>Loading...</p>;

  return (
    <div>
      <h1>{travelBlog.title}</h1>
      <p>{travelBlog.content}</p>
      <p><strong>Location: </strong>{travelBlog.location}</p>
      <p><strong>Date: </strong>{travelBlog.date}</p>
    </div>
  );
};

export default View;
