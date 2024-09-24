import React, { useEffect, useState, useRef, startTransition } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import '@/styles/TripFinishPage.css';
import { useTripStore } from '@/stores/tripStore'

const TripFinishPage = () => {
  const tripStore = useTripStore();

  return (
    <>
      {/* 정산 완료 */}
      <div className="complete">
        <div className="message">정 산 완 료</div>
      </div>

      {/* 지출/예산/잔액 */}
      <div className="detail">
        <table className="settlement-table">
          <thead>
            <tr>
              <th></th>
              <th>지출금</th>
              <th>정산금</th>
              <th>남은 예산</th>
            </tr>
          </thead>
          {/* 정산 인원 표기 */}
          <tbody>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </tbody>
        </table>
        <div className="explanation">
          (개인별) 남은 예산 = 초기 예산 - 총 지출금
        </div>
      </div>
    </>
  )
}

export default TripFinishPage;