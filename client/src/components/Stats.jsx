import React from "react";

export default function Stats({ blogs }) {
  const totalPosts = blogs.length;
  const uniquePlaces = new Set(blogs.map(b => b.location)).size;

  return (
    <div className="mb-6 p-4 bg-white rounded shadow flex justify-between">
      <div>
        <h3 className="text-xl font-semibold">Travel Stats</h3>
        <p>You’ve written {totalPosts} trip journal{totalPosts !== 1 ? "s" : ""}.</p>
        <p>You’ve visited {uniquePlaces} unique place{uniquePlaces !== 1 ? "s" : ""}.</p>
      </div>
    </div>
  );
}