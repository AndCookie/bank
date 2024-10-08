import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/axios'; // axiosInstance import
import { format, parseISO } from 'date-fns'; // parseISO 함수 추가
import styles from './styles/PreviousTrip.module.css';

const PreviousTrip = () => {
  const { tripId } = useParams(); // URL에서 tripId 추출
  const [selectedTrip, setSelectedTrip] = useState(null); // 선택된 여행 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [duration, setDuration] = useState(''); // 여행 기간

  // 여행 상세 정보를 가져오는 함수
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axiosInstance.get('/trips/detail/', {
          params: { trip_id: tripId } // tripId를 파라미터로 전달
        });
        const tripData = response.data;

        setSelectedTrip(tripData); // 여행 데이터를 상태에 저장
        setLoading(false);

        // 여행 기간 계산
        const { start_date, end_date } = tripData;
        if (start_date && end_date) {
          const start = parseISO(start_date);
          const end = parseISO(end_date);
          const diffTime = end.getTime() - start.getTime();
          const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const totalNights = totalDays - 1;
          setDuration(`${totalNights}박 ${totalDays}일`);
        }
      } catch (err) {
        console.error(err);
        setError('여행 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  // 로딩 중일 때 로딩 메시지 표시
  if (loading) return <div>로딩 중...</div>;

  // 에러가 발생했을 때 에러 메시지 표시
  if (error) return <div>{error}</div>;

  // 여행 데이터가 없을 경우 처리
  if (!selectedTrip) return <div>해당 여행 데이터를 찾을 수 없습니다.</div>;

  const { start_date, end_date, locations, members } = selectedTrip;

  // 날짜 포맷 함수
  const formatDay = (date) => format(parseISO(date), 'yyyy년 MM월 dd일');

  return (
    <>
      {/* 여행 날짜 섹션 */}
      <div className={styles.date}>
        <div className={styles.title}>
          <div>날짜</div>
          <div className={styles.subtitle}>{duration}</div>
        </div>
        <div className={styles.content}>
          <div>시작일 &nbsp; | &nbsp; {formatDay(start_date)}</div>
          <div>종료일 &nbsp; | &nbsp; {formatDay(end_date)}</div>
        </div>
      </div>

      {/* 멤버 리스트 섹션 */}
      <div className={styles.trip}>
        <div className={styles.title}>
          <div>멤버</div>
          <div className={styles.subtitle}>{members.length}명</div>
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
