import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spot"
import "./SpotDetails.css";

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector(state => state.spot.spot);
    useEffect(() => {
        dispatch(spotActions.getSpotDetails(spotId));
    }, [dispatch, spotId]);

    if (!spot) {
        return <div>Loading...</div>;
    }
    return (
        <div className="spot-details">
            <div className="spot-header">
                <h1>{spot.name}</h1>
                <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
            </div>

            <div className="spot-image">
                <img src={spot.previewImage} alt={spot.name} />
            </div>

            <div className="spot-user-info">
                <h2>Owner: {`${spot.User.firstName} ${spot.User.lastName}`}</h2>
            </div>

            <div className="spot-description">
                <p>{spot.description}</p>
            </div>

            <div className="spot-reviews">
                <h2>Reviews:</h2>
            </div>
        </div>
    );
};

export default SpotDetails;
