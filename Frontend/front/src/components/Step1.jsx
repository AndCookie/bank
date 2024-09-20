import React, { useState } from 'react';

const StepOne = ({ formData, updateFormData }) => {
  const [countryInput, setCountryInput] = useState(''); // 입력한 국가를 저장하는 상태

  // 국가 추가 함수
  const addCountry = () => {
    if (countryInput && !formData.countries.includes(countryInput)) {
      // 기존 국가 목록에 새로운 국가 추가
      updateFormData({ countries: [...formData.countries, countryInput] });
      setCountryInput(''); // 입력 필드 초기화
    }
  };

  // 국가 삭제 함수
  const removeCountry = (index) => {
    const updatedCountries = formData.countries.filter((_, i) => i !== index);
    updateFormData({ countries: updatedCountries });
  };

  return (
    <div>
      <h2>Step 1</h2>
      {/* 국가 입력 */}
      <div>
        <input
          type="text"
          placeholder="Add Country"
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && addCountry()} // Enter 키로 국가 추가
        />
        <button onClick={addCountry}>+ 추가</button>
      </div>

      {/* 선택된 국가 리스트 */}
      <div>
        {formData.countries && formData.countries.length > 0 && (
          <ul>
            {formData.countries.map((country, index) => (
              <li key={index}>
                {country} <button onClick={() => removeCountry(index)}>X</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 날짜 입력 */}
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