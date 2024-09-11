import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdClose } from 'react-icons/md'; // react-icons에서 아이콘 가져오기
import StepOne from '../components/StepOne';
import StepTwo from '../components/StepTwo';
import StepThree from '../components/StepThree';
import StepFour from '../components/StepFour';
import './styles/TripCreate.css';

const TripCreate = () => {
  const [step, setStep] = useState(0); // Vue에서 0부터 시작했으므로 맞춤
  const [showCancelModal, setShowCancelModal] = useState(false); // 취소 모달 관리
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    members: [],
    dates: { start: '', end: '' },
    tripName: '',
    destination: '',
    settlementTime: '',
    account: ''
  });

  // 폼 데이터 업데이트 함수
  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const cancelTrip = () => setShowCancelModal(true); // 취소 모달 열기
  const closeCancelModal = () => setShowCancelModal(false); // 모달 닫기
  const clearTrip = () => {
    // 여행 생성 취소 로직 처리
    setShowCancelModal(false);
    navigate('/trip');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepOne formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <StepTwo formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <StepThree formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <StepFour formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header my-2">
        <div className="back">
          {step > 0 && (
            <MdArrowBack className="btns" size={30} onClick={prevStep} />
          )}
        </div>
        <div className="cancel">
          <MdClose className="btns" size={30} onClick={cancelTrip} />
        </div>
      </div>

      {/* Main Form */}
      <div className="main px-2">
        {renderStep()}
      </div>

      {/* Next Button */}
      <div className="bottom">
        {step < 3 && (
          <button className="next-btn" onClick={nextStep}>
            다 &nbsp; 음
          </button>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal">
          <div className="modal-container">
            <div className="modal-message">
              <span>여행 생성을 취소하시겠습니까?</span>
            </div>
            <div className="modal-btns">
              <button className="modal-btn" onClick={clearTrip}>
                네
              </button>
              <button className="modal-btn" onClick={closeCancelModal}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCreate;