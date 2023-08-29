import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotDetails } from "../../store/spot";
import "./SpotDetails.css";

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const spot = useSelector(state => state.spot.details); // Make sure this matches your Redux store structure

    useEffect(() => {
        dispatch(getSpotDetails(id));
    }, [dispatch, id]);

    if (!spot) {
        return <div>Loading...</div>;
    }

    return (
        <div className="spot-details">
            {/* Header */}
            <div className="spot-header">
                <h1>{spot.name}</h1>
                <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
            </div>

            {/* Preview Image */}
            <div className="spot-image">
                <img src={spot.previewImage} alt={spot.name} />
            </div>

            {/* User Information */}
            <div className="spot-user-info">
                <h2>Owner: {`${spot.User.firstName} ${spot.User.lastName}`}</h2>
            </div>

            {/* Description */}
            <div className="spot-description">
                <p>{spot.description}</p>
            </div>

            {/* Reviews */}
            <div className="spot-reviews">
                <h2>Reviews:</h2>
                {spot.Reviews.map(review => (
                    <div className="review" key={review.id}>
                        <p>By: {review.User.firstName}</p>
                        <p>Date: {new Date(review.createdAt).toLocaleDateString()}</p>
                        <p>{review.review}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpotDetails;
