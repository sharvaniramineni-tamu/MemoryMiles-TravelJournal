import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EntryDetails = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      const res = await axios.get(`/api/entries/${id}`);
      setEntry(res.data);
    };
    fetchEntry();
  }, [id]);

  if (!entry) return <div>Loading...</div>;

  return (
    <div>
      <h1>{entry.title}</h1>
      <p>{entry.location} | {entry.date}</p>
      <p>Budget: {entry.budget}</p>
      <p>Stayed at: {entry.placesStayed}</p>
      <p>{entry.text}</p>
      {entry.photos.map((photo, idx) => (
        <img key={idx} src={photo} alt="trip" width={200} />
      ))}
    </div>
  );
};

export default EntryDetails;
