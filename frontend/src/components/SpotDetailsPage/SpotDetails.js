import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spot"
import "./SpotDetails.css";

const SpotDetails = () => {
    const dispatch = useDispatch();
    console.log(useParams())
    const { spotId } = useParams();

    const spot = useSelector(state => state.spot.spot);
    useEffect(() => {
        dispatch(spotActions.getSpotDetails(spotId));
    }, [dispatch, spotId]);



    if (!spot) {
        return <div>Loading...</div>;
    }

    const previewImage = spot.SpotImages.find(image => image.preview === true);

    let previewUrl
    if(previewImage) {
        previewUrl = previewImage.url
    }else {
        previewUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo0nwDRO1dYTQIhm9Sz8sA20Wqk8xaiNyhQg&usqp=CAU"
    }
    return (
        <div className="spot-details">
            <div className="spot-header">
                <h1>{spot.name}</h1>
                <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
            </div>

            <div className="main-spot-image">
                <img src={previewUrl} alt={spot.name} />
            </div>

            <div className="image-list">
                    {/* {spot.spotImages.map(image => (
                        <img key={image.id} src={image.url} alt={spot.name} />
                    ))} */}
            </div>

            <div className="spot-user-info">
                <h2>Hosted by {`${spot.User.firstName} ${spot.User.lastName}`}</h2>
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
