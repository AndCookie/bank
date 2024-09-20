import React from 'react';

const StepOne = ({ formData, updateFormData }) => {
  return (
    <div>
      <h2>Step 1</h2>
      <input
        type="text"
        placeholder="Select members"
        value={formData.members}
        onChange={(e) => updateFormData({ members: e.target.value })}
      />
      <input
        type="date"
        placeholder="Start Date"
        value={formData.dates.start}
        onChange={(e) => updateFormData({ dates: { ...formData.dates, start: e.target.value } })}
      />
      <input
        type="date"
        placeholder="End Date"
        value={formData.dates.end}
        onChange={(e) => updateFormData({ dates: { ...formData.dates, end: e.target.value } })}
      />
    </div>
  );
};

export default StepOne;