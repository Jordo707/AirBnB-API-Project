import React from "react";

const SpotCard = ({spot}) => {
    return (
        <>
            <div className="spot-card">
                <h2>{spot.name}</h2>
                <p>{spot.description}</p>
                <p>{spot.price}</p>
            </div>
        </>
    );
};

export default SpotCard;
