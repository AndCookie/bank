import React from 'react';
import styles from './styles/Steps.module.css'

const StepThree = ({ formData, updateFormData }) => {
  return (
    <div>
      <h2>정산 계좌 선택</h2>
      <input
        type="text"
        placeholder="Bank Account"
        value={formData.bank_account}
        onChange={(e) => updateFormData({ bank_account: e.target.value })}
      />
    </div>
  );
};

export default StepThree;
