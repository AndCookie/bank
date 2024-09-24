import React from "react";
import './styles/Modal.css';

const TripInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div>여행 상세 정보</div>
          <button onClick={onClose}>X</button>
        </div>
      </div>
    </>
  )
}

export default TripInfoModal;