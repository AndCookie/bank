import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';
import './styles/PreviousTrip.css'

const TripDuration = ({ startDate, endDate }) => {
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const diffTime = end.getTime() - start.getTime();
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalNights = totalDays - 1;

      setDuration(`${totalNights}박 ${totalDays}일`);
    }
  }, [startDate, endDate]);

  const formatDay = (date) => format(new Date(date), 'yyyy년 MM월 dd일');

  return (
    <div className="trip date">
      <div className="title">
        <div>날짜</div>
        <div className="subtitle">{duration}</div>
      </div>
      <div className="content">
        <div>시작일 &nbsp; | &nbsp; {formatDay(startDate)}</div>
        <div>종료일 &nbsp; | &nbsp; {formatDay(endDate)}</div>
      </div>
    </div>
  );
};

const MemberList = ({ tripMembers }) => {
  return (
    <div className="trip">
      <div className="title">
        <div>멤버</div>
        <div className="subtitle">{tripMembers.length}명</div>
      </div>
      <div className="content">
        <div>
          {tripMembers.map((member, index) => (
            <div key={index}>{member}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 메인 컴포넌트
const PreviousTip = () => {
  // 여행 날짜 더미 데이터
  const startDate = '2024-09-09';
  const endDate = '2024-09-15';

  // 여행 인원 더미 데이터
  const tripMembers = ['강해린', '다니엘']

  return (
    <>
      <TripDuration startDate={startDate} endDate={endDate} />
      <MemberList tripMembers={tripMembers} />
    </>
  )
}

export default PreviousTip;