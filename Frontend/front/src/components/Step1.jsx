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
    <div className={styles.mainContainer}>
      <div className={styles.first}>
        <div className={styles.question}>어디로 여행을 떠나시나요?</div>
        
        {/* 국가 입력 */}
        <div className={styles.country}>
          <input
            type="text"
            placeholder="국가명 입력"
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && addCountry()} // Enter 키로 국가 추가
          />
          {/* <button className={styles.btnAdd} onClick={addCountry}>+ 추가</button> */}
        </div>

        {/* 선택된 국가 리스트 */}
        {/* <Stack direction="row" spacing={1} flexWrap="wrap" className={styles.chipContainer}> */}
        <div className={styles.chipContainer}>
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
        </div>
        {/* </Stack> */}
      </div>


      <div className={styles.second}>
        <div className={styles.question}>
          언제 여행을 떠나시나요?
          <p className={styles.subtitle}>자택 출발/도착 기준</p>
        </div>
        {/* 날짜 입력 */}
        <div className={styles.dates}>
          <input
            type="date"
            placeholder="Start Date"
            value={formData.start_date || ''}  // formData.dates.start가 없는 경우 빈 문자열 처리
            onChange={(e) => updateFormData({ dates: { ...formData.dates, start: e.target.value } })}
          />
          <input
            type="date"
            placeholder="End Date"
            value={formData.end_date || ''}  // formData.dates.end가 없는 경우 빈 문자열 처리
            onChange={(e) => updateFormData({ dates: { ...formData.dates, end: e.target.value } })}
          />
        </div>
      </div>
    </div>
  );
};

export default StepOne;
