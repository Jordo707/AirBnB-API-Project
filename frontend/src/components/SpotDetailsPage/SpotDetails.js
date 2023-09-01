import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spot";
import * as reviewActions from '../../store/reviews'
import "./SpotDetails.css";

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const spot = useSelector(state => state.spots.singleSpot);

    console.log(`Spot: `, spot)

    const reviews = useSelector(state => state.reviews.Reviews);

    console.log('Reviews ',reviews)

    useEffect(() => {
        dispatch(spotActions.getSpotDetails(spotId));
        dispatch(reviewActions.getSpotReviews(spotId));
    }, [dispatch, spotId]);

    if (!spot.id) {
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
                                {spot.avgNumStars || "new"}
                            </div>
                            <div className="num-reviews">
                                {spot.numReviews === 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews`}
                            </div>
                    </div>
                </div>
            </div>
        </>
    )

    // return (

            //
            // <div className="spot-details">
            //     <div className="spot-header">
            //         <h1>{spot.name}</h1>
            //         <h3>{`${spot.city}, ${spot.state}, ${spot.country}`}</h3>
            //     </div>

        {/* <div className="image-list">
            <div className="spot-image-preview">
                <img src={previewUrl} alt={spot.name} />
            </div>
            <div className="additional-images">
                {spotImages.map(image => (
                        <img key={image.id} src={image.url || defaultImageUrl} alt={spot.name} />
                    ))}
            </div>
        </div> */}

                // <div className="spot-user-info">
                //     <h2>Hosted by {`${spot.User.firstName} ${spot.User.lastName}`}</h2>
                // </div>

                // <div className="spot-description">
                //     <p>{spot.description}</p>
                // </div>


            //  {/* <div className="spot-reviews">
            //             //! Sort out the review issues
            //                 <h2>Reviews:</h2>
            //                         {reviews.map(review => (
                //                             <div className="review-card">
                //                                 <div className="reviewer">
                //                                     {review.User.firstName}
                //                                 </div>
                //                                 <div className="review-date">
                //                                     {review.createdAt}
                //                                 </div>
                //                                 <div className="review-content">
                //                                     {review.review}
                //                                 </div>
                //                             </div>
                //                         ))}
            //             </div> */}
            // </div>
            // );
            // )
};

export default SpotDetails;
