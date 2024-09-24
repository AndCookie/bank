import React from 'react';
import { useErrorStore } from '@/stores/errorStore'; // Error Store 가져오기
import './styles/ErrorModal.css'

const ErrorModal = () => {
  const { errorMessage, showErrorModal, clearError } = useErrorStore();

  if (!showErrorModal) return null; // 모달을 보여줄 필요가 없으면 null 반환

  return (
    <div className="modal">
      <div className="modal-container">
        <div className="modal-message">
          <span>{errorMessage}</span>
        </div>
        <div className="modal-btns">
          <button className="modal-btn" onClick={clearError}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;