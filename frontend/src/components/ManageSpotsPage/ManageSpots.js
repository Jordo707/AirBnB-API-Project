import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserSpots, deleteUserSpot } from "../../store/spots";
import "./ManageSpots.css";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const UserSpotList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);

  const userSpots = spots.filter((spot) => spot.ownerId === user.id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);

  const handleDeleteClick = (spotId) => {
    setSpotToDelete(spotId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteUserSpot(spotToDelete));
    setShowDeleteModal(false);
    setSpotToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSpotToDelete(null);
  };

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
              <div className="spot-card-container" key={spot.id} title={spot.name}>
                <div className="spot-card">
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
                                     {typeof spot.avgRating === 'string' ?
                                        parseFloat(spot.avgRating).toFixed(1) :
                                        typeof spot.avgRating === 'number' ?
                                        `★ ${spot.avgRating.toFixed(1)}` :
                                        '★ New'
                                      }
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
                    <Link to={`/spots/${spot.id}/edit`} className="edit-button">
                        Edit
                    </Link>
                    <button className="delete-spot-button" onClick={() => handleDeleteClick(spot.id)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default UserSpotList;
