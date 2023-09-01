import React, {useState} from "react";
import { useDispatch } from "react-redux";
import StarRating from "./StarRating";
import * as reviewActions from "../../store/reviews"
import './SubmitReviewModal.css'

const ReviewModal = ({ spotId, onClose }) => {
    const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);

  const handleSubmit = async () => {
    if (review.length < 10 || stars === 0) {
      // Handle validation (e.g., show an error message)
      return;
    }

    // Submit the review
    await dispatch(reviewActions.submitReview(spotId, review, stars));

    // Close the modal
    onClose();
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>How was your stay?</h2>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Leave your review here..."
        />
        <div className="star-rating">
            <StarRating totalStars={5} rating={stars} onRatingChange={setStars} />
        </div>
        <button onClick={handleSubmit}>Submit Review</button>
      </div>
    </div>
  );
};

  export default ReviewModal;
