import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePastTripStore } from '@/stores/pastTripStore'; // Zustand 스토어 경로에 맞게 변경
import { format, parseISO } from 'date-fns'; // parseISO 함수 추가
import styles from './styles/PreviousTrip.module.css';

const PreviousTrip = () => {
  const { tripId } = useParams(); // URL에서 tripId 추출
  const { pastTrips } = usePastTripStore(); // Zustand 스토어에서 과거 여행 데이터 가져오기

  // tripId에 맞는 여행 데이터를 필터링
  const selectedTrip = pastTrips.find(trip => trip.id === Number(tripId));

  // 여행 기간을 계산할 useState (조건문 밖에서 호출)
  const [duration, setDuration] = useState('');

  // 여행 기간 계산 로직을 useEffect에서 항상 호출하지만, selectedTrip이 없으면 return
  useEffect(() => {
    if (!selectedTrip) return; // selectedTrip이 없으면 useEffect는 아무 동작도 하지 않음

    const { startDate, endDate } = selectedTrip; // startDate, endDate로 접근

    if (startDate && endDate) {
      const start = parseISO(startDate); // parseISO로 날짜 변환
      const end = parseISO(endDate); // parseISO로 날짜 변환

      const diffTime = end.getTime() - start.getTime();
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalNights = totalDays - 1;

      setDuration(`${totalNights}박 ${totalDays}일`);
    }
  }, [selectedTrip]);

  // 여행 데이터가 없을 경우 처리
  if (!selectedTrip) return <div>해당 여행 데이터를 찾을 수 없습니다.</div>;

  const { startDate, endDate, locations } = selectedTrip; // startDate, endDate로 접근

  const formatDay = (date) => format(parseISO(date), 'yyyy년 MM월 dd일'); // parseISO로 날짜 변환 후 포맷

  return (
    <>
      {/* 여행 날짜 섹션 */}
      <div className={styles.date}>
        <div className={styles.title}>
          <div>날짜</div>
          <div className={styles.subtitle}>{duration}</div>
        </div>
        <div className={styles.content}>
          <div>시작일 &nbsp; | &nbsp; {formatDay(startDate)}</div>
          <div>종료일 &nbsp; | &nbsp; {formatDay(endDate)}</div>
        </div>
      </div>

      {/* 멤버 리스트 섹션 */}
      <div className={styles.trip}>
        <div className={styles.title}>
          <div>멤버</div>
          <div className={styles.subtitle}>{locations.length}명</div>
        </div>
        <div className={styles.content}>
          {locations.map((location, index) => (
            <div key={index}>{location.country}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PreviousTrip;
