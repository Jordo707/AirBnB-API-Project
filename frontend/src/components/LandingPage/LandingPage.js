import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllSpots } from "../../store/spots";
import "./LandingPage.css";

const SpotList = () => {
    const dispatch = useDispatch();
    const spotsObject = useSelector(state => state.spots.allSpots);

    // console.log("Spots Object",spotsObject)

    const spots = Object.values(spotsObject);

    // console.log("Spots ", spots)

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    return (
        <div className="spot-list">
            {spots.map(spot => {
                if (!spot.id || !spot.name || !spot.price) {
                    return null;
                }

                const imageUrl = spot.previewImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo0nwDRO1dYTQIhm9Sz8sA20Wqk8xaiNyhQg&usqp=CAU";

                return (
                    <div className="spot-card" key={spot.id} title={spot.name}>
                        <Link to={`/spots/${spot.id}`} className="spot-card-link">
                            <div className="spot-card-image">
                                <div className="image-container">
                                 <img src={imageUrl} alt={spot.name} className="spot-card-img" />
                                </div>
                            </div>
                            <div className="spot-card-details">
                                <div className="spot-card-row">
                                    <div className="spot-card-location">
                                        {`${spot.city}, ${spot.state}`}
                                    </div>
                                    <div className="spot-card-rating">
                                        {typeof spot.avgRating === 'number' ? spot.avgRating.toFixed(1) : 'New'}
                                    </div>
                                </div>
                                <div className="spot-card-row">
                                    <div className="spot-card-price">
                                        {`$${spot.price} night`}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default SpotList;
