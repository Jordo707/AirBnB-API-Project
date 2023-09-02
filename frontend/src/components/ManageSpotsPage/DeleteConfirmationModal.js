import React from "react";
import { useModal } from "../../context/Modal";
import "./DeleteConfimationModal.css";

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
  const { closeModal } = useModal();

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot?</p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>
            Yes (Delete Spot)
          </button>
          <button className="cancel-button" onClick={onCancel}>
            No (Keep Spot)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
