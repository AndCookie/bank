import React, { useState } from 'react';

const StepOne = ({ formData, updateFormData }) => {
  const [countryInput, setCountryInput] = useState('');

  // 국가 추가 함수
  const addCountry = () => {
    // formData.locations가 존재하지 않으면 빈 배열로 처리
    const currentLocations = formData.locations || [];

    if (countryInput && !currentLocations.some(loc => loc.country === countryInput)) {
      updateFormData({
        locations: [...currentLocations, { country: countryInput }],
      });
      setCountryInput('');
    }
  };

  const removeCountry = (index) => {
    const updatedLocations = formData.locations.filter((_, i) => i !== index);
    updateFormData({ locations: updatedLocations });
  };

  return (
    <div className="main-container">
      <h2 className="question">어디로 여행을 떠나시나요?</h2>
      {/* 국가 입력 */}
      <div className="first">
        <input
          type="text"
          placeholder="Add Country"
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && addCountry()} // Enter 키로 국가 추가
        />
        <button className="btn-add" onClick={addCountry}>+ 추가</button>
      </div>

      {/* 선택된 국가 리스트 */}
      <div className="chip-container">
        {formData.locations && formData.locations.length > 0 && (
          <ul>
            {formData.locations.map((location, index) => (
              <li key={index}>
                {location.country} <button onClick={() => removeCountry(index)}>X</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 날짜 입력 */}
      <div className="second">
        <input
          type="date"
          placeholder="Start Date"
          value={formData.start_date || ''}
          onChange={(e) => updateFormData({ start_date: e.target.value })}
        />
        <input
          type="date"
          placeholder="End Date"
          value={formData.end_date || ''}
          onChange={(e) => updateFormData({ end_date: e.target.value })}
        />
      </div>
    </div>
  );
};

export default StepOne;
