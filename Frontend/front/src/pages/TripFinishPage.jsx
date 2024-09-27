import React from 'react';
import { useTripStore } from '@/stores/tripStore';
import '@/styles/TripFinishPage.css';
import checkImage from '@/assets/images/check.png';

const TripFinishPage = () => {
  // const { members } = useTripStore((state) => state.currentTrip); 

  return (
    <>
      {/* 정산 완료 */}
      <div className="complete">
        <img src={checkImage} alt="체크" />
        {/* 액수 추가해야 함 */}
        <div className="message">정 산 완 료</div>
      </div>

      {/* 지출/예산/잔액 */}
      <div className="detail">
        <h4>정태완 님의 여행 소비 정보</h4>
        <p>전체 지출 3,200,887원 / 17건</p>
        <p>오늘의 지출 1,082,051원 / 5건</p>
        <p></p>
        <div className="explanation">
          (개인별) 남은 예산 = 초기 예산 - 총 지출금
        </div>
      </div>
    </>
  );
};

export default TripFinishPage;
 