import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserSpots } from "../../store/allSpots";
import "./ManageSpots.css";

const UserSpotList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const spots = useSelector((state) => Object.values(state.allSpots));

  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);

  const userSpots = spots.filter((spot) => spot.ownerId === user.id);

  return (
    <>
      <h2>Manage Spots</h2>
      <div className="spot-list">
        {userSpots.length === 0 ? (
          <div className="no-spots-message">
            <p>You don't have any spots yet.</p>
            <Link to="/spots/new" className="create-spot-link">
              Create New Spot
            </Link>
          </div>
        ) : (
          userSpots.map((spot) => {
            if (!spot.id || !spot.name || !spot.price) {
              return null;
            }

            const imageUrl =
              spot.previewImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo0nwDRO1dYTQIhm9Sz8sA20Wqk8xaiNyhQg&usqp=CAU";

            return (
              <div className="spot-card-contianer" key={spot.id} title={spot.name}>
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
                                         {`${spot.avgRating !== undefined && spot.avgRating !== null ? spot.avgRating.toFixed(1) : 'New'}`}
                                     </div>
                                 </div>
                                 <div className="spot-card-row">
                                     <div className="spot-card-price">
                                         {`$${spot.price} night`}
                                     </div>
                                 </div>
                             </div>
                         </Link>
                     <div className="card-footer">
                         <button>Edit</button>
                         <button>Delete</button>
                     </div>
                     </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default UserSpotList;
