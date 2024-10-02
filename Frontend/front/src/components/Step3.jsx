import React from 'react';
import './styles/Steps.css'

const StepThree = ({ formData, updateFormData }) => {
  return (
    <div>
      <h2>정산 계좌 선택</h2>
      <input
        type="text"
        placeholder="Bank Account"
        value={formData.bankAccount}
        onChange={(e) => updateFormData({ bankAccount: e.target.value })}
      />
    </div>
  );
};

export default StepThree;
