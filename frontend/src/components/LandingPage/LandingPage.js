// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Route, Switch, NavLink } from "react-router-dom/cjs/react-router-dom.min";
// import SpotCard from './SpotCard';
// import { getAllSpots } from "../../store/allSpots";

// const SpotList = () => {
//     const dispatch = useDispatch();
//     const spots = useSelector(state => Object.values(state.allSpots));
//     console.log('test')

//     useEffect(() => {
//         dispatch(getAllSpots());
//     }, [dispatch]);

//     return (
//         <div key='SpotsDiv'>
//             <ul>
//                 {spots.map(({id, name}) => (
//                     <li key={id}><NavLink to={`/spots/${id}`}>{name}</NavLink></li>
//                 ))}
//             </ul>

//             <Switch>
//                 <Route path='/spots/:id'>
//                     <SpotCard/>
//                 </Route>
//             </Switch>
//         </div>
//     )
// }

// export default SpotList

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllSpots } from "../../store/allSpots";
import "./LandingPage.css"; // Create a CSS file for styling

const SpotList = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.allSpots));

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
                                <img src={imageUrl} alt={spot.name} />
                            </div>
                            <div className="spot-card-details">
                                <div className="spot-card-row">
                                    <div className="spot-card-location">
                                        {`${spot.city}, ${spot.state}`}
                                    </div>
                                    <div className="spot-card-rating">
                                        {`Avg Rating: ${spot.avgRating || 'New'}`}
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
