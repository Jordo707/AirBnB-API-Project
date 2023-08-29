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
            {spots.map((spot, index) => (
                <div className="spot-card" key={spot.id}>
                    <Link to={`/spots/${spot.id}`}>
                        <img src={spot.imageUrl} alt={spot.name} />
                        <h3>{spot.name}</h3>
                        <p>Price: ${spot.price}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default SpotList;
