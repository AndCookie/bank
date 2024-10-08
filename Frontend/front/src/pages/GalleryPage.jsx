import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axiosInstance from '@/axios'; // axiosInstance import
import LoadingPage from '@/pages/LoadingPage';
import PreviousTrip from '../components/PreviousTrip';
import Chart from '../components/Chart';

import '@/styles/GalleryPage.module.css';

const GalleryPage = () => {
  const { tripId } = useParams(); // URL에서 tripId 추출

  // React Query로 /payments/list/ 엔드포인트에 GET 요청
  const { data: payments, isLoading, error } = useQuery(
    ['payments', tripId], // query key: payments + tripId
    () =>
      axiosInstance.get('/payments/list/', {
        params: { trip_id: tripId }, // trip_id를 params로 전달
      }).then((res) => res.data.data), // 서버에서 받은 데이터를 추출
    {
      enabled: !!tripId, // tripId가 존재할 때만 실행
    }
  );

  if (isLoading) return <LoadingPage />; // 로딩 중일 때 로딩 페이지 출력
  if (error) return <div>Error: {error.message}</div>; // 에러 발생 시 에러 메시지 출력

  return (
    <div className="main-container">
      {/* 가져온 payments 데이터를 바로 컴포넌트에 전달 */}
      <PreviousTrip payments={payments} />
      <Chart payments={payments} />
    </div>
  );
};

export default GalleryPage;