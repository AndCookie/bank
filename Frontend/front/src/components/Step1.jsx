import React, { useState } from 'react';
import { Chip } from '@mui/material';
import styles from './styles/Steps.module.css';
import { useErrorStore } from '@/stores/errorStore'; // 에러 스토어 가져오기
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StepOne = ({ formData, updateFormData }) => {
  const [countryInput, setCountryInput] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // 국가 추가 함수
  const addCountry = () => {
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

  // 시작일 변경 함수
  const handleStartDateChange = (date) => {
    setStartDate(date);
    updateFormData({ start_date: date });
  };

  // 종료일 변경 함수
  const handleEndDateChange = (date) => {
    setEndDate(date);
    updateFormData({ end_date: date });
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
        </div>

        {/* 선택된 국가 리스트 */}
        <div className={styles.chipContainer}>
          {formData.locations && formData.locations.length > 0 && (
            formData.locations.map((location, index) => (
              <Chip
                key={index}
                label={location.country}
                onDelete={() => removeCountry(index)}
                variant="outlined"
                color="primary"
              />
            ))
          )}
        </div>
      </div>

      <div className={styles.second}>
        <div className={styles.question}>
          언제 여행을 떠나시나요?
          <p className={styles.subtitle}>자택 출발/도착 기준</p>
        </div>
        <div className={styles.dates}>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="출발일"
            dateFormat="yyyy/MM/dd"
            className={styles.datePicker}
            minDate={new Date()}
            showPopperArrow={false} // 화살표 표시하지 않음
            isClearable={false}     // 삭제 버튼 표시하지 않음
          />
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="종료일"
            dateFormat="yyyy/MM/dd"
            className={styles.datePicker}
            minDate={startDate || new Date()}
            showPopperArrow={false} // 화살표 표시하지 않음
            isClearable={false}     // 삭제 버튼 표시하지 않음
          />
        </div>
      </div>
    </div>
  );
};

export default StepOne;
