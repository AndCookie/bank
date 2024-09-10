import React, { useState } from 'react';
import StepOne from '../components/StepOne';
import StepTwo from '../components/StepTwo';
import StepThree from '../components/StepThree';
import StepFour from '../components/StepFour';
import './styles/TripPage.css';

const TripCreate = () => {
  const [step, setStep] = useState(1);
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <StepTwo formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <StepThree formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <StepFour formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="trip-create-container">
      {renderStep()}
      <div className="navigation-buttons">
        {step > 1 && <button onClick={prevStep}>Previous</button>}
        {step < 4 && <button onClick={nextStep}>Next</button>}
      </div>
    </div>
  );
};

export default TripCreate;