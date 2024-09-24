import React from "react";
import './styles/Modal.css';

const OngoingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div>진행 중인 여행 정산 정보</div>
          <button onClick={onClose}>X</button>
        </div>
      </div>
    </>
  )
}

export default OngoingModal;