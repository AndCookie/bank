import React from "react";
import './styles/Modal.css';

const SketchModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h1>AI 스케치</h1>
        <button onClick={onClose}>X</button>
      </div>
    </div>
  );
}

export default SketchModal;