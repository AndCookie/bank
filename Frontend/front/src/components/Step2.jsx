import React from 'react';

const StepTwo = ({ formData, updateFormData }) => {
  return (
    <div>
      <h2>멤버 선택하기</h2>
      <input
        type="text"
        placeholder="Select members"
        value={formData.members}
        onChange={(e) => updateFormData({ members: e.target.value })}
      />
      <input
        type="text"
        placeholder="Trip Name"
        value={formData.tripName}
        onChange={(e) => updateFormData({ tripName: e.target.value })}
      />

    </div>
  );
};

export default StepTwo;