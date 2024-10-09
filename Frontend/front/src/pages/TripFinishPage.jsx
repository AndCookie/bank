import React, { useEffect, useState } from 'react';
import styles from '@/styles/TripFinishPage.module.css';
import checkImage from '@/assets/images/load/check.png';
import axiosInstance from '@/axios.js';
import { useTripStore } from '@/stores/tripStore';
import { usePaymentStore } from '@/stores/paymentStore';
import LoadingPage from '@/pages/LoadingPage'; // LoadingPage 컴포넌트 가져오기
import AdjustCompleteModal from '@/components/AdjustCompleteModal';

const TripFinishPage = () => {
  const getPartPayment = usePaymentStore((state) => state.getPartPayment);
  const finalPayments = usePaymentStore((state) => state.finalPayments);

  // 정산 결과
  const [resultPayments, setResultPayments] = useState([]);

  // 선택한 상세 정산 내역 Id
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  useEffect(() => {
    console.log('Final', finalPayments);
  }, [])

  useEffect(() => {
    // 결제 정산 요청
    if (finalPayments.payments) {
      const sendAdjustment = async () => {
        try {
          const response = await axiosInstance.post('/payments/adjustment/', finalPayments);
          const { data } = response;
          setResultPayments(data.payments);
        } catch (error) {
          console.log(error);
        }
      }
      sendAdjustment();
    };
  }, [finalPayments]);

  // paymentId에 따른 결제 내역의 정산 여부
  const isAdjusted = (paymentId) => {
    const resultPayment = resultPayments.find(payment => payment.payment_id === paymentId);
    return resultPayment.bills.every(bill => bill.is_complete) ? true : false;
  }

  // 정산 상세 정보 모달 창
  const [isAdjustCompleteOpen, setisAdjustCompleteOpen] = useState(false);

  const openisAdjustCompleteModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setisAdjustCompleteOpen(true);
  };

  const closeisAdjustCompleteModal = () => {
    setisAdjustCompleteOpen(false);
  };

  return (
    <div>
      <div>정산 완료</div>
      {resultPayments.map((payment) => (
        <div key={payment.payment_id} onClick={() => openisAdjustCompleteModal(payment.payment_id)}>
          {getPartPayment(payment.payment_id).brand_name}
          {getPartPayment(payment.payment_id).pay_date}
          {getPartPayment(payment.payment_id).pay_time}
          {isAdjusted(payment.payment_id)}

          <AdjustCompleteModal isOpen={isAdjustCompleteOpen} onClose={closeisAdjustCompleteModal} resultPayments={resultPayments} paymentId={selectedPaymentId} />
        </div>
      ))}

    </div>
  );
};

export default TripFinishPage;