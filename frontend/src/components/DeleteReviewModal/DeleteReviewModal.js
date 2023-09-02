import React from 'react';
import './DeleteReviewModal.css';

const DeleteReviewModal = ({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-review-modal">
            <div className="delete-review-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this review?</p>
                <div className="button-container">
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteReviewModal;
