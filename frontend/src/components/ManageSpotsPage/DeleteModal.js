import React from 'react';
import ReactDOM from 'react-dom';
// import './DeleteModal.css';

const DeleteModal = ({ onClose, children }) => {
    return ReactDOM.createPortal(
        <div className="modal">
            <div className="modal-content">
                {children}
                <button className="modal-close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default DeleteModal;
