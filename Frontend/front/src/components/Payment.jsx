import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { useTripStore } from '@/stores/tripStore';
import { useUserStore } from '@/stores/userStore';
import { usePaymentStore } from '@/stores/paymentStore';
import styles from './styles/Payment.module.css';
import OngoingModal from '@/components/OngoingModal';
import AdjustModal from '@/components/AdjustModal';

import Checkbox from '@mui/material/Checkbox';

const Payment = ({ paymentsData, selectedDate }) => {
  const { tripId } = useParams();
  const tripDetailInfo = {
    id: tripId,
    startDate: "2024-08-19",
    members: [
      // ...
    ]
  };

  const userInfo = useUserStore((state) => state.userInfo);
  // const tripDetailInfo = useTripStore((state) => state.tripDetailInfo);

  const payments = usePaymentStore((state) => state.payments);
  const setPayments = usePaymentStore((state) => state.setPayments);

  const finalPayments = usePaymentStore((state) => state.finalPayments);
  const setFinalPayments = usePaymentStore((state) => state.setFinalPayments);
  const addFinalPayments = usePaymentStore((state) => state.addFinalPayments);
  const removeFinalPayments = usePaymentStore((state) => state.removeFinalPayments);

  // 정산 여부 판단
  const [isCompleted, setIsCompleted] = useState(0);
  
  // 선택한 상세 결제 내역 Id
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    
  // 최종 정산 금액
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setFinalPayments(tripDetailInfo.id);
  }, [tripDetailInfo.id])

  useEffect(() => {
    // 인원별 정산 금액과 체크 여부를 담기 위한 임시 변수
    const updatedPaymentsData = paymentsData.map((payment) => {
      const membersData = tripDetailInfo.members.map(member => ({
        cost: 0,
        bank_account: member.bank_account
      }));
      return {
        ...payment,
        bills: membersData,
        checked: false,
      };
    });
    setPayments(updatedPaymentsData)
  }, [setPayments])

  // payments가 정의되어 있는지 체크하고 처리
  const filteredPayments = (payments || []).filter((payment) => {
    if (selectedDate === 'all') {
      return true;
    } else if (selectedDate === 'prepare') {
      return new Date(payment.pay_date) < new Date(tripDetailInfo.startDate);
      // 특정 날짜 조회
    } else {
      return new Date(payment.pay_date).toDateString() === new Date(selectedDate).toDateString();
    }
  }).filter((payment) => payment.is_completed === isCompleted);

  // 정산 내역 체크
  const handleCheck = (paymentId, amount) => {
    const updatedPaymentsData = payments.map((payment) => {
      if (payment.id === paymentId) {
        const checked = !payment.checked;
        if (checked) {
          setTotalAmount(prev => prev + amount);

          // calculatedPayments에서 paymentId에 해당하는 데이터 추가
          // const bills = tripDetailInfo.members.map((member) => ({
          //   cost: 0,
          //   bank_account: member.bank_account,
          // }));

          addFinalPayments(paymentId);
        } else {
          setTotalAmount(prev => prev - amount);
          removeFinalPayments(paymentId)
        }
        return { ...payment, checked };
      }
      return payment;
    });

    setPayments(updatedPaymentsData);
  };

  // 디버깅
  useEffect(() => {
    console.log(finalPayments);
  }, [finalPayments])

  useEffect(() => {
    console.log(payments);
  }, [payments])

  // 결제내역 상세 정보 모달 창
  const [isOngoingOpen, setisOngoingOpen] = useState(false);
  
  // 체크한 결제내역 정산 모달 창
  const [isAdjustOpen, setisAdjustOpen] = useState(false);

  const openOngoingModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setisOngoingOpen(true);
  }

  const closeOngoingModal = () => {
    setisOngoingOpen(false);
  }

  const openAdjustModal = () => {
    setisAdjustOpen(true);
  }

  const closeAdjustModal = () => {
    setisAdjustOpen(false);
  }

  return (
    <div className={styles.container}>
      {/* 탭 버튼 */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${isCompleted === 0 ? styles.active : ''}`}
          onClick={() => setIsCompleted(0)}
        >
          미정산
        </button>
        <button
          className={`${styles.tab} ${isCompleted === 1 ? styles.active : ''}`}
          onClick={() => setIsCompleted(1)}
        >
          정산 완료
        </button>
      </div>

      {/* 결제 내역 */}
      {filteredPayments.map((data) => (
        <div key={data.id} className="d-flex">
          <div onClick={() => openOngoingModal(data.id)}>{data.pay_date} {data.amount} {data.username}</div>
          <div>{data.username === userInfo.nickName && <Checkbox checked={data.checked} onChange={() => handleCheck(data.id, data.amount)} />}</div>

        </div>
      ))}

      <button onClick={openAdjustModal}>{totalAmount}원 정산하기</button>

      {/* 결제내역 상세 정보 모달 창 */}
      <OngoingModal isOpen={isOngoingOpen} onClose={closeOngoingModal} paymentId={selectedPaymentId} />

      {/* 결제내역 상세 정보 모달 창 */}
      <AdjustModal isOpen={isAdjustOpen} onClose={closeAdjustModal} totalAmount={totalAmount} />
    </div>
  );
};

export default Payment;
