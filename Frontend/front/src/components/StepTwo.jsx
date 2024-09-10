import React from 'react';

const StepTwo = ({ formData, updateFormData }) => {
  return (
    <div>
      <h2>Step 2: Set Destination and Trip Name</h2>
      <input
        type="text"
        placeholder="Trip Name"
        value={formData.tripName}
        onChange={(e) => updateFormData({ tripName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Destination"
        value={formData.destination}
        onChange={(e) => updateFormData({ destination: e.target.value })}
      />
    </div>
  );
};

export default StepTwo;