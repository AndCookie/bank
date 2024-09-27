import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdClose } from 'react-icons/md';
import StepOne from '../components/Step1';
import StepTwo from '../components/Step2';
import StepThree from '../components/Step3';
import StepFour from '../components/Step4';
import '@/styles/TripCreatePage.css';
import { useTripStore } from '../stores/tripStore';
import { useErrorStore } from '../stores/errorStore'; // Error Store 가져오기

const TripCreatePage = () => {
  const [step, setStep] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();
  const { setTrip, clearTrip: clearTripStore } = useTripStore();
  const { setError } = useErrorStore(); // 에러 메시지 설정 함수 가져오기
  const [formData, setFormData] = useState({
    locations : [],
    dates: { start: '', end: '' },
    members: [],
    tripName: '',
    bankAccount: '',
  });

  // 폼 데이터 업데이트 함수
  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // 각 스텝별 필수 입력값 검증
  const validateStep = () => {
    switch (step) {
      case 0: // Step 1: 국가, 날짜, 목적지 검증
        if (!formData.locations.length || !formData.dates.start || !formData.dates.end) {
          setError('국가, 날짜, 또는 목적지를 입력해주세요.'); // 에러 메시지 설정
          return false;
        }
        return true;
      case 1: // Step 2: 여행 이름 및 멤버 검증
        if (!formData.tripName || !formData.members.length) {
          setError('여행 이름과 참여 인원을 입력해주세요.');
          return false;
        }
        return true;
      case 2: // Step 3: 정산 계좌 검증
        if (!formData.account) {
          setError('정산 계좌를 입력해주세요.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    // 상태 확인 로그 추가
    console.log('Current Form Data:', formData);
    
    if (validateStep()) {
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1);

  const cancelTrip = () => setShowCancelModal(true);
  const closeCancelModal = () => setShowCancelModal(false);

  const clearTrip = () => {
    clearTripStore(); // Zustand 스토어의 여행 데이터 초기화
    setShowCancelModal(false);
    navigate('/trip');
  };

  const saveTrip = () => {
    const { locations, dates, members, tripName, bankAccount } = formData;
    setTrip(locations, dates.start, dates.end, members, tripName, bankAccount);
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
        return <StepFour formData={formData} saveTrip={saveTrip} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header my-2">
        <div className="back">
          {step > 0 && <MdArrowBack className="btns" size={30} onClick={prevStep} />}
        </div>
        <div className="cancel">
          <MdClose className="btns" size={30} onClick={cancelTrip} />
        </div>
      </div>

      {/* Main Form */}
      <div className="main px-2">{renderStep()}</div>

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

export default TripCreatePage;