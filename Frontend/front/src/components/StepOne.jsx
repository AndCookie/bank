import React, { useState } from 'react';
import { useTripStore } from '../stores/tripStore'; // Zustand에서 스토어 사용
import DatePicker from 'react-datepicker'; // 날짜 선택 라이브러리
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/TripCreatePage.css'; // 스타일 관련

const TripCreate = () => {
  const tripStore = useTripStore(); // Zustand에서 스토어 가져오기
  const [countryInput, setCountryInput] = useState(''); // 국가 입력 상태
  const [departureDate, setDepartureDate] = useState(tripStore.startDate || null); // 출발일시
  const [arrivalDate, setArrivalDate] = useState(tripStore.endDate || null); // 도착일시
  const [dateError, setDateError] = useState(false); // 날짜 역전 현상 상태

  // 국가 추가 함수
  const addCountry = () => {
    if (countryInput && !tripStore.country.includes(countryInput)) {
      tripStore.country.push(countryInput);
      tripStore.locations.push({ country: countryInput });
      setCountryInput(''); // 입력창 초기화
    } else {
      alert('국가를 중복으로 추가할 수 없습니다.');
    }
  };

  // 국가 삭제 함수
  const removeCountry = (index) => {
    tripStore.country.splice(index, 1); // 해당 인덱스의 국가 제거
  };

  // 출발일시 업데이트 함수
  const updateDepartureDate = (date) => {
    setDepartureDate(date);
    tripStore.startDate = date.toISOString().split('T')[0]; // yyyy-mm-dd 형식으로 저장
    if (arrivalDate && date > arrivalDate) setDateError(true);
    else setDateError(false);
  };

  // 도착일시 업데이트 함수
  const updateArrivalDate = (date) => {
    setArrivalDate(date);
    tripStore.endDate = date.toISOString().split('T')[0];
    if (departureDate && date < departureDate) setDateError(true);
    else setDateError(false);
  };

  return (
    <div className="main-container">
      {/* 국가 선택 섹션 */}
      <div className="first">
        <h3>어디로 여행을 떠나시나요?</h3>
        <input
          type="text"
          value={countryInput}
          placeholder="국가"
          onChange={(e) => setCountryInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && addCountry()}
        />
        <button onClick={addCountry} className="mt-1 btn-add">+ 추가</button>

        <div className="chip-container">
          {tripStore.country.map((country, index) => (
            <div
              key={index}
              className="chip"
              onClick={() => removeCountry(index)}
            >
              {country}
            </div>
          ))}
        </div>
      </div>

      {/* 날짜 선택 섹션 */}
      <div className="second">
        <h3>언제 여행을 떠나시나요?</h3>
        <p className="subtitle">자택 출발/도착 기준</p>

        <div>
          <label>출발일시</label>
          <DatePicker
            selected={departureDate}
            onChange={updateDepartureDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="출발일시 선택"
            className="calendar-input"
          />
        </div>

        <div>
          <label>도착일시</label>
          <DatePicker
            selected={arrivalDate}
            onChange={updateArrivalDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="도착일시 선택"
            className="calendar-input"
          />
        </div>

        {dateError && <p className="error-message">도착일자가 출발일자보다 빠릅니다.</p>}
      </div>
    </div>
  );
};

export default TripCreate;
