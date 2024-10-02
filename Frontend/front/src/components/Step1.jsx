import React, { useState } from 'react';
import { Chip, Stack } from '@mui/material';
import styles from './styles/Steps.module.css'

const StepOne = ({ formData, updateFormData }) => {
  const [countryInput, setCountryInput] = useState('');

  // 국가 추가 함수
  const addCountry = () => {
    // formData.locations가 존재하지 않으면 빈 배열로 처리
    const currentLocations = formData.locations || [];

    if (countryInput && !currentLocations.some((loc) => loc.country === countryInput)) {
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
    <div className={styles.mainContainer}>\
      <h2 className={styles.question}>어디로 여행을 떠나시나요?</h2>
      {/* 국가 입력 */}
      <div className={styles.first}>
        <input
          type="text"
          placeholder="Add Country"
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && addCountry()} // Enter 키로 국가 추가
        />
        <button className={styles.btnAdd} onClick={addCountry}>+ 추가</button>
      </div>

      {/* 선택된 국가 리스트 */}
      <Stack direction="row" spacing={1} flexWrap="wrap" className={styles.chipContainer}>
        {formData.locations && formData.locations.length > 0 && (
          formData.locations.map((location, index) => (
            <Chip
              key={index}
              label={location.country}
              onDelete={() => removeCountry(index)}
              variant="outlined"  // 테두리 있는 스타일
              color="primary"     // 색상 설정
            />
          ))
        )}
      </Stack>
      {/* 날짜 입력 */}
      <div className={styles.second}>
        <input
          type="date"
          placeholder="Start Date"
          value={formData.dates.start || ''}  // formData.dates.start가 없는 경우 빈 문자열 처리
          onChange={(e) => updateFormData({ dates: { ...formData.dates, start: e.target.value } })}
        />
        <input
          type="date"
          placeholder="End Date"
          value={formData.dates.end || ''}  // formData.dates.end가 없는 경우 빈 문자열 처리
          onChange={(e) => updateFormData({ dates: { ...formData.dates, end: e.target.value } })}
        />
      </div>
    </div>
  );
};

export default StepOne;
