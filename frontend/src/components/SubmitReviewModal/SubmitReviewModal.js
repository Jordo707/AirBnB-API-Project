import React, {useState} from "react";
import { useDispatch } from "react-redux";
import StarRating from "./StarRating";
import * as reviewActions from "../../store/reviews"
import * as spotActions from "../../store/spots"
import './SubmitReviewModal.css'
import { useSelector } from "react-redux";

const ReviewModal = ({ spotId, onClose }) => {
    const dispatch = useDispatch();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const user = useSelector(state => state.session.user)
//   console.log(object)

//   console.log("=---------------------landed-----------")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (review.length < 10 || stars === 0) {
      // Handle validation (e.g., show an error message)
      return;
    }

    // Submit the review
    const response = await dispatch(reviewActions.submitReview(spotId, review, stars, user));

    // console.log("response, ",response)

    if (response.id) {
        // console.log("made it to the response.id")
        await(dispatch(spotActions.getSpotDetails(spotId)))
    }


    // Close the modal
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>

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
        <button type="submit">Submit Review</button>
      </div>
    </div>
    </form>
  );
};

  export default ReviewModal;
