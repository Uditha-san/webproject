import React from "react";

// Simple star rating component (shows 5 filled stars)
const StarRating = () => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: '#FFD700', fontSize: '1.2em' }}>★</span>
      ))}
    </div>
  );
};

export default StarRating;
