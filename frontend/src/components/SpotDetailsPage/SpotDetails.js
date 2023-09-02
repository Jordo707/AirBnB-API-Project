import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spot";
import * as reviewActions from '../../store/reviews'
import "./SpotDetails.css";
import ReviewModal from "../SubmitReviewModal/SubmitReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);


    const spot = useSelector(state => state.spots.singleSpot);
    const userId = useSelector(state => state.session.user ? state.session.user.id : null);
    const spotOwnerId = spot.ownerId
    const reviewObject = useSelector(state => state.reviews.spot);
    const reviews = Object.values(reviewObject)

    // Convert avgNumStars to a number using parseFloat
    const avgNumStars = parseFloat(spot.avgNumStars);

    // Check if avgNumStars is a valid number, if not, set it to "New"
    const formattedAvgNumStars = isNaN(avgNumStars) ? "New" : avgNumStars.toFixed(1);


    // console.log(`Spot: `, spot)
    // console.log("userId: ", userId)
    // console.log('Reviews ',reviews)
    // console.log("spotOwnerId", spotOwnerId)
    // console.log("You are the spot owner:", spotOwnerId === userId)

    const handleDeleteReview = (reviewId) => {
        setReviewToDelete(reviewId);
    };

    // Conditionally render the submit review button
    const renderSubmitReviewButton = () => {
        if(!userId) {
            return null
        }

        if(userId && userId === spotOwnerId) {
            return null
        }

        if (userId && reviews.some(review => review?.User?.id === userId)) {
            return null;
        }

        return (
            <>
            <div className="review-button">
                <button onClick={openReviewModal}>Submit a review</button>
            </div>
            {reviewModalOpen && (
                <ReviewModal spotId={spotId} onClose={closeReviewModal} />
            )}
            </>
        )
    };

    const openReviewModal = () => {
        setReviewModalOpen(true);
    }

    const closeReviewModal = () => {
        setReviewModalOpen(false);
    };

    useEffect(() => {
        dispatch(spotActions.getSpotDetails(spotId));
        dispatch(reviewActions.getSpotReviews(spotId));

        return () => {
            // dispatch(spotActions.resetSingleSpotAction())
            dispatch(reviewActions.resetReviews())
        }
    }, [dispatch, spotId]);

    if (!spot.id || !reviews) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="spot-details">
                <div className="spot-header">
                     <h1>{spot.name}</h1>
                     <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
                </div>
                <div className="image-list">
                    <div className="spot-image-preview">
                        <img src={spot.SpotImages[0].url} alt={spot.name}/>
                    </div>
                    <div className="additional-images">
                        {spot.SpotImages.filter((image, index) => index !== 0).map(image => (
                            <img key={image.id} src={image.url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo0nwDRO1dYTQIhm9Sz8sA20Wqk8xaiNyhQg&usqp=CAU"} alt={spot.name}/>
                        ))}
                    </div>
                </div>
                <div className="spot-info">
                    <div className="spot-writeup">
                        <div className="spot-host">
                            <h2>Hosted by {`${spot.User.firstName} ${spot.User.lastName}`}</h2>
                        </div>
                        <div className="spot-description">
                            <p>{spot.description}</p>
                        </div>
                    </div>
                    <div className="reserve-box">
                            <div className="price">
                                ${spot.price}
                            </div>
                            <div className="review-score">
                                {formattedAvgNumStars}
                            </div>
                            <div className="num-reviews">
                                {spot.numReviews == 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews`}
                            </div>
                    </div>
                </div>
                <div className="dividing-line">
                            -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                </div>
                <div className="review-container">
                    <div className="review-header">
                        <div className="star-rating">
                            {formattedAvgNumStars}
                        </div>
                        <div className="number-reviews">
                            {spot.numReviews == 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews`}
                        </div>
                    </div>
                    {renderSubmitReviewButton()}
                    <div className="user-reviews">
                            {reviews.map(review => {
                                const createdAtDate = new Date(review.reviewData.createdAt);
                                const month = createdAtDate.toLocaleString('default', { month: 'long' });
                                const year = createdAtDate.getFullYear();
                                const formattedDate = `${month} ${year}`;
                                console.log("Rendering Review:",review)

                                return (

                                <div className="review-card" key={review.reviewData.id}>
                                    <div className="review-owner">
                                        {review.User.firstName}
                                    </div>
                                    <div className="review-date">
                                        {formattedDate}
                                    </div>
                                    <div className="review-content">
                                        {review.reviewData.review}
                                    </div>
                                    {userId === review.User.id && (
                                        <>
                                        <button onClick={() => handleDeleteReview(review.reviewData.id)}>Delete</button>
                                        <DeleteReviewModal
                                            isOpen={reviewToDelete === review.reviewData.id}
                                            onCancel={() => setReviewToDelete(null)}
                                            onConfirm={() => {
                                                dispatch(reviewActions.deleteUserReview(review.reviewData.id));
                                                console.log('reviewToDelete: ', review.reviewData.id)
                                                dispatch(spotActions.getSpotDetails(spotId))
                                                setReviewToDelete(null);
                                            }}
                                        />
                                        </>
                                    )}
                                </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        </>
    )
};

export default SpotDetails;
