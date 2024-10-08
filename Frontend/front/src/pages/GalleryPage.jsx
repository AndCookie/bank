import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { usePaymentStore } from '@/stores/paymentStore'; // paymentStore import
import axiosInstance from '@/axios'; // axiosInstance import

import PreviousTrip from '../components/PreviousTrip';
import Chart from '../components/Chart';

import '@/styles/GalleryPage.module.css';

const GalleryPage = () => {
  const { tripId } = useParams(); // URL에서 tripId 추출
  const { addPayments } = usePaymentStore(); // paymentStore에서 addPayments 가져오기

  // const { data, error, isLoading } = useQuery(
  //   ['payments', tripId], 
  //   () => axiosInstance.get(`/payments/list/`, {
  //     params: {
  //       trip_id: Number(tripId), // tripId를 params로 전달
  //     }
  //   }).then(res => res.data.data),
  //   {
  //     onSuccess: (fetchedData) => {
  //       addPayments(tripId, fetchedData); // 데이터가 로드되면 paymentStore에 저장
  //     }
  //   }
  // );

  // // 로딩 중, 에러 처리
  // if (isLoading) return <div>로딩 중...</div>;
  // if (error) return <div>오류가 발생했습니다: {error.message}</div>;

  return (
    <div className="main-container">
      <PreviousTrip />
      <Chart />
    </div>
  );
};

export default GalleryPage;