import React from 'react';

const StepFour = ({ formData }) => {
  const handleSubmit = () => {
    console.log('Trip Created:', formData);
  };

  return (
    <div>
      <h2>Step 4: Review and Submit</h2>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      <button onClick={handleSubmit}>Create Trip</button>
    </div>
  );
};

export default StepFour;