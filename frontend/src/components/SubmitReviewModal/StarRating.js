import React, { useState } from 'react';
import './StarRating.css'

const StarRating = ({ totalStars, rating, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (selectedRating) => {
    onRatingChange(selectedRating);
  };

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            className={`star ${starValue <= (hoveredRating || rating) ? 'filled' : ''}`}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => setHoveredRating(starValue)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            &#9733;
          </span>
        );
      })}
       Stars
    </div>
  );
};

export default StarRating;
