import React from 'react';

const StepThree = ({ formData, updateFormData }) => {
  return (
    <div>
      <h2>Step 3: Set Settlement Time and Account</h2>
      <input
        type="text"
        placeholder="Settlement Time"
        value={formData.settlementTime}
        onChange={(e) => updateFormData({ settlementTime: e.target.value })}
      />
      <input
        type="text"
        placeholder="Account"
        value={formData.account}
        onChange={(e) => updateFormData({ account: e.target.value })}
      />
    </div>
  );
};

export default StepThree;