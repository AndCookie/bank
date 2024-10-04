import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { useTripStore } from '@/stores/tripStore';

import OngoingModal from '@/components/OngoingModal';

const Payment = ({ payments, selectedDate }) => {
  // const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  const tripDetailInfo = {
    startDate: "2024-08-19",
  }

  const [isCompleted, setIsCompleted] = useState(0);

  // 필터링 된 결제 내역
  const filteredPayments = payments.filter((payment) => {
    // 전체 기간 조회
    if (selectedDate === 'all') {
      return true;
      // 준비 기간 조회
    } else if (selectedDate === 'prepare') {
      return new Date(payment.pay_date) < tripDetailInfo.startDate;
      // 특정 날짜 조회
    } else {
      return new Date(payment.pay_date).toDateString() === new Date(selectedDate).toDateString();
    }
    // 정산 여부 조회
  }).filter((payment) => {
    return payment.is_completed === isCompleted;
  });

  // 진행 중인 여행 정산 모달 창
  const [isOngoingOpen, setisOngoingOpen] = useState(false);

  const openOngoingModal = (paymentId) => {
    console.log(paymentId)
    setisOngoingOpen(true);
  }

  const closeOngoingModal = () => {
    setisOngoingOpen(false);
  }

  return (
    <>
      <div>
        <button onClick={() => setIsCompleted(0)}>미정산</button>
        <button onClick={() => setIsCompleted(1)}>정산완료</button>
      </div>

      {filteredPayments.map((data) => (
        <div key={data.id} onClick={() => openOngoingModal(data.id)}>{data.pay_date} {data.amount} {data.brand_name} {data.is_completed}</div>
      ))}

      {/* 진행 중인 여행 정산 모달 창 */}
      <OngoingModal isOpen={isOngoingOpen} onClose={closeOngoingModal} />
    </>
  )

}

export default Payment;